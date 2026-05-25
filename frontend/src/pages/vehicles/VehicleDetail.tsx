import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { vehicleApi } from '@/api/vehicles'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Car } from 'lucide-react'

const statusLabels: Record<string, string> = {
  AVAILABLE: 'Disponible',
  SOLD: 'Vendido',
  RESERVED: 'Reservado',
  IN_MAINTENANCE: 'Mantenimiento',
}

const fuelLabels: Record<string, string> = {
  GASOLINE: 'Gasolina',
  DIESEL: 'Diesel',
  ELECTRIC: 'Eléctrico',
  HYBRID: 'Híbrido',
  GAS: 'Gas',
}

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleApi.getById(id!),
    enabled: !!id,
  })

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>
  if (!data?.data) return <p>Vehículo no encontrado</p>

  const v = data.data

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/vehicles')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{v.brandName} {v.model}</h1>
          <p className="text-muted-foreground">{v.year} · {v.vinCode}</p>
        </div>
        <div className="ml-auto">
          <Badge variant={v.status === 'AVAILABLE' ? 'success' : v.status === 'SOLD' ? 'info' : 'warning'}>
            {statusLabels[v.status]}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Detalles del vehículo</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Marca</span><p className="font-medium">{v.brandName}</p></div>
              <div><span className="text-muted-foreground">Tipo</span><p className="font-medium">{v.typeName}</p></div>
              <div><span className="text-muted-foreground">Modelo</span><p className="font-medium">{v.model}</p></div>
              <div><span className="text-muted-foreground">Año</span><p className="font-medium">{v.year}</p></div>
              <div><span className="text-muted-foreground">Precio</span><p className="font-medium text-lg">${v.price.toLocaleString()}</p></div>
              <div><span className="text-muted-foreground">Color</span><p className="font-medium">{v.color}</p></div>
              <div><span className="text-muted-foreground">Combustible</span><p className="font-medium">{fuelLabels[v.fuelType]}</p></div>
              <div><span className="text-muted-foreground">Kilometraje</span><p className="font-medium">{v.mileage ? `${v.mileage.toLocaleString()} km` : 'N/A'}</p></div>
              <div><span className="text-muted-foreground">VIN</span><p className="font-medium font-mono text-xs">{v.vinCode}</p></div>
              <div><span className="text-muted-foreground">Creado</span><p className="font-medium">{new Date(v.createdAt).toLocaleDateString()}</p></div>
            </div>
            {v.description && (
              <>
                <Separator className="my-4" />
                <div><span className="text-muted-foreground text-sm">Descripción</span><p className="mt-1">{v.description}</p></div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Imagen</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
              {v.primaryImageUrl ? (
                <img src={v.primaryImageUrl} alt={v.model} className="max-h-full object-contain" />
              ) : (
                <Car className="h-16 w-16 text-muted-foreground/50" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
