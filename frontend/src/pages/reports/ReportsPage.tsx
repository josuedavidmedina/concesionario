import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { reportApi } from '@/api/reports'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Select } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Download } from 'lucide-react'

const COLORS = ['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState(() => {
    const to = new Date()
    const from = new Date()
    from.setMonth(from.getMonth() - 12)
    return {
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0],
    }
  })

  const { data: monthlyData, isLoading: loadingMonthly } = useQuery({
    queryKey: ['reports', 'monthly'],
    queryFn: () => reportApi.monthlySales(),
  })

  const { data: topVehiclesData, isLoading: loadingVehicles } = useQuery({
    queryKey: ['reports', 'top-vehicles'],
    queryFn: () => reportApi.topVehicles(),
  })

  const { data: topCustomersData, isLoading: loadingCustomers } = useQuery({
    queryKey: ['reports', 'top-customers'],
    queryFn: () => reportApi.topCustomers(),
  })

  const monthlyChartData = (monthlyData?.data ?? []).map((m: any) => ({
    name: m.monthName?.slice(0, 3),
    ventas: m.totalSales,
    ingresos: m.totalRevenue,
  }))

  const vehicleChartData = (topVehiclesData?.data ?? []).slice(0, 10).map((v: any) => ({
    name: `${v.brand} ${v.model}`,
    vendidos: v.totalSold,
  }))

  const customerChartData = (topCustomersData?.data ?? []).slice(0, 10).map((c: any) => ({
    name: c.fullName,
    gasto: c.totalSpent,
  }))

  const handleExport = (format: 'pdf' | 'excel') => {
    if (format === 'pdf') reportApi.exportPdf(dateRange.from, dateRange.to)
    else reportApi.exportExcel(dateRange.from, dateRange.to)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reportes</h1>
          <p className="text-muted-foreground">Analítica y exportación de datos</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          />
          <span className="text-muted-foreground">a</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          />
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
            <Download className="h-4 w-4" /> Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Ventas Mensuales</CardTitle></CardHeader>
          <CardContent>
            {loadingMonthly ? <Skeleton className="h-64 w-full" /> :
              monthlyChartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="ventas" fill="#0f172a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : <p className="text-center text-muted-foreground py-12">Sin datos</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Vehículos más vendidos</CardTitle></CardHeader>
          <CardContent>
            {loadingVehicles ? <Skeleton className="h-64 w-full" /> :
              vehicleChartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={vehicleChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="vendidos" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : <p className="text-center text-muted-foreground py-12">Sin datos</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Mejores clientes</CardTitle></CardHeader>
          <CardContent>
            {loadingCustomers ? <Skeleton className="h-64 w-full" /> :
              customerChartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customerChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="gasto" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : <p className="text-center text-muted-foreground py-12">Sin datos</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Distribución de ventas</CardTitle></CardHeader>
          <CardContent>
            {loadingMonthly ? <Skeleton className="h-64 w-full" /> :
              monthlyChartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={monthlyChartData.slice(0, 6)}
                        dataKey="ventas"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {monthlyChartData.slice(0, 6).map((_: any, i: number) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : <p className="text-center text-muted-foreground py-12">Sin datos</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
