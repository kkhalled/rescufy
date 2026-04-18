import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import type { User } from "../types/users.types";
import { useLanguage } from "@/i18n/useLanguage";
import { getAuthToken } from "@/features/auth/utils/auth.utils";

const ROLE_VALUE_MAP: Record<string, User["role"]> = {
  admin: "Admin",
  hospitaladmin: "HospitalAdmin",
  paramedic: "Paramedic",
  ambulancedriver: "AmbulanceDriver",
  superadmin: "SuperAdmin",
  "system superadmin": "SuperAdmin",
};

const normalizeRoleValue = (value: unknown): User["role"] | undefined => {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  return ROLE_VALUE_MAP[normalized];
};

const normalizeGenderValue = (value: unknown): User["gender"] | undefined => {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === "male") return "Male";
  if (normalized === "female") return "Female";
  return undefined;
};

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
      const token = getAuthToken();

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

      const responseUsers = Array.isArray(response.data) ? response.data : [];

      // Normalize backend users to a stable UI shape for list + edit modal.
      const fetchedUsers: User[] = responseUsers.map((user: any) => {
        const normalizedRoles = Array.isArray(user.roles)
          ? user.roles.flatMap((role: unknown) => {
              const normalizedRole = normalizeRoleValue(role);
              return normalizedRole ? [normalizedRole] : [];
            })
          : [];

        const normalizedRole =
          normalizedRoles[0] || normalizeRoleValue(user.role);

        return {
          ...user,
          role: normalizedRole,
          roles: normalizedRoles.length
            ? normalizedRoles
            : normalizedRole
              ? [normalizedRole]
              : [],
          nationalId: typeof user.nationalId === "string" ? user.nationalId : "",
          gender: normalizeGenderValue(user.gender),
          age: typeof user.age === "number" && Number.isFinite(user.age) ? user.age : undefined,
          phoneNumber:
            typeof user.phoneNumber === "string" ? user.phoneNumber : null,
        };
      });

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