export interface User {
  id: number;
  email: string;
  name: string;
  accessType: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  accessType: number;
}

export type UpdateUserRequest = CreateUserRequest & { id: number };

export interface GetUsersResponse {
  data: User[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetUsersRequest {
  page?: number;
  pageSize?: number;
  name?: string;
  email?: string;
}
