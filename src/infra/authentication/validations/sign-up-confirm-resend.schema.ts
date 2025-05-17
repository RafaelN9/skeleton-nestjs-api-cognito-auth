import { z } from "zod";

export const signUpConfirmResendSchema = z.object({
  email: z.string().email(),
});

export type SignUpConfirmResendDto = z.infer<typeof signUpConfirmResendSchema>;
