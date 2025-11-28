import { z } from "zod"
import { api } from "@/http/api-client"

export const registerVerifySchema = z.object({
  phoneNumber: z.string().min(8).max(20),
  code: z.string().length(6),
})

export type RegisterVerifyParams = z.infer<typeof registerVerifySchema>

export async function partnerAuthRegisterVerify(params: RegisterVerifyParams) {
  const response = await api.post<{ token: string }>(
    "/partner-auth/register/verify",
    {
      ...params,
    },
  )

  return response.data
}
