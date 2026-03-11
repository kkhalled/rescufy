import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faEnvelope,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface UserRowProps {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  phoneNumber?: string | null;
  isBanned?: boolean;
  onEdit: () => void;
  onDelete?: () => void;
}

export function UserRow({
  id,
  name,
  email,
  password,
  role,
  phoneNumber,
  isBanned,
  onEdit,
  onDelete,
}: UserRowProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation(['users', 'common']);

  // Generate initials from name
  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }, [name]);

  // Updated role mappings to match current API values
  const roleColor: Record<string, string> = {
    SuperAdmin: "bg-red-500",
    Admin: "bg-purple-500", 
    HospitalAdmin: "bg-blue-500",
    Paramedic: "bg-green-500",
    AmbulanceDriver: "bg-emerald-500",
  };

  const roleLabel: Record<string, string> = {
    SuperAdmin: t('users:roles.SuperAdmin'),
    Admin: t('users:roles.Admin'),
    HospitalAdmin: t('users:roles.HospitalAdmin'), 
    Paramedic: t('users:roles.Paramedic'),
    AmbulanceDriver: t('users:roles.AmbulanceDriver') || 'Ambulance Driver',
  };

  const roleBgColor: Record<string, string> = {
    SuperAdmin: "bg-red-500/15 dark:bg-red-500/25 text-red-600 dark:text-red-400",
    Admin: "bg-purple-500/15 dark:bg-purple-500/25 text-purple-600 dark:text-purple-400",
    HospitalAdmin: "bg-blue-500/15 dark:bg-blue-500/25 text-blue-600 dark:text-blue-400",
    Paramedic: "bg-green-500/15 dark:bg-green-500/25 text-green-600 dark:text-green-400",
    AmbulanceDriver: "bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className={`relative flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-4 bg-card border-b border-border hover:bg-surface-muted/50 transition-colors`}>
      {/* Indicator Bar */}
      <div className={`absolute left-0 rtl:left-auto rtl:right-0 top-0 h-1 md:h-full w-full md:w-1 ${roleColor[role] || 'bg-gray-500'} md:rounded-r rtl:md:rounded-r-none rtl:md:rounded-l rounded-t`} />

      {/* Top Row - Mobile */}
      <div className="md:hidden flex items-start justify-between gap-3 pt-1 w-full">
        {/* User Avatar & Name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${roleColor[role] || 'bg-gray-500'}`}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-heading truncate">{name}</p>
            <p className="text-[10px] text-muted font-mono truncate">{id}</p>
          </div>
        </div>
        {/* Role Badge Mobile */}
        <span
          className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${roleBgColor[role] || 'bg-gray-500/15 text-gray-600'}`}
        >
          {roleLabel[role] || role}
        </span>
      </div>

      {/* Desktop: Avatar + Name */}
      <div className="hidden md:flex md:items-center md:gap-3 md:w-64">
        <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${roleColor[role] || 'bg-gray-500'}`}>
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-heading truncate">{name}</p>
          <p className="text-[11px] text-muted font-mono truncate">{(id).split('-')[0]}</p>
        </div>
      </div>

      {/* Email */}
      <div className="hidden md:flex md:items-center md:gap-2 md:w-85">
        <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-muted shrink-0" />
        <span className="text-sm text-body truncate">{email}</span>
      </div>

      {/* Mobile Email & Password */}
      <div className="md:hidden space-y-2 flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 text-muted shrink-0" />
          <span className="text-body truncate">{email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-body">
          <span className="font-medium">{t('users:row.password')}</span>
          <span className="font-mono">{showPassword ? password : "•".repeat(8)}</span>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted hover:text-heading transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Desktop Password */}
      <div className="hidden md:flex md:items-center md:gap-3 md:w-32">
        <span className="text-sm text-body font-mono">
          {showPassword ? (password || '••••••••') : "••••••••"}
        </span>
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="text-muted hover:text-heading transition-colors cursor-pointer p-1 shrink-0"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-3 h-3" />
        </button>
      </div>

      {/* Desktop Role Badge */}
      <div className="hidden md:flex md:items-center md:w-40 md:justify-center">
        <span
          className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${roleBgColor[role] || 'bg-gray-500/15 text-gray-600'}`}
        >
          {roleLabel[role] || role || 'No Role'}
        </span>
      </div>

      {/* Action Buttons Container */}
      <div className="flex items-center gap-2 justify-end md:gap-2 md:w-22">

        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="p-2 text-muted hover:text-heading hover:bg-surface-muted rounded-lg transition-colors cursor-pointer"
          aria-label={t('users:row.editTooltip')}
        >
          <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" />
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
          aria-label={t('users:row.deleteTooltip')}
        >
          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
