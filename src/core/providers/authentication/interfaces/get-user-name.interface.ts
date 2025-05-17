export interface GetUserNameReq {
  accessToken: string;
}

export interface GetUserNameRes {
  sub: string;
  email_verified: string;
  email: string;
}

export interface GetUserName {
  (data: GetUserNameReq): Promise<GetUserNameRes>;
}
