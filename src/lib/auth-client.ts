import { createAuthClient } from "better-auth/client";
import { phoneNumberClient } from "better-auth/client/plugins";
import { env } from "@/env";

export const authClient = createAuthClient({
  baseURL: env.BETTER_AUTH_URL,
  plugins: [phoneNumberClient()],
});
