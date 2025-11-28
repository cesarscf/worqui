import { api } from "@/http/api-client"

export type UpdateServiceOrderStatusParams = {
  id: string
  accept: boolean
}

export async function updateProposalStatus(
  params: UpdateServiceOrderStatusParams,
) {
  const response = await api.post(`/proposals/${params.id}`, {
    accept: params.accept,
  })

  return response.data
}
