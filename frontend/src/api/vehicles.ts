import type { ApiResponse, PageResponse } from '@/types/api'
import type { Brand, VehicleFilter, VehicleRequest, VehicleResponse, VehicleType, VehicleStatus } from '@/types/vehicle'
import apiClient from './client'

export const vehicleApi = {
  list: (filter?: VehicleFilter) =>
    apiClient.get<ApiResponse<PageResponse<VehicleResponse>>>('/vehicles', { params: filter }).then(r => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<VehicleResponse>>(`/vehicles/${id}`).then(r => r.data),

  create: (data: VehicleRequest) =>
    apiClient.post<ApiResponse<VehicleResponse>>('/vehicles', data).then(r => r.data),

  update: (id: string, data: VehicleRequest) =>
    apiClient.put<ApiResponse<VehicleResponse>>(`/vehicles/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/vehicles/${id}`).then(r => r.data),

  updateStatus: (id: string, status: VehicleStatus) =>
    apiClient.patch<ApiResponse<VehicleResponse>>(`/vehicles/${id}/status`, null, { params: { status } }).then(r => r.data),

  getBrands: () =>
    apiClient.get<ApiResponse<Brand[]>>('/brands').then(r => r.data).catch(() => ({ data: [] as Brand[], success: true, message: '', errors: null, timestamp: '' })),

  getTypes: () =>
    apiClient.get<ApiResponse<VehicleType[]>>('/vehicle-types').then(r => r.data).catch(() => ({ data: [] as VehicleType[], success: true, message: '', errors: null, timestamp: '' })),
}
