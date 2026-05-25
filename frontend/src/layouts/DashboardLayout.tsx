import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Car, Users, ShoppingCart, UserCircle, BarChart3, LogOut, Menu, X,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_SELLER'] },
  { href: '/vehicles', label: 'Vehículos', icon: Car, roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_SELLER'] },
  { href: '/customers', label: 'Clientes', icon: Users, roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_SELLER'] },
  { href: '/sales', label: 'Ventas', icon: ShoppingCart, roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_SELLER'] },
  { href: '/employees', label: 'Empleados', icon: UserCircle, roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
  { href: '/reports', label: 'Reportes', icon: BarChart3, roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const visibleItems = navItems.filter(
    item => user && item.roles.some(r => user.role === r)
  )

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-6 py-5 border-b">
            <Car className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Concesionario</span>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {visibleItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="border-t px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="font-medium">{user?.email}</p>
                <p className="text-muted-foreground text-xs">{user?.role?.replace('ROLE_', '')}</p>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-md hover:bg-accent cursor-pointer" title="Cerrar sesión">
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-background flex items-center px-4 lg:px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-accent cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="text-sm text-muted-foreground hidden sm:block">
            {user?.email}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
