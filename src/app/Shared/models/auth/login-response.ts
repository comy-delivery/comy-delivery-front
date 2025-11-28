export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  role: string;
  userId: number;
}