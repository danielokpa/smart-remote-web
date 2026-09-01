export interface ApiResponse<T = unknown> {
  status: string;
  statusCode: number;
  message: string;
  data: T | null;
}

export interface PaginatedData<T> {
  data: T[];
  nextCursor?: string | null;
  prevCursor?: string | null;
  total?: number;
}

export type ApiListResponse<T> =
  | T[]
  | PaginatedData<T>;