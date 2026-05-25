import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { saleApi } from '@/api/sales'
import { vehicleApi } from '@/api/vehicles'
import { customerApi } from '@/api/customers'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { SaleRequest, PaymentMethod } from '@/types/sale'

const paymentMethods = [
  { value: 'CASH', label: 'Efectivo' },
  { value: 'CREDIT_CARD', label: 'Tarjeta Crédito' },
  { value: 'DEBIT_CARD', label: 'Tarjeta Débito' },
  { value: 'BANK_TRANSFER', label: 'Transferencia' },
  { value: 'FINANCING', label: 'Financiamiento' },
]

interface Props {
  onSuccess: () => void
}

export default function SaleForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    customerId: '',
    paymentMethod: 'CASH' as PaymentMethod,
    vehicleId: '',
    discount: 0,
    notes: '',
  })
  const [error, setError] = useState('')
  const queryClient = useQueryClient()

  const { data: customersData } = useQuery({
    queryKey: ['customers', 'select'],
    queryFn: () => customerApi.list(),
  })

  const { data: vehiclesData } = useQuery({
    queryKey: ['vehicles', 'available'],
    queryFn: () => vehicleApi.list({ status: 'AVAILABLE', page: 0, size: 100 }),
  })

  const createMutation = useMutation({
    mutationFn: (data: SaleRequest) => saleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      onSuccess()
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Error al crear venta'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.customerId || !form.vehicleId) {
      setError('Debe seleccionar cliente y vehículo')
      return
    }
    createMutation.mutate({
      customerId: form.customerId,
      paymentMethod: form.paymentMethod,
      items: [{ vehicleId: form.vehicleId, discount: form.discount || undefined }],
      notes: form.notes || undefined,
    })
  }

  const customers = customersData?.data ?? []
  const vehicles = vehiclesData?.data?.content ?? []

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}
      <div className="space-y-2">
        <label className="text-sm font-medium">Cliente</label>
        <Select
          options={customers.map((c: any) => ({ value: c.id, label: `${c.fullName} (${c.documentNumber})` }))}
          placeholder="Seleccionar cliente"
          value={form.customerId}
          onChange={(e) => setForm(prev => ({ ...prev, customerId: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Vehículo</label>
        <Select
          options={vehicles.map((v: any) => ({ value: v.id, label: `${v.brandName} ${v.model} ${v.year} - $${v.price.toLocaleString()}` }))}
          placeholder="Seleccionar vehículo"
          value={form.vehicleId}
          onChange={(e) => setForm(prev => ({ ...prev, vehicleId: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Método de pago</label>
          <Select options={paymentMethods} value={form.paymentMethod} onChange={(e) => setForm(prev => ({ ...prev, paymentMethod: e.target.value as PaymentMethod }))} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Descuento ($)</label>
          <Input type="number" value={form.discount} onChange={(e) => setForm(prev => ({ ...prev, discount: Number(e.target.value) }))} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Notas</label>
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
          value={form.notes}
          onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancelar</Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creando...' : 'Crear venta'}
        </Button>
      </div>
    </form>
  )
}
