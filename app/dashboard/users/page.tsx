"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Eye,
  Loader2,
  Mail,
  Search,
  ShieldCheck,
  ShieldOff,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useUsers } from "@/lib/hooks/users/useUsers";

import type {
  GetUsersParams,
  User,
  UserRole,
} from "@/lib/types/users/types";

const PAGE_SIZE = 20;

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

const ROLE_CONFIG: Record<
  UserRole,
  {
    label: string;
    description: string;
    icon: typeof ShieldCheck;
    className: string;
  }
> = {
  ADMIN: {
    label: "Administrator",
    description: "Full system access",
    icon: ShieldCheck,
    className:
      "border-violet-400/15 bg-violet-400/10 text-violet-300",
  },

  DOCTOR: {
    label: "Doctor",
    description: "Clinical access",
    icon: UserCog,
    className:
      "border-cyan-400/15 bg-cyan-400/10 text-cyan-300",
  },

  NURSE: {
    label: "Nurse",
    description: "Care team access",
    icon: CircleUserRound,
    className:
      "border-emerald-400/15 bg-emerald-400/10 text-emerald-300",
  },
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`
    .toUpperCase()
    .slice(0, 2);
}

function getUserName(user: User) {
  return `${user.firstName} ${user.lastName}`.trim();
}

/* -------------------------------------------------------------------------- */
/* Reusable UI                                                                */
/* -------------------------------------------------------------------------- */

function RoleBadge({ role }: { role: UserRole }) {
  const config = ROLE_CONFIG[role];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-manrope text-[10px] font-bold tracking-wide ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function StatusBadge({ disabled }: { disabled: boolean }) {
  if (disabled) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/15 bg-red-400/10 px-2.5 py-1 font-manrope text-[10px] font-bold tracking-wide text-red-300">
        <ShieldOff className="h-3 w-3" />
        Disabled
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 font-manrope text-[10px] font-bold tracking-wide text-emerald-300">
      <CheckCircle2 className="h-3 w-3" />
      Active
    </span>
  );
}

function UserAvatar({
  user,
  size = "md",
}: {
  user: User;
  size?: "sm" | "md";
}) {
  const initials = getInitials(
    user.firstName,
    user.lastName
  );

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10 font-manrope font-bold text-[#2DD4BF] ${
        size === "sm"
          ? "h-9 w-9 text-[11px]"
          : "h-11 w-11 text-xs"
      }`}
    >
      {initials || (
        <CircleUserRound className="h-5 w-5" />
      )}
    </div>
  );
}

