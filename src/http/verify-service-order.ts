import { z } from "zod"
import { api } from "@/http/api-client"

export const verifyServiceOrderSchema = z.object({
  phoneNumber: z.string().min(8).max(20),
  code: z.string().length(6),
})
export type VerifyServiceOrderParams = z.infer<typeof verifyServiceOrderSchema>

export async function verifyServiceOrder(params: VerifyServiceOrderParams) {
  const response = await api.post("/service-orders/verify", {
    ...params,
  })

  return response.data
}
