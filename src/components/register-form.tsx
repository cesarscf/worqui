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
  partnerAuthRegisterSendOtp,
  registerSendOtpSchema,
} from "@/http/partner-auth-register-send-otp"
import { partnerAuthRegisterVerify } from "@/http/partner-auth-register-verify"
import { setToken } from "@/lib/auth"
import { cn } from "@/lib/utils"

type RegisterStep = "info" | "code"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState<RegisterStep>("info")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  })

  const sendOtpMutation = useMutation({
    mutationFn: partnerAuthRegisterSendOtp,
    onSuccess: () => {
      setStep("code")
      toast.success("Código enviado com sucesso!")
    },
  })

  const verifyOtpMutation = useMutation({
    mutationFn: partnerAuthRegisterVerify,
    onSuccess: (data) => {
      toast.success("Cadastro realizado com sucesso!")
      setToken(data.token)
    },
  })

  const infoForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
    validators: {
      onSubmit: registerSendOtpSchema,
    },
    onSubmit: async ({ value }) => {
      setPhoneNumber(value.phoneNumber)
      setRegistrationData(value)
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
    setStep("info")
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
          {step === "info" ? "Criar conta no Worqui" : "Verificar código"}
        </h1>
        <FieldDescription>
          {step === "info" ? (
            <>
              Já tem uma conta?{" "}
              <Link to="/login" className="underline">
                Entrar
              </Link>
            </>
          ) : (
            "Digite o código enviado para seu telefone"
          )}
        </FieldDescription>
      </div>

      {step === "info" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            infoForm.handleSubmit()
          }}
        >
          <FieldGroup>
            <infoForm.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="João Silva"
                      autoComplete="name"
                      disabled={sendOtpMutation.isPending}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </infoForm.Field>
            <infoForm.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="joao@exemplo.com"
                      autoComplete="email"
                      type="email"
                      disabled={sendOtpMutation.isPending}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </infoForm.Field>
            <infoForm.Field name="phoneNumber">
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
            </infoForm.Field>
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
                onClick={() => sendOtpMutation.mutate(registrationData)}
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
                {verifyOtpMutation.isPending ? <Spinner /> : "Criar conta"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}
    </div>
  )
}
