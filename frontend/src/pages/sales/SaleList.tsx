import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { saleApi } from '@/api/sales'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog } from '@/components/ui/dialog'
import SaleForm from './SaleForm'
import type { SaleResponse, SaleStatus } from '@/types/sale'
import { Plus, Eye } from 'lucide-react'

const statusColors: Record<SaleStatus, 'success' | 'warning' | 'info' | 'destructive'> = {
  PENDING: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'destructive',
  REFUNDED: 'info',
}

const statusLabels: Record<SaleStatus, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  REFUNDED: 'Reembolsada',
}

export default function SaleList() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<SaleResponse | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: () => saleApi.list(),
  })

  const sales = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ventas</h1>
          <p className="text-muted-foreground">Gestiona las ventas realizadas</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" /> Nueva venta
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : sales.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No hay ventas registradas</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-3 px-4 font-medium">Cliente</th>
                    <th className="text-left py-3 px-2 font-medium">Vendedor</th>
                    <th className="text-right py-3 px-2 font-medium">Total</th>
                    <th className="text-left py-3 px-2 font-medium">Método</th>
                    <th className="text-center py-3 px-2 font-medium">Estado</th>
                    <th className="text-left py-3 px-2 font-medium">Fecha</th>
                    <th className="text-right py-3 px-2 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s: SaleResponse) => (
                    <tr key={s.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{s.customerName}</td>
                      <td className="py-3 px-2">{s.employeeName}</td>
                      <td className="py-3 px-2 text-right font-medium">${s.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-2">{s.paymentMethod}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant={statusColors[s.status]}>{statusLabels[s.status]}</Badge>
                      </td>
                      <td className="py-3 px-2">{new Date(s.saleDate).toLocaleDateString()}</td>
                      <td className="py-3 px-2 text-right">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedSale(s)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title="Nueva venta">
        <SaleForm onSuccess={() => setFormOpen(false)} />
      </Dialog>

      <Dialog open={!!selectedSale} onClose={() => setSelectedSale(null)} title="Detalle de venta">
        {selectedSale && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Cliente</span><p className="font-medium">{selectedSale.customerName}</p></div>
              <div><span className="text-muted-foreground">Vendedor</span><p className="font-medium">{selectedSale.employeeName}</p></div>
              <div><span className="text-muted-foreground">Total</span><p className="font-medium text-lg">${selectedSale.totalAmount.toLocaleString()}</p></div>
              <div><span className="text-muted-foreground">Método</span><p className="font-medium">{selectedSale.paymentMethod}</p></div>
              <div><span className="text-muted-foreground">Estado</span><Badge variant={statusColors[selectedSale.status]}>{statusLabels[selectedSale.status]}</Badge></div>
              <div><span className="text-muted-foreground">Fecha</span><p className="font-medium">{new Date(selectedSale.saleDate).toLocaleDateString()}</p></div>
            </div>
            {selectedSale.notes && (
              <div><span className="text-sm text-muted-foreground">Notas</span><p className="text-sm mt-1">{selectedSale.notes}</p></div>
            )}
            <div>
              <h4 className="text-sm font-medium mb-2">Vehículos</h4>
              <div className="space-y-2">
                {selectedSale.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm p-2 bg-muted rounded-md">
                    <span>{item.vehicleModel}</span>
                    <span className="font-medium">${item.unitPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
