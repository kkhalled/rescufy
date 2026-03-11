import type { User } from "../types/users.types";
export const usersData: User[] = [
  {
    id: "USR-001",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@rescufy.com",
    password: "Secure@123",
    role: "Admin",
    phoneNumber: "123-456-7890",
  },
  {
    id: "USR-002",
    name: "Fatima Khalil",
    email: "fatima.khalil@rescufy.com",
    password: "Secure@456",
    role: "HospitalAdmin",
    phoneNumber: "234-567-8901",
  },
  {
    id: "USR-003",
    name: "Mohamed Ali",
    email: "mohamed.ali@rescufy.com",
    password: "Secure@789",
    role: "Admin",
    phoneNumber: "345-678-9012",
  },
  {
    id: "USR-004",
    name: "Noor Saleh",
    email: "noor.saleh@rescufy.com",
    password: "Secure@101",
    role: "HospitalAdmin",
    phoneNumber: "456-789-0123",
  },
  {
    id: "USR-005",
    name: "Karim Ibrahim",
    email: "karim.ibrahim@rescufy.com",
    password: "Secure@202",
    role: "Admin",
    phoneNumber: "567-890-1234",
  },
  {
    id: "USR-006",
    name: "Sara Mansour",
    email: "sara.mansour@rescufy.com",
    password: "Secure@303",
    role: "HospitalAdmin",
    phoneNumber: "678-901-2345",
  },
];

// Simulated API response
export const getUsersResponse = () => ({
  success: true,
  message: "Users retrieved successfully",
  data: usersData,
  timestamp: new Date().toISOString(),
});