function EmptyState({
  search,
  onClearSearch,
}: {
  search: string;
  onClearSearch: () => void;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
        {search ? (
          <Search className="h-6 w-6 text-[#8FA8A2]" />
        ) : (
          <Users className="h-6 w-6 text-[#8FA8A2]" />
        )}
      </div>

      <h3 className="mt-5 font-manrope text-sm font-bold text-white">
        {search ? "No users found" : "No users available"}
      </h3>

      <p className="mt-1.5 max-w-sm font-manrope text-xs leading-5 text-[#8FA8A2]">
        {search
          ? `No users matched "${search}". Try a different name, email, phone number, or search term.`
          : "There are currently no users to display."}
      </p>

      {search && (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 font-manrope text-xs font-bold text-white transition hover:border-white/15 hover:bg-white/[0.07]"
        >
          <X className="h-3.5 w-3.5" />
          Clear search
        </button>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="divide-y divide-white/[0.06]">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 px-5 py-4"
        >
          <div className="h-11 w-11 animate-pulse rounded-xl bg-white/[0.05]" />

          <div className="min-w-0 flex-1">
            <div className="h-3.5 w-36 animate-pulse rounded bg-white/[0.06]" />
            <div className="mt-2 h-2.5 w-48 animate-pulse rounded bg-white/[0.04]" />
          </div>

          <div className="hidden h-6 w-24 animate-pulse rounded-full bg-white/[0.05] md:block" />

          <div className="hidden h-6 w-20 animate-pulse rounded-full bg-white/[0.05] lg:block" />

          <div className="hidden h-3 w-20 animate-pulse rounded bg-white/[0.05] xl:block" />

          <div className="h-8 w-20 animate-pulse rounded-lg bg-white/[0.05]" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function UsersPage() {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [cursor, setCursor] = useState<
    string | undefined
  >();

  const [
    cursorHistory,
    setCursorHistory,
  ] = useState<Array<string | undefined>>([]);

  const params = useMemo<GetUsersParams>(
    () => ({
      limit: PAGE_SIZE,
      ...(search ? { search } : {}),
      ...(cursor ? { cursor } : {}),
    }),
    [search, cursor]
  );

  const {
    users,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useUsers(params);

  /* ------------------------------------------------------------------------ */
  /* Debounced search                                                         */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const normalized = searchInput.trim();

      if (normalized !== search) {
        setSearch(normalized);
        setCursor(undefined);
        setCursorHistory([]);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput, search]);

  /* ------------------------------------------------------------------------ */
  /* Pagination                                                               */
  /* ------------------------------------------------------------------------ */

  const handleNextPage = () => {
    if (
      !pagination.hasNextPage ||
      !pagination.nextCursor ||
      isFetching
    ) {
      return;
    }

    setCursorHistory((history) => [
      ...history,
      cursor,
    ]);

    setCursor(pagination.nextCursor);
  };

  const handlePreviousPage = () => {
    if (
      cursorHistory.length === 0 ||
      isFetching
    ) {
      return;
    }

    const history = [...cursorHistory];
    const previousCursor = history.pop();

    setCursorHistory(history);
    setCursor(previousCursor);
  };

  /* ------------------------------------------------------------------------ */
  /* Search                                                                   */
  /* ------------------------------------------------------------------------ */

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setCursor(undefined);
    setCursorHistory([]);
  };

  /* ------------------------------------------------------------------------ */
  /* Refresh                                                                  */
  /* ------------------------------------------------------------------------ */

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Users refreshed successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to refresh users."
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Navigation                                                               */
  /* ------------------------------------------------------------------------ */

  const openUser = (userId: string) => {
    router.push(`/dashboard/users/${userId}`);
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="w-full pb-8">
      {/* ------------------------------------------------------------------ */}
      {/* Page heading                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10">
              <Users className="h-4 w-4 text-[#2DD4BF]" />
            </div>

            <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.18em] text-[#2DD4BF]">
              User management
            </span>
          </div>

          <h1 className="mt-4 font-manrope text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Users
          </h1>

          <p className="mt-1.5 max-w-2xl font-manrope text-xs leading-5 text-[#8FA8A2] sm:text-sm">
            Manage administrators and healthcare staff
            with access to the Remote Care platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5 sm:block">
            <p className="font-manrope text-[9px] font-bold uppercase tracking-[0.14em] text-[#627873]">
              Showing
            </p>

            <p className="mt-0.5 font-manrope text-xs font-bold text-white">
              {isLoading
                ? "Loading..."
                : `${users.length} users`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 font-manrope text-xs font-bold text-[#B9CAC6] transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Loader2
              className={`h-3.5 w-3.5 ${
                isFetching ? "animate-spin" : ""
              }`}
            />

            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Search toolbar                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-7 rounded-2xl border border-white/[0.07] bg-[#0E2723] p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#627873]" />

            <input
              type="search"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Search users by name, email or phone..."
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#071A17] pl-10 pr-10 font-manrope text-xs text-white outline-none transition placeholder:text-[#627873] focus:border-[#2DD4BF]/30 focus:ring-2 focus:ring-[#2DD4BF]/10"
            />

            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#627873] transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {search && (
              <span className="hidden rounded-lg border border-[#2DD4BF]/10 bg-[#2DD4BF]/5 px-3 py-2 font-manrope text-[10px] font-semibold text-[#8FA8A2] sm:block">
                Search:{" "}
                <span className="text-[#2DD4BF]">
                  {search}
                </span>
              </span>
            )}

            {isFetching && !isLoading && (
              <div className="flex items-center gap-2 px-2 font-manrope text-[10px] font-semibold text-[#8FA8A2]">
                <Loader2 className="h-3 w-3 animate-spin text-[#2DD4BF]" />
                Updating
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Error                                                                */}
      {/* ------------------------------------------------------------------ */}

      {isError && (
        <div className="mt-5 rounded-2xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-400/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-manrope text-xs font-bold text-red-300">
                Unable to load users
              </p>

              <p className="mt-1 font-manrope text-[10px] leading-5 text-red-300/70">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong while retrieving users."}
              </p>

              <button
                type="button"
                onClick={handleRefresh}
                className="mt-2.5 font-manrope text-[10px] font-bold text-red-300 underline underline-offset-2 transition hover:text-red-200"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Users table                                                          */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0E2723]">
        {/* Desktop header */}
        <div className="hidden grid-cols-[minmax(250px,1.7fr)_minmax(120px,0.8fr)_minmax(110px,0.7fr)_minmax(110px,0.7fr)_120px] gap-4 border-b border-white/[0.07] bg-white/[0.015] px-5 py-3.5 lg:grid">
          <p className="font-manrope text-[9px] font-bold uppercase tracking-[0.14em] text-[#627873]">
            User
          </p>

          <p className="font-manrope text-[9px] font-bold uppercase tracking-[0.14em] text-[#627873]">
            Role
          </p>

          <p className="font-manrope text-[9px] font-bold uppercase tracking-[0.14em] text-[#627873]">
            Status
          </p>

          <p className="font-manrope text-[9px] font-bold uppercase tracking-[0.14em] text-[#627873]">
            Joined
          </p>

          <p className="text-right font-manrope text-[9px] font-bold uppercase tracking-[0.14em] text-[#627873]">
            Action
          </p>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : users.length === 0 ? (
          <EmptyState
            search={search}
            onClearSearch={handleClearSearch}
          />
        ) : (
          <>
            {/* ------------------------------------------------------------ */}
            {/* Desktop rows                                                   */}
            {/* ------------------------------------------------------------ */}

            <div className="hidden lg:block">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-[minmax(250px,1.7fr)_minmax(120px,0.8fr)_minmax(110px,0.7fr)_minmax(110px,0.7fr)_120px] items-center gap-4 border-b border-white/[0.055] px-5 py-4 transition last:border-b-0 hover:bg-white/[0.018]"
                >
                  {/* User */}
                  <button
                    type="button"
                    onClick={() => openUser(user.id)}
                    className="flex min-w-0 items-center gap-3 text-left"
                  >
                    <UserAvatar user={user} />

                    <div className="min-w-0">
                      <p className="truncate font-manrope text-xs font-bold text-white">
                        {getUserName(user)}
                      </p>

                      <div className="mt-1 flex min-w-0 items-center gap-1.5">
                        <Mail className="h-3 w-3 shrink-0 text-[#627873]" />

                        <span className="truncate font-manrope text-[10px] text-[#8FA8A2]">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Role */}
                  <RoleBadge role={user.role} />

                  {/* Status */}
                  <StatusBadge disabled={user.isDisabled} />

                  {/* Joined */}
                  <div>
                    <p className="font-manrope text-[10px] font-semibold text-[#B9CAC6]">
                      {formatDate(user.createdAt)}
                    </p>

                    <p className="mt-1 truncate font-manrope text-[9px] text-[#627873]">
                      {user.phoneNo || "No phone"}
                    </p>
                  </div>

                  {/* View only */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => openUser(user.id)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 font-manrope text-[10px] font-bold text-[#B9CAC6] transition hover:border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/5 hover:text-[#2DD4BF]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Mobile / tablet cards                                         */}
            {/* ------------------------------------------------------------ */}

            <div className="divide-y divide-white/[0.055] lg:hidden">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 transition hover:bg-white/[0.018]"
                >
                  <button
                    type="button"
                    onClick={() => openUser(user.id)}
                    className="flex w-full items-start gap-3 text-left"
                  >
                    <UserAvatar user={user} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-manrope text-xs font-bold text-white">
                        {getUserName(user)}
                      </p>

                      <p className="mt-1 truncate font-manrope text-[10px] text-[#8FA8A2]">
                        {user.email}
                      </p>
                    </div>

                    <Eye className="mt-1 h-4 w-4 shrink-0 text-[#627873]" />
                  </button>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <RoleBadge role={user.role} />
                    <StatusBadge disabled={user.isDisabled} />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                      <p className="font-manrope text-[9px] font-bold uppercase tracking-wide text-[#627873]">
                        Joined
                      </p>

                      <p className="mt-1 truncate font-manrope text-[10px] font-semibold text-[#B9CAC6]">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                      <p className="font-manrope text-[9px] font-bold uppercase tracking-wide text-[#627873]">
                        Phone
                      </p>

                      <p className="mt-1 truncate font-manrope text-[10px] font-semibold text-[#B9CAC6]">
                        {user.phoneNo || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openUser(user.id)}
                    className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] font-manrope text-[10px] font-bold text-[#B9CAC6] transition hover:border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/5 hover:text-[#2DD4BF]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View user
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Pagination                                                        */}
        {/* ---------------------------------------------------------------- */}

        {!isLoading && users.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-white/[0.07] bg-white/[0.012] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-2">
              <span className="font-manrope text-[10px] text-[#627873]">
                {search ? "Filtered results" : "Users"}
              </span>

              <span className="h-1 w-1 rounded-full bg-[#627873]" />

              <span className="font-manrope text-[10px] font-semibold text-[#8FA8A2]">
                {users.length} shown
              </span>

              {isFetching && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[#627873]" />

                  <span className="flex items-center gap-1.5 font-manrope text-[10px] text-[#8FA8A2]">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={
                  cursorHistory.length === 0 ||
                  isFetching
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.025] px-3 font-manrope text-[10px] font-bold text-[#B9CAC6] transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>

              <div className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-[#2DD4BF]/10 bg-[#2DD4BF]/5 px-2.5 font-manrope text-[10px] font-bold text-[#2DD4BF]">
                {cursorHistory.length + 1}
              </div>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={
                  !pagination.hasNextPage ||
                  !pagination.nextCursor ||
                  isFetching
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.025] px-3 font-manrope text-[10px] font-bold text-[#B9CAC6] transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}