// LocationPicker.jsx
//
// Replaces the old "copy lat/lon from Google Maps and paste it into a text
// box" flow that used to live in Register.jsx and AddItemModal.jsx.
//
// Instead, this gives the user two easy ways to set a location:
//   1. "Use my current location" -> browser Geolocation API (one click)
//   2. Click anywhere on the embedded map to drop/move a pin
//
// The `leaflet` package was already listed in package.json but never
// actually used anywhere in the app - this is what it was for.
//
// Reports the chosen coordinates back to the parent via onChange({ lat, lon }).

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LocationPicker.css";

// Leaflet's default marker icon references image files in a way that breaks
// with most bundlers (Vite included) unless we point it at the CDN copies.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_CENTER = [22.3072, 73.1812]; // Vadodara, Gujarat - a reasonable fallback center
const DEFAULT_ZOOM = 5;
const SELECTED_ZOOM = 15;

const LocationPicker = ({ value, onChange, required = false }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");
  const [address, setAddress] = useState("");

  // Initialize the map once
  useEffect(() => {
    if (mapRef.current) return; // already initialized

    const map = L.map(mapContainerRef.current).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    map.on("click", (e) => {
      setPoint(e.latlng.lat, e.latlng.lng);
    });

    // If a value was already passed in (e.g. editing), show it
    if (value && value.lat != null && value.lon != null) {
      placeMarker(value.lat, value.lon);
      map.setView([value.lat, value.lon], SELECTED_ZOOM);
    }

    // Leaflet needs a nudge to size itself correctly inside modals/flex layouts
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeMarker = (lat, lon) => {
    const map = mapRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lon]);
    } else {
      markerRef.current = L.marker([lat, lon]).addTo(map);
    }
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data?.display_name) setAddress(data.display_name);
    } catch (err) {
      // Reverse geocoding is a nice-to-have; never block the flow on it
      console.warn("Reverse geocoding failed:", err);
    }
  };

  const setPoint = (lat, lon) => {
    placeMarker(lat, lon);
    onChange({ lat, lon });
    setAddress("");
    reverseGeocode(lat, lon);
  };

  const handleUseCurrentLocation = () => {
    setLocateError("");

    if (!navigator.geolocation) {
      setLocateError("Your browser doesn't support geolocation. Tap the map to set your location instead.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPoint(latitude, longitude);
        mapRef.current?.setView([latitude, longitude], SELECTED_ZOOM);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocateError("Location permission denied. Tap the map to set your location manually.");
        } else {
          setLocateError("Couldn't get your location. Tap the map to set it manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="location-picker">
      <div className="location-picker-actions">
        <button
          type="button"
          className="use-location-btn"
          onClick={handleUseCurrentLocation}
          disabled={locating}
        >
          {locating ? "Locating..." : "📍 Use my current location"}
        </button>
        {value?.lat != null && value?.lon != null && (
          <span className="location-picker-coords">
            {value.lat.toFixed(5)}, {value.lon.toFixed(5)}
          </span>
        )}
      </div>

      {locateError && <p className="location-picker-error">{locateError}</p>}

      <div ref={mapContainerRef} className="location-picker-map" />

      <p className="location-picker-hint">
        Tap the map to fine-tune the exact spot.
      </p>

      {address && <p className="location-picker-address">📌 {address}</p>}

      {required && value?.lat == null && (
        <p className="location-picker-required">Location is required.</p>
      )}
    </div>
  );
};

export default LocationPicker;
