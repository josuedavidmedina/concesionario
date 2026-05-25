import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { vehicleApi } from '@/api/vehicles'
import { saleApi } from '@/api/sales'
import { customerApi } from '@/api/customers'
import { reportApi } from '@/api/reports'
import { Car, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function StatCard({ title, value, icon: Icon, trend, loading: isLoading }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-full bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {trend !== undefined && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {trend >= 0 ? <TrendingUp className="h-3 w-3 text-emerald-500" /> : <TrendingDown className="h-3 w-3 text-red-500" />}
                {Math.abs(trend)}% vs mes anterior
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { data: vehiclesData, isLoading: loadingVehicles } = useQuery({
    queryKey: ['vehicles', 'dashboard'],
    queryFn: () => vehicleApi.list({ page: 0, size: 1 }),
  })

  const { data: salesData, isLoading: loadingSales } = useQuery({
    queryKey: ['sales', 'dashboard'],
    queryFn: () => saleApi.list(),
  })

  const { data: customersData, isLoading: loadingCustomers } = useQuery({
    queryKey: ['customers', 'dashboard'],
    queryFn: () => customerApi.list(),
  })

  const { data: monthlyData, isLoading: loadingMonthly } = useQuery({
    queryKey: ['reports', 'monthly'],
    queryFn: () => reportApi.monthlySales(),
  })

  const totalVehicles = vehiclesData?.data?.totalElements ?? 0
  const totalSales = salesData?.data?.length ?? 0
  const totalCustomers = customersData?.data?.length ?? 0
  const totalRevenue = salesData?.data?.reduce((sum: number, s: any) => sum + (s.totalAmount || 0), 0) ?? 0

  const chartData = (monthlyData?.data ?? []).map((m: any) => ({
    name: m.monthName?.slice(0, 3),
    ventas: m.totalSales,
    ingresos: m.totalRevenue,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del concesionario</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Vehículos" value={totalVehicles.toLocaleString()} icon={Car} loading={loadingVehicles} />
        <StatCard title="Ventas" value={totalSales.toLocaleString()} icon={ShoppingCart} loading={loadingSales} />
        <StatCard title="Clientes" value={totalCustomers.toLocaleString()} icon={Users} loading={loadingCustomers} />
        <StatCard title="Ingresos" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} loading={loadingSales} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ventas Mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingMonthly ? (
            <Skeleton className="h-72 w-full" />
          ) : chartData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="ventas" fill="hsl(222.2 47.4% 11.2%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No hay datos disponibles</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
