import SearchBar from "@/shared/common/SearchBar";

import { UserRow } from "./UserRow";
import { UserFormModal } from "./UserFormModal";
import { useUsers } from "../hooks/useUsers";
import { useTranslation } from "react-i18next";

import UsersRoles from "./UsersRoles";

/** Skeleton placeholder row shown while loading */
function UserRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-border animate-pulse">
      <div className="w-9 h-9 rounded-full bg-surface-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-32 bg-surface-muted rounded" />
        <div className="h-2.5 w-20 bg-surface-muted rounded" />
      </div>
      <div className="hidden md:block h-3.5 w-48 bg-surface-muted rounded" />
      <div className="hidden md:block h-3.5 w-20 bg-surface-muted rounded" />
      <div className="hidden md:block h-6 w-24 bg-surface-muted rounded-lg" />
      <div className="hidden md:block h-8 w-16 bg-surface-muted rounded" />
    </div>
  );
}
// import { UsersRoles } from '@/shared/common/UsersRoles';

export default function AllUsers() {
  const { t } = useTranslation('users');
  const {
    users,
    search,
    role,
    setSearch,
    setRole,
    isModalOpen,
    modalMode,
    selectedUser,
    isLoading,
    openAddModal,
    openEditModal,
    closeModal,
    submitUser,
    handleDeleteUser,
  } = useUsers();

  return (
    <>
      <div className="my-6">
        <SearchBar
          value={search}
          onSearchChange={setSearch}
          placeholder={t('filters.searchPlaceholder')}
        >
          <div className="flex items-center gap-3">
            <UsersRoles value={role} onChange={setRole} />
            <button
              onClick={openAddModal}
              className="shrink-0 h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium shadow hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <span className="text-lg leading-none">+</span> {t('actions.add')}
            </button>
          </div>
        </SearchBar>
      </div>

      <main className="mt-6 border border-border rounded-xl overflow-hidden bg-bg-card">
        {/* Table Header */}
        <div className="hidden md:flex items-center gap-4 px-6 py-4 bg-surface-muted border-b border-border">
          <div className="w-64">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              {t('table.name')}
            </p>
          </div>
          <div className="w-85">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              {t('table.email')}
            </p>
          </div>
          <div className="w-32">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              {t('form.password')}
            </p>
          </div>
          <div className="w-40 text-center">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              {t('table.role')}
            </p>
          </div>
          <div className="w-20 text-right rtl:text-left">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              {t('table.actions')}
            </p>
          </div>
        </div>

        {/* Rows */}
        <div>
          {isLoading ? (
            // Skeleton loading rows
            Array.from({ length: 6 }).map((_, i) => (
              <UserRowSkeleton key={i} />
            ))
          ) : users.length > 0 ? (
            users.map((user, index) => {
              // Extract first role from roles array, fallback to role property
              const userRole = user.roles && user.roles.length > 0 ? user.roles[0] : user.role || '';
              return (
                <div
                  key={user.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <UserRow
                    id={user.id || ''}
                    name={user.name}
                    email={user.email}
                    password={user.password || '••••••••'}
                    role={userRole}
                    phoneNumber={user.phoneNumber}
                    isBanned={user.isBanned}
                    onEdit={() => openEditModal(user)}
                    onDelete={() => handleDeleteUser(user.id || '', user.name)}
                  />
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted text-sm">{t('empty.title')}</p>
            </div>
          )}
        </div>
      </main>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={submitUser}
        user={selectedUser}
        mode={modalMode}
        isLoading={isLoading}
      />
    </>
  );
}
