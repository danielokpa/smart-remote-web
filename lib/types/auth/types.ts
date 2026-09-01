export type UserType = "ADMIN" | "DOCTOR" | "NURSE";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  token: string;
  userType: UserType;
  userId: string;
  email: string;
}

export interface LoginResponse {
  status: string;
  statusCode: number;
  message: string;
  data: AuthUser;
}