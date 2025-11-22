import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
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
import { MaskInput } from "@/components/ui/mask-input"
import { Spinner } from "@/components/ui/spinner"
import { partnerSendToken } from "@/http/partner-send-otp"
import { unknownError } from "@/lib/constants"
import { phoneNumberPattern } from "@/lib/partterns"
import { authSendOtpSchema } from "@/lib/validations/auth"

type PartnerSendOtpFormProps = {
  onSended: (phoneNumber: string) => void
}

export function PartnerSendOtpForm({ onSended }: PartnerSendOtpFormProps) {
  const [loading, setLoading] = React.useState(false)

  const form = useForm<z.infer<typeof authSendOtpSchema>>({
    resolver: zodResolver(authSendOtpSchema),
    defaultValues: {
      phoneNumber: "",
    },
  })

  async function onSubmit(data: z.infer<typeof authSendOtpSchema>) {
    setLoading(true)

    await partnerSendToken(data.phoneNumber)
      .then(() => onSended(data.phoneNumber))
      .catch((error) => {
        if (error instanceof AxiosError) {
          const message = error.response?.data?.message ?? unknownError

          toast.error(message)
          return
        }

        toast.error(unknownError)
      })

    setLoading(false)
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Entre para continuar</CardTitle>
        <CardDescription>
          Para acessar sua conta, digite abaixo seu celular e enviaremos o
          código para efetuar login.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="phoneNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone-number">
                    Número de telefone
                  </FieldLabel>
                  <MaskInput
                    {...field}
                    id="phone-number"
                    mask={phoneNumberPattern}
                    aria-invalid={fieldState.invalid}
                    placeholder="(11) 98765-4321"
                    autoComplete="tel"
                    onValueChange={(_, unmaskedValue) => {
                      field.onChange(unmaskedValue)
                    }}
                  />
                  <FieldDescription>
                    Usaremos este número para nos comunicar com você.
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
          Enviar código
        </Button>
      </CardFooter>
    </Card>
  )
}
