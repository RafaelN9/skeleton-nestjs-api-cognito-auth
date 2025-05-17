export interface PasswordResetReq {
  email: string;
}

export interface PasswordReset {
  (data: PasswordResetReq): Promise<void>;
}
