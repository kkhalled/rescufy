import { useMemo, type ComponentType } from "react";
import SearchInput from "@/shared/ui/SearchInput";
import { Building2, ShieldCheck, Stethoscope, UsersRound } from "lucide-react";
import { UserRow } from "./UserRow";
import { UserFormModal } from "./UserFormModal";
import { useUsers } from "../hooks/useUsers";
import { useTranslation } from "react-i18next";

import UsersRoles from "./UsersRoles";

/** Skeleton placeholder row shown while loading */
function UserRowSkeleton() {
  return (
    <div className="animate-pulse px-4 py-4 md:px-5">
      <div className="hidden items-center gap-3 md:grid md:grid-cols-[2.2fr_1.3fr_1.2fr_0.9fr_auto]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-surface-muted" />
          <div className="space-y-2">
            <div className="h-3.5 w-32 rounded bg-surface-muted" />
            <div className="h-2.5 w-20 rounded bg-surface-muted" />
          </div>
        </div>
        <div className="h-3.5 w-40 rounded bg-surface-muted" />
        <div className="h-6 w-24 rounded-full bg-surface-muted" />
        <div className="h-3.5 w-20 rounded bg-surface-muted" />
        <div className="h-8 w-20 justify-self-end rounded bg-surface-muted" />
      </div>

      <div className="rounded-xl border border-border/70 bg-bg-card p-3 md:hidden">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-surface-muted" />
          <div className="space-y-2">
            <div className="h-3.5 w-28 rounded bg-surface-muted" />
            <div className="h-2.5 w-16 rounded bg-surface-muted" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-40 rounded bg-surface-muted" />
          <div className="h-3 w-36 rounded bg-surface-muted" />
          <div className="h-8 w-full rounded bg-surface-muted" />
        </div>
      </div>
    </div>
  );
}

type OverviewStatProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "primary" | "success" | "info" | "warning";
};

