import { z } from "zod"
import { api } from "@/http/api-client"

export const registerSendOtpSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  phoneNumber: z.string().min(8).max(20),
})

export type RegisterSendOtpParams = z.infer<typeof registerSendOtpSchema>

export async function partnerAuthRegisterSendOtp(
  params: RegisterSendOtpParams,
) {
  const response = await api.post("/partner-auth/register", {
    ...params,
  })

  return response.data
}
