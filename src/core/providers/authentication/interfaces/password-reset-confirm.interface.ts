export interface PasswordResetConfirmReq {
  email: string;
  newPassword: string;
  code: string;
}

export interface PasswordResetConfirm {
  (data: PasswordResetConfirmReq): Promise<void>;
}
