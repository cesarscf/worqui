import { treaty } from "@elysiajs/eden";
import { env } from "@/env";
import type { App } from "../app/api/[[...slugs]]/route";

export const api = treaty<App>(env.NEXT_PUBLIC_APP_URL).api;
