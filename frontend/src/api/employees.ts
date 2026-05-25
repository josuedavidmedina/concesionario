import type { ApiResponse } from '@/types/api'
import type { EmployeeRequest, EmployeeResponse } from '@/types/employee'
import apiClient from './client'

export const employeeApi = {
  list: () =>
    apiClient.get<ApiResponse<EmployeeResponse[]>>('/employees').then(r => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<EmployeeResponse>>(`/employees/${id}`).then(r => r.data),

  getByUserId: (userId: string) =>
    apiClient.get<ApiResponse<EmployeeResponse>>(`/employees/user/${userId}`).then(r => r.data),

  create: (data: EmployeeRequest) =>
    apiClient.post<ApiResponse<EmployeeResponse>>('/employees', data).then(r => r.data),

  update: (id: string, data: EmployeeRequest) =>
    apiClient.put<ApiResponse<EmployeeResponse>>(`/employees/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/employees/${id}`).then(r => r.data),
}
