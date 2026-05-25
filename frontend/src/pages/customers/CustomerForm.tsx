import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerApi } from '@/api/customers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { CustomerRequest, ContactRequest, DocumentType, ContactType } from '@/types/customer'

const docTypes = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'NIT', label: 'NIT' },
  { value: 'PASSPORT', label: 'Pasaporte' },
]

const contactTypes = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'PHONE', label: 'Teléfono' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'ADDRESS', label: 'Dirección' },
]

function defaultForm(): CustomerRequest {
  return {
    firstName: '',
    lastName: '',
    documentType: 'CC',
    documentNumber: '',
    birthDate: '',
    address: '',
    city: '',
    contacts: [],
  }
}

interface Props {
  id?: string | null
  onSuccess: () => void
}

export default function CustomerForm({ id, onSuccess }: Props) {
  const [form, setForm] = useState<CustomerRequest>(defaultForm())
  const [error, setError] = useState('')
  const queryClient = useQueryClient()

  const { data: existing } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerApi.getById(id!),
    enabled: !!id,
  })

  useEffect(() => {
    if (existing?.data && id) {
      const c = existing.data
      setForm({
        firstName: c.firstName,
        lastName: c.lastName,
        documentType: c.documentType,
        documentNumber: c.documentNumber,
        birthDate: c.birthDate ?? '',
        address: c.address ?? '',
        city: c.city ?? '',
        contacts: c.contacts.map(cnt => ({ type: cnt.type, value: cnt.value })),
      })
    }
  }, [existing, id])

  const createMutation = useMutation({
    mutationFn: (data: CustomerRequest) => customerApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['customers'] }); onSuccess() },
    onError: (err: any) => setError(err.response?.data?.message || 'Error al crear'),
  })

  const updateMutation = useMutation({
    mutationFn: (data: CustomerRequest) => customerApi.update(id!, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['customers'] }); onSuccess() },
    onError: (err: any) => setError(err.response?.data?.message || 'Error al actualizar'),
  })

  const set = (key: keyof CustomerRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const addContact = () => {
    setForm(prev => ({ ...prev, contacts: [...prev.contacts, { type: 'EMAIL' as ContactType, value: '' }] }))
  }

  const updateContact = (index: number, field: keyof ContactRequest, value: string) => {
    setForm(prev => {
      const contacts = [...prev.contacts]
      contacts[index] = { ...contacts[index], [field]: value }
      return { ...prev, contacts }
    })
  }

  const removeContact = (index: number) => {
    setForm(prev => ({ ...prev, contacts: prev.contacts.filter((_, i) => i !== index) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (id) updateMutation.mutate(form)
    else createMutation.mutate(form)
  }

  const loading = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre</label>
          <Input value={form.firstName} onChange={set('firstName')} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Apellido</label>
          <Input value={form.lastName} onChange={set('lastName')} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo Documento</label>
          <Select options={docTypes} value={form.documentType} onChange={set('documentType')} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">N° Documento</label>
          <Input value={form.documentNumber} onChange={set('documentNumber')} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Ciudad</label>
          <Input value={form.city} onChange={set('city')} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha Nacimiento</label>
          <Input type="date" value={form.birthDate} onChange={set('birthDate')} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Dirección</label>
        <Input value={form.address} onChange={set('address')} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Contactos</label>
          <Button type="button" variant="outline" size="sm" onClick={addContact}>+ Agregar</Button>
        </div>
        {form.contacts.map((contact, i) => (
          <div key={i} className="flex gap-2 items-start">
            <Select
              options={contactTypes}
              value={contact.type}
              onChange={(e) => updateContact(i, 'type', e.target.value)}
              className="w-40"
            />
            <Input
              value={contact.value}
              onChange={(e) => updateContact(i, 'value', e.target.value)}
              placeholder="Valor"
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeContact(i)}>
              <Trash2Icon className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : id ? 'Actualizar' : 'Crear'}</Button>
      </div>
    </form>
  )
}

function Trash2Icon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}
