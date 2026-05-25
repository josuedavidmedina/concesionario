import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { vehicleApi } from '@/api/vehicles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog } from '@/components/ui/dialog'
import VehicleForm from './VehicleForm'
import type { VehicleFilter, VehicleResponse, VehicleStatus } from '@/types/vehicle'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'

const statusColors: Record<VehicleStatus, 'success' | 'warning' | 'info' | 'destructive'> = {
  AVAILABLE: 'success',
  RESERVED: 'warning',
  SOLD: 'info',
  IN_MAINTENANCE: 'destructive',
}

const statusLabels: Record<VehicleStatus, string> = {
  AVAILABLE: 'Disponible',
  SOLD: 'Vendido',
  RESERVED: 'Reservado',
  IN_MAINTENANCE: 'Mantenimiento',
}

export default function VehicleList() {
  const [filter, setFilter] = useState<VehicleFilter>({ page: 0, size: 15 })
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', filter],
    queryFn: () => vehicleApi.list(filter),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vehicleApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: VehicleStatus }) => vehicleApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  })

  const vehicles = data?.data?.content ?? []
  const totalPages = data?.data?.totalPages ?? 0

  const handleSearch = () => {
    setFilter(prev => ({ ...prev, search, page: 0 }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vehículos</h1>
          <p className="text-muted-foreground">Gestiona el inventario de vehículos</p>
        </div>
        <Button onClick={() => { setEditId(null); setFormOpen(true) }}>
          <Plus className="h-4 w-4" /> Nuevo
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Buscar por modelo, VIN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button variant="secondary" onClick={handleSearch}><Search className="h-4 w-4" /></Button>
            </div>
            <div className="flex gap-2">
              <Select
                options={[
                  { value: 'AVAILABLE', label: 'Disponible' },
                  { value: 'SOLD', label: 'Vendido' },
                  { value: 'RESERVED', label: 'Reservado' },
                  { value: 'IN_MAINTENANCE', label: 'Mantenimiento' },
                ]}
                placeholder="Estado"
                value={filter.status ?? ''}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as VehicleStatus || undefined, page: 0 }))}
              />
              <Select
                options={[
                  { value: 'price,asc', label: 'Precio ↑' },
                  { value: 'price,desc', label: 'Precio ↓' },
                  { value: 'year,desc', label: 'Año ↓' },
                  { value: 'year,asc', label: 'Año ↑' },
                ]}
                placeholder="Ordenar"
                value={filter.sortBy ? `${filter.sortBy},${filter.sortDir ?? 'asc'}` : ''}
                onChange={(e) => {
                  const [sortBy, sortDir] = e.target.value.split(',')
                  setFilter(prev => ({ ...prev, sortBy: sortBy as any, sortDir: sortDir as any }))
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : vehicles.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay vehículos</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-3 px-2 font-medium">Modelo</th>
                    <th className="text-left py-3 px-2 font-medium">Marca</th>
                    <th className="text-left py-3 px-2 font-medium">Año</th>
                    <th className="text-right py-3 px-2 font-medium">Precio</th>
                    <th className="text-center py-3 px-2 font-medium">Estado</th>
                    <th className="text-right py-3 px-2 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v: VehicleResponse) => (
                    <tr key={v.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2 font-medium">{v.model}</td>
                      <td className="py-3 px-2">{v.brandName}</td>
                      <td className="py-3 px-2">{v.year}</td>
                      <td className="py-3 px-2 text-right">${v.price.toLocaleString()}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant={statusColors[v.status]}>{statusLabels[v.status]}</Badge>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/vehicles/${v.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setEditId(v.id); setFormOpen(true) }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => {
                            if (confirm('¿Eliminar este vehículo?')) deleteMutation.mutate(v.id)
                          }}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="outline" size="sm" disabled={filter.page === 0}
                onClick={() => setFilter(prev => ({ ...prev, page: prev.page! - 1 }))}>
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {(filter.page ?? 0) + 1} de {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={(filter.page ?? 0) >= totalPages - 1}
                onClick={() => setFilter(prev => ({ ...prev, page: prev.page! + 1 }))}>
                Siguiente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editId ? 'Editar vehículo' : 'Nuevo vehículo'}>
        <VehicleForm id={editId} onSuccess={() => { setFormOpen(false); setEditId(null) }} />
      </Dialog>
    </div>
  )
}
