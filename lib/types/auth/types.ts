export type UserType = "ADMIN" | "DOCTOR" | "NURSE" | "PATIENT";

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

  patient?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface LoginResponse {
  status: string;
  statusCode: number;
  message: string;
  data: AuthUser;
}

export interface PatientLoginRequest {
  email: string;
  contact: string;
}

export interface PatientLoginResponse {
  status: string;
  statusCode: number;
  message: string;
  data: AuthUser;
}