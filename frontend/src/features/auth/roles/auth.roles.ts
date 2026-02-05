export const ROLE_ROUTES = {
  admin: "/admin",
  hospital: "/hospital_user",
  ambulance: "/ambulance_user",
};

export const isUserAuthorized = (userRole: string | null, requiredRole: string): boolean => {
  if (!userRole) return false;
  return userRole === requiredRole;
};
