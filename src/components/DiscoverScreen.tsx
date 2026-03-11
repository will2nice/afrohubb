import { useState } from "react";
import { Search, MapPinned, Users, Sliders, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useScreenView } from "@/hooks/useAnalytics";
import MapScreen from "@/components/MapScreen";
import PlacesScreen from "@/components/PlacesScreen";
import AskForHelpScreen from "@/components/AskForHelpScreen";
import FlightsScreen from "@/components/FlightsScreen";
import CampusScreen from "@/components/CampusScreen";
import { type City, cities } from "@/data/cityData";
import { trackEvent } from "@/lib/posthog";

type DiscoverView = "map" | "places" | "campus" | "flights" | "help";

interface DiscoverScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
  onOpenDM?: () => void;
}

const DiscoverScreen = ({ selectedCity, onCityChange, onOpenDM }: DiscoverScreenProps) => {
  useScreenView("discover");
  const [view, setView] = useState<DiscoverView>("map");

  const toggleItems: { id: DiscoverView; label: string }[] = [
    { id: "map", label: "Map" },
    { id: "places", label: "Places" },
    { id: "campus", label: "Campus" },
    { id: "flights", label: "Flights" },
    { id: "help", label: "Help" },
  ];

  return (
    <div className="relative min-h-screen">
      {view === "map" && (
        <MapScreen selectedCity={selectedCity} onCityChange={onCityChange} />
      )}
      {view === "places" && (
        <PlacesScreen selectedCity={selectedCity} onCityChange={onCityChange} />
      )}
      {view === "campus" && <CampusScreen />}
      {view === "flights" && (
        <FlightsScreen selectedCity={selectedCity} onCityChange={onCityChange} />
      )}
      {view === "help" && (
        <AskForHelpScreen onOpenDM={onOpenDM || (() => {})} />
      )}

      {/* Floating toggle pill */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center bg-card/95 backdrop-blur-lg border border-border rounded-full p-1 shadow-lg">
          {toggleItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                trackEvent("discover_tab_changed", { view: item.id });
                setView(item.id);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                view === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverScreen;
