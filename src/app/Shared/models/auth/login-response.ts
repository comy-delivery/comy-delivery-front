export interface LoginResponse {
  jwt: string;           // Alterado de accessToken para jwt
  refreshToken: string;
  userId: number;
}