import { z } from "zod"
import { api } from "@/http/api-client"

export const createProposalSchema = z.object({
  serviceOrderId: z.string().uuid(),
  priceInCents: z.string(),
  description: z.string().min(10).max(1000),
})

export type CreateProposalParams = z.infer<typeof createProposalSchema>

export async function createProposal(params: CreateProposalParams) {
  const response = await api.post("/proposals", {
    ...params,
  })

  return response.data
}