function OverviewStat({ icon: Icon, label, value, tone }: OverviewStatProps) {
  const toneStyles = {
    primary: "border-primary/20 bg-primary/8 text-primary",
    success:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    info: "border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300",
    warning:
      "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  };

  return (
    <article className="rounded-xl border border-border/70 bg-bg-card p-3 shadow-card md:p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          {label}
        </p>
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${toneStyles[tone]}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold leading-none text-heading">
        {value}
      </p>
    </article>
  );
}

export default function AllUsers() {
  const { t } = useTranslation("users");
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

  const overview = useMemo(() => {
    const extractRole = (userRole: { roles?: string[]; role?: string }) =>
      userRole.roles && userRole.roles.length > 0
        ? userRole.roles[0]
        : userRole.role || "";

    const admins = users.filter((user) => {
      const currentRole = extractRole(user);
      return currentRole === "Admin" || currentRole === "SuperAdmin";
    }).length;

    const hospitalAdmins = users.filter(
      (user) => extractRole(user) === "HospitalAdmin",
    ).length;
    const fieldTeam = users.filter((user) => {
      const currentRole = extractRole(user);
      return currentRole === "Paramedic" || currentRole === "AmbulanceDriver";
    }).length;

    return {
      total: users.length,
      admins,
      hospitalAdmins,
      fieldTeam,
    };
  }, [users]);

  const hasActiveFilters = search.trim().length > 0 || role !== "all";

  return (
    <>
      <div className="mt-6 space-y-5">
        <div className="mt-6 space-y-5">
          {/* Mobile Combined Card */}
          <section className="lg:hidden">
            <article className="rounded-2xl border border-border bg-bg-card p-4 shadow-card">
              <div className="grid grid-cols-2 gap-4">
                <OverviewStat
                  icon={UsersRound}
                  label={t("overview.totalUsers")}
                  value={overview.total}
                  tone="primary"
                />

                <OverviewStat
                  icon={ShieldCheck}
                  label={t("overview.adminTeam")}
                  value={overview.admins}
                  tone="success"
                />

                <OverviewStat
                  icon={Building2}
                  label={t("overview.hospitalAdmins")}
                  value={overview.hospitalAdmins}
                  tone="info"
                />

                <OverviewStat
                  icon={Stethoscope}
                  label={t("overview.fieldTeam")}
                  value={overview.fieldTeam}
                  tone="warning"
                />
              </div>
            </article>
          </section>

          {/* Desktop Cards */}
          <section className="hidden gap-3 lg:grid lg:grid-cols-4">
            <OverviewStat
              icon={UsersRound}
              label={t("overview.totalUsers")}
              value={overview.total}
              tone="primary"
            />

            <OverviewStat
              icon={ShieldCheck}
              label={t("overview.adminTeam")}
              value={overview.admins}
              tone="success"
            />

            <OverviewStat
              icon={Building2}
              label={t("overview.hospitalAdmins")}
              value={overview.hospitalAdmins}
              tone="info"
            />

            <OverviewStat
              icon={Stethoscope}
              label={t("overview.fieldTeam")}
              value={overview.fieldTeam}
              tone="warning"
            />
          </section>
        </div>

        <section
  className="
    rounded-3xl
    border border-border/60
    bg-bg-card/95

    p-4 md:p-5

    shadow-card
    backdrop-blur-sm
  "
>
  {/* Top Controls */}
  <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
    {/* Search */}
    <div className="flex-1">
      <SearchInput
        value={search}
        onSearchChange={setSearch}
        placeholder={t("filters.searchPlaceholder")}
      />
    </div>

    {/* Filters + Action */}
    <div
      className="
        flex flex-col gap-3
        sm:flex-row sm:items-center
      "
    >
      <div className="w-full sm:w-56">
        <UsersRoles
          value={role}
          onChange={setRole}
        />
      </div>

      <button
        onClick={openAddModal}
        className="
          inline-flex h-11
          items-center justify-center gap-2

          rounded-2xl

          bg-primary
          px-4

          text-sm font-medium text-white

          shadow-[0_8px_25px_rgba(99,102,241,0.25)]

          transition-all duration-200

          hover:scale-[1.02]
          hover:bg-primary/90

          active:scale-[0.98]
        "
      >
        <span className="text-base leading-none">
          +
        </span>

        {t("actions.add")}
      </button>
    </div>
  </div>

  {/* Footer Info */}
  <div
    className="
      mt-4
      flex flex-col gap-2
      border-t border-border/50
      pt-3

      sm:flex-row
      sm:items-center
      sm:justify-between
    "
  >
    <p className="text-xs text-muted">
      {t("overview.usersFound", {
        count: users.length,
      })}
    </p>

    {hasActiveFilters && (
      <span
        className="
          inline-flex w-fit items-center

          rounded-full

          border border-primary/20
          bg-primary/10

          px-3 py-1

          text-xs font-medium
          text-primary
        "
      >
        {t("overview.activeFilters")}
      </span>
    )}
  </div>
</section>
      </div>

      <main className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-bg-card shadow-card">
        {/* Table Header */}
        <div className="hidden grid-cols-[2.2fr_1.3fr_1.2fr_0.9fr_auto] items-center gap-3 border-b border-border/70 bg-surface-muted/50 px-5 py-3 md:grid">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
            {t("table.name")}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
            {t("table.email")}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
            {t("table.role")}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
            {t("form.phone")}
          </p>
          <p className="text-end text-xs font-semibold uppercase tracking-[0.08em] text-muted">
            {t("table.actions")}
          </p>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/70">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <UserRowSkeleton key={i} />)
          ) : users.length > 0 ? (
            users.map((user, index) => {
              const userRole =
                user.roles && user.roles.length > 0
                  ? user.roles[0]
                  : user.role || "";
              return (
                <div
                  key={user.id}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 40}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <UserRow
                    id={user.id || ""}
                    name={user.name}
                    email={user.email}
                    role={userRole}
                    phoneNumber={user.phoneNumber}
                    isBanned={user.isBanned}
                    onEdit={() => openEditModal(user)}
                    onDelete={() => handleDeleteUser(user.id || "", user.name)}
                  />
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 py-14">
              <p className="text-sm font-medium text-heading">
                {t("empty.title")}
              </p>
              <p className="text-xs text-muted">{t("empty.description")}</p>
            </div>
          )}
        </div>
      </main>

      <UserFormModal
        key={`${modalMode}-${selectedUser?.id ?? "new"}`}
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
