"use client";

import {
  AlertCircle,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  ClipboardList,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { usePatients } from "@/lib/hooks/patients/usePatients";

import type {
  RegisterPatientPayload,
} from "@/lib/types/patients/types";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(date: string) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getInitials(
  firstName: string,
  lastName: string
) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`
    .toUpperCase();
}

function getPatientName(
  firstName: string,
  lastName: string
) {
  return `${firstName} ${lastName}`.trim();
}

/* -------------------------------------------------------------------------- */
/* Loading skeleton                                                           */
/* -------------------------------------------------------------------------- */

function PatientRowSkeleton() {
  return (
    <div className="animate-pulse border-b border-white/[0.06] px-5 py-4 last:border-b-0">
      <div className="grid grid-cols-[minmax(220px,1.7fr)_1fr_1.2fr_1fr_40px] items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/[0.06]" />

          <div className="space-y-2">
            <div className="h-3.5 w-32 rounded bg-white/[0.06]" />
            <div className="h-2.5 w-20 rounded bg-white/[0.04]" />
          </div>
        </div>

        <div className="h-3 w-24 rounded bg-white/[0.05]" />
        <div className="h-3 w-32 rounded bg-white/[0.05]" />
        <div className="h-3 w-20 rounded bg-white/[0.05]" />
        <div className="h-8 w-8 rounded-lg bg-white/[0.05]" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile patient card                                                        */
/* -------------------------------------------------------------------------- */

interface PatientCardProps {
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    contact: string;
  };
  onOpen: (id: string) => void;
}

function PatientCard({
  patient,
  onOpen,
}: PatientCardProps) {
  const fullName = getPatientName(
    patient.firstName,
    patient.lastName
  );

  return (
    <button
      type="button"
      onClick={() => onOpen(patient.id)}
      className="group w-full border-b border-white/[0.06] px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-white/[0.025]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.08]">
            <span className="font-manrope text-[11px] font-bold text-[#2DD4BF]">
              {getInitials(
                patient.firstName,
                patient.lastName
              )}
            </span>
          </div>

          <div className="min-w-0">
            <p className="truncate font-manrope text-sm font-bold text-white">
              {fullName}
            </p>

            <p className="mt-0.5 truncate font-manrope text-[11px] text-[#8FA8A2]">
              {patient.contact}
            </p>
          </div>
        </div>

        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#8FA8A2] transition-transform group-hover:translate-x-0.5 group-hover:text-[#2DD4BF]" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
          <p className="font-manrope text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8FA8A2]/70">
            Date of birth
          </p>

          <p className="mt-1 font-manrope text-[11px] font-semibold text-white/80">
            {formatDate(patient.dateOfBirth)}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
          <p className="font-manrope text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8FA8A2]/70">
            Gender
          </p>

          <p className="mt-1 font-manrope text-[11px] font-semibold capitalize text-white/80">
            {patient.gender || "—"}
          </p>
        </div>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Registration modal                                                         */
/* -------------------------------------------------------------------------- */

interface RegisterPatientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    payload: RegisterPatientPayload
  ) => Promise<unknown>;
  isSubmitting: boolean;
  error: unknown;
}

function RegisterPatientModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: RegisterPatientModalProps) {
  const [form, setForm] =
    useState<RegisterPatientPayload>({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      contact: "",
    });

  const [formError, setFormError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setForm({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        contact: "",
      });

      setFormError(null);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const updateField = (
    field: keyof RegisterPatientPayload,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (formError) {
      setFormError(null);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const gender = form.gender.trim();
    const contact = form.contact.trim();

    if (
      !firstName ||
      !lastName ||
      !form.dateOfBirth ||
      !gender ||
      !contact
    ) {
      setFormError(
        "Please complete all required fields."
      );
      return;
    }

    try {
      await onSubmit({
        firstName,
        lastName,
        dateOfBirth: form.dateOfBirth,
        gender,
        contact,
      });

      toast.success("Patient registered successfully.");
      onClose();
    } catch {
      // The mutation error is displayed inside the modal.
    }
  };

  const mutationErrorMessage =
    error instanceof Error
      ? error.message
      : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          if (!isSubmitting) {
            onClose();
          }
        }
      }}
    >
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/[0.08] bg-[#0B211D] shadow-2xl shadow-black/40">
        {/* Modal header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/[0.06] bg-[#0B211D]/95 px-5 py-5 backdrop-blur-xl sm:px-6">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/[0.08]">
              <UserPlus className="h-4.5 w-4.5 text-[#2DD4BF]" />
            </div>

            <div>
              <h2 className="font-manrope text-base font-bold text-white">
                Register patient
              </h2>

              <p className="mt-1 max-w-sm font-manrope text-[11px] leading-relaxed text-[#8FA8A2]">
                Add a new patient to the Remote Care
                monitoring system.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8FA8A2] transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5 sm:p-6"
        >
          {(formError || mutationErrorMessage) && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-400/10 bg-red-400/[0.05] px-4 py-3.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-400/10">
                <AlertCircle className="h-3.5 w-3.5 text-red-400" />
              </div>

              <div>
                <p className="font-manrope text-[11px] font-bold text-red-300">
                  Unable to register patient
                </p>

                <p className="mt-0.5 font-manrope text-[10px] leading-relaxed text-red-300/70">
                  {formError ??
                    mutationErrorMessage ??
                    "Please check the information and try again."}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* First name */}
            <FormField
              label="First name"
              required
            >
              <input
                type="text"
                value={form.firstName}
                onChange={(event) =>
                  updateField(
                    "firstName",
                    event.target.value
                  )
                }
                placeholder="John"
                disabled={isSubmitting}
                autoComplete="given-name"
                className="form-input"
              />
            </FormField>

            {/* Last name */}
            <FormField
              label="Last name"
              required
            >
              <input
                type="text"
                value={form.lastName}
                onChange={(event) =>
                  updateField(
                    "lastName",
                    event.target.value
                  )
                }
                placeholder="Doe"
                disabled={isSubmitting}
                autoComplete="family-name"
                className="form-input"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Date of birth */}
            <FormField
              label="Date of birth"
              required
            >
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(event) =>
                  updateField(
                    "dateOfBirth",
                    event.target.value
                  )
                }
                disabled={isSubmitting}
                className="form-input"
              />
            </FormField>

            {/* Gender */}
            <FormField
              label="Gender"
              required
            >
              <select
                value={form.gender}
                onChange={(event) =>
                  updateField(
                    "gender",
                    event.target.value
                  )
                }
                disabled={isSubmitting}
                className="form-input"
              >
                <option value="">
                  Select gender
                </option>
                <option value="Male">
                  Male
                </option>
                <option value="Female">
                  Female
                </option>
                <option value="Other">
                  Other
                </option>
              </select>
            </FormField>
          </div>

          {/* Contact */}
          <FormField
            label="Contact"
            required
            hint="Use the patient's primary phone number."
          >
            <input
              type="tel"
              value={form.contact}
              onChange={(event) =>
                updateField(
                  "contact",
                  event.target.value
                )
              }
              placeholder="+2348012345678"
              disabled={isSubmitting}
              autoComplete="tel"
              className="form-input"
            />
          </FormField>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2.5 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 rounded-xl border border-white/[0.08] px-5 font-manrope text-[11px] font-bold text-[#8FA8A2] transition-colors hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 font-manrope text-[11px] font-bold text-[#06201C] transition-all hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" />
                  Register patient
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Form field                                                                 */
/* -------------------------------------------------------------------------- */

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function FormField({
  label,
  required,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block font-manrope text-[10px] font-bold uppercase tracking-[0.1em] text-[#8FA8A2]">
        {label}
        {required && (
          <span className="ml-1 text-[#2DD4BF]">
            *
          </span>
        )}
      </label>

      {children}

      {hint && (
        <p className="mt-1.5 font-manrope text-[9px] text-[#8FA8A2]/60">
          {hint}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main page                                                                  */
/* -------------------------------------------------------------------------- */

export default function PatientsPage() {
  const router = useRouter();

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [cursor, setCursor] =
    useState<string | undefined>(undefined);

  const [registerModalOpen, setRegisterModalOpen] =
    useState(false);

  /*
   * Debounce search.
   *
   * Whenever the search term changes, pagination starts
   * again from the beginning. We never reuse an old cursor
   * with a different search query.
   */
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const normalizedSearch =
        searchInput.trim();

      setCursor(undefined);
      setSearch(normalizedSearch);
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput]);

  const queryParams = useMemo(
    () => ({
      limit: 20,
      ...(search
        ? { search }
        : {}),
      ...(cursor
        ? { cursor }
        : {}),
    }),
    [search, cursor]
  );

  const {
    patients,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    registerPatient,
    isRegistering,
    registerError,
    refetch,
  } = usePatients(queryParams);

  const openPatient = (id: string) => {
    router.push(
      `/dashboard/patients/${id}`
    );
  };

  const handleNextPage = () => {
    if (
      !pagination.hasNextPage ||
      !pagination.nextCursor
    ) {
      return;
    }

    setCursor(
      pagination.nextCursor
    );
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const hasPatients = patients.length > 0;
  const isInitialLoading =
    isLoading && !hasPatients;

  return (
    <>
      <div className="w-full">
        <DashboardHeader
          userName="there"
          userType={undefined}
        />

        {/* ---------------------------------------------------------------- */}
        {/* Page heading                                                      */}
        {/* ---------------------------------------------------------------- */}

        <section className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.06]">
                  <Users className="h-3.5 w-3.5 text-[#2DD4BF]" />
                </div>

                <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.14em] text-[#2DD4BF]/80">
                  Patient management
                </span>
              </div>

              <h1 className="font-manrope text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                Patients
              </h1>

              <p className="mt-1.5 max-w-xl font-manrope text-[11px] leading-relaxed text-[#8FA8A2]">
                Manage registered patients and access
                their remote health monitoring records.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setRegisterModalOpen(true)
              }
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-4 font-manrope text-[11px] font-bold text-[#06201C] shadow-lg shadow-[#2DD4BF]/10 transition-all hover:bg-[#5EEAD4] hover:shadow-[#2DD4BF]/15"
            >
              <Plus className="h-4 w-4" />
              Add patient
            </button>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Quick context cards                                              */}
        {/* ---------------------------------------------------------------- */}

        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.07] bg-[#0E2723] px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#8FA8A2]/70">
                  Current results
                </p>

                <p className="mt-1.5 font-manrope text-xl font-extrabold text-white">
                  {isInitialLoading
                    ? "—"
                    : patients.length}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2DD4BF]/[0.07]">
                <Users className="h-4 w-4 text-[#2DD4BF]" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#0E2723] px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#8FA8A2]/70">
                  Page size
                </p>

                <p className="mt-1.5 font-manrope text-xl font-extrabold text-white">
                  {pagination.limit}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">
                <ClipboardList className="h-4 w-4 text-[#8FA8A2]" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#0E2723] px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#8FA8A2]/70">
                  Directory status
                </p>

                <p className="mt-1.5 font-manrope text-sm font-extrabold text-white">
                  {isError
                    ? "Unavailable"
                    : isFetching
                      ? "Updating..."
                      : "Up to date"}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">
                <ShieldCheck className="h-4 w-4 text-[#8FA8A2]" />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Main patients panel                                              */}
        {/* ---------------------------------------------------------------- */}

        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0E2723]">
          {/* Toolbar */}
          <div className="border-b border-white/[0.06] p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8FA8A2]/70" />

                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => {
                    setSearchInput(
                      event.target.value
                    );
                  }}
                  placeholder="Search by name or contact..."
                  className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#071A17] pl-10 pr-10 font-manrope text-[11px] text-white outline-none placeholder:text-[#8FA8A2]/45 transition-colors focus:border-[#2DD4BF]/30 focus:ring-2 focus:ring-[#2DD4BF]/[0.06]"
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setSearch("");
                      setCursor(undefined);
                    }}
                    className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md text-[#8FA8A2] transition-colors hover:bg-white/[0.05] hover:text-white"
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="font-manrope text-[10px] text-[#8FA8A2]">
                  {search ? (
                    <>
                      Results for{" "}
                      <span className="font-semibold text-white/80">
                        “{search}”
                      </span>
                    </>
                  ) : (
                    "All registered patients"
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isFetching}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-[#8FA8A2] transition-colors hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Refresh patients"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${
                      isFetching
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Error state */}
          {isError && (
            <div className="flex min-h-[320px] items-center justify-center px-5 py-12">
              <div className="flex max-w-md flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/[0.06]">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>

                <h3 className="mt-4 font-manrope text-sm font-bold text-white">
                  Unable to load patients
                </h3>

                <p className="mt-1.5 font-manrope text-[11px] leading-relaxed text-[#8FA8A2]">
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong while retrieving the patient directory."}
                </p>

                <button
                  type="button"
                  onClick={handleRefresh}
                  className="mt-5 inline-flex h-9 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 font-manrope text-[10px] font-bold text-white transition-colors hover:bg-white/[0.06]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Desktop table */}
          {!isError && (
            <>
              <div className="hidden md:block">
                <div className="grid grid-cols-[minmax(220px,1.7fr)_1fr_1.2fr_1fr_40px] items-center gap-4 border-b border-white/[0.06] bg-white/[0.015] px-5 py-3">
                  <TableHeading>
                    Patient
                  </TableHeading>

                  <TableHeading>
                    Date of birth
                  </TableHeading>

                  <TableHeading>
                    Contact
                  </TableHeading>

                  <TableHeading>
                    Gender
                  </TableHeading>

                  <span />
                </div>

                {isInitialLoading ? (
                  <>
                    <PatientRowSkeleton />
                    <PatientRowSkeleton />
                    <PatientRowSkeleton />
                    <PatientRowSkeleton />
                    <PatientRowSkeleton />
                  </>
                ) : hasPatients ? (
                  patients.map((patient) => {
                    const fullName =
                      getPatientName(
                        patient.firstName,
                        patient.lastName
                      );

                    return (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() =>
                          openPatient(
                            patient.id
                          )
                        }
                        className="group grid w-full grid-cols-[minmax(220px,1.7fr)_1fr_1.2fr_1fr_40px] items-center gap-4 border-b border-white/[0.06] px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-white/[0.025]"
                      >
                        {/* Patient */}
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.07]">
                            <span className="font-manrope text-[10px] font-extrabold text-[#2DD4BF]">
                              {getInitials(
                                patient.firstName,
                                patient.lastName
                              )}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-manrope text-[12px] font-bold text-white">
                              {fullName}
                            </p>

                            <p className="mt-0.5 truncate font-manrope text-[9px] text-[#8FA8A2]/70">
                              ID:{" "}
                              {patient.id.slice(
                                0,
                                8
                              )}
                              ...
                            </p>
                          </div>
                        </div>

                        {/* Date of birth */}
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#8FA8A2]/60" />

                          <span className="font-manrope text-[10px] font-medium text-[#D5E2DE]">
                            {formatDate(
                              patient.dateOfBirth
                            )}
                          </span>
                        </div>

                        {/* Contact */}
                        <div className="min-w-0">
                          <span className="block truncate font-manrope text-[10px] font-medium text-[#D5E2DE]">
                            {patient.contact}
                          </span>
                        </div>

                        {/* Gender */}
                        <div>
                          <span className="inline-flex items-center rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 font-manrope text-[9px] font-semibold capitalize text-[#B8C9C4]">
                            {patient.gender ||
                              "—"}
                          </span>
                        </div>

                        {/* Action */}
                        <div className="flex justify-end">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8FA8A2]/60 transition-all group-hover:bg-[#2DD4BF]/[0.07] group-hover:text-[#2DD4BF]">
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <EmptyPatientsState
                    hasSearch={Boolean(search)}
                    onAddPatient={() =>
                      setRegisterModalOpen(
                        true
                      )
                    }
                  />
                )}
              </div>

              {/* Mobile cards */}
              <div className="md:hidden">
                {isInitialLoading ? (
                  <div className="animate-pulse space-y-0">
                    {[1, 2, 3, 4].map(
                      (item) => (
                        <div
                          key={item}
                          className="border-b border-white/[0.06] px-4 py-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/[0.06]" />

                            <div className="space-y-2">
                              <div className="h-3 w-28 rounded bg-white/[0.06]" />
                              <div className="h-2.5 w-20 rounded bg-white/[0.04]" />
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="h-14 rounded-xl bg-white/[0.03]" />
                            <div className="h-14 rounded-xl bg-white/[0.03]" />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : hasPatients ? (
                  patients.map((patient) => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      onOpen={openPatient}
                    />
                  ))
                ) : (
                  <EmptyPatientsState
                    hasSearch={Boolean(search)}
                    onAddPatient={() =>
                      setRegisterModalOpen(
                        true
                      )
                    }
                  />
                )}
              </div>
            </>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* Pagination                                                       */}
          {/* ---------------------------------------------------------------- */}

          {!isError &&
            !isInitialLoading &&
            (hasPatients ||
              pagination.hasNextPage) && (
              <div className="flex flex-col gap-3 border-t border-white/[0.06] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="font-manrope text-[9px] text-[#8FA8A2]/70">
                  Showing{" "}
                  <span className="font-semibold text-white/80">
                    {patients.length}
                  </span>{" "}
                  patient
                  {patients.length === 1
                    ? ""
                    : "s"} on this page
                </p>

                <div className="flex items-center justify-end gap-2">
                  {isFetching && (
                    <div className="mr-1 flex items-center gap-1.5 font-manrope text-[9px] text-[#8FA8A2]">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Updating
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={
                      !pagination.hasNextPage ||
                      !pagination.nextCursor ||
                      isFetching
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 font-manrope text-[10px] font-bold text-[#D5E2DE] transition-colors hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Supporting information                                            */}
        {/* ---------------------------------------------------------------- */}

        <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <InfoCard
            icon={
              <CircleUserRound className="h-4 w-4" />
            }
            title="Patient profiles"
            description="Maintain essential patient information in one place."
          />

          <InfoCard
            icon={
              <Stethoscope className="h-4 w-4" />
            }
            title="Remote monitoring"
            description="Access health readings and alerts from patient records."
          />

          <InfoCard
            icon={
              <ShieldCheck className="h-4 w-4" />
            }
            title="Secure records"
            description="Patient information is retrieved directly from the protected API."
          />
        </section>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Registration modal                                                 */}
      {/* ------------------------------------------------------------------ */}

      <RegisterPatientModal
        open={registerModalOpen}
        onClose={() =>
          setRegisterModalOpen(false)
        }
        onSubmit={registerPatient}
        isSubmitting={isRegistering}
        error={registerError}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Page-local styles                                                   */}
      {/* ------------------------------------------------------------------ */}

      <style jsx global>{`
        .form-input {
          width: 100%;
          height: 42px;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #071a17;
          padding: 0 0.875rem;
          font-family: var(--font-manrope), sans-serif;
          font-size: 11px;
          color: white;
          outline: none;
          transition:
            border-color 150ms ease,
            box-shadow 150ms ease;
        }

        .form-input::placeholder {
          color: rgba(143, 168, 162, 0.4);
        }

        .form-input:focus {
          border-color: rgba(45, 212, 191, 0.3);
          box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.06);
        }

        .form-input:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        select.form-input {
          appearance: none;
          cursor: pointer;
        }

        input[type="date"].form-input {
          color-scheme: dark;
        }
      `}</style>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Table heading                                                              */
/* -------------------------------------------------------------------------- */

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#8FA8A2]/65">
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                */
/* -------------------------------------------------------------------------- */

function EmptyPatientsState({
  hasSearch,
  onAddPatient,
}: {
  hasSearch: boolean;
  onAddPatient: () => void;
}) {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-5 py-12">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.05]">
          <Users className="h-6 w-6 text-[#2DD4BF]/80" />

          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#0E2723] bg-[#2DD4BF]">
            {hasSearch ? (
              <Search className="h-2.5 w-2.5 text-[#06201C]" />
            ) : (
              <Plus className="h-2.5 w-2.5 text-[#06201C]" />
            )}
          </div>
        </div>

        <h3 className="mt-4 font-manrope text-sm font-bold text-white">
          {hasSearch
            ? "No patients found"
            : "No patients registered yet"}
        </h3>

        <p className="mt-1.5 font-manrope text-[11px] leading-relaxed text-[#8FA8A2]">
          {hasSearch
            ? "Try adjusting your search term or clear the search to view all patients."
            : "Register your first patient to begin managing their remote care records."}
        </p>

        {hasSearch ? (
          <p className="mt-3 font-manrope text-[9px] text-[#8FA8A2]/60">
            Search supports patient names and contact
            numbers.
          </p>
        ) : (
          <button
            type="button"
            onClick={onAddPatient}
            className="mt-5 inline-flex h-9 items-center gap-2 rounded-xl bg-[#2DD4BF] px-4 font-manrope text-[10px] font-bold text-[#06201C] transition-colors hover:bg-[#5EEAD4]"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Register patient
          </button>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Info card                                                                  */
/* -------------------------------------------------------------------------- */

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0E2723]/60 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.035] text-[#8FA8A2]">
          {icon}
        </div>

        <div>
          <p className="font-manrope text-[10px] font-bold text-white/85">
            {title}
          </p>

          <p className="mt-1 font-manrope text-[9px] leading-relaxed text-[#8FA8A2]/70">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
