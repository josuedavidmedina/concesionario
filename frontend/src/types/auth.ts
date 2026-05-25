export interface AuthRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  email: string
  role: string
  expiresIn: number
}
