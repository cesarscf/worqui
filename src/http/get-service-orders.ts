import { api } from "./api-client"

export type GetServiceOrdersResponse = {
  items: {
    id: string
    zipCode: string
    deviceBrand: string
    warrantyStatus: string
    serviceType: string
    issueCategory: string
    urgencyLevel: string
    additionalInfo: string | null
    createdAt: Date
  }[]
}

export async function getServiceOrders() {
  const response = await api.get<GetServiceOrdersResponse>("/service-orders")

  return response.data
}
