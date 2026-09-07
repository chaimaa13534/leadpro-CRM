/**
 * Shared API response envelope.
 *
 * Every endpoint returns a consistent structure so the frontend can rely on a
 * single convention:
 *
 *   Success: { success: true,  data: ... }
 *   Error:   { success: false, message: "..." }
 */

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
