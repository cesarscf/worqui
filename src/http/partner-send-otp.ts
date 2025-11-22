import { api } from "./api-client"

export async function partnerSendToken(phoneNumber: string) {
  const response = await api.post("/partner-auth/send-otp", { phoneNumber })

  return response.data
}
