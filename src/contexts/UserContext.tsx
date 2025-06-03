import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
  clearAuth: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Safe localStorage access
const safeGetItem = (key: string): string | null => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem(key);
    }
  } catch (error) {
    console.warn(`Failed to get ${key} from localStorage:`, error);
  }
  return null;
};

const safeSetItem = (key: string, value: string): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn(`Failed to set ${key} in localStorage:`, error);
  }
};

const safeRemoveItem = (key: string): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn(`Failed to remove ${key} from localStorage:`, error);
  }
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Initialize state from localStorage after component mounts
  useEffect(() => {
    try {
      const savedUser = safeGetItem("user");
      const savedAccessToken = safeGetItem("accessToken");
      const savedRefreshToken = safeGetItem("refreshToken");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (savedAccessToken) {
        setAccessToken(savedAccessToken);
      }
      if (savedRefreshToken) {
        setRefreshToken(savedRefreshToken);
      }
    } catch (error) {
      console.error(
        "Error initializing user context from localStorage:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        safeSetItem("user", JSON.stringify(user));
      } else {
        safeRemoveItem("user");
      }
    }
  }, [user, isLoading]);

  // Update localStorage when accessToken changes
  useEffect(() => {
    if (!isLoading) {
      if (accessToken) {
        safeSetItem("accessToken", accessToken);
      } else {
        safeRemoveItem("accessToken");
      }
    }
  }, [accessToken, isLoading]);

  // Update localStorage when refreshToken changes
  useEffect(() => {
    if (!isLoading) {
      if (refreshToken) {
        safeSetItem("refreshToken", refreshToken);
      } else {
        safeRemoveItem("refreshToken");
      }
    }
  }, [refreshToken, isLoading]);

  const clearAuth = () => {
    console.log("Clearing authentication state");
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const value = {
    user,
    setUser,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    clearAuth,
    isLoading,
  };

  console.log("UserProvider rendering with state:", { user, isLoading });

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
