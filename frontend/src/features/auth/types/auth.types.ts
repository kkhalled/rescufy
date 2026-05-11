export type Role = "Admin" | "hospitaladmin" | "SuperAdmin";

export type responseType = {
  id: number;
  name: string;
  email: string;
  roleId: Role;
};

export type JwtPayload = {
  Id: string;
  FullName: string;
  PicUrl: string;
  Email: string;
  UserName: string;
  Role: string[] | string; // Can be array ["SuperAdmin", "Admin"] or single string
  HospitalId?: string; // For hospital users
  SecurityStamp?: string;
  aud?: string;
  exp?: number;
  iss?: string;
  jti?: string;
  [key: string]: any; // For any additional claims
};


