import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeApi } from '@/api/employees'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog } from '@/components/ui/dialog'
import EmployeeForm from './EmployeeForm'
import type { EmployeeResponse } from '@/types/employee'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function EmployeeList() {
  const [formOpen, setFormOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeApi.list(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeeApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  })

  const employees = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Empleados</h1>
          <p className="text-muted-foreground">Administración de empleados</p>
        </div>
        <Button onClick={() => { setEditId(null); setFormOpen(true) }}>
          <Plus className="h-4 w-4" /> Nuevo
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : employees.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No hay empleados</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-3 px-4 font-medium">Nombre</th>
                    <th className="text-left py-3 px-2 font-medium">Código</th>
                    <th className="text-left py-3 px-2 font-medium">Departamento</th>
                    <th className="text-left py-3 px-2 font-medium">Email</th>
                    <th className="text-center py-3 px-2 font-medium">Estado</th>
                    <th className="text-right py-3 px-2 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e: EmployeeResponse) => (
                    <tr key={e.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{e.fullName}</td>
                      <td className="py-3 px-2 font-mono text-xs">{e.employeeCode}</td>
                      <td className="py-3 px-2">{e.department || '-'}</td>
                      <td className="py-3 px-2">{e.userEmail}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant={e.isActive ? 'success' : 'destructive'}>
                          {e.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setEditId(e.id); setFormOpen(true) }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => {
                            if (confirm('¿Eliminar este empleado?')) deleteMutation.mutate(e.id)
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

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editId ? 'Editar empleado' : 'Nuevo empleado'}>
        <EmployeeForm id={editId} onSuccess={() => { setFormOpen(false); setEditId(null) }} />
      </Dialog>
    </div>
  )
}
