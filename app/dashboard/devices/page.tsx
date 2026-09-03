"use client";

import {
  Activity,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Cpu,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Wifi,
  WifiOff,
  X,
  XCircle,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

import { useDevices } from "@/lib/hooks/devices/useDevices";
import { authStorage } from "@/lib/store/auth";

import type {
  Device,
  DeviceStatus,
} from "@/lib/types/devices/types";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const PAGE_SIZE = 20;

const SEARCH_DEBOUNCE_MS = 350;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(
  value: string
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(date);
}

function formatDateTime(
  value: string
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(date);
}

function getDeviceInitials(
  deviceName: string
) {
  const words = deviceName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "DV";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

/* -------------------------------------------------------------------------- */
/* Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function DeviceStatusBadge({
  status,
}: {
  status: DeviceStatus;
}) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full",
        "border px-2.5 py-1",
        "font-manrope text-[10px] font-bold",
        "uppercase tracking-[0.08em]",
        isActive
          ? "border-[#2DD4BF]/15 bg-[#2DD4BF]/8 text-[#5EEAD4]"
          : "border-white/10 bg-white/[0.035] text-[#8FA8A2]",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isActive
            ? "bg-[#2DD4BF] shadow-[0_0_8px_rgba(45,212,191,0.6)]"
            : "bg-[#647873]",
        ].join(" ")}
      />

      {isActive
        ? "Active"
        : "Inactive"}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

function DeviceStatCard({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0E2723] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-manrope text-[10px] font-semibold uppercase tracking-[0.12em] text-[#718983]">
            {label}
          </p>

          <p className="mt-2 font-manrope text-2xl font-extrabold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 font-manrope text-[10px] text-[#718983]">
            {description}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.07] text-[#2DD4BF]">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading Row                                                                */
/* -------------------------------------------------------------------------- */

function DeviceRowSkeleton() {
  return (
    <div className="grid grid-cols-[minmax(220px,1.5fr)_150px_170px_150px_100px] items-center gap-4 border-b border-white/[0.055] px-5 py-4 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 animate-pulse rounded-xl bg-white/[0.06]" />

        <div className="space-y-2">
          <div className="h-3 w-28 animate-pulse rounded bg-white/[0.06]" />
          <div className="h-2.5 w-40 animate-pulse rounded bg-white/[0.04]" />
        </div>
      </div>

      <div className="h-6 w-20 animate-pulse rounded-full bg-white/[0.05]" />

      <div className="h-3 w-28 animate-pulse rounded bg-white/[0.05]" />

      <div className="h-3 w-24 animate-pulse rounded bg-white/[0.05]" />

      <div className="flex justify-end">
        <div className="h-8 w-16 animate-pulse rounded-lg bg-white/[0.05]" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyDevices({
  searching,
  onClearSearch,
  onRegister,
  canManage,
}: {
  searching: boolean;
  onClearSearch: () => void;
  onRegister: () => void;
  canManage: boolean;
}) {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.06]">
        {searching ? (
          <Search className="h-6 w-6 text-[#2DD4BF]" />
        ) : (
          <Cpu className="h-6 w-6 text-[#2DD4BF]" />
        )}
      </div>

      <h3 className="mt-5 font-manrope text-sm font-bold text-white">
        {searching
          ? "No devices found"
          : "No devices registered yet"}
      </h3>

      <p className="mt-2 max-w-sm font-manrope text-xs leading-5 text-[#718983]">
        {searching
          ? "Try adjusting your search term or clear the search to view all registered devices."
          : "Register a monitoring device to start connecting hardware to your remote patient monitoring system."}
      </p>

      <div className="mt-5 flex items-center gap-2">
        {searching ? (
          <button
            type="button"
            onClick={onClearSearch}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 font-manrope text-xs font-bold text-[#B8C9C5] transition hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
            Clear search
          </button>
        ) : canManage ? (
          <button
            type="button"
            onClick={onRegister}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#2DD4BF] px-4 font-manrope text-xs font-extrabold text-[#06211D] transition hover:bg-[#5EEAD4]"
          >
            <Plus className="h-3.5 w-3.5" />
            Register device
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Error State                                                                */
/* -------------------------------------------------------------------------- */

function DevicesError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/[0.06]">
        <AlertCircle className="h-6 w-6 text-red-400" />
      </div>

      <h3 className="mt-5 font-manrope text-sm font-bold text-white">
        Unable to load devices
      </h3>

      <p className="mt-2 max-w-sm font-manrope text-xs leading-5 text-[#718983]">
        {message ||
          "Something went wrong while retrieving the device records."}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-9 items-center gap-2 rounded-xl bg-[#2DD4BF] px-4 font-manrope text-xs font-extrabold text-[#06211D] transition hover:bg-[#5EEAD4]"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function DevicesPage() {
  /* ------------------------------------------------------------------------ */
  /* Authentication / role                                                   */
  /* ------------------------------------------------------------------------ */

  const user = authStorage.getUser();

  const canManageDevices =
    user?.userType === "ADMIN";

  /* ------------------------------------------------------------------------ */
  /* Search                                                                   */
  /* ------------------------------------------------------------------------ */

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  /*
   * Cursor history allows the user to move
   * backwards through cursor-based results.
   *
   * Example:
   *
   * page 1 -> undefined
   * page 2 -> cursor A
   * page 3 -> cursor B
   *
   * Going back from page 3 gives us cursor A.
   */
  const [cursorHistory, setCursorHistory] =
    useState<string[]>([]);

  const currentCursor =
    cursorHistory[
      cursorHistory.length - 1
    ];

  /* ------------------------------------------------------------------------ */
  /* Dialog state                                                             */
  /* ------------------------------------------------------------------------ */

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [editingDevice, setEditingDevice] =
    useState<Device | null>(null);

  const [deletingDevice, setDeletingDevice] =
    useState<Device | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Form state                                                               */
  /* ------------------------------------------------------------------------ */

  const [deviceName, setDeviceName] =
    useState("");

  const [deviceStatus, setDeviceStatus] =
    useState<DeviceStatus>("ACTIVE");

  /* ------------------------------------------------------------------------ */
  /* Search debounce                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const nextSearch =
        searchInput.trim();

      setSearch(nextSearch);

      /*
       * A new search represents a completely
       * different cursor dataset.
       */
      setCursorHistory([]);
    }, SEARCH_DEBOUNCE_MS);

    return () =>
      window.clearTimeout(timeout);
  }, [searchInput]);

  /* ------------------------------------------------------------------------ */
  /* Devices query                                                            */
  /* ------------------------------------------------------------------------ */

  const {
    devices,
    pagination,

    isLoading,
    isFetching,
    isError,
    error,

    registerDevice,
    isRegistering,

    updateDevice,
    isUpdating,

    deleteDevice,
    isDeleting,

    refetch,
  } = useDevices({
    search: search || undefined,
    cursor: currentCursor,
    limit: PAGE_SIZE,
  });

  /* ------------------------------------------------------------------------ */
  /* Derived stats                                                            */
  /* ------------------------------------------------------------------------ */

  const activeDevices =
    useMemo(
      () =>
        devices.filter(
          (device) =>
            device.status === "ACTIVE"
        ).length,
      [devices]
    );

  const inactiveDevices =
    devices.length - activeDevices;

  /* ------------------------------------------------------------------------ */
  /* Open create modal                                                        */
  /* ------------------------------------------------------------------------ */

  const openCreateModal =
    useCallback(() => {
      setDeviceName("");
      setDeviceStatus("ACTIVE");
      setShowCreateModal(true);
    }, []);

  /* ------------------------------------------------------------------------ */
  /* Close create modal                                                       */
  /* ------------------------------------------------------------------------ */

  const closeCreateModal =
    useCallback(() => {
      if (isRegistering) {
        return;
      }

      setShowCreateModal(false);
      setDeviceName("");
    }, [isRegistering]);

  /* ------------------------------------------------------------------------ */
  /* Open edit modal                                                          */
  /* ------------------------------------------------------------------------ */

  const openEditModal =
    useCallback(
      (device: Device) => {
        setEditingDevice(device);
        setDeviceName(
          device.deviceName
        );
        setDeviceStatus(device.status);
      },
      []
    );

  /* ------------------------------------------------------------------------ */
  /* Close edit modal                                                         */
  /* ------------------------------------------------------------------------ */

  const closeEditModal =
    useCallback(() => {
      if (isUpdating) {
        return;
      }

      setEditingDevice(null);
      setDeviceName("");
      setDeviceStatus("ACTIVE");
    }, [isUpdating]);

  /* ------------------------------------------------------------------------ */
  /* Register device                                                          */
  /* ------------------------------------------------------------------------ */

  const handleRegister =
    async (
      event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      const trimmedName =
        deviceName.trim();

      if (!trimmedName) {
        toast.error(
          "Device name is required."
        );
        return;
      }

      if (!canManageDevices) {
        toast.error(
          "You do not have permission to register devices."
        );
        return;
      }

      try {
        await registerDevice({
          deviceName: trimmedName,
        });

        toast.success(
          "Device registered successfully."
        );

        setShowCreateModal(false);
        setDeviceName("");

        /*
         * Return to the first result set so
         * the newly registered device can be
         * displayed immediately.
         */
        setCursorHistory([]);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to register device."
        );
      }
    };

  /* ------------------------------------------------------------------------ */
  /* Update device                                                            */
  /* ------------------------------------------------------------------------ */

  const handleUpdate =
    async (
      event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (!editingDevice) {
        return;
      }

      const trimmedName =
        deviceName.trim();

      if (!trimmedName) {
        toast.error(
          "Device name is required."
        );
        return;
      }

      if (!canManageDevices) {
        toast.error(
          "You do not have permission to update devices."
        );
        return;
      }

      try {
        await updateDevice({
          id: editingDevice.id,
          payload: {
            deviceName: trimmedName,
            status: deviceStatus,
          },
        });

        toast.success(
          "Device updated successfully."
        );

        closeEditModal();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to update device."
        );
      }
    };

  /* ------------------------------------------------------------------------ */
  /* Delete device                                                            */
  /* ------------------------------------------------------------------------ */

  const handleDelete =
    async () => {
      if (!deletingDevice) {
        return;
      }

      if (!canManageDevices) {
        toast.error(
          "You do not have permission to delete devices."
        );
        return;
      }

      try {
        const deleted =
          await deleteDevice(
            deletingDevice.id
          );

        if (!deleted) {
          toast.error(
            "The device could not be deleted."
          );
          return;
        }

        toast.success(
          "Device deleted successfully."
        );

        setDeletingDevice(null);

        /*
         * If the current cursor becomes empty
         * after deletion, going back to the
         * previous cursor gives the user a
         * better experience.
         */
        if (
          devices.length === 1 &&
          cursorHistory.length > 0
        ) {
          setCursorHistory(
            (history) =>
              history.slice(0, -1)
          );
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to delete device."
        );
      }
    };

  /* ------------------------------------------------------------------------ */
  /* Pagination                                                               */
  /* ------------------------------------------------------------------------ */

  const handleNextPage =
    () => {
      if (
        !pagination.hasNextPage ||
        !pagination.nextCursor
      ) {
        return;
      }

      setCursorHistory(
        (history) => [
          ...history,
          pagination.nextCursor!,
        ]
      );
    };

  const handlePreviousPage =
    () => {
      if (
        cursorHistory.length === 0
      ) {
        return;
      }

      setCursorHistory(
        (history) =>
          history.slice(0, -1)
      );
    };

  /* ------------------------------------------------------------------------ */
  /* Clear search                                                             */
  /* ------------------------------------------------------------------------ */

  const handleClearSearch =
    () => {
      setSearchInput("");
      setSearch("");
      setCursorHistory([]);
    };

  /* ------------------------------------------------------------------------ */
  /* Error message                                                            */
  /* ------------------------------------------------------------------------ */

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Something went wrong while loading the devices.";

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="w-full pb-8">
      {/* ================================================================== */}
      {/* Page header                                                        */}
      {/* ================================================================== */}

      <section className="mb-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.045] px-3 py-1.5">
              <Activity className="h-3 w-3 text-[#2DD4BF]" />

              <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.16em] text-[#54CDBD]">
                Device management
              </span>

              <span className="h-1 w-1 rounded-full bg-[#2DD4BF]" />
            </div>

            <h1 className="font-manrope text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Monitoring devices
            </h1>

            <p className="mt-2 max-w-2xl font-manrope text-xs leading-5 text-[#7F9993] sm:text-sm">
              Manage the connected devices used
              to collect and monitor patient
              health data across Remote Care.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 font-manrope text-xs font-bold text-[#9DB1AD] transition hover:border-white/[0.13] hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={[
                  "h-3.5 w-3.5",
                  isFetching
                    ? "animate-spin"
                    : "",
                ].join(" ")}
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

            {canManageDevices && (
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2DD4BF] px-4 font-manrope text-xs font-extrabold text-[#06211D] shadow-[0_8px_24px_rgba(45,212,191,0.08)] transition hover:bg-[#5EEAD4] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Register device
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Summary cards                                                      */}
      {/* ================================================================== */}

      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DeviceStatCard
          label="Devices shown"
          value={devices.length}
          icon={
            <Cpu className="h-4 w-4" />
          }
          description={
            search
              ? "Matching your search"
              : "Current result set"
          }
        />

        <DeviceStatCard
          label="Active"
          value={activeDevices}
          icon={
            <Wifi className="h-4 w-4" />
          }
          description="Ready for monitoring"
        />

        <DeviceStatCard
          label="Inactive"
          value={inactiveDevices}
          icon={
            <WifiOff className="h-4 w-4" />
          }
          description="Not currently active"
        />
      </section>

      {/* ================================================================== */}
      {/* Main device card                                                   */}
      {/* ================================================================== */}

      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0B211E] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        {/* ---------------------------------------------------------------- */}
        {/* Toolbar                                                          */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-manrope text-sm font-extrabold text-white">
              Registered devices
            </h2>

            <p className="mt-1 font-manrope text-[10px] text-[#718983]">
              Monitor device status and manage
              your connected hardware.
            </p>
          </div>

          <div className="relative w-full lg:w-[280px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#607772]" />

            <input
              type="search"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(
                  event.target.value
                )
              }
              placeholder="Search devices..."
              className="h-9 w-full rounded-xl border border-white/[0.08] bg-[#071A17] pl-9 pr-9 font-manrope text-xs text-white outline-none transition placeholder:text-[#526A65] focus:border-[#2DD4BF]/30 focus:ring-2 focus:ring-[#2DD4BF]/5"
            />

            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg text-[#647873] transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Error                                                            */}
        {/* ---------------------------------------------------------------- */}

        {isError ? (
          <DevicesError
            message={errorMessage}
            onRetry={() => refetch()}
          />
        ) : isLoading ? (
          /* -------------------------------------------------------------- */
          /* Loading                                                        */
          /* -------------------------------------------------------------- */
          <div>
            <div className="hidden grid-cols-[minmax(220px,1.5fr)_150px_170px_150px_100px] gap-4 border-b border-white/[0.055] bg-white/[0.012] px-5 py-3 lg:grid">
              {[
                "Device",
                "Status",
                "Device ID",
                "Registered",
                "Action",
              ].map((heading) => (
                <span
                  key={heading}
                  className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#607772]"
                >
                  {heading}
                </span>
              ))}
            </div>

            {Array.from({
              length: 5,
            }).map((_, index) => (
              <DeviceRowSkeleton
                key={index}
              />
            ))}
          </div>
        ) : devices.length === 0 ? (
          /* -------------------------------------------------------------- */
          /* Empty                                                          */
          /* -------------------------------------------------------------- */
          <EmptyDevices
            searching={Boolean(search)}
            onClearSearch={
              handleClearSearch
            }
            onRegister={
              openCreateModal
            }
            canManage={
              canManageDevices
            }
          />
        ) : (
          /* -------------------------------------------------------------- */
          /* Device table                                                   */
          /* -------------------------------------------------------------- */
          <>
            {/* Desktop header */}
            <div className="hidden grid-cols-[minmax(220px,1.5fr)_150px_170px_150px_100px] items-center gap-4 border-b border-white/[0.055] bg-white/[0.012] px-5 py-3 lg:grid">
              <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#607772]">
                Device
              </span>

              <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#607772]">
                Status
              </span>

              <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#607772]">
                Device ID
              </span>

              <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#607772]">
                Registered
              </span>

              <span className="text-right font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#607772]">
                Action
              </span>
            </div>

            {/* Device rows */}
            <div className="divide-y divide-white/[0.055]">
              {devices.map(
                (device) => (
                  <div
                    key={device.id}
                    className="group px-4 py-4 transition hover:bg-white/[0.018] sm:px-5"
                  >
                    {/* -------------------------------------------------- */}
                    {/* Desktop row                                       */}
                    {/* -------------------------------------------------- */}

                    <div className="hidden grid-cols-[minmax(220px,1.5fr)_150px_170px_150px_100px] items-center gap-4 lg:grid">
                      {/* Device */}
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.06] font-manrope text-[10px] font-extrabold text-[#45D8C5]">
                          {getDeviceInitials(
                            device.deviceName
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-manrope text-xs font-bold text-white">
                            {device.deviceName}
                          </p>

                          <p className="mt-0.5 truncate font-mono text-[9px] text-[#607772]">
                            {device.id}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <DeviceStatusBadge
                          status={
                            device.status
                          }
                        />
                      </div>

                      {/* ID */}
                      <div className="min-w-0">
                        <p
                          title={device.id}
                          className="truncate font-mono text-[10px] text-[#80958F]"
                        >
                          {device.id.slice(
                            0,
                            8
                          )}
                          ...
                          {device.id.slice(
                            -4
                          )}
                        </p>
                      </div>

                      {/* Registered */}
                      <div>
                        <p className="font-manrope text-[10px] font-medium text-[#9BAFA9]">
                          {formatDate(
                            device.createdAt
                          )}
                        </p>

                        <p className="mt-0.5 font-manrope text-[9px] text-[#607772]">
                          {formatDateTime(
                            device.createdAt
                          ).split(
                            ", "
                          )[1] ?? ""}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end">
                        {canManageDevices ? (
                          <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  device
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-[#80958F] transition hover:border-[#2DD4BF]/15 hover:bg-[#2DD4BF]/[0.06] hover:text-[#2DD4BF]"
                              aria-label={`Edit ${device.deviceName}`}
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeletingDevice(
                                  device
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-[#80958F] transition hover:border-red-400/15 hover:bg-red-400/[0.06] hover:text-red-400"
                              aria-label={`Delete ${device.deviceName}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-manrope text-[9px] text-[#526A65]">
                            View only
                          </span>
                        )}
                      </div>
                    </div>

                    {/* -------------------------------------------------- */}
                    {/* Mobile/tablet card                                 */}
                    {/* -------------------------------------------------- */}

                    <div className="lg:hidden">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.06] font-manrope text-[10px] font-extrabold text-[#45D8C5]">
                            {getDeviceInitials(
                              device.deviceName
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-manrope text-xs font-bold text-white">
                              {
                                device.deviceName
                              }
                            </p>

                            <p className="mt-1 truncate font-mono text-[9px] text-[#607772]">
                              {device.id}
                            </p>
                          </div>
                        </div>

                        <DeviceStatusBadge
                          status={
                            device.status
                          }
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">
                        <div>
                          <p className="font-manrope text-[8px] font-bold uppercase tracking-[0.12em] text-[#526A65]">
                            Registered
                          </p>

                          <p className="mt-1 font-manrope text-[10px] font-semibold text-[#9BAFA9]">
                            {formatDate(
                              device.createdAt
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="font-manrope text-[8px] font-bold uppercase tracking-[0.12em] text-[#526A65]">
                            Device ID
                          </p>

                          <p className="mt-1 truncate font-mono text-[9px] text-[#80958F]">
                            {device.id}
                          </p>
                        </div>
                      </div>

                      {canManageDevices && (
                        <div className="mt-3 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                device
                              )
                            }
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 font-manrope text-[10px] font-bold text-[#80958F] transition hover:bg-white/[0.05] hover:text-white"
                          >
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeletingDevice(
                                device
                              )
                            }
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-400/10 bg-red-400/[0.035] px-3 font-manrope text-[10px] font-bold text-red-300/80 transition hover:bg-red-400/[0.07] hover:text-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Pagination                                                    */}
            {/* ------------------------------------------------------------ */}

            <div className="flex flex-col gap-3 border-t border-white/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2DD4BF]/[0.06] text-[#2DD4BF]">
                  <CircleDot className="h-3 w-3" />
                </div>

                <p className="font-manrope text-[10px] text-[#718983]">
                  Showing{" "}
                  <span className="font-bold text-[#A9BBB7]">
                    {devices.length}
                  </span>{" "}
                  device
                  {devices.length === 1
                    ? ""
                    : "s"}
                </p>

                {isFetching &&
                  !isLoading && (
                    <Loader2 className="h-3 w-3 animate-spin text-[#2DD4BF]" />
                  )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={
                    handlePreviousPage
                  }
                  disabled={
                    cursorHistory.length ===
                      0 ||
                    isFetching
                  }
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 font-manrope text-[10px] font-bold text-[#80958F] transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </button>

                <div className="hidden h-8 items-center rounded-lg border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.04] px-3 sm:flex">
                  <span className="font-manrope text-[10px] font-bold text-[#55CFC0]">
                    Cursor{" "}
                    {cursorHistory.length +
                      1}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={
                    handleNextPage
                  }
                  disabled={
                    !pagination.hasNextPage ||
                    !pagination.nextCursor ||
                    isFetching
                  }
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 font-manrope text-[10px] font-bold text-[#80958F] transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ================================================================== */}
      {/* Permission notice                                                  */}
      {/* ================================================================== */}

      {!canManageDevices && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.018] px-4 py-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#2DD4BF]" />

          <div>
            <p className="font-manrope text-[10px] font-bold text-[#A9BBB7]">
              Read-only access
            </p>

            <p className="mt-0.5 font-manrope text-[9px] leading-4 text-[#647873]">
              Only administrators can register,
              update, or delete monitoring
              devices.
            </p>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* Register modal                                                     */}
      {/* ================================================================== */}

      {showCreateModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-device-title"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeCreateModal();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0B211E] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <div className="flex items-start justify-between border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.06] text-[#2DD4BF]">
                  <Cpu className="h-4 w-4" />
                </div>

                <div>
                  <h2
                    id="register-device-title"
                    className="font-manrope text-sm font-extrabold text-white"
                  >
                    Register device
                  </h2>

                  <p className="mt-1 font-manrope text-[10px] text-[#718983]">
                    Add a new monitoring device
                    to Remote Care.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  closeCreateModal
                }
                disabled={isRegistering}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[#647873] transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleRegister}
              className="p-5"
            >
              <label
                htmlFor="device-name"
                className="font-manrope text-[10px] font-bold text-[#A9BBB7]"
              >
                Device name
              </label>

              <div className="relative mt-2">
                <Cpu className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#526A65]" />

                <input
                  id="device-name"
                  type="text"
                  autoFocus
                  value={deviceName}
                  onChange={(event) =>
                    setDeviceName(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Ward A Monitor"
                  maxLength={100}
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#071A17] pl-9 pr-3 font-manrope text-xs text-white outline-none transition placeholder:text-[#526A65] focus:border-[#2DD4BF]/30 focus:ring-2 focus:ring-[#2DD4BF]/5"
                />
              </div>

              <p className="mt-2 font-manrope text-[9px] leading-4 text-[#607772]">
                Give the device a clear name that
                will help staff identify it.
              </p>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={
                    closeCreateModal
                  }
                  disabled={
                    isRegistering
                  }
                  className="h-9 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 font-manrope text-[10px] font-bold text-[#8FA8A2] transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isRegistering ||
                    !deviceName.trim()
                  }
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#2DD4BF] px-4 font-manrope text-[10px] font-extrabold text-[#06211D] transition hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Register device
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* Edit modal                                                         */}
      {/* ================================================================== */}

      {editingDevice && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-device-title"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeEditModal();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0B211E] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <div className="flex items-start justify-between border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.06] text-[#2DD4BF]">
                  <Edit3 className="h-4 w-4" />
                </div>

                <div>
                  <h2
                    id="edit-device-title"
                    className="font-manrope text-sm font-extrabold text-white"
                  >
                    Edit device
                  </h2>

                  <p className="mt-1 font-manrope text-[10px] text-[#718983]">
                    Update the device name or
                    monitoring status.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  closeEditModal
                }
                disabled={isUpdating}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[#647873] transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="p-5"
            >
              <div className="mb-4 rounded-xl border border-white/[0.05] bg-white/[0.015] px-3.5 py-3">
                <p className="font-manrope text-[8px] font-bold uppercase tracking-[0.12em] text-[#526A65]">
                  Device ID
                </p>

                <p className="mt-1 break-all font-mono text-[9px] text-[#80958F]">
                  {editingDevice.id}
                </p>
              </div>

              <label
                htmlFor="edit-device-name"
                className="font-manrope text-[10px] font-bold text-[#A9BBB7]"
              >
                Device name
              </label>

              <div className="relative mt-2">
                <Cpu className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#526A65]" />

                <input
                  id="edit-device-name"
                  type="text"
                  autoFocus
                  value={deviceName}
                  onChange={(event) =>
                    setDeviceName(
                      event.target.value
                    )
                  }
                  maxLength={100}
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#071A17] pl-9 pr-3 font-manrope text-xs text-white outline-none transition placeholder:text-[#526A65] focus:border-[#2DD4BF]/30 focus:ring-2 focus:ring-[#2DD4BF]/5"
                />
              </div>

              <div className="mt-5">
                <p className="font-manrope text-[10px] font-bold text-[#A9BBB7]">
                  Device status
                </p>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDeviceStatus(
                        "ACTIVE"
                      )
                    }
                    className={[
                      "flex items-center gap-2 rounded-xl border px-3 py-3 text-left transition",
                      deviceStatus ===
                      "ACTIVE"
                        ? "border-[#2DD4BF]/20 bg-[#2DD4BF]/[0.07]"
                        : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "flex h-7 w-7 items-center justify-center rounded-lg",
                        deviceStatus ===
                        "ACTIVE"
                          ? "bg-[#2DD4BF]/10 text-[#2DD4BF]"
                          : "bg-white/[0.04] text-[#607772]",
                      ].join(" ")}
                    >
                      <Wifi className="h-3.5 w-3.5" />
                    </div>

                    <div>
                      <p
                        className={[
                          "font-manrope text-[10px] font-bold",
                          deviceStatus ===
                          "ACTIVE"
                            ? "text-[#5EEAD4]"
                            : "text-[#8FA8A2]",
                        ].join(" ")}
                      >
                        Active
                      </p>

                      <p className="mt-0.5 font-manrope text-[8px] text-[#607772]">
                        Available
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeviceStatus(
                        "INACTIVE"
                      )
                    }
                    className={[
                      "flex items-center gap-2 rounded-xl border px-3 py-3 text-left transition",
                      deviceStatus ===
                      "INACTIVE"
                        ? "border-white/10 bg-white/[0.055]"
                        : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "flex h-7 w-7 items-center justify-center rounded-lg",
                        deviceStatus ===
                        "INACTIVE"
                          ? "bg-white/[0.07] text-[#9DB1AD]"
                          : "bg-white/[0.04] text-[#607772]",
                      ].join(" ")}
                    >
                      <WifiOff className="h-3.5 w-3.5" />
                    </div>

                    <div>
                      <p
                        className={[
                          "font-manrope text-[10px] font-bold",
                          deviceStatus ===
                          "INACTIVE"
                            ? "text-[#B5C3C0]"
                            : "text-[#8FA8A2]",
                        ].join(" ")}
                      >
                        Inactive
                      </p>

                      <p className="mt-0.5 font-manrope text-[8px] text-[#607772]">
                        Disabled
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={
                    closeEditModal
                  }
                  disabled={isUpdating}
                  className="h-9 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 font-manrope text-[10px] font-bold text-[#8FA8A2] transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isUpdating ||
                    !deviceName.trim()
                  }
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#2DD4BF] px-4 font-manrope text-[10px] font-extrabold text-[#06211D] transition hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* Delete confirmation                                                */}
      {/* ================================================================== */}

      {deletingDevice && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-device-title"
        >
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-red-400/10 bg-[#0B211E] shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
            <div className="p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/[0.06]">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>

              <h2
                id="delete-device-title"
                className="mt-4 font-manrope text-sm font-extrabold text-white"
              >
                Delete device?
              </h2>

              <p className="mt-2 font-manrope text-xs leading-5 text-[#718983]">
                You are about to permanently
                delete{" "}
                <span className="font-bold text-[#B8C9C5]">
                  {deletingDevice.deviceName}
                </span>
                . This action cannot be
                undone.
              </p>

              <div className="mt-4 rounded-xl border border-red-400/[0.08] bg-red-400/[0.025] px-3.5 py-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />

                  <p className="font-manrope text-[9px] leading-4 text-red-300/70">
                    Make sure this device is no
                    longer required for patient
                    monitoring before continuing.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDeletingDevice(
                      null
                    )
                  }
                  disabled={isDeleting}
                  className="h-9 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 font-manrope text-[10px] font-bold text-[#8FA8A2] transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleDelete
                  }
                  disabled={isDeleting}
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-red-400 px-4 font-manrope text-[10px] font-extrabold text-[#220807] transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete device
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}