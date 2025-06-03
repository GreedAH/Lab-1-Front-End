import { API_BASE_URL } from "@/utils/consts";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions extends RequestInit {
  method: RequestMethod;
  data?: unknown;
}

interface ApiError {
  message: string;
  status: number;
}

export async function api<T>(
  endpoint: string,
  options: FetchOptions = { method: "GET" }
): Promise<T> {
  console.log("API_BASE_URL", API_BASE_URL);
  const { data, headers: customHeaders, ...customOptions } = options;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...customHeaders,
    // Authorization header - commented out for now
    // Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const config: RequestInit = {
    ...customOptions,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
      throw new Error("Invalid response format");
    }

    const result = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        message: result.message || "An error occurred",
        status: response.status,
      };
      throw error;
    }

    return result as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}
