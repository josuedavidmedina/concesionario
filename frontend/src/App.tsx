import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import DashboardLayout from '@/layouts/DashboardLayout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import VehicleList from '@/pages/vehicles/VehicleList'
import VehicleDetail from '@/pages/vehicles/VehicleDetail'
import CustomerList from '@/pages/customers/CustomerList'
import SaleList from '@/pages/sales/SaleList'
import EmployeeList from '@/pages/employees/EmployeeList'
import ReportsPage from '@/pages/reports/ReportsPage'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30000 },
  },
})

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center text-muted-foreground">Cargando...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminOrManagerRoute({ children }: { children: ReactNode }) {
  const { isManager, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isManager) return <Navigate to="/" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route path="/" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/vehicles" element={<ProtectedRoute><DashboardLayout><VehicleList /></DashboardLayout></ProtectedRoute>} />
      <Route path="/vehicles/:id" element={<ProtectedRoute><DashboardLayout><VehicleDetail /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><DashboardLayout><CustomerList /></DashboardLayout></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><DashboardLayout><SaleList /></DashboardLayout></ProtectedRoute>} />
      <Route path="/employees" element={<AdminOrManagerRoute><DashboardLayout><EmployeeList /></DashboardLayout></AdminOrManagerRoute>} />
      <Route path="/reports" element={<AdminOrManagerRoute><DashboardLayout><ReportsPage /></DashboardLayout></AdminOrManagerRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
