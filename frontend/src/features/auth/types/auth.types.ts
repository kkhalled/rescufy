export type Role = "admin" | "hospital" | "ambulance";

export type responseType = {
  id: number;
  name: string;
  email: string;
  roleId: Role;
};

export type JwtPayload = {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  FullName: string;
  PicUrl: string;
  Email: string;
  UserName: string;
  Role: string; // Can be "Admin", "Hospital", or "Ambulance"
  SecurityStamp?: string;
  aud?: string;
  exp?: number;
  iss?: string;
  jti?: string;
  [key: string]: any; // For any additional claims
};
