"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MaskInput } from "@/components/ui/mask-input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { phoneNumberPattern } from "@/lib/patterns";
import { phoneNumberSignInFormSchema } from "@/lib/validations/auth";

export function PhoneNumberSignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof phoneNumberSignInFormSchema>>({
    resolver: zodResolver(phoneNumberSignInFormSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  async function onSubmit({
    phoneNumber,
  }: z.infer<typeof phoneNumberSignInFormSchema>) {
    setLoading(true);

    const { data } = await authClient.phoneNumber.sendOtp({
      phoneNumber,
    });

    setLoading(false);

    if (data) {
      toast.message("Verifique seu WhatsApp", {
        description:
          "Enviamos um código de verificação de 6 dígitos para você.",
      });

      const params = new URLSearchParams(searchParams.toString());
      params.set("phoneNumber", phoneNumber);
      router.push(`/login/verify-number?${params.toString()}`);
    } else {
      toast.error("Ocorreu um erro ao enviar o código.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <MaskInput
                  mask={phoneNumberPattern}
                  value={field.value}
                  onValueChange={(_maskedValue, unmaskedValue) => {
                    field.onChange(unmaskedValue);
                  }}
                  placeholder="Enter phone number"
                  invalid={!!form.formState.errors.phoneNumber}
                />
              </FormControl>
              <FormDescription>Enter your primary phone number</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={loading}>
          {loading && <Spinner />}
          Continue
          <span className="sr-only">Continue to email verification page</span>
        </Button>
      </form>
    </Form>
  );
}
