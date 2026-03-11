import type { User } from "../types/users.types";

export interface FilterOptions {
  search: string;
  role: string; // Add this property
}

export default function usersFilter(
  users: User[],
  { search, role }: FilterOptions,
): User[] {
  return users.filter((user) => {
    // Filter by role — match exact backend values: Admin, HospitalAdmin, Paramedic, SuperAdmin, AmbulanceDriver
    // Handle both roles array and role property
    const userRole = user.roles && user.roles.length > 0 ? user.roles[0] : user.role;
    const matchesRole = role === "all" || userRole === role;

    // Filter by search
    const lowerSearch = search.toLowerCase();
    const matchesSearch =
      !search ||
      user.name.toLowerCase().includes(lowerSearch) ||
      user.email.toLowerCase().includes(lowerSearch) ||
      user.phoneNumber?.toLowerCase().includes(lowerSearch) ||
      user.id?.toLowerCase().includes(lowerSearch);

    return matchesRole && matchesSearch;
  });
}
