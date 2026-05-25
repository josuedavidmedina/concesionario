import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vehicleApi } from '@/api/vehicles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { VehicleRequest, FuelType } from '@/types/vehicle'

const fuelOptions = [
  { value: 'GASOLINE', label: 'Gasolina' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'ELECTRIC', label: 'Eléctrico' },
  { value: 'HYBRID', label: 'Híbrido' },
  { value: 'GAS', label: 'Gas' },
]

const defaultForm: VehicleRequest = {
  brandId: 0,
  typeId: 0,
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  color: '',
  fuelType: 'GASOLINE',
  mileage: null,
  engineCc: null,
  transmission: null,
  description: null,
  vinCode: '',
}

interface Props {
  id?: string | null
  onSuccess: () => void
}

export default function VehicleForm({ id, onSuccess }: Props) {
  const [form, setForm] = useState<VehicleRequest>(defaultForm)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => vehicleApi.getBrands(),
  })

  const { data: typesData } = useQuery({
    queryKey: ['vehicleTypes'],
    queryFn: () => vehicleApi.getTypes(),
  })

  const { data: existing } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleApi.getById(id!),
    enabled: !!id,
  })

  useEffect(() => {
    if (existing?.data && id) {
      setForm({
        brandId: 0,
        typeId: 0,
        model: existing.data.model,
        year: existing.data.year,
        price: existing.data.price,
        color: existing.data.color,
        fuelType: existing.data.fuelType,
        mileage: existing.data.mileage,
        engineCc: null,
        transmission: null,
        description: existing.data.description,
        vinCode: existing.data.vinCode,
      })
    }
  }, [existing, id])

  const createMutation = useMutation({
    mutationFn: (data: VehicleRequest) => vehicleApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['vehicles'] }); onSuccess() },
    onError: (err: any) => setError(err.response?.data?.message || 'Error al crear'),
  })

  const updateMutation = useMutation({
    mutationFn: (data: VehicleRequest) => vehicleApi.update(id!, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['vehicles'] }); onSuccess() },
    onError: (err: any) => setError(err.response?.data?.message || 'Error al actualizar'),
  })

  const set = (key: keyof VehicleRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (id) updateMutation.mutate(form)
    else createMutation.mutate(form)
  }

  const brands = brandsData?.data ?? []
  const types = typesData?.data ?? []
  const loading = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Marca</label>
          <Select
            options={brands.map((b: any) => ({ value: String(b.id), label: b.name }))}
            placeholder="Seleccionar marca"
            value={form.brandId ? String(form.brandId) : ''}
            onChange={(e) => setForm(prev => ({ ...prev, brandId: Number(e.target.value) }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo</label>
          <Select
            options={types.map((t: any) => ({ value: String(t.id), label: t.name }))}
            placeholder="Seleccionar tipo"
            value={form.typeId ? String(form.typeId) : ''}
            onChange={(e) => setForm(prev => ({ ...prev, typeId: Number(e.target.value) }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Modelo</label>
          <Input value={form.model} onChange={set('model')} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Año</label>
          <Input type="number" value={form.year} onChange={set('year')} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Precio</label>
          <Input type="number" value={form.price} onChange={set('price')} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Color</label>
          <Input value={form.color} onChange={set('color')} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Combustible</label>
          <Select options={fuelOptions} value={form.fuelType} onChange={set('fuelType')} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Código VIN</label>
          <Input value={form.vinCode} onChange={set('vinCode')} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Kilometraje</label>
          <Input type="number" value={form.mileage ?? ''} onChange={(e) => setForm(prev => ({ ...prev, mileage: e.target.value ? Number(e.target.value) : null }))} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Transmisión</label>
          <Input value={form.transmission ?? ''} onChange={(e) => setForm(prev => ({ ...prev, transmission: e.target.value || null }))} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Descripción</label>
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
          value={form.description ?? ''}
          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value || null }))}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : id ? 'Actualizar' : 'Crear'}</Button>
      </div>
    </form>
  )
}
