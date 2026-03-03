import { useState } from "react";
import { CalendarDays, Store } from "lucide-react";
import EventsScreen from "@/components/EventsScreen";
import PlacesScreen from "@/components/PlacesScreen";
import { type City } from "@/data/cityData";

type ExploreView = "events" | "places";

interface ExploreScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const ExploreScreen = ({ selectedCity, onCityChange }: ExploreScreenProps) => {
  const [view, setView] = useState<ExploreView>("events");

  return (
    <div className="relative">
      {view === "events" ? (
        <EventsScreen selectedCity={selectedCity} onCityChange={onCityChange} />
      ) : (
        <PlacesScreen selectedCity={selectedCity} onCityChange={onCityChange} />
      )}

      {/* Floating toggle pill */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center bg-card/95 backdrop-blur-lg border border-border rounded-full p-1 shadow-lg">
          <button
            onClick={() => setView("events")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              view === "events"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarDays size={14} />
            Events
          </button>
          <button
            onClick={() => setView("places")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              view === "places"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Store size={14} />
            Places
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExploreScreen;
