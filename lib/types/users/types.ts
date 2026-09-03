export type UserRole = "ADMIN" | "DOCTOR" | "NURSE";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  role: UserRole;
  isDisabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phoneNo?: string;
}

export interface GetUsersParams {
  cursor?: string;
  limit?: number;
  search?: string;
}

export interface UsersPagination {
  limit: number;
  hasNextPage: boolean;
  nextCursor: string | null;
}

export interface UsersListResponse {
  items: User[];
  pagination: UsersPagination;
}