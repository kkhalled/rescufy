export const ROLE_ROUTES = {
  admin: "/admin",
  hospital: "/hospital",
  
};

export const isUserAuthorized = (userRole: string | null, requiredRole: string): boolean => {
  if (!userRole) return false;
  return userRole === requiredRole;
};
