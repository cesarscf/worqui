import { api } from "./api-client"

export type Partner = {
  createdAt: Date
  updatedAt: Date
  id: string
  name: string
  email: string
  phone: string | null
  expertise: string | null
  phoneVerifiedAt: Date | null
  emailVerifiedAt: Date | null
}

export async function getPartner() {
  const response = await api.get<Partner>("/partners/me")

  return response.data
}
