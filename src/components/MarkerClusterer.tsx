/// <reference types="google.maps" />
import { useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer as GMClusterer, type Marker } from "@googlemaps/markerclusterer";
import {
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from "react";

const ClustererContext = createContext<{
  setMarkerRef: (id: string, marker: Marker | null) => void;
} | null>(null);

export function useClusterer() {
  return useContext(ClustererContext);
}

interface ClusteredMarkersProps {
  children: ReactNode;
}

export default function ClusteredMarkers({ children }: ClusteredMarkersProps) {
  const map = useMap();
  const clusterer = useRef<GMClusterer | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new GMClusterer({
        map,
        renderer: {
          render({ count, position }) {
            const el = document.createElement("div");
            el.style.cssText = `
              width: 36px; height: 36px; border-radius: 50%;
              background: linear-gradient(135deg, hsl(25,95%,55%), hsl(43,96%,56%));
              display: flex; align-items: center; justify-content: center;
              color: hsl(0,0%,5%); font-weight: 800; font-size: 13px;
              border: 3px solid hsl(0,0%,7%);
              box-shadow: 0 2px 10px rgba(0,0,0,0.4);
            `;
            el.textContent = count >= 1000 ? `${Math.round(count / 1000)}K` : String(count);

            return new (google.maps.marker.AdvancedMarkerElement as any)({
              map,
              position,
              content: el,
              zIndex: Number((google.maps.Marker as any).MAX_ZINDEX) + count,
            }) as google.maps.marker.AdvancedMarkerElement;
          },
        },
      });
    }
  }, [map]);

  const setMarkerRef = useCallback((id: string, marker: Marker | null) => {
    const current = markersRef.current;
    if (marker) {
      if (current[id] === marker) return;
      current[id] = marker;
    } else {
      if (!(id in current)) return;
      delete current[id];
    }
    // Update clusterer directly, no state needed
    if (clusterer.current) {
      clusterer.current.clearMarkers();
      clusterer.current.addMarkers(Object.values(current));
    }
  }, []);

  return (
    <ClustererContext.Provider value={{ setMarkerRef }}>
      {children}
    </ClustererContext.Provider>
  );
}

export { type Marker } from "@googlemaps/markerclusterer";
