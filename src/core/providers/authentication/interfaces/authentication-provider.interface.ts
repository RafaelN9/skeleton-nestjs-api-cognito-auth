import { SignIn } from "@/core/providers/authentication/interfaces/sign-in.interface";
import { SignUp } from "@/core/providers/authentication/interfaces/sign-up.interface";
import { SignUpConfirm } from "@/core/providers/authentication/interfaces/sign-up-confirm.interface";
import { ResendConfirmationCode } from "@/core/providers/authentication/interfaces/resend-confirmation-code.interface";
import { PasswordReset } from "@/core/providers/authentication/interfaces/password-reset.interface";
import { PasswordResetConfirm } from "@/core/providers/authentication/interfaces/password-reset-confirm.interface";
import { GetUserName } from "@/core/providers/authentication/interfaces/get-user-name.interface";

export interface AuthenticationProviderProps {
  signIn: SignIn;
  signUp: SignUp;
  signUpConfirm: SignUpConfirm;
  resendConfirmationCode: ResendConfirmationCode;
  passwordReset: PasswordReset;
  passwordResetConfirm: PasswordResetConfirm;
  getUserName: GetUserName;
}
