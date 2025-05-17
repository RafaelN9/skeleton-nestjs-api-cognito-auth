import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "min 8 characters.")
    .refine((password) => {
      const lowercaseRegex = /[a-z]/;
      const uppercaseRegex = /[A-Z]/;
      const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

      return (
        lowercaseRegex.test(password) &&
        uppercaseRegex.test(password) &&
        specialCharRegex.test(password)
      );
    }),
});

export type SignInDto = z.infer<typeof signInSchema>;
