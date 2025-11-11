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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { verifyPhoneNumberSchema } from "@/lib/validations/auth";

export function VerifyPhoneNumberForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof verifyPhoneNumberSchema>>({
    resolver: zodResolver(verifyPhoneNumberSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit({ code }: z.infer<typeof verifyPhoneNumberSchema>) {
    setLoading(true);

    const phoneNumber = searchParams.get("phoneNumber");

    if (!phoneNumber) return;

    const { data } = await authClient.phoneNumber.verify({
      phoneNumber,
      code,
      disableSession: false,
      updatePhoneNumber: false,
    });

    if (data) {
      router.push("/w");
    } else {
      toast.error("Código expirou ou está inválido.");
    }

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your phone.
              </FormDescription>
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
