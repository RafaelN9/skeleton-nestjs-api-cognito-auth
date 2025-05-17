export interface SignInReq {
  email: string;
  password: string;
}

export interface SignInRes {
  accessToken: string;
  idToken: string;
  expiresIn: number;
  groups: string[];
  sub: {
    email: string;
    email_verified: string;
  };
}

export interface SignIn {
  (data: SignInReq): Promise<SignInRes>;
}
