import type { ApiResponse } from '@/types/api'
import type { MonthlySalesReport, RevenueReport, TopCustomerReport, TopVehicleReport } from '@/types/report'
import apiClient from './client'

export const reportApi = {
  monthlySales: () =>
    apiClient.get<ApiResponse<MonthlySalesReport[]>>('/reports/sales/monthly').then(r => r.data),

  topVehicles: () =>
    apiClient.get<ApiResponse<TopVehicleReport[]>>('/reports/vehicles/top-sold').then(r => r.data),

  topCustomers: () =>
    apiClient.get<ApiResponse<TopCustomerReport[]>>('/reports/customers/top').then(r => r.data),

  revenue: (from: string, to: string) =>
    apiClient.get<ApiResponse<RevenueReport>>('/reports/revenue', { params: { from, to } }).then(r => r.data),

  exportPdf: (from: string, to: string) =>
    apiClient.post(`/reports/sales/export/pdf`, null, {
      params: { from, to },
      responseType: 'blob',
    }).then(r => {
      const url = window.URL.createObjectURL(new Blob([r.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-ventas-${from}-${to}.pdf`
      a.click()
    }),

  exportExcel: (from: string, to: string) =>
    apiClient.post(`/reports/sales/export/excel`, null, {
      params: { from, to },
      responseType: 'blob',
    }).then(r => {
      const url = window.URL.createObjectURL(new Blob([r.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-ventas-${from}-${to}.xlsx`
      a.click()
    }),
}
