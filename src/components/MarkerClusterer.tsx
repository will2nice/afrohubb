import { useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer as GMClusterer, type Marker } from "@googlemaps/markerclusterer";
import {
  useEffect,
  useRef,
  useState,
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
  const [markers, setMarkers] = useState<Record<string, Marker>>({});

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

            return new google.maps.marker.AdvancedMarkerElement({
              map,
              position,
              content: el,
              zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
            });
          },
        },
      });
    }
  }, [map]);

  // Sync markers dict with clusterer
  useEffect(() => {
    if (!clusterer.current) return;
    clusterer.current.clearMarkers();
    clusterer.current.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = useCallback((id: string, marker: Marker | null) => {
    setMarkers((prev) => {
      if (marker) {
        if (prev[id] === marker) return prev;
        return { ...prev, [id]: marker };
      }
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  return (
    <ClustererContext.Provider value={{ setMarkerRef }}>
      {children}
    </ClustererContext.Provider>
  );
}
