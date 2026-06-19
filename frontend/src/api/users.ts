import axios from 'axios';
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  ApiResponse,
  UsersQueryParams,
  PaginationMeta,
} from '../types/user';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export interface PaginatedUsersResponse {
  data: User[];
  pagination: PaginationMeta;
}

export const usersApi = {
  getAll: async (params: UsersQueryParams = {}): Promise<PaginatedUsersResponse> => {
    const { data } = await api.get<ApiResponse<User[]>>('/users', { params });
    return {
      data: data.data,
      pagination: data.pagination!,
    };
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
    return data.data;
  },

  create: async (payload: CreateUserPayload): Promise<User> => {
    const { data } = await api.post<ApiResponse<User>>('/users', payload);
    return data.data;
  },

  update: async (id: string, payload: UpdateUserPayload): Promise<User> => {
    const { data } = await api.put<ApiResponse<User>>(`/users/${id}`, payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
