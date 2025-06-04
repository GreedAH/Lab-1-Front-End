import { API_BASE_URL } from "@/utils/consts";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions extends RequestInit {
  method: RequestMethod;
  data?: unknown;
  requiresAuth?: boolean;
}

interface ApiError {
  message: string;
  status: number;
}

// Function to get the current access token
const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem("accessToken");
  } catch (error) {
    console.warn("Failed to get access token from localStorage:", error);
    return null;
  }
};

export async function api<T>(
  endpoint: string,
  options: FetchOptions = { method: "GET" }
): Promise<T> {
  const {
    data,
    headers: customHeaders,
    requiresAuth = true,
    ...customOptions
  } = options;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...customHeaders,
  });

  // Add Authorization header if authentication is required
  if (requiresAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

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
      // Handle specific error cases
      if (response.status === 401) {
        // Token might be expired or invalid
        // You might want to trigger a token refresh here or redirect to login
        throw new Error("Authentication required");
      }

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
