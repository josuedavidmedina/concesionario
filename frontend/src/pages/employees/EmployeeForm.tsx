import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeApi } from '@/api/employees'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { EmployeeRequest } from '@/types/employee'

function defaultForm(): EmployeeRequest {
  return {
    userId: '',
    firstName: '',
    lastName: '',
    employeeCode: '',
    department: '',
    hireDate: new Date().toISOString().split('T')[0],
    isActive: true,
  }
}

interface Props {
  id?: string | null
  onSuccess: () => void
}

export default function EmployeeForm({ id, onSuccess }: Props) {
  const [form, setForm] = useState<EmployeeRequest>(defaultForm())
  const [error, setError] = useState('')
  const queryClient = useQueryClient()

  const { data: existing } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeApi.getById(id!),
    enabled: !!id,
  })

  useEffect(() => {
    if (existing?.data && id) {
      const e = existing.data
      setForm({
        userId: e.userId,
        firstName: e.firstName,
        lastName: e.lastName,
        employeeCode: e.employeeCode,
        department: e.department ?? '',
        hireDate: e.hireDate.split('T')[0],
        isActive: e.isActive,
      })
    }
  }, [existing, id])

  const createMutation = useMutation({
    mutationFn: (data: EmployeeRequest) => employeeApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['employees'] }); onSuccess() },
    onError: (err: any) => setError(err.response?.data?.message || 'Error al crear'),
  })

  const updateMutation = useMutation({
    mutationFn: (data: EmployeeRequest) => employeeApi.update(id!, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['employees'] }); onSuccess() },
    onError: (err: any) => setError(err.response?.data?.message || 'Error al actualizar'),
  })

  const set = (key: keyof EmployeeRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(prev => ({ ...prev, [key]: value }))
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
          <label className="text-sm font-medium">Código</label>
          <Input value={form.employeeCode} onChange={set('employeeCode')} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Departamento</label>
          <Input value={form.department} onChange={set('department')} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha contratación</label>
          <Input type="date" value={form.hireDate} onChange={set('hireDate')} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">User ID (UUID)</label>
          <Input value={form.userId} onChange={set('userId')} placeholder="UUID del usuario" required />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.isActive} onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))} />
        <label className="text-sm font-medium">Activo</label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : id ? 'Actualizar' : 'Crear'}</Button>
      </div>
    </form>
  )
}
