"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MapContainer, SVGOverlay, Marker, useMap } from "react-leaflet";
import { useEffect } from "react";
import { KarteIcon } from "@/components/features/KarteIcon";
import type { Routenzug } from "@/types/routenzug";

interface MapCanvasProps {
  routenzüge: Routenzug[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

const BOUNDS = L.latLngBounds([[0, 0], [1080, 1920]]);

function createMarkerIcon(variant: "routenzug" | "routenzug-selected" | "routenzug-problem") {
  const size: [number, number] = [28, 31];
  return L.divIcon({
    html: renderToStaticMarkup(<KarteIcon variant={variant} />),
    className: "",
    iconSize: size,
    iconAnchor: [14, 31],
  });
}

function MapSetup() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(BOUNDS);
  }, [map]);
  return null;
}

export function MapCanvas({ routenzüge, selectedId, onSelect }: MapCanvasProps) {
  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={BOUNDS}
      style={{ width: "100%", height: "100%", background: "#E4E8E4" }}
      zoomControl
      className="leaflet-container-custom"
    >
      <MapSetup />

      <SVGOverlay bounds={BOUNDS}>
        <rect x="0" y="0" width="1920" height="1080" fill="#EEEEEE" />
        <line x1="0" y1="540" x2="1920" y2="540" stroke="#FFFFFF" strokeWidth="8" strokeDasharray="40 20" />
        <line x1="960" y1="0" x2="960" y2="1080" stroke="#FFFFFF" strokeWidth="8" strokeDasharray="40 20" />
        <line x1="0" y1="270" x2="1920" y2="270" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="20 10" />
        <line x1="0" y1="810" x2="1920" y2="810" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="20 10" />
      </SVGOverlay>

      {routenzüge.map((rz) => {
        const variant =
          selectedId === rz.id
            ? "routenzug-selected"
            : rz.status === "fahrt-unterbrochen"
              ? "routenzug-problem"
              : "routenzug";

        return (
          <Marker
            key={rz.id}
            position={L.latLng(rz.position.y, rz.position.x)}
            icon={createMarkerIcon(variant)}
            eventHandlers={{ click: () => onSelect(rz.id) }}
          />
        );
      })}
    </MapContainer>
  );
}
