"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cngStationApi, stationProfileApi, getStationLoginType, stationSettingsApi } from "@/lib/api";
import LocationPicker from "@/components/dashboard/settings/LocationPicker";
import { LoginType } from "@/enums/login-type.enum";

/** -----------------------------
 * Types
 * ------------------------------*/
type StationProfile = {
  name?: string;
  address?: string;
  latitude?: number | null,
  longitude?: number | null,
  placeId?: string | null,
  openingTime?: string; // "HH:mm"
  closingTime?: string; // "HH:mm"
  amountPerUnit?: number | null;
  currency?: string;
  amountPerUnitType?: string;
  dispenserCount?: number | null;
  storageCapacity?: number | null;
  operatorName?: string;
  safetyCertifications?: string;
  isActive?: boolean | null;
};

type UpdateFormData = {
  name?: string;
  address?: string;
  latitude?: number | null,
  longitude?: number | null,
  // placeId?: string | null,
  openingTime?: string;
  closingTime?: string;
  amountPerUnit?: number | null;
  currency?: string;
  amountPerUnitType?: string;
  dispenserCount?: number | null;
  storageCapacity?: number | null;
  // operatorName?: string;
  safetyCertifications?: string;
  isActive?: boolean;
};

type ToastState =
  | { type: "success" | "error"; message: string }
  | { type: null; message: "" };

/** -----------------------------
 * Helpers
 * ------------------------------*/
