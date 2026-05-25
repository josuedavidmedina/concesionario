import type { ApiResponse } from '@/types/api'
import type { CustomerRequest, CustomerResponse } from '@/types/customer'
import apiClient from './client'

export const customerApi = {
  list: (search?: string) =>
    apiClient.get<ApiResponse<CustomerResponse[]>>('/customers', { params: { search } }).then(r => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<CustomerResponse>>(`/customers/${id}`).then(r => r.data),

  create: (data: CustomerRequest) =>
    apiClient.post<ApiResponse<CustomerResponse>>('/customers', data).then(r => r.data),

  update: (id: string, data: CustomerRequest) =>
    apiClient.put<ApiResponse<CustomerResponse>>(`/customers/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/customers/${id}`).then(r => r.data),
}
