export type Role = "admin" | "hospital" | "ambulance";


export type responseType ={
    id: number;
    name: string;
    email: string;
    roleId: Role;
}