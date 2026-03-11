import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";
import type { Role } from "../../features/auth/types/auth.types";

export interface AuthUser {
  id: string; // user id
  FullName: string;
  PicUrl: string;
  Email: string;
  UserName: string;
  Role: Role; // "admin" | "hospitaladmin" | "ambulance"
  HospitalId?: string; // For hospital users
  SecurityStamp?: string;
  aud?: string;
  exp?: number;
  iss?: string;
  jti?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  const [user, setUserState] = useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const token = localStorage.getItem("auth_token");

    if (savedUser && token) {
      try {
        setUserState(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
      }
    }

    setIsLoading(false);
  }, []);

  const setUser = (newUser: AuthUser | null) => {
    if (newUser) {
      setUserState(newUser);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
    } else {
      setUserState(null);
      localStorage.removeItem("auth_user");
    }
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    logout,
  };

 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
