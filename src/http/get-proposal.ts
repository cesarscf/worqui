import { api } from "./api-client"

export type Proposal = {
  id: string
  serviceOrderId: string
  partnerId: string
  description: string
  price: string
  status: "pending" | "accepted" | "rejected" | "counter_offer"
  createdAt: Date
  partner: {
    id: string
    name: string
  }
  serviceOrder: {
    id: string
    customerId: string
    zipCode: string
    deviceBrand: string
    warrantyStatus: string
    serviceType: string
    issueCategory: string
    urgencyLevel: string
    additionalInfo: string | null
    status: "open" | "closed" | "cancelled"
  }
}

export async function getProposal(id: string) {
  const response = await api.get<Proposal>(`/proposals/${id}`)

  return response.data
}
