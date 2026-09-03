"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clipboard,
  Clock3,
  Edit3,
  HeartPulse,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserRound,
  UserX,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useUser } from "@/lib/hooks/users/useUser";
import { useUsers } from "@/lib/hooks/users/useUsers";
import type {
  UpdateUserPayload,
  User,
} from "@/lib/types/users/types";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getInitials(
  firstName: string,
  lastName: string
) {
  return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`
    .toUpperCase()
    .slice(0, 2);
}

function getUserName(user: User) {
  return `${user.firstName} ${user.lastName}`.trim();
}

function formatDate(date: string) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function formatDateTime(date: string) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
}

function getRoleLabel(role: User["role"]) {
  switch (role) {
    case "ADMIN":
      return "Administrator";
    case "DOCTOR":
      return "Doctor";
    case "NURSE":
      return "Nurse";
    default:
      return role;
  }
}

function getRoleIcon(role: User["role"]) {
  switch (role) {
    case "ADMIN":
      return ShieldCheck;
    case "DOCTOR":
      return HeartPulse;
    case "NURSE":
      return UserCheck;
    default:
      return UserRound;
  }
}

/* -------------------------------------------------------------------------- */
/* Info components                                                            */
/* -------------------------------------------------------------------------- */

function InfoItem({
  label,
  value,
  copyable = false,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      toast.error("Unable to copy this value.");
    }
  };

  return (
    <div className="min-w-0">
      <p className="font-manrope text-xs font-medium text-[#8FA8A2]">
        {label}
      </p>

      <div className="mt-1.5 flex min-w-0 items-center gap-2">
        <p
          className={`min-w-0 truncate text-sm font-medium ${
            label === "User ID"
              ? "font-mono text-[#B9CAC6]"
              : "text-white"
          }`}
        >
          {value}
        </p>

        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-lg p-1.5 text-[#8FA8A2] transition hover:bg-white/5 hover:text-[#2DD4BF]"
            title={copied ? "Copied" : "Copy user ID"}
            aria-label={
              copied ? "Copied" : "Copy user ID"
            }
          >
            {copied ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
            ) : (
              <Clipboard className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function AccountInfoRow({
  icon: Icon,
  label,
  value,
  valueClassName = "text-white",
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035]">
        <Icon className="h-4 w-4 text-[#2DD4BF]" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#8FA8A2]">
          {label}
        </p>

        <p
          className={`mt-0.5 truncate text-sm font-medium ${valueClassName}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Edit modal                                                                 */
/* -------------------------------------------------------------------------- */

function EditUserModal({
  user,
  open,
  isUpdating,
  onClose,
  onSubmit,
}: {
  user: User | null;
  open: boolean;
  isUpdating: boolean;
  onClose: () => void;
  onSubmit: (
    payload: UpdateUserPayload
  ) => Promise<void>;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  useEffect(() => {
    if (!user || !open) {
      return;
    }

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhoneNo(user.phoneNo ?? "");
  }, [user, open]);

  if (!open || !user) {
    return null;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const normalizedFirstName =
      firstName.trim();

    const normalizedLastName =
      lastName.trim();

    const normalizedPhone = phoneNo.trim();

    if (!normalizedFirstName) {
      toast.error("First name is required.");
      return;
    }

    if (!normalizedLastName) {
      toast.error("Last name is required.");
      return;
    }

    if (!normalizedPhone) {
      toast.error("Phone number is required.");
      return;
    }

    try {
      await onSubmit({
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        phoneNo: normalizedPhone,
      });
    } catch {
      // Error is surfaced by the page mutation handler.
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isUpdating
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0E2723] shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.07] px-6 py-5">
          <div>
            <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.18em] text-[#2DD4BF]">
              User management
            </p>

            <h2 className="mt-1.5 font-manrope text-lg font-extrabold text-white">
              Edit user
            </h2>

            <p className="mt-1 font-manrope text-xs text-[#8FA8A2]">
              Update this user's personal and contact
              information.
            </p>
          </div>

          <button
            type="button"
            disabled={isUpdating}
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[#8FA8A2] transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close edit user modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {/* User preview */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10 text-xs font-bold text-[#2DD4BF]">
              {getInitials(
                user.firstName,
                user.lastName
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate font-manrope text-sm font-bold text-white">
                {getUserName(user)}
              </p>

              <p className="truncate font-manrope text-[11px] text-[#8FA8A2]">
                {user.email}
              </p>
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block font-manrope text-[11px] font-bold text-[#B9CAC6]">
                First name
              </span>

              <input
                type="text"
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
                disabled={isUpdating}
                autoComplete="given-name"
                className="h-11 w-full rounded-xl border border-white/10 bg-[#071A17] px-3.5 font-manrope text-sm text-white outline-none transition placeholder:text-[#627873] focus:border-[#2DD4BF]/40 focus:ring-2 focus:ring-[#2DD4BF]/10 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="First name"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-manrope text-[11px] font-bold text-[#B9CAC6]">
                Last name
              </span>

              <input
                type="text"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
                disabled={isUpdating}
                autoComplete="family-name"
                className="h-11 w-full rounded-xl border border-white/10 bg-[#071A17] px-3.5 font-manrope text-sm text-white outline-none transition placeholder:text-[#627873] focus:border-[#2DD4BF]/40 focus:ring-2 focus:ring-[#2DD4BF]/10 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Last name"
              />
            </label>
          </div>

          {/* Phone */}
          <label className="block">
            <span className="mb-2 block font-manrope text-[11px] font-bold text-[#B9CAC6]">
              Phone number
            </span>

            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#627873]" />

              <input
                type="tel"
                value={phoneNo}
                onChange={(event) =>
                  setPhoneNo(event.target.value)
                }
                disabled={isUpdating}
                autoComplete="tel"
                className="h-11 w-full rounded-xl border border-white/10 bg-[#071A17] pl-10 pr-3.5 font-manrope text-sm text-white outline-none transition placeholder:text-[#627873] focus:border-[#2DD4BF]/40 focus:ring-2 focus:ring-[#2DD4BF]/10 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="+234..."
              />
            </div>
          </label>

          {/* Email - read only */}
          <div>
            <span className="mb-2 block font-manrope text-[11px] font-bold text-[#B9CAC6]">
              Email address
            </span>

            <div className="flex h-11 items-center rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5">
              <Mail className="mr-2.5 h-4 w-4 text-[#627873]" />

              <span className="truncate font-manrope text-sm text-[#8FA8A2]">
                {user.email}
              </span>
            </div>

            <p className="mt-1.5 font-manrope text-[10px] text-[#627873]">
              Email address cannot be changed from this form.
            </p>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2.5 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isUpdating}
              onClick={onClose}
              className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-5 font-manrope text-xs font-bold text-[#B9CAC6] transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 font-manrope text-xs font-extrabold text-[#05211D] transition hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {isUpdating
                ? "Saving..."
                : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Delete modal                                                               */
/* -------------------------------------------------------------------------- */

function DeleteUserModal({
  user,
  open,
  isDeleting,
  onClose,
  onConfirm,
}: {
  user: User | null;
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  if (!open || !user) {
    return null;
  }

  const handleDelete = async () => {
    try {
      await onConfirm();
    } catch {
      // Error is surfaced by the page mutation handler.
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isDeleting
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-red-400/10 bg-[#0E2723] shadow-2xl shadow-black/40">
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10">
              <Trash2 className="h-5 w-5 text-red-300" />
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded-lg p-1.5 text-[#8FA8A2] transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              aria-label="Close delete dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <h2 className="mt-5 font-manrope text-lg font-extrabold text-white">
            Delete user account?
          </h2>

          <p className="mt-2 font-manrope text-xs leading-5 text-[#8FA8A2]">
            You are about to delete{" "}
            <span className="font-bold text-white">
              {getUserName(user)}
            </span>
            . This action cannot be undone.
          </p>

          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10 text-[10px] font-bold text-[#2DD4BF]">
              {getInitials(
                user.firstName,
                user.lastName
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate font-manrope text-xs font-bold text-white">
                {getUserName(user)}
              </p>

              <p className="truncate font-manrope text-[10px] text-[#8FA8A2]">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isDeleting}
              onClick={onClose}
              className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-5 font-manrope text-xs font-bold text-[#B9CAC6] transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-500/90 px-5 font-manrope text-xs font-extrabold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {isDeleting
                ? "Deleting..."
                : "Delete user"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const userId = params?.id ?? "";

  const {
    user,
    isLoading,
    isError,
    error,
    refetch,
  } = useUser(userId);

  /*
   * We use useUsers here only for the mutation operations.
   *
   * The actual user detail is provided by useUser(userId).
   */
  const {
    updateUser,
    isUpdating,
    deleteUser,
    isDeleting,
  } = useUsers({
    limit: 20,
  });

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* Update                                                                   */
  /* ------------------------------------------------------------------------ */

  const handleUpdateUser = async (
    payload: UpdateUserPayload
  ) => {
    if (!user) {
      throw new Error("User not found.");
    }

    try {
      await updateUser({
        id: user.id,
        payload,
      });

      toast.success(
        "User details updated successfully."
      );

      setShowEditModal(false);

      /*
       * Make sure the detail screen reflects the
       * latest server state.
       */
      await refetch();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update user."
      );

      throw error;
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Delete                                                                   */
  /* ------------------------------------------------------------------------ */

  const handleDeleteUser = async () => {
    if (!user) {
      throw new Error("User not found.");
    }

    try {
      const deleted = await deleteUser(user.id);

      if (!deleted) {
        throw new Error(
          "The server did not confirm that the user was deleted."
        );
      }

      toast.success("User deleted successfully.");

      setShowDeleteModal(false);

      router.replace("/dashboard/users");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete user."
      );

      throw error;
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (isLoading) {
    return (
      <main className="min-h-full bg-[#071A17]">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8 h-5 w-28 animate-pulse rounded bg-white/[0.05]" />

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0E2723]">
            <div className="h-32 animate-pulse bg-white/[0.025]" />

            <div className="px-5 pb-8 sm:px-8">
              <div className="-mt-12 h-24 w-24 animate-pulse rounded-3xl border-4 border-[#0E2723] bg-white/10" />

              <div className="mt-5 space-y-3">
                <div className="h-7 w-56 animate-pulse rounded-lg bg-white/10" />
                <div className="h-4 w-72 animate-pulse rounded-lg bg-white/5" />
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-24 animate-pulse rounded-2xl bg-white/[0.035]"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error                                                                    */
  /* ------------------------------------------------------------------------ */

  if (isError || !user) {
    return (
      <main className="min-h-full bg-[#071A17]">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-4 py-10">
          <div className="w-full rounded-3xl border border-white/10 bg-[#0E2723] p-8 text-center shadow-2xl shadow-black/10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10">
              <UserX className="h-6 w-6 text-red-300" />
            </div>

            <h1 className="mt-5 font-manrope text-xl font-bold text-white">
              Unable to load user
            </h1>

            <p className="mx-auto mt-2 max-w-md font-manrope text-sm leading-6 text-[#8FA8A2]">
              {error instanceof Error
                ? error.message
                : "The requested user could not be found or could not be loaded."}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  router.push("/dashboard/users")
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 font-manrope text-sm font-medium text-white transition hover:bg-white/[0.07]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to users
              </button>

              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 font-manrope text-sm font-semibold text-[#071A17] transition hover:bg-[#5EEAD4]"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const RoleIcon = getRoleIcon(user.role);

  /* ------------------------------------------------------------------------ */
  /* Main                                                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-full bg-[#071A17]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ------------------------------------------------------------------ */}
        {/* Page header                                                         */}
        {/* ------------------------------------------------------------------ */}

        <div className="mb-6">
          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/users")
            }
            className="group inline-flex items-center gap-2 font-manrope text-sm font-medium text-[#8FA8A2] transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to users
          </button>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#2DD4BF]">
                <HeartPulse className="h-4 w-4" />
                Care team
              </div>

              <h1 className="mt-2 font-manrope text-2xl font-bold tracking-tight text-white sm:text-3xl">
                User profile
              </h1>

              <p className="mt-2 max-w-2xl font-manrope text-sm leading-6 text-[#8FA8A2]">
                View and manage this Remote Care team
                member's account.
              </p>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* Management actions                                              */}
            {/* -------------------------------------------------------------- */}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setShowEditModal(true)
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-4 font-manrope text-xs font-bold text-[#05211D] transition hover:bg-[#5EEAD4]"
              >
                <Edit3 className="h-4 w-4" />
                Edit user
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(true)
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 font-manrope text-xs font-bold text-red-300 transition hover:border-red-400/30 hover:bg-red-400/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Profile hero                                                        */}
        {/* ------------------------------------------------------------------ */}

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0E2723] shadow-2xl shadow-black/10">
          <div className="relative h-32 overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#123b34] via-[#0E2723] to-[#0a201d]">
            <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-[#2DD4BF]/10 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#2DD4BF]/5 blur-3xl" />

            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2DD4BF]/30 to-transparent" />
          </div>

          <div className="relative px-5 pb-7 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-[#0E2723] bg-[#153b35] text-2xl font-bold text-[#2DD4BF] shadow-xl shadow-black/20">
                  {getInitials(
                    user.firstName,
                    user.lastName
                  )}
                </div>

                <div className="pb-1">
                  <h2 className="font-manrope text-xl font-bold text-white sm:text-2xl">
                    {getUserName(user)}
                  </h2>

                  <p className="mt-1 font-manrope text-sm text-[#8FA8A2]">
                    {getRoleLabel(user.role)}
                  </p>
                </div>
              </div>

              <div className="sm:pb-1">
                {user.isDisabled ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-3 py-1.5 font-manrope text-xs font-semibold text-amber-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                    Account disabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 font-manrope text-xs font-semibold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    Account active
                  </span>
                )}
              </div>
            </div>

            {/* Summary cards */}
            <div className="mt-8 grid gap-3 border-t border-white/10 pt-7 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-[#8FA8A2]">
                  <RoleIcon className="h-4 w-4" />
                  <span className="font-manrope text-xs font-medium">
                    Role
                  </span>
                </div>

                <p className="mt-2 font-manrope text-sm font-semibold text-white">
                  {getRoleLabel(user.role)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-[#8FA8A2]">
                  <Mail className="h-4 w-4" />
                  <span className="font-manrope text-xs font-medium">
                    Email
                  </span>
                </div>

                <p className="mt-2 truncate font-manrope text-sm font-semibold text-white">
                  {user.email}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-[#8FA8A2]">
                  <Phone className="h-4 w-4" />
                  <span className="font-manrope text-xs font-medium">
                    Phone
                  </span>
                </div>

                <p className="mt-2 font-manrope text-sm font-semibold text-white">
                  {user.phoneNo || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-[#8FA8A2]">
                  <CalendarDays className="h-4 w-4" />
                  <span className="font-manrope text-xs font-medium">
                    Joined
                  </span>
                </div>

                <p className="mt-2 font-manrope text-sm font-semibold text-white">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Information                                                        */}
        {/* ------------------------------------------------------------------ */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          {/* Personal information */}
          <section className="rounded-3xl border border-white/10 bg-[#0E2723] p-5 sm:p-7">
            <div>
              <h2 className="font-manrope text-base font-semibold text-white">
                Personal information
              </h2>

              <p className="mt-1 font-manrope text-sm text-[#8FA8A2]">
                Basic information associated with this
                account.
              </p>
            </div>

            <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <InfoItem
                label="First name"
                value={user.firstName}
              />

              <InfoItem
                label="Last name"
                value={user.lastName}
              />

              <InfoItem
                label="Email address"
                value={user.email}
              />

              <InfoItem
                label="Phone number"
                value={
                  user.phoneNo || "Not provided"
                }
              />

              <InfoItem
                label="Account role"
                value={getRoleLabel(user.role)}
              />

              <InfoItem
                label="User ID"
                value={user.id}
                copyable
              />
            </div>
          </section>

          {/* Account information */}
          <section className="rounded-3xl border border-white/10 bg-[#0E2723] p-5 sm:p-7">
            <div>
              <h2 className="font-manrope text-base font-semibold text-white">
                Account information
              </h2>

              <p className="mt-1 font-manrope text-sm text-[#8FA8A2]">
                Account lifecycle and access details.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <AccountInfoRow
                icon={ShieldCheck}
                label="Access level"
                value={getRoleLabel(user.role)}
              />

              <AccountInfoRow
                icon={
                  user.isDisabled
                    ? UserX
                    : UserCheck
                }
                label="Account status"
                value={
                  user.isDisabled
                    ? "Disabled"
                    : "Active"
                }
                valueClassName={
                  user.isDisabled
                    ? "text-amber-300"
                    : "text-emerald-300"
                }
              />

              <AccountInfoRow
                icon={CalendarDays}
                label="Created"
                value={formatDateTime(
                  user.createdAt
                )}
              />

              <AccountInfoRow
                icon={Clock3}
                label="Last updated"
                value={formatDateTime(
                  user.updatedAt
                )}
              />
            </div>
          </section>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Management section                                                 */}
        {/* ------------------------------------------------------------------ */}

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#0E2723] p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-manrope text-base font-semibold text-white">
                Account management
              </h2>

              <p className="mt-1 max-w-2xl font-manrope text-sm leading-6 text-[#8FA8A2]">
                Update the user's personal information
                or permanently remove their account from
                Remote Care.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  setShowEditModal(true)
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/[0.06] px-4 font-manrope text-xs font-bold text-[#5EEAD4] transition hover:bg-[#2DD4BF]/10"
              >
                <Edit3 className="h-4 w-4" />
                Edit details
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(true)
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 font-manrope text-xs font-bold text-red-300 transition hover:bg-red-400/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Modals                                                                */}
      {/* -------------------------------------------------------------------- */}

      <EditUserModal
        user={user}
        open={showEditModal}
        isUpdating={isUpdating}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateUser}
      />

      <DeleteUserModal
        user={user}
        open={showDeleteModal}
        isDeleting={isDeleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
      />
    </main>
  );
}