"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet's default marker points at image files that bundlers rewrite, so the
// pin silently renders broken. A divIcon sidesteps assets entirely.
const pin = L.divIcon({
  className: "",
  html: `<div style="
    width:22px;height:22px;border-radius:50% 50% 50% 0;
    background:#c1613f;border:2px solid #fff;
    transform:rotate(-45deg);
    box-shadow:0 2px 6px rgba(0,0,0,.3);
  "></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 22],
  popupAnchor: [0, -22],
});

export type MapPoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export default function RestaurantMap({
  points,
  height = 220,
  zoom = 16,
}: {
  points: MapPoint[];
  height?: number;
  zoom?: number;
}) {
  if (points.length === 0) return null;

  const center: [number, number] =
    points.length === 1
      ? [points[0].lat, points[0].lng]
      : [
          points.reduce((s, p) => s + p.lat, 0) / points.length,
          points.reduce((s, p) => s + p.lng, 0) / points.length,
        ];

  return (
    <div
      className="overflow-hidden rounded-xl border border-border"
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={points.length === 1 ? zoom : 11}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pin}>
            <Popup>{p.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
