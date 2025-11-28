import { z } from "zod"
import { api } from "@/http/api-client"

export const loginSendOtpSchema = z.object({
  phoneNumber: z.string().min(8).max(20),
})

export type LoginSendOtpParams = z.infer<typeof loginSendOtpSchema>

export async function partnerAuthLoginSendOtp(params: LoginSendOtpParams) {
  const response = await api.post("/partner-auth/login", {
    ...params,
  })

  return response.data
}
