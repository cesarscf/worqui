import { treaty } from "@elysiajs/eden";
import type { App } from "@/app/api/[[...slugs]]/route";
import { env } from "@/env";

export const api = treaty<App>(env.NEXT_PUBLIC_APP_URL).api;
