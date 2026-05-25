import type { ApiResponse } from '@/types/api'
import type { SaleRequest, SaleResponse, SaleStatus, SaleStatusRequest } from '@/types/sale'
import apiClient from './client'

export const saleApi = {
  list: () =>
    apiClient.get<ApiResponse<SaleResponse[]>>('/sales').then(r => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<SaleResponse>>(`/sales/${id}`).then(r => r.data),

  getByCustomer: (customerId: string) =>
    apiClient.get<ApiResponse<SaleResponse[]>>(`/sales/customer/${customerId}`).then(r => r.data),

  create: (data: SaleRequest) =>
    apiClient.post<ApiResponse<SaleResponse>>('/sales', data).then(r => r.data),

  updateStatus: (id: string, data: SaleStatusRequest) =>
    apiClient.patch<ApiResponse<SaleResponse>>(`/sales/${id}/status`, data).then(r => r.data),
}
