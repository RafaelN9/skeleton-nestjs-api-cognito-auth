export interface ResendConfirmationCodeReq {
  email: string;
}

export interface ResendConfirmationCode {
  (data: ResendConfirmationCodeReq): Promise<void>;
}
