import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Spinner } from "@/components/ui/spinner"
import { partnerVerifyOtp } from "@/http/partner-verify-otp"
import { setToken } from "@/lib/auth"
import { authVerifyOtpSchema } from "@/lib/validations/auth"

export function PartnerVerifyOtpForm({ phoneNumber }: { phoneNumber: string }) {
  const [loading, setLoading] = React.useState(false)

  const form = useForm<z.infer<typeof authVerifyOtpSchema>>({
    resolver: zodResolver(authVerifyOtpSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(data: z.infer<typeof authVerifyOtpSchema>) {
    setLoading(true)

    await partnerVerifyOtp({ phoneNumber, code: data.code }).then((res) =>
      setToken(res.token),
    )

    setLoading(false)
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Verificar código</CardTitle>
        <CardDescription>
          Digite o código de 6 dígitos enviado para seu telefone
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="verify-code"
                    className="w-full justify-center"
                  >
                    Código de verificação
                  </FieldLabel>
                  <div className="flex justify-center">
                    <InputOTP {...field} id="verify-code" maxLength={6}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <FieldDescription className="text-center">
                    Insira o código de 6 dígitos enviado para seu telefone
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          disabled={loading}
          type="submit"
          form="login-form"
          className="w-full"
          size="lg"
        >
          {loading && <Spinner />}
          Entrar
        </Button>
      </CardFooter>
    </Card>
  )
}
