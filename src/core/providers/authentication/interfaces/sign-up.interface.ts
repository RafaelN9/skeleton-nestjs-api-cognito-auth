export interface SignUpReq {
  email: string;
  password: string;
}

export interface SignUp {
  (data: SignUpReq): Promise<void>;
}
