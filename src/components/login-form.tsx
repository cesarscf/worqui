import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { GalleryVerticalEnd } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  loginSendOtpSchema,
  partnerAuthLoginSendOtp,
} from "@/http/partner-auth-login-send-otp"
import { partnerAuthLoginVerify } from "@/http/partner-auth-login-verify"
import { setToken } from "@/lib/auth"
import { cn } from "@/lib/utils"

type LoginStep = "phone" | "code"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState<LoginStep>("phone")
  const [phoneNumber, setPhoneNumber] = useState("")

  const sendOtpMutation = useMutation({
    mutationFn: partnerAuthLoginSendOtp,
    onSuccess: () => {
      setStep("code")
      toast.success("Código enviado com sucesso!")
    },
  })

  const verifyOtpMutation = useMutation({
    mutationFn: partnerAuthLoginVerify,
    onSuccess: (data) => {
      toast.success("Login realizado com sucesso!")
      setToken(data.token)
    },
  })

  const phoneForm = useForm({
    defaultValues: {
      phoneNumber: "",
    },
    validators: {
      onSubmit: loginSendOtpSchema,
    },
    onSubmit: async ({ value }) => {
      setPhoneNumber(value.phoneNumber)
      sendOtpMutation.mutate(value)
    },
  })

  const codeForm = useForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onSubmit: z.object({
        code: z.string().length(6, "O código deve ter 6 dígitos"),
      }),
    },
    onSubmit: async ({ value }) => {
      verifyOtpMutation.mutate({
        phoneNumber,
        code: value.code,
      })
    },
  })

  function handleBack() {
    setStep("phone")
    codeForm.reset()
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex flex-col items-center gap-2 font-medium">
          <div className="flex size-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <span className="sr-only">Worqui</span>
        </div>
        <h1 className="text-xl font-bold">
          {step === "phone" ? "Bem-vindo ao Worqui" : "Verificar código"}
        </h1>
        <FieldDescription>
          {step === "phone" ? (
            <>
              Não tem uma conta?{" "}
              <Link to="/register" className="underline">
                Cadastre-se
              </Link>
            </>
          ) : (
            "Digite o código enviado para seu telefone"
          )}
        </FieldDescription>
      </div>

      {step === "phone" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            phoneForm.handleSubmit()
          }}
        >
          <FieldGroup>
            <phoneForm.Field name="phoneNumber">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Telefone</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="+55 11 99999-9999"
                      autoComplete="tel"
                      disabled={sendOtpMutation.isPending}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </phoneForm.Field>
            <Field>
              <Button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="w-full"
              >
                {sendOtpMutation.isPending ? <Spinner /> : "Continuar"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            codeForm.handleSubmit()
          }}
        >
          <FieldGroup>
            <codeForm.Field name="code">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Código</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="000000"
                      autoComplete="one-time-code"
                      maxLength={6}
                      disabled={verifyOtpMutation.isPending}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </codeForm.Field>
            <Field>
              <Button
                type="button"
                variant="link"
                onClick={() => sendOtpMutation.mutate({ phoneNumber })}
                disabled={sendOtpMutation.isPending}
                className="w-full"
              >
                {sendOtpMutation.isPending ? <Spinner /> : "Reenviar código"}
              </Button>
            </Field>
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={verifyOtpMutation.isPending}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={verifyOtpMutation.isPending}
                className="flex-1"
              >
                {verifyOtpMutation.isPending ? <Spinner /> : "Entrar"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}
    </div>
  )
}
