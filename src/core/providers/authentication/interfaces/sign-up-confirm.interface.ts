export interface SignUpConfirmReq {
  email: string;
  code: string;
}

export interface SignUpConfirm {
  (data: SignUpConfirmReq): Promise<void>;
}
