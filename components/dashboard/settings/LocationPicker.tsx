"use client";

/// <reference types="google.maps" />

import { useEffect, useRef, useState } from "react";

export type LocationValue = {
  address: string;
  latitude: number | string | null;
  longitude: number | string | null;
  placeId?: string | null;
};

type GeofenceBounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

type Props = {
  value: LocationValue;
  onChange: (next: LocationValue) => void;
  disabled?: boolean;
  geofenceBounds?: GeofenceBounds;
  onGeofenceError?: (message: string) => void;
};

function isWithinBounds(
  lat: number,
  lng: number,
  bounds?: GeofenceBounds
): boolean {
  if (!bounds) return true;

  return (
    lat >= bounds.minLat &&
    lat <= bounds.maxLat &&
    lng >= bounds.minLng &&
    lng <= bounds.maxLng
  );
}

function toValidNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function stripLeadingPlusCode(address: string): string {
  if (!address) return "";
  return address.replace(/^[A-Z0-9]{4,}\+[A-Z0-9]{2,}\s*,\s*/i, "").trim();
}

export default function LocationPicker({
  value,
  onChange,
  disabled,
  geofenceBounds,
  onGeofenceError,
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [isReady, setIsReady] = useState(false);

  const defaultCenter = {
    lat: 6.5244,
    lng: 3.3792,
  };

  useEffect(() => {
    let cancelled = false;
    let intervalId: number | undefined;

    async function initMap() {
      if (!mapRef.current || !inputRef.current) return;
      if (!window.google?.maps) return;

      const lat = toValidNumber(value.latitude);
      const lng = toValidNumber(value.longitude);

      const currentCenter = {
        lat: lat ?? defaultCenter.lat,
        lng: lng ?? defaultCenter.lng,
      };

      const hasValidCoords = lat !== null && lng !== null;

      const { Map } =
        (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;

      const { AdvancedMarkerElement } =
        (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

      await google.maps.importLibrary("places");

      if (cancelled) return;

      // If map already exists, just update it
      if (mapInstanceRef.current && markerRef.current) {
        mapInstanceRef.current.setCenter(currentCenter);
        mapInstanceRef.current.setZoom(hasValidCoords ? 16 : 12);
        markerRef.current.position = currentCenter;
        setIsReady(true);
        return;
      }

      const map = new Map(mapRef.current, {
        center: currentCenter,
        zoom: hasValidCoords ? 16 : 12,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
        gestureHandling: "greedy",
      });

      const marker = new AdvancedMarkerElement({
        map,
        position: currentCenter,
        title: "Station location",
        gmpDraggable: !disabled,
      });

      const geocoder = new google.maps.Geocoder();

      mapInstanceRef.current = map;
      markerRef.current = marker;
      geocoderRef.current = geocoder;

      async function updateFromCoords(lat: number, lng: number) {
        if (!isWithinBounds(lat, lng, geofenceBounds)) {
          onGeofenceError?.(
            "Selected location is outside the allowed operating area."
          );
          return;
        }

        const result = await geocoder.geocode({
          location: { lat, lng },
        });

        const first = result.results?.[0];

        onChange({
          address: stripLeadingPlusCode(first?.formatted_address ?? value.address ?? ""),
          latitude: lat,
          longitude: lng,
          placeId: first?.place_id ?? null,
        });
      }

      map.addListener("click", async (e: google.maps.MapMouseEvent) => {
        if (disabled || !e.latLng) return;

        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        if (!isWithinBounds(lat, lng, geofenceBounds)) {
          onGeofenceError?.(
            "Selected location is outside the allowed operating area."
          );
          return;
        }

        marker.position = { lat, lng };
        await updateFromCoords(lat, lng);
      });

      marker.addListener("dragend", async () => {
        const pos = marker.position as google.maps.LatLngLiteral | null;
        if (!pos) return;

        if (!isWithinBounds(pos.lat, pos.lng, geofenceBounds)) {
          onGeofenceError?.(
            "Selected location is outside the allowed operating area."
          );

          marker.position = currentCenter;
          return;
        }

        await updateFromCoords(pos.lat, pos.lng);
      });

      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ["formatted_address", "geometry", "place_id", "name"],
        types: ["geocode", "establishment"],
      });

      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (!place.geometry?.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        if (!isWithinBounds(lat, lng, geofenceBounds)) {
          onGeofenceError?.(
            "Selected location is outside the allowed operating area."
          );
          return;
        }

        map.setCenter({ lat, lng });
        map.setZoom(17);
        marker.position = { lat, lng };

        onChange({
          address: stripLeadingPlusCode(place.formatted_address || place.name || ""),
          latitude: lat,
          longitude: lng,
          placeId: place.place_id ?? null,
        });
      });

      setIsReady(true);
    }

    // wait for google maps script if it has not loaded yet
    if (window.google?.maps) {
      initMap();
    } else {
      intervalId = window.setInterval(() => {
        if (window.google?.maps) {
          window.clearInterval(intervalId);
          initMap();
        }
      }, 300);
    }

    return () => {
      cancelled = true;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [
    disabled,
    geofenceBounds,
    onChange,
    onGeofenceError,
    value.address,
    value.latitude,
    value.longitude,
  ]);

  return (
    <div className="flex flex-col gap-3 sm:col-span-2">
      <div className="flex flex-col gap-2">
        <label className="font-manrope font-semibold text-[14px] text-white">
          Station Location
        </label>

        <input
          ref={inputRef}
          type="text"
          value={value.address}
          onChange={(e) =>
            onChange({
              ...value,
              address: e.target.value,
            })
          }
          placeholder="Search address or select on the map"
          disabled={disabled}
          className="w-full rounded-full p-3 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
        />

        <p className="text-[12px] text-[#8E94A4] font-manrope">
          Search for the station, or click directly on the map for precise coordinates.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#2d1f3f]">
        <div ref={mapRef} className="h-[280px] w-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-[#2d1f3f] border border-white/10 p-3">
          <p className="text-[12px] text-[#8E94A4]">Latitude</p>
          <p className="text-white font-semibold text-[14px]">
            {value.latitude ?? "—"}
          </p>
        </div>

        <div className="rounded-2xl bg-[#2d1f3f] border border-white/10 p-3">
          <p className="text-[12px] text-[#8E94A4]">Longitude</p>
          <p className="text-white font-semibold text-[14px]">
            {value.longitude ?? "—"}
          </p>
        </div>

        <div className="rounded-2xl bg-[#2d1f3f] border border-white/10 p-3">
          <p className="text-[12px] text-[#8E94A4]">Place ID</p>
          <p className="text-white font-semibold text-[14px] break-all">
            {value.placeId ?? "—"}
          </p>
        </div>
      </div>

      {!isReady && (
        <p className="text-[12px] text-[#8E94A4] font-manrope">Loading map…</p>
      )}
    </div>
  );
}