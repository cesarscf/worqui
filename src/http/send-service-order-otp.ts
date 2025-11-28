import { z } from "zod"
import { api } from "@/http/api-client"

export const sendServiceOrderOtpSchema = z.object({
  name: z.string().min(3).max(255),
  phoneNumber: z.string().min(10).max(20),
  zipCode: z.string().min(8).max(10),
  deviceBrand: z.string().min(1),
  warrantyStatus: z.string().min(1),
  serviceType: z.string().min(1),
  issueCategory: z.string().min(1),
  urgencyLevel: z.string().min(1),
  additionalInfo: z.string().optional(),
})

export type SendServiceOrderOtpParmas = z.infer<
  typeof sendServiceOrderOtpSchema
>

export async function sendServiceOrderOtp(params: SendServiceOrderOtpParmas) {
  const response = await api.post("/service-orders/send-top", {
    ...params,
  })

  return response.data
}
