import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { phoneNumber } from "better-auth/plugins";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    phoneNumber({
      sendOTP: ({ phoneNumber, code }) => {
        console.log(`➡️ Code: ${code} 📱 sent to: ${phoneNumber}`);
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}@my-site.com`;
        },

        getTempName: (phoneNumber) => {
          return phoneNumber;
        },
      },
    }),
  ],
});
