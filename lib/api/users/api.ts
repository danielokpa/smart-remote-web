import { apiRequest } from "@/lib/api/api-client";

import type {
  GetUsersParams,
  UpdateUserPayload,
  User,
  UsersListResponse,
} from "@/lib/types/users/types";

export const usersApi = {
  /**
   * Get all users with optional cursor pagination and search.
   */
  getAll: async (
    params: GetUsersParams = {}
  ): Promise<UsersListResponse> => {
    const searchParams = new URLSearchParams();

    if (params.search?.trim()) {
      searchParams.set(
        "search",
        params.search.trim()
      );
    }

    if (params.cursor) {
      searchParams.set(
        "cursor",
        params.cursor
      );
    }

    if (params.limit) {
      searchParams.set(
        "limit",
        String(params.limit)
      );
    }

    const query = searchParams.toString();

    const response =
      await apiRequest<UsersListResponse>(
        `/users${query ? `?${query}` : ""}`
      );

    if (!response.data) {
      throw new Error(
        "Users data was not returned."
      );
    }

    return response.data;
  },

  /**
   * Get a single user by ID.
   *
   * This endpoint is ADMIN-only according
   * to the backend controller.
   */
  getById: async (
    id: string
  ): Promise<User> => {
    const response =
      await apiRequest<User>(
        `/users/${id}`
      );

    if (!response.data) {
      throw new Error(
        "User data was not returned."
      );
    }

    return response.data;
  },

  /**
   * Update user details.
   *
   * Supported fields according to UpdateUserDto:
   * - firstName
   * - lastName
   * - phoneNo
   */
  update: async (
    id: string,
    payload: UpdateUserPayload
  ): Promise<User> => {
    const response =
      await apiRequest<User>(
        `/users/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );

    if (!response.data) {
      throw new Error(
        "Updated user data was not returned."
      );
    }

    return response.data;
  },

  /**
   * Delete a user account.
   *
   * The backend returns a boolean.
   */
  delete: async (
    id: string
  ): Promise<boolean> => {
    const response =
      await apiRequest<boolean>(
        `/users/${id}`,
        {
          method: "DELETE",
        }
      );

    if (typeof response.data !== "boolean") {
      throw new Error(
        "User deletion confirmation was not returned."
      );
    }

    return response.data;
  },
};