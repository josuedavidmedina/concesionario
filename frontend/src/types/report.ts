export interface MonthlySalesReport {
  year: number
  month: number
  monthName: string
  totalSales: number
  totalRevenue: number
}

export interface TopVehicleReport {
  vehicleId: string
  brand: string
  model: string
  year: number
  totalSold: number
  totalRevenue: number
}

export interface TopCustomerReport {
  customerId: string
  fullName: string
  documentNumber: string
  totalPurchases: number
  totalSpent: number
}

export interface RevenueReport {
  from: string
  to: string
  totalRevenue: number
  totalTransactions: number
}
