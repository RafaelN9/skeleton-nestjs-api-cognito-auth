import { z } from "zod";

export const signUpConfirmSchema = z.object({
  email: z.string().email(),
  code: z.string(),
});

export type SignUpConfirmDto = z.infer<typeof signUpConfirmSchema>;
