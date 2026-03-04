import { useState } from "react";
import { CalendarDays, Store, HandHelping } from "lucide-react";
import EventsScreen from "@/components/EventsScreen";
import PlacesScreen from "@/components/PlacesScreen";
import AskForHelpScreen from "@/components/AskForHelpScreen";
import { type City } from "@/data/cityData";

type ExploreView = "events" | "places" | "help";

interface ExploreScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
  onOpenDM?: () => void;
}

const ExploreScreen = ({ selectedCity, onCityChange, onOpenDM }: ExploreScreenProps) => {
  const [view, setView] = useState<ExploreView>("events");

  const toggleItems: { id: ExploreView; label: string; icon: typeof CalendarDays }[] = [
    { id: "events", label: "Events", icon: CalendarDays },
    { id: "places", label: "Places", icon: Store },
    { id: "help", label: "Help", icon: HandHelping },
  ];

  return (
    <div className="relative">
      {view === "events" && (
        <EventsScreen selectedCity={selectedCity} onCityChange={onCityChange} />
      )}
      {view === "places" && (
        <PlacesScreen selectedCity={selectedCity} onCityChange={onCityChange} />
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
              onClick={() => setView(item.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                view === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreScreen;
