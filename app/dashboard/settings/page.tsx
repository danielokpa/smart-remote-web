"use client";

import { useEffect, useState } from "react";
import { cngStationApi } from "@/lib/api";

interface UpdateFormData {
  name?: string;
  address?: string;
  openingTime?: string;
  closingTime?: string;
  amountPerUnit?: number;
  currency?: string;
  amountPerUnitType?: string;
  dispenserCount?: number;
  storageCapacity?: number;
  operatorName?: string;
  safetyCertifications?: string;
  isActive?: boolean;
}

export default function SettingsPage() {
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState<UpdateFormData>({});
  const [loading, setLoading] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Prevent background scroll when modal is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const closeModal = () => {
    setShowModal(false);
    setOtp("");
    setFormData({});
    setError("");
  };

  const handleRequestUpdate = async () => {
    setRequestingOtp(true);
    setError("");
    setSuccess("");

    try {
      const response = await cngStationApi.requestUpdate();

      if (response.success) {
        setSuccess("OTP sent to your email. Please check your inbox.");
        setShowModal(true);
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setRequestingOtp(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await cngStationApi.updateWithOtp(otp, formData);

      if (response.success) {
        setSuccess("Station information updated successfully!");
        closeModal();
      } else {
        setError(response.message || "Failed to update station information");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : Number(value),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full">
      {/* 🔧 Hide number spinners + hide scrollbars (scoped) */}
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

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-manrope font-bold text-[32px] md:text-[40px] leading-tight text-white mb-2">
          Station Settings
        </h1>
        <p className="font-manrope font-medium text-[15px] md:text-[16px] text-[#8E94A4]">
          Update your station information and details
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 rounded-full p-4 bg-green-500/20 border border-green-500/30">
          <p className="font-manrope font-medium text-[14px] text-green-400 text-center">
            {success}
          </p>
        </div>
      )}

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
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
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

              {/* ✅ Scrollable content (scrollbar hidden) */}
              <div className="relative z-10 max-h-[85vh] sm:max-h-[80vh] overflow-y-auto overscroll-contain pepp-scroll">
                {/* ✅ Sticky header stays at very top while scrolling */}
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
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Form body */}
                <form
                  onSubmit={handleUpdate}
                  className="px-5 sm:px-8 py-6 flex flex-col gap-6"
                >
                  {/* OTP Input */}
                  <div className="flex flex-col gap-2">
                    <label className="font-manrope font-semibold text-[14px] text-white">
                      OTP Code
                    </label>
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
                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">
                        Station Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleInputChange}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">
                        Opening Time (HH:mm)
                      </label>
                      <input
                        type="time"
                        name="openingTime"
                        value={formData.openingTime || ""}
                        onChange={handleInputChange}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">
                        Closing Time (HH:mm)
                      </label>
                      <input
                        type="time"
                        name="closingTime"
                        value={formData.closingTime || ""}
                        onChange={handleInputChange}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">
                        Amount Per Unit
                      </label>
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

                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={formData.currency || "NGN"}
                        onChange={handleInputChange}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      >
                        <option value="NGN">NGN</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">
                        Dispenser Count
                      </label>
                      <input
                        type="number"
                        name="dispenserCount"
                        value={formData.dispenserCount ?? ""}
                        onChange={handleInputChange}
                        min={0}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">
                        Storage Capacity (kg)
                      </label>
                      <input
                        type="number"
                        name="storageCapacity"
                        value={formData.storageCapacity ?? ""}
                        onChange={handleInputChange}
                        min={0}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">
                        Operator Name
                      </label>
                      <input
                        type="text"
                        name="operatorName"
                        value={formData.operatorName || ""}
                        onChange={handleInputChange}
                        className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label className="font-manrope font-semibold text-[14px] text-white">
                        Safety Certifications
                      </label>
                      <textarea
                        name="safetyCertifications"
                        value={formData.safetyCertifications || ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full rounded-2xl p-3 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive ?? true}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-white/20 bg-[#2d1f3f] text-[#762FB8] focus:ring-[#762FB8]"
                      />
                      <label className="font-manrope font-semibold text-[14px] text-white">
                        Station is Active
                      </label>
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
