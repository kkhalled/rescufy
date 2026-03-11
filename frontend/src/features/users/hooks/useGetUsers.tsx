import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import type { User } from "../types/users.types";
import { useLanguage } from "@/i18n/useLanguage";

/**
 * Hook for fetching users with optional role filtering
 * Always includes Admin users regardless of role filter
 */
export function useGetUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["users", "auth"]);
  const { isRTL } = useLanguage();

  const fetchUsers = async (roleFilter?: string): Promise<User[]> => {
    setIsLoading(true);
    const toastPosition = isRTL ? "top-left" : "top-right";

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), {
          position: toastPosition,
        });
        return [];
      }

      // Build API URL with role filter if provided
      let apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.USERS.GET_ALL);
      if (roleFilter && roleFilter !== "all") {
        apiUrl += `?role=${roleFilter}`;
      }

      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      let fetchedUsers: User[] = response.data;

      // Ensure password field exists (APIs typically don't return actual passwords)
      fetchedUsers = fetchedUsers.map((user: any) => ({
        ...user,
        password: user.password || '••••••••'  // Placeholder for password display
      }));

      // If filtering by a specific role (not Admin), also fetch Admin users
      // if (roleFilter && roleFilter !== "all" && roleFilter !== "Admin") {
      //   try {
      //     const adminResponse = await axios.get(
      //       getApiUrl(API_CONFIG.ENDPOINTS.USERS.GET_ALL) + "?role=Admin",
      //       {
      //         headers: {
      //           "Content-Type": "application/json",
      //           Authorization: `Bearer ${token}`,
      //         },
      //       }
      //     );

      //     const adminUsers: User[] = adminResponse.data.map((user: any) => ({
      //       ...user,
      //       password: user.password || '••••••••'  // Placeholder for password display
      //     }));
          
      //     // Combine filtered users with admin users, avoiding duplicates
      //     const combinedUsers = [...fetchedUsers];
      //     adminUsers.forEach(adminUser => {
      //       if (!combinedUsers.find(user => user.id === adminUser.id)) {
      //         combinedUsers.push(adminUser);
      //       }
      //     });
          
      //     fetchedUsers = combinedUsers;
      //   } catch (adminError) {
      //     console.warn("Failed to fetch admin users:", adminError);
      //   }
      // }

      setUsers(fetchedUsers);
      return fetchedUsers;

    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error(t("users:fetchUsers.error"), {
        position: toastPosition,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const refetchUsers = (roleFilter?: string) => {
    return fetchUsers(roleFilter);
  };

  return {
    users,
    isLoading,
    fetchUsers,
    refetchUsers,
    setUsers,
  };
}