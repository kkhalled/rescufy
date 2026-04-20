import axios from "axios";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import { useLanguage } from "@/i18n/useLanguage";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import type { User } from "../types/users.types";

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

const normalizeUserFromApi = (rawUser: any): User => {
	const normalizedRoles = Array.isArray(rawUser?.roles)
		? rawUser.roles.flatMap((role: unknown) => {
				const normalizedRole = normalizeRoleValue(role);
				return normalizedRole ? [normalizedRole] : [];
			})
		: [];

	const normalizedRole =
		normalizedRoles[0] || normalizeRoleValue(rawUser?.role);

	return {
		...rawUser,
		id: typeof rawUser?.id === "string" ? rawUser.id : undefined,
		role: normalizedRole,
		roles: normalizedRoles.length
			? normalizedRoles
			: normalizedRole
				? [normalizedRole]
				: [],
		nationalId: typeof rawUser?.nationalId === "string" ? rawUser.nationalId : "",
		gender: normalizeGenderValue(rawUser?.gender),
		age:
			typeof rawUser?.age === "number" && Number.isFinite(rawUser.age)
				? rawUser.age
				: undefined,
		phoneNumber:
			typeof rawUser?.phoneNumber === "string" ? rawUser.phoneNumber : null,
		isBanned: typeof rawUser?.isBanned === "boolean" ? rawUser.isBanned : undefined,
	};
};

export function useGetUserById() {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const requestIdRef = useRef(0);
	const { t } = useTranslation(["users", "auth"]);
	const { isRTL } = useLanguage();

	const fetchUserById = useCallback(
		async (userId: string): Promise<User | null> => {
			const requestId = ++requestIdRef.current;
			setIsLoading(true);
			setUser(null);
			const toastPosition = isRTL ? "top-left" : "top-right";

			try {
				const token = getAuthToken();

				if (!token) {
					toast.error(t("auth:signIn.tokenNotFound"), {
						position: toastPosition,
					});
					return null;
				}

				const response = await axios.get(
					getApiUrl(API_CONFIG.ENDPOINTS.USERS.GET_BY_ID(userId)),
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					},
				);

				const responseUser = response.data?.user || response.data;
				const normalizedUser = normalizeUserFromApi(responseUser);

				if (requestId === requestIdRef.current) {
					setUser(normalizedUser);
				}

				return normalizedUser;
			} catch (error: any) {
				console.error("Fetch user by id error:", error);

				if (error.response?.status === 401) {
					toast.error(t("auth:signIn.unauthorized"), { position: toastPosition });
				} else if (error.response?.status === 404) {
					toast.error(t("users:updateUser.userNotFound"), {
						position: toastPosition,
					});
				} else if (error.message === "Network Error") {
					toast.error(t("auth:signIn.networkError"), { position: toastPosition });
				} else {
					toast.error(
						error.response?.data?.message || t("users:fetchUsers.error"),
						{ position: toastPosition },
					);
				}

				return null;
			} finally {
				if (requestId === requestIdRef.current) {
					setIsLoading(false);
				}
			}
		},
		[isRTL, t],
	);

	return {
		user,
		isLoading,
		fetchUserById,
	};
}
