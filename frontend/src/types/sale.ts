export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'FINANCING'
export type SaleStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'

export interface SaleItemRequest {
  vehicleId: string
  discount?: number
}

export interface SaleRequest {
  customerId: string
  paymentMethod: PaymentMethod
  items: SaleItemRequest[]
  notes?: string
  installments?: number
  downPayment?: number
}

export interface SaleItemResponse {
  id: number
  vehicleId: string
  vehicleModel: string
  unitPrice: number
  discount: number
}

export interface PaymentResponse {
  id: string
  method: PaymentMethod
  amount: number
  installments: number | null
  installmentAmount: number | null
  paymentDate: string
}

export interface SaleResponse {
  id: string
  customerId: string
  customerName: string
  employeeId: string
  employeeName: string
  totalAmount: number
  paymentMethod: PaymentMethod
  status: SaleStatus
  saleDate: string
  notes: string | null
  items: SaleItemResponse[]
  payments: PaymentResponse[]
  createdAt: string
}

export interface SaleStatusRequest {
  status: SaleStatus
}
