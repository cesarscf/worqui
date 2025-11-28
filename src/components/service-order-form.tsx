import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
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
import { RadioCard } from "@/components/ui/radio-card"
import { RadioGroup } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { airConditionerQuestions } from "@/config/air-conditioner-questions"
import { sendServiceOrderOtp } from "@/http/send-service-order-otp"
import { verifyServiceOrder } from "@/http/verify-service-order"
import { cn } from "@/lib/utils"

type ServiceOrderStep =
  | "deviceBrand"
  | "warrantyStatus"
  | "serviceType"
  | "issueCategory"
  | "urgencyLevel"
  | "additionalInfo"
  | "zipCode"
  | "personal"
  | "code"

interface FormData {
  deviceBrand: string
  warrantyStatus: string
  serviceType: string
  issueCategory: string
  urgencyLevel: string
  additionalInfo: string
  zipCode: string
  name: string
  phoneNumber: string
}

export function ServiceOrderForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState<ServiceOrderStep>("deviceBrand")
  const [formData, setFormData] = useState<FormData>({
    deviceBrand: "",
    warrantyStatus: "",
    serviceType: "",
    issueCategory: "",
    urgencyLevel: "",
    additionalInfo: "",
    zipCode: "",
    name: "",
    phoneNumber: "",
  })

  const sendOtpMutation = useMutation({
    mutationFn: sendServiceOrderOtp,
    onSuccess: () => {
      setStep("code")
      toast.success("Código enviado com sucesso!")
    },
  })

  const verifyOtpMutation = useMutation({
    mutationFn: verifyServiceOrder,
    onSuccess: () => {
      toast.success("Ordem de serviço criada com sucesso!")
    },
  })

  const zipCodeForm = useForm({
    defaultValues: {
      zipCode: formData.zipCode,
    },
    validators: {
      onSubmit: z.object({
        zipCode: z.string().min(8, "CEP inválido"),
      }),
    },
    onSubmit: async ({ value }) => {
      setFormData((prev) => ({ ...prev, ...value }))
      setStep("personal")
    },
  })

  const personalForm = useForm({
    defaultValues: {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
        phoneNumber: z.string().min(10, "Telefone inválido"),
      }),
    },
    onSubmit: async ({ value }) => {
      const finalData = { ...formData, ...value }
      setFormData(finalData)
      sendOtpMutation.mutate(finalData)
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
        phoneNumber: formData.phoneNumber,
        code: value.code,
      })
    },
  })

  const currentQuestionIndex = airConditionerQuestions.findIndex(
    (q) => q.id === step,
  )
  const currentQuestion =
    currentQuestionIndex >= 0
      ? airConditionerQuestions[currentQuestionIndex]
      : null

  function handleQuestionSubmit() {
    const currentStep = airConditionerQuestions[currentQuestionIndex]
    const value = formData[currentStep.fieldName as keyof FormData]

    if (!value && currentStep.type === "radio") {
      toast.error("Por favor, selecione uma opção")
      return
    }

    if (currentQuestionIndex < airConditionerQuestions.length - 1) {
      setStep(
        airConditionerQuestions[currentQuestionIndex + 1]
          .id as ServiceOrderStep,
      )
    } else {
      setStep("zipCode")
    }
  }

  function handleBack() {
    const steps: ServiceOrderStep[] = [
      ...airConditionerQuestions.map((q) => q.id as ServiceOrderStep),
      "zipCode",
      "personal",
      "code",
    ]
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1])
    }
  }

  function updateFormData(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const stepConfig = {
    zipCode: {
      title: "Localização",
      description: "Informe seu CEP",
    },
    personal: {
      title: "Informações Pessoais",
      description: "Informe seu nome e telefone",
    },
    code: {
      title: "Verificar Código",
      description: "Digite o código enviado para seu telefone",
    },
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-xl font-bold">
          {currentQuestion
            ? currentQuestion.title
            : stepConfig[step as keyof typeof stepConfig]?.title}
        </h1>
        <FieldDescription>
          {currentQuestion
            ? currentQuestion.description
            : stepConfig[step as keyof typeof stepConfig]?.description}
        </FieldDescription>
      </div>

      {currentQuestion && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleQuestionSubmit()
          }}
        >
          <FieldGroup>
            <Field>
              {currentQuestion.type === "radio" && currentQuestion.options ? (
                <RadioGroup
                  value={formData[currentQuestion.fieldName as keyof FormData]}
                  onValueChange={(value) =>
                    updateFormData(
                      currentQuestion.fieldName as keyof FormData,
                      value,
                    )
                  }
                  className="gap-2"
                >
                  {currentQuestion.options.map((option) => (
                    <RadioCard
                      key={option.value}
                      value={option.value}
                      id={`${currentQuestion.id}-${option.value}`}
                      icon={<div className="size-5">{option.icon}</div>}
                      title={option.label}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <>
                  <FieldLabel htmlFor={currentQuestion.fieldName}>
                    Informações Adicionais (Opcional)
                  </FieldLabel>
                  <Textarea
                    id={currentQuestion.fieldName}
                    name={currentQuestion.fieldName}
                    value={
                      formData[currentQuestion.fieldName as keyof FormData]
                    }
                    onChange={(e) =>
                      updateFormData(
                        currentQuestion.fieldName as keyof FormData,
                        e.target.value,
                      )
                    }
                    placeholder="Digite informações adicionais sobre o serviço..."
                    rows={4}
                  />
                </>
              )}
            </Field>
            <Field orientation="horizontal">
              {currentQuestionIndex > 0 && (
                <Button type="button" variant="ghost" onClick={handleBack}>
                  Voltar
                </Button>
              )}
              <Button type="submit" className="flex-1">
                Continuar
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}

      {step === "zipCode" && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            zipCodeForm.handleSubmit()
          }}
        >
          <FieldGroup>
            <zipCodeForm.Field name="zipCode">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>CEP</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="12345-678"
                      autoComplete="postal-code"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </zipCodeForm.Field>
            <Field orientation="horizontal">
              <Button type="button" variant="ghost" onClick={handleBack}>
                Voltar
              </Button>
              <Button type="submit" className="flex-1">
                Continuar
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}

      {step === "personal" && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            personalForm.handleSubmit()
          }}
        >
          <FieldGroup>
            <personalForm.Field name="name">
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
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </personalForm.Field>
            <personalForm.Field name="phoneNumber">
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
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </personalForm.Field>
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={sendOtpMutation.isPending}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="flex-1"
              >
                {sendOtpMutation.isPending ? <Spinner /> : "Enviar código"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}

      {step === "code" && (
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
                onClick={() => sendOtpMutation.mutate(formData)}
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
                {verifyOtpMutation.isPending ? <Spinner /> : "Confirmar"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}
    </div>
  )
}
