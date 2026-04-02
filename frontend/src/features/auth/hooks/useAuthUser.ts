import { useAuth } from "@/app/provider/AuthContext";

/**
 * Custom hook to get the current user's information
 * Provides easy access to user data with proper type safety
 */
export const useAuthUser = () => {
  const { user } = useAuth();

  const getCurrentUser = () => user;

  const getUserEmail = () => user?.Email;

  const getUserFullName = () => user?.FullName;

  const getUserRole = () => user?.Role;

  const getUserPicUrl = () => user?.PicUrl;

  const getUserName = () => user?.UserName;

  const getUserId = () =>
    user?.id; /* Assuming `id` is the claim for user ID in the token */

  const isAdmin = () => user?.Role === "SuperAdmin";

  const isHospitalUser = () => user?.Role === "hospitaladmin";

  return {
    user,
    getCurrentUser,
    getUserEmail,
    getUserFullName,
    getUserRole,
    getUserPicUrl,
    getUserName,
    getUserId,
    isAdmin,
    isHospitalUser,
  };
};
