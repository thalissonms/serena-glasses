import { ApiError } from "../types/error/apiError.interface";

export function isApiError(
  error: unknown,
): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}