// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Image from "next/image";
// import { useStationApi } from "@/lib/hooks/stations/useStationApi";

// type StationProfile = {
//   id: string;
//   name: string;
//   state: string;
//   country: string;
//   address: string;
//   contactPhone: string;
//   contactEmail: string;

//   // ✅ Aggregates (recommended)
//   averageRating?: number;
//   totalRatings?: number;
//   totalReviews?: number;

//   // ✅ Backward compatible (if backend still returns these)
//   rating: number; // avg rating
//   reviews: number; // total reviews

//   openingTime: string;
//   closingTime: string;

//   amountPerUnit: number | string;
//   currency: string;
//   amountPerUnitType: string;

//   isActive: boolean;

//   longitude?: number | string | null;
//   latitude?: number | string | null;

//   stationImage?: string | null;

//   dispenserCount?: number | null;
//   storageCapacity?: number | null;
//   safetyCertifications?: string | null;

//   createdAt: string | Date;
//   updatedAt: string | Date;
// };

// function formatDate(value: string | Date) {
//   const d = typeof value === "string" ? new Date(value) : value;
//   if (Number.isNaN(d.getTime())) return String(value);
//   return d.toLocaleString();
// }

// function safeText(v: unknown, fallback = "—") {
//   if (v === null || v === undefined) return fallback;
//   if (typeof v === "string" && v.trim() === "") return fallback;
//   return String(v);
// }

// function clamp(n: number, min: number, max: number) {
//   return Math.min(max, Math.max(min, n));
// }

// function formatRating(n?: number) {
//   const v = typeof n === "number" && !Number.isNaN(n) ? n : 0;
//   return v.toFixed(1);
// }

// export default function ProfilePage() {
//   const [station, setStation] = useState<StationProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const api = useStationApi();

//   const statusPill = useMemo(() => {
//     const active = station?.isActive ?? false;
//     return active
//       ? "bg-green-500/15 border border-green-500/30 text-green-300"
//       : "bg-red-500/15 border border-red-500/30 text-red-300";
//   }, [station?.isActive]);

//   const ratingPack = useMemo(() => {
//     const avg =
//       typeof station?.averageRating === "number"
//         ? station.averageRating
//         : typeof station?.rating === "number"
//         ? station.rating
//         : 0;

//     const totalRatings =
//       typeof station?.totalRatings === "number" ? station.totalRatings : 0;

//     const totalReviews =
//       typeof station?.totalReviews === "number"
//         ? station.totalReviews
//         : typeof station?.reviews === "number"
//         ? station.reviews
//         : 0;

//     const starPct = (clamp(avg, 0, 5) / 5) * 100;

//     return { avg, totalRatings, totalReviews, starPct };
//   }, [station]);

//   useEffect(() => {
//     let mounted = true;

//     const run = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const res = await api.getProfile();

//         if (!mounted) return;

//         if (res.success && res.data) {
//           setStation(res.data as StationProfile);
//         } else {
//           setError(res.message || "Failed to load station profile.");
//         }
//       } catch (e) {
//         if (!mounted) return;
//         setError("An error occurred while loading profile.");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     run();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   return (
//     <div className="w-full">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="font-manrope font-bold text-[32px] md:text-[40px] leading-tight text-white mb-2">
//           Station Profile
//         </h1>
//         <p className="font-manrope font-medium text-[15px] md:text-[16px] text-[#8E94A4]">
//           View your station details and operational info
//         </p>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="mb-6 rounded-2xl p-4 bg-red-500/15 border border-red-500/30">
//           <p className="font-manrope font-medium text-[14px] text-red-300 text-center">
//             {error}
//           </p>
//         </div>
//       )}

//       {/* Loading */}
//       {loading && (
//         <div className="rounded-2xl bg-[#251a34] border border-white/10 p-6 md:p-8 shadow-2xl">
//           <div className="flex items-start gap-4">
//             <div className="w-16 h-16 rounded-2xl bg-white/10 animate-pulse" />
//             <div className="flex-1">
//               <div className="h-6 w-2/3 bg-white/10 rounded animate-pulse mb-2" />
//               <div className="h-4 w-1/3 bg-white/10 rounded animate-pulse" />
//             </div>
//           </div>

//           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//             {Array.from({ length: 8 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="h-14 rounded-2xl bg-white/10 animate-pulse"
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Content */}
//       {!loading && station && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left: identity */}
//           <div className="lg:col-span-1">
//             <div className="relative rounded-2xl bg-[#251a34] border border-white/10 p-6 shadow-2xl overflow-hidden">
//               <div
//                 className="absolute w-[70%] aspect-square -top-10 -right-10 opacity-40 rounded-full blur-[110px] pointer-events-none"
//                 style={{
//                   background:
//                     "radial-gradient(45.33% 45.33% at 50% 50%, #8A25E9 0%, rgba(117,31,198,0.656447) 38.28%, rgba(78,21,131,0) 100%)",
//                 }}
//               />

//               <div className="relative z-10 flex items-start gap-4">
//                 <div className="w-16 h-16 rounded-2xl bg-[#2d1f3f] border border-white/10 overflow-hidden shrink-0">
//                   <Image
//                     src={
//                       station.stationImage?.startsWith('http') 
//                         ? station.stationImage 
//                         : `/images/${station.stationImage}`
//                     }
//                     alt="Station"
//                     width={64}
//                     height={64}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 <div className="min-w-0">
//                   <p className="font-manrope font-bold text-[18px] text-white truncate">
//                     {safeText(station.name)}
//                   </p>
//                   <p className="font-manrope text-[13px] text-[#8E94A4] mt-1 truncate">
//                     {safeText(station.state)} • {safeText(station.country)}
//                   </p>

//                   <div className="mt-3 flex flex-wrap items-center gap-2">
//                     <span
//                       className={[
//                         "px-3 py-1 rounded-full text-[12px] font-manrope font-semibold",
//                         statusPill,
//                       ].join(" ")}
//                     >
//                       {station.isActive ? "Active" : "Inactive"}
//                     </span>

//                     <span className="px-3 py-1 rounded-full text-[12px] font-manrope font-semibold bg-white/5 border border-white/10 text-white/90">
//                       ⭐ {formatRating(ratingPack.avg)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Ratings & Reviews */}
//               <div className="relative z-10 mt-5 rounded-2xl bg-[#2d1f3f] border border-white/10 p-4">
//                 <div className="flex items-center justify-between gap-3">
//                   <p className="font-manrope text-[12px] text-[#8E94A4]">
//                     Ratings & Reviews
//                   </p>
//                   <p className="font-manrope text-[12px] text-white/80">
//                     {safeText(ratingPack.totalRatings, "0")} ratings •{" "}
//                     {safeText(ratingPack.totalReviews, "0")} reviews
//                   </p>
//                 </div>

//                 <div className="mt-3">
//                   <div className="h-2 rounded-full bg-white/10 overflow-hidden border border-white/10">
//                     <div
//                       className="h-full bg-gradient-to-r from-[#762FB8] to-[#9B4DE0]"
//                       style={{ width: `${ratingPack.starPct}%` }}
//                     />
//                   </div>

//                   <div className="mt-2 flex items-center justify-between">
//                     <p className="font-manrope font-semibold text-[14px] text-white">
//                       {formatRating(ratingPack.avg)} / 5.0
//                     </p>
//                     <p className="font-manrope text-[12px] text-[#8E94A4]">
//                       Based on {safeText(ratingPack.totalRatings, "0")} ratings
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="relative z-10 mt-4 space-y-3">
//                 <div className="rounded-2xl bg-[#2d1f3f] border border-white/10 p-4">
//                   <p className="font-manrope text-[12px] text-[#8E94A4] mb-1">
//                     Contact Email
//                   </p>
//                   <p className="font-manrope font-semibold text-[14px] text-white break-all">
//                     {safeText(station.contactEmail)}
//                   </p>
//                 </div>

//                 <div className="rounded-2xl bg-[#2d1f3f] border border-white/10 p-4">
//                   <p className="font-manrope text-[12px] text-[#8E94A4] mb-1">
//                     Contact Phone
//                   </p>
//                   <p className="font-manrope font-semibold text-[14px] text-white">
//                     {safeText(station.contactPhone)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right: details */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="rounded-2xl bg-[#251a34] border border-white/10 p-6 md:p-8 shadow-2xl">
//               <h2 className="font-manrope font-bold text-[18px] md:text-[22px] text-white mb-4">
//                 Station Details
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <InfoBox label="Address" value={station.address} />
//                 <InfoBox
//                   label="Operating Hours"
//                   value={`${safeText(station.openingTime)} - ${safeText(
//                     station.closingTime
//                   )}`}
//                 />

//                 <InfoBox
//                   label="Price"
//                   value={`${safeText(station.currency)} ${safeText(
//                     station.amountPerUnit
//                   )} / ${safeText(station.amountPerUnitType)}`}
//                 />

//                 <InfoBox
//                   label="Coordinates"
//                   value={`${safeText(station.latitude)} , ${safeText(
//                     station.longitude
//                   )}`}
//                 />

//                 {typeof station.dispenserCount !== "undefined" && (
//                   <InfoBox label="Dispenser Count" value={station.dispenserCount} />
//                 )}

//                 {typeof station.storageCapacity !== "undefined" && (
//                   <InfoBox
//                     label="Storage Capacity (kg)"
//                     value={station.storageCapacity}
//                   />
//                 )}

//                 {typeof station.safetyCertifications !== "undefined" && (
//                   <InfoBox
//                     label="Safety Certifications"
//                     value={station.safetyCertifications}
//                     multiline
//                   />
//                 )}

//                 <InfoBox label="Created At" value={formatDate(station.createdAt)} />
//                 <InfoBox label="Updated At" value={formatDate(station.updatedAt)} />
//               </div>
//             </div>

//             <div className="rounded-2xl bg-[#251a34] border border-white/10 p-6 shadow-2xl">
//               <h3 className="font-manrope font-bold text-[16px] md:text-[18px] text-white mb-4">
//                 Performance Snapshot
//               </h3>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <MetricCard
//                   label="Average Rating"
//                   value={`${formatRating(ratingPack.avg)} / 5.0`}
//                   sub={`Based on ${safeText(ratingPack.totalRatings, "0")} ratings`}
//                 />
//                 <MetricCard
//                   label="Total Reviews"
//                   value={safeText(ratingPack.totalReviews, "0")}
//                   sub="Customer feedback count"
//                 />
//                 <MetricCard
//                   label="Operational Status"
//                   value={station.isActive ? "Active" : "Inactive"}
//                   sub={station.isActive ? "Visible to users" : "Hidden from users"}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function InfoBox({
//   label,
//   value,
//   multiline,
// }: {
//   label: string;
//   value: unknown;
//   multiline?: boolean;
// }) {
//   return (
//     <div className="rounded-2xl bg-[#2d1f3f] border border-white/10 p-4">
//       <p className="font-manrope text-[12px] text-[#8E94A4] mb-1">{label}</p>
//       <p
//         className={[
//           "font-manrope font-semibold text-[14px] text-white",
//           multiline ? "whitespace-pre-wrap break-words" : "truncate",
//         ].join(" ")}
//         title={typeof value === "string" ? value : undefined}
//       >
//         {safeText(value)}
//       </p>
//     </div>
//   );
// }

// function MetricCard({
//   label,
//   value,
//   sub,
// }: {
//   label: string;
//   value: string;
//   sub?: string;
// }) {
//   return (
//     <div className="rounded-2xl bg-[#2d1f3f] border border-white/10 p-4">
//       <p className="font-manrope text-[12px] text-[#8E94A4]">{label}</p>
//       <p className="mt-2 font-manrope font-bold text-[18px] text-white">
//         {value}
//       </p>
//       {sub && (
//         <p className="mt-1 font-manrope text-[12px] text-white/70">{sub}</p>
//       )}
//     </div>
//   );
// }
