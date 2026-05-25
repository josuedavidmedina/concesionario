import type { AuthRequest, AuthResponse, RegisterRequest } from '@/types/auth'
import type { ApiResponse } from '@/types/api'
import apiClient from './client'

export const authApi = {
  login: (data: AuthRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data).then(r => r.data),

  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data).then(r => r.data),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh-token', null, {
      headers: { 'X-Refresh-Token': refreshToken },
    }).then(r => r.data),
}
