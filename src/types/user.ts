export interface Address {
  id: string
  fullName: string
  line1: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface User {
  id: string
  email: string
  name: string
  addresses: Address[]
}