function normalizeString(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function normalizeNumber(v: any): number | null {
  if (v === "" || v === undefined) return null;
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function valuesEqual(a: any, b: any) {
  // handle null/undefined/empty string equivalences carefully for your form
  if (a === undefined) return b === undefined;
  if (b === undefined) return a === undefined;
  return a === b;
}

/**
 * Build a PATCH payload containing only changed fields
 */
function buildPatchPayload(
  baseline: StationProfile | null,
  current: UpdateFormData
): Partial<UpdateFormData> {
  if (!baseline) return current;

  const patch: Partial<UpdateFormData> = {};
  const keys = Object.keys(current) as (keyof UpdateFormData)[];

  for (const key of keys) {
    const cur = current[key];
    const base = (baseline as any)[key];

    // If user never touched it (unlikely since we prefill), skip.
    if (cur === undefined) continue;

    // Compare strictly
    if (!valuesEqual(cur, base)) {
      patch[key] = cur as any;
    }
  }

  return patch;
}

const ALLOWED_UPDATE_FIELDS: Record<LoginType, Array<keyof UpdateFormData>> = {
  [LoginType.CNG_STATION]: [
    "name",
    "address",
    "latitude",
    "longitude",
    "openingTime",
    "closingTime",
    "amountPerUnit",
    "currency",
    "amountPerUnitType",
    "dispenserCount",
    "storageCapacity",
    "safetyCertifications",
    "isActive",
  ],
  [LoginType.CNG_CONVERSION_STATION]: [
    "name",
    "address",
    "latitude",
    "longitude",
    "openingTime",
    "closingTime",
    "amountPerUnit",
    "currency",
    "amountPerUnitType",
    "dispenserCount",
    "storageCapacity",
    // "operatorName",
    "safetyCertifications",
    "isActive",
  ],
  [LoginType.EV_CHARGING_STATION]: [
    "name",
    "address",
    "latitude",
    "longitude",
    "openingTime",
    "closingTime",
    "amountPerUnit",
    "currency",
    "amountPerUnitType",
    "isActive",
  ],
};

function filterPayloadByStationType(
  stationType: LoginType | null,
  payload: Partial<UpdateFormData>
): Partial<UpdateFormData> {
  if (!stationType) return {};

  const allowedKeys = ALLOWED_UPDATE_FIELDS[stationType] ?? [];
  const filtered: Partial<UpdateFormData> = {};

  for (const key of allowedKeys) {
    const value = payload[key];

    if (value !== undefined) {
      filtered[key] = value;
    }
  }

  return filtered;
}

function removeEmptyValues(
  payload: Partial<UpdateFormData>
): Partial<UpdateFormData> {
  const cleaned: Partial<UpdateFormData> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue;

    if (typeof value === "string" && value.trim() === "") continue;

    cleaned[key as keyof UpdateFormData] = value as any;
  }

  return cleaned;
}

/** -----------------------------
 * Page
 * ------------------------------*/
export default function SettingsPage() {
  const [showModal, setShowModal] = useState(false);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);

  const [toast, setToast] = useState<ToastState>({ type: null, message: "" });

  const [station, setStation] = useState<StationProfile | null>(null);

  // editable form state (prefilled when modal opens)
  const [formData, setFormData] = useState<UpdateFormData>({});
  const [error, setError] = useState("");

  const toastTimerRef = useRef<number | null>(null);

  /** -----------------------------
   * Global styles (same as yours)
   * ------------------------------*/
  // 🔧 Hide number spinners + hide scrollbars (scoped)
  const GlobalStyles = useMemo(
    () => (
      <style jsx global>{`
        /* hide number input spinners (Chrome/Safari/Edge) */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /* hide number input spinners (Firefox) */
        input[type="number"] {
          -moz-appearance: textfield;
        }

        /* hide scrollbar but keep scroll */
        .pepp-scroll::-webkit-scrollbar {
          width: 0px;
          height: 0px;
        }
        .pepp-scroll {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge legacy */
        }
      `}</style>
    ),
    []
  );

  /** -----------------------------
   * Toast helpers
   * ------------------------------*/
  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });

    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToast({ type: null, message: "" });
    }, 4000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  /** -----------------------------
   * Prevent background scroll when modal open
   * ------------------------------*/
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  /** -----------------------------
   * Fetch station profile (same API as profile page)
   * ------------------------------*/
  const fetchStationProfile = useCallback(async () => {
    setError("");
    try {
      const res = await stationProfileApi.getProfile();

      if (res.success && res.data) {
        // Your API might wrap data differently (res.data.data). If so, adjust:
        const payload = res.data;
        console.log('Payload: ', payload);
        setStation(payload as StationProfile);
        return payload as StationProfile;
      } else {
        setError(res.message || "Failed to load station profile.");
        return null;
      }
    } catch {
      setError("An error occurred while loading station profile.");
      return null;
    }
  }, []);

  useEffect(() => {
    // load once for the page (so modal can instantly prefill)
    fetchStationProfile();
  }, [fetchStationProfile]);

  /** -----------------------------
   * Prefill modal form when opening
   * ------------------------------*/
  const openModalWithPrefill = useCallback(
    async (ensureFresh = false) => {
      const base = ensureFresh ? await fetchStationProfile() : station;

      const s = base || station;

      // prefill controlled values
      setFormData({
        name: normalizeString(s?.name),
        address: normalizeString(s?.address),
        latitude: normalizeNumber(s?.latitude),
        longitude: normalizeNumber(s?.longitude),
        // placeId: s?.placeId ?? null,
        openingTime: normalizeString(s?.openingTime),
        closingTime: normalizeString(s?.closingTime),
        amountPerUnit:
          s?.amountPerUnit === undefined ? null : (s?.amountPerUnit ?? null),
        currency: normalizeString(s?.currency || "NGN") || "NGN",
        amountPerUnitType: normalizeString(s?.amountPerUnitType),
        dispenserCount:
          s?.dispenserCount === undefined ? null : (s?.dispenserCount ?? null),
        storageCapacity:
          s?.storageCapacity === undefined ? null : (s?.storageCapacity ?? null),
        operatorName: normalizeString(s?.operatorName),
        safetyCertifications: normalizeString(s?.safetyCertifications),
        isActive: s?.isActive ?? true,
      });

      setOtp("");
      setError("");
      setShowModal(true);
    },
    [fetchStationProfile, station]
  );

  const closeModal = () => {
    setShowModal(false);
    setOtp("");
    setFormData({});
    setError("");
  };

  /** -----------------------------
   * Request OTP
   * ------------------------------*/
  const handleRequestUpdate = async () => {
    setRequestingOtp(true);
    setError("");

    try {
      const response = await stationSettingsApi.requestUpdate();

      if (response.success) {
        // ✅ toast above everything (z-index fixed)
        showToast("success", "OTP sent to your email. Please check your inbox.");

        // Open modal with prefills
        openModalWithPrefill(false);
      } else {
        setError(response.message || "Failed to send OTP");
        showToast("error", response.message || "Failed to send OTP");
      }
    } catch {
      setError("An error occurred. Please try again.");
      showToast("error", "An error occurred. Please try again.");
    } finally {
      setRequestingOtp(false);
    }
  };

  /** -----------------------------
   * Update with OTP (send only changed fields)
   * ------------------------------*/
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    const stationType = getStationLoginType();

    // Only send modified fields
    const patch = buildPatchPayload(station, formData);

    // Step 2: keep only fields allowed for this station type
    const typeSafePatch = filterPayloadByStationType(stationType, patch);

    // Step 3: remove empty/blank values
    const finalPatch = removeEmptyValues(typeSafePatch);

    if (Object.keys(finalPatch).length === 0) {
      showToast("error", "No valid changes detected for this station type. Please edit at least one field.");
      setLoading(false);
      return;
    }

    try {
      const response = await stationSettingsApi.updateWithOtp(otp, finalPatch);

      if (response.success) {
        showToast("success", "Station information updated successfully!");
        closeModal();

        // Refresh station profile so next edit reflects updated data
        await fetchStationProfile();
      } else {
        setError(response.message || "Failed to update station information");
        showToast("error", response.message || "Failed to update station information");
      }
    } catch {
      setError("An error occurred. Please try again.");
      showToast("error", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /** -----------------------------
   * Input handler
   * ------------------------------*/
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (type === "number") {
      // Keep "cleared" as null so diff detects it
      const num = value === "" ? null : Number(value);
      setFormData((prev) => ({
        ...prev,
        [name]: Number.isFinite(num as number) ? (num as number) : null,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** -----------------------------
   * Render
   * ------------------------------*/
  return (
    <div className="w-full">
      {GlobalStyles}

      {/* ✅ Toast (always above modal + fields) */}
      {toast.type && (
        <div className="fixed top-4 left-0 right-0 z-[9999] flex justify-center px-4">
          <div
            className={[
              "w-full max-w-[760px] rounded-full border px-4 py-3 shadow-2xl backdrop-blur-md",
              toast.type === "success"
                ? "bg-green-500/20 border-green-500/30"
                : "bg-red-500/20 border-red-500/30",
            ].join(" ")}
            role="status"
          >
            <p
              className={[
                "font-manrope font-medium text-[14px] text-center",
                toast.type === "success" ? "text-green-300" : "text-red-300",
              ].join(" ")}
            >
              {toast.message}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-manrope font-bold text-[32px] md:text-[40px] leading-tight text-white mb-2">
          Station Settings
        </h1>
        <p className="font-manrope font-medium text-[15px] md:text-[16px] text-[#8E94A4]">
          Update your station information and details
        </p>
      </div>

      {/* Inline error (page level) */}
      {error && (
        <div className="mb-6 rounded-full p-4 bg-red-500/20 border border-red-500/30">
          <p className="font-manrope font-medium text-[14px] text-red-400 text-center">
            {error}
          </p>
        </div>
      )}

      {/* Request Update Button */}
      <div className="mb-8">
        <button
          onClick={handleRequestUpdate}
          disabled={requestingOtp}
          className="rounded-full px-6 py-3 bg-gradient-to-r from-[#762FB8] to-[#9B4DE0] text-white font-manrope font-bold text-[16px] hover:from-[#8A3AC7] hover:to-[#AB5DF0] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {requestingOtp ? "Requesting..." : "Request Update"}
        </button>
      </div>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
          {/* Center container */}
          <div className="h-full w-full p-4 sm:p-6 flex items-start justify-center overflow-y-auto pepp-scroll">
            {/* Modal card */}
            <div className="relative w-full max-w-[640px] rounded-2xl bg-[#251a34] border border-white/10 shadow-2xl my-6 overflow-hidden">
              {/* Gradient overlay */}
              <div
                className="absolute w-[60%] aspect-square top-16 right-0 opacity-50 rounded-full blur-[100px] z-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(45.33% 45.33% at 50% 50%, #8A25E9 0%, rgba(117,31,198,0.656447) 38.28%, rgba(78,21,131,0) 100%)",
                }}
              />

              {/* Scrollable content */}
              <div className="relative z-10 max-h-[85vh] sm:max-h-[80vh] overflow-y-auto overscroll-contain pepp-scroll">
                {/* Sticky header */}
                <div className="sticky top-0 z-30 bg-[#251a34]/92 backdrop-blur-md border-b border-white/10">
                  <div className="px-5 sm:px-8 py-4 flex items-center justify-between">
                    <h2 className="font-manrope font-bold text-[18px] sm:text-[24px] text-white">
                      Update Station Information
                    </h2>

                    <button
                      type="button"
                      onClick={closeModal}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[#8E94A4] hover:text-white hover:bg-white/5 transition-colors"
                      aria-label="Close"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Form body */}
                <form onSubmit={handleUpdate} className="px-5 sm:px-8 py-6 flex flex-col gap-6">
                  {/* OTP Input */}
                  <div className="flex flex-col gap-2">
                    <label className="font-manrope font-semibold text-[14px] text-white">OTP Code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setOtp(value);
                      }}
                      required
                      maxLength={6}
                      className="w-full rounded-full p-4 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[20px] text-center tracking-widest outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                    />
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">Station Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name ?? ""}
                        onChange={handleInputChange}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div>

                    {/* Address */}
                    {/* <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address ?? ""}
                        onChange={handleInputChange}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div> */}
                    <div className="sm:col-span-2">
                      <LocationPicker
                        value={{
                          address: formData.address ?? "",
                          latitude: formData.latitude ?? null,
                          longitude: formData.longitude ?? null,
                          placeId: formData.placeId ?? null,
                        }}
                        onChange={(next) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: next.address,
                            latitude: next.latitude,
                            longitude: next.longitude,
                            placeId: next.placeId,
                          }))
                        }
                      />
                    </div>

                    {/* Opening time */}
                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">Opening Time</label>
                      <input
                        type="time"
                        name="openingTime"
                        value={formData.openingTime ?? ""}
                        onChange={handleInputChange}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div>

                    {/* Closing time */}
                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">Closing Time</label>
                      <input
                        type="time"
                        name="closingTime"
                        value={formData.closingTime ?? ""}
                        onChange={handleInputChange}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">Amount Per Unit</label>
                      <input
                        type="number"
                        name="amountPerUnit"
                        value={formData.amountPerUnit ?? ""}
                        onChange={handleInputChange}
                        step="0.01"
                        inputMode="decimal"
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div>

                    {/* Currency */}
                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">Currency</label>
                      <select
                        name="currency"
                        value={formData.currency ?? "NGN"}
                        onChange={handleInputChange}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      >
                        <option value="NGN">NGN</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>

                    {/* Dispenser */}
                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">Dispenser Count</label>
                      <input
                        type="number"
                        name="dispenserCount"
                        value={formData.dispenserCount ?? ""}
                        onChange={handleInputChange}
                        min={0}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div>

                    {/* Storage */}
                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">Storage Capacity (kg)</label>
                      <input
                        type="number"
                        name="storageCapacity"
                        value={formData.storageCapacity ?? ""}
                        onChange={handleInputChange}
                        min={0}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div>

                    {/* Operator */}
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">Operator Name</label>
                      <input
                        type="text"
                        name="operatorName"
                        value={formData.operatorName ?? ""}
                        onChange={handleInputChange}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div>

                    {/* Safety */}
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">Safety Certifications</label>
                      <textarea
                        name="safetyCertifications"
                        value={formData.safetyCertifications ?? ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full rounded-2xl p-3 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all resize-none"
                      />
                    </div>

                    {/* Active */}
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive ?? true}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-white/20 bg-[#2d1f3f] text-[#762FB8] focus:ring-[#762FB8]"
                      />
                      <label className="font-manrope font-semibold text-[14px] text-white">Station is Active</label>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="flex-1 rounded-full p-4 bg-gradient-to-r from-[#762FB8] to-[#9B4DE0] text-white font-manrope font-bold text-[16px] hover:from-[#8A3AC7] hover:to-[#AB5DF0] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {loading ? "Updating..." : "Update Station"}
                    </button>

                    <button
                      type="button"
                      onClick={closeModal}
                      className="sm:w-[160px] px-6 py-4 rounded-full border border-white/20 text-white font-manrope font-semibold text-[14px] hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="h-2" />
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
