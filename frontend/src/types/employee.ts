export interface EmployeeRequest {
  userId: string
  firstName: string
  lastName: string
  employeeCode: string
  department?: string
  hireDate: string
  isActive?: boolean
}

export interface EmployeeResponse {
  id: string
  userId: string
  userEmail: string
  firstName: string
  lastName: string
  fullName: string
  employeeCode: string
  department: string | null
  hireDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
