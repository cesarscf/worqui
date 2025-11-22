import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"

import { PartnerSendOtpForm } from "./-components/partner-send-otp-form"
import { PartnerVerifyOtpForm } from "./-components/partner-verify-otp-form"

export const Route = createFileRoute("/login/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [sendedOtpTo, setSendedOtpTo] = React.useState("")

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {!sendedOtpTo ? (
        <PartnerSendOtpForm
          onSended={(phoneNumber) => {
            setSendedOtpTo(phoneNumber)
          }}
        />
      ) : (
        <PartnerVerifyOtpForm phoneNumber={sendedOtpTo} />
      )}
    </div>
  )
}
