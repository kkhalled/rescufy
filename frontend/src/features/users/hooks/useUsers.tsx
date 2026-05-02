import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { User } from "../types/users.types";
import { useAddUser } from "./useAddUser";
import { useGetUsers } from "./useGetUsers";
import { useUpdateUser } from "./useUpdateUser";
import { useDeleteUser } from "./useDeleteUser";
import { useGetUserById } from "./useGetUserById";

export function useUsers() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const editRequestIdRef = useRef(0);

  const { addUser, isLoading: isAddLoading } = useAddUser();
  const { users, isLoading: isFetchLoading, fetchUsers } = useGetUsers();
  const { fetchUserById } = useGetUserById();
  const { updateUser, isLoading: isUpdateLoading } = useUpdateUser();
  const { deleteUser, isLoading: isDeleteLoading } = useDeleteUser();

  // Fetch users on component mount and when role filter changes
  useEffect(() => {
    fetchUsers(role);
  }, [role]);

  // Apply search filter on the fetched users (role filtering is handled by API)
  const filteredUsers = useMemo(() => {
    if (!search) return users;
    
    const lowerSearch = search.toLowerCase();
    return users.filter((user) =>
      user.name.toLowerCase().includes(lowerSearch) ||
      user.email.toLowerCase().includes(lowerSearch) ||
      user.phoneNumber?.toLowerCase().includes(lowerSearch) ||
      user.id?.toLowerCase().includes(lowerSearch)
    );
  }, [users, search]);

  const openAddModal = useCallback(() => {
    editRequestIdRef.current += 1;
    setSelectedUser(undefined);
    setModalMode("add");
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((user: User) => {
    editRequestIdRef.current += 1;
    const requestId = editRequestIdRef.current;

    setSelectedUser(user);
    setModalMode("edit");
    const userId = user.id;
    if (!userId) {
      setIsModalOpen(true);
      return;
    }

    void (async () => {
      const fetchedUser = await fetchUserById(userId);

      if (requestId !== editRequestIdRef.current) {
        return;
      }

      setSelectedUser(fetchedUser || user);
      setIsModalOpen(true);
    })();
  }, [fetchUserById]);

  const closeModal = useCallback(() => {
    editRequestIdRef.current += 1;
    setIsModalOpen(false);
    setSelectedUser(undefined);
  }, []);

  const submitUser = useCallback(
    async (user: User) => {
      if (modalMode === "add") {
        const createdUser = await addUser(user);
        if (createdUser) {
          // If the user is a HospitalAdmin and has a hospitalId, assign the hospital
         
          setIsModalOpen(false);
          setSelectedUser(undefined);
          await fetchUsers(role);
        }
      } else {
        if (user.id) {
          const updatedUser = await updateUser(user.id, user);
          if (updatedUser) {
            setIsModalOpen(false);
            setSelectedUser(undefined);
            await fetchUsers(role);
          }
        }
      }
    },
    [modalMode, addUser, updateUser, fetchUsers, role],
  );

  const handleDeleteUser = useCallback(
    async (userId: string, userName?: string) => {
      const success = await deleteUser(userId, userName);
      if (success) {
        await fetchUsers(role);
      }
      return success;
    },
    [deleteUser, fetchUsers, role],
  );

  return {
    users: filteredUsers,
    search,
    role,
    setSearch,
    setRole,
    isModalOpen,
    modalMode,
    selectedUser,
    isLoading: isAddLoading || isFetchLoading || isUpdateLoading || isDeleteLoading ,
    openAddModal,
    openEditModal,
    closeModal,
    submitUser,
    handleDeleteUser,
  };
}
