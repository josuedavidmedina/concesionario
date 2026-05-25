import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerApi } from '@/api/customers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog } from '@/components/ui/dialog'
import CustomerForm from './CustomerForm'
import type { CustomerResponse } from '@/types/customer'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'

export default function CustomerList() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['customers', query],
    queryFn: () => customerApi.list(query || undefined),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customerApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })

  const customers = data?.data ?? []
  const filtered = query ? customers : customers

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gestiona los clientes del concesionario</p>
        </div>
        <Button onClick={() => { setEditId(null); setFormOpen(true) }}>
          <Plus className="h-4 w-4" /> Nuevo
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por nombre, documento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setQuery(search)}
              className="max-w-sm"
            />
            <Button variant="secondary" onClick={() => setQuery(search)}><Search className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay clientes</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-3 px-2 font-medium">Nombre</th>
                    <th className="text-left py-3 px-2 font-medium">Documento</th>
                    <th className="text-left py-3 px-2 font-medium">Ciudad</th>
                    <th className="text-right py-3 px-2 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c: CustomerResponse) => (
                    <tr key={c.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2 font-medium">{c.fullName}</td>
                      <td className="py-3 px-2">{c.documentType} {c.documentNumber}</td>
                      <td className="py-3 px-2">{c.city || '-'}</td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setEditId(c.id); setFormOpen(true) }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => {
                            if (confirm('¿Eliminar este cliente?')) deleteMutation.mutate(c.id)
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
        </CardContent>
      </Card>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editId ? 'Editar cliente' : 'Nuevo cliente'}>
        <CustomerForm id={editId} onSuccess={() => { setFormOpen(false); setEditId(null) }} />
      </Dialog>
    </div>
  )
}
