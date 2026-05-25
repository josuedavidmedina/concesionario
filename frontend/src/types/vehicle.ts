export type FuelType = 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID' | 'GAS'
export type VehicleStatus = 'AVAILABLE' | 'SOLD' | 'RESERVED' | 'IN_MAINTENANCE'

export interface VehicleRequest {
  brandId: number
  typeId: number
  model: string
  year: number
  price: number
  color: string
  fuelType: FuelType
  mileage: number | null
  engineCc: number | null
  transmission: string | null
  description: string | null
  vinCode: string
}

export interface VehicleResponse {
  id: string
  brandName: string
  typeName: string
  model: string
  year: number
  price: number
  color: string
  fuelType: FuelType
  status: VehicleStatus
  mileage: number | null
  description: string | null
  vinCode: string
  imageUrls: string[]
  primaryImageUrl: string | null
  createdAt: string
}

export interface VehicleFilter {
  brandId?: number
  typeId?: number
  yearFrom?: number
  yearTo?: number
  priceFrom?: number
  priceTo?: number
  fuelType?: FuelType
  status?: VehicleStatus
  search?: string
  sortBy?: 'price' | 'year' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  size?: number
}

export interface Brand {
  id: number
  name: string
  country: string | null
  logoUrl: string | null
}

export interface VehicleType {
  id: number
  name: string
  description: string | null
}
