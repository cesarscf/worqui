import { api } from "./api-client"

export async function partnerVerifyOtp({
  phoneNumber,
  code,
}: {
  phoneNumber: string
  code: string
}) {
  const response = await api.post<{ token: string }>("/partner-auth/verify", {
    phoneNumber,
    code,
  })

  return response.data
}
