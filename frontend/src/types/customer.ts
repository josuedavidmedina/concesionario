export type DocumentType = 'CC' | 'CE' | 'NIT' | 'PASSPORT'
export type ContactType = 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'ADDRESS'

export interface ContactRequest {
  type: ContactType
  value: string
}

export interface CustomerRequest {
  userId?: string
  firstName: string
  lastName: string
  documentType: DocumentType
  documentNumber: string
  birthDate?: string
  address?: string
  city?: string
  contacts: ContactRequest[]
}

export interface ContactResponse {
  id: number
  type: ContactType
  value: string
}

export interface CustomerResponse {
  id: string
  userId: string | null
  firstName: string
  lastName: string
  fullName: string
  documentType: DocumentType
  documentNumber: string
  birthDate: string | null
  address: string | null
  city: string | null
  contacts: ContactResponse[]
  createdAt: string
  updatedAt: string
}
