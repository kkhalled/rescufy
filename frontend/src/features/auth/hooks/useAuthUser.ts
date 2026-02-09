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
    user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

  const isAdmin = () => user?.Role === "admin";

  const isHospitalUser = () => user?.Role === "hospital";

  const isAmbulanceUser = () => user?.Role === "ambulance";

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
    isAmbulanceUser,
  };
};
