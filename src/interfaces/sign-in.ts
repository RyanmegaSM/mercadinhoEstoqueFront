export interface SignInResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    accessType: number;
  };
}
