import { z } from "zod"
import { api } from "@/http/api-client"

export const loginVerifySchema = z.object({
  phoneNumber: z.string().min(8).max(20),
  code: z.string().length(6),
})

export type LoginVerifyParams = z.infer<typeof loginVerifySchema>

export async function partnerAuthLoginVerify(params: LoginVerifyParams) {
  const response = await api.post<{ token: string }>(
    "/partner-auth/login/verify",
    {
      ...params,
    },
  )

  return response.data
}
