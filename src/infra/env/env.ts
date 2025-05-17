import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),
  API_ENV: z
    .string()
    .refine((value) => ["DEV", "TEST", "PROD"].includes(value)),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  AWS_COGNITO_REGION: z.string(),
  AWS_COGNITO_AUTHORITY: z.string(),
  AWS_COGNITO_CLIENT_ID: z.string(),
  AWS_COGNITO_CLIENT_SECRET: z.string(),
});

export type Env = z.infer<typeof envSchema>;
