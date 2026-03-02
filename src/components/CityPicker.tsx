import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Check, Search, Lock, Crown } from "lucide-react";
import { cities, type City } from "@/data/cityData";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";

const FREE_CITY_LIMIT = 2;
const STORAGE_KEY = "afrohub-visited-cities";

const getVisitedCities = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const addVisitedCity = (cityId: string) => {
  const visited = getVisitedCities();
  if (!visited.includes(cityId)) {
    visited.push(cityId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visited));
  }
  return visited;
};

interface CityPickerProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const CityPicker = ({ selectedCity, onCityChange }: CityPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const role = useUserRole();
  const { toast } = useToast();
  const isAdmin = role === "admin";

  // Track current city as visited
  useEffect(() => {
    addVisitedCity(selectedCity.id);
  }, [selectedCity.id]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const filtered = search.trim()
    ? cities.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase())
      )
    : cities;

  const handleSelect = (city: City) => {
    if (!isAdmin) {
      const visited = getVisitedCities();
      const alreadyVisited = visited.includes(city.id);
      if (!alreadyVisited && visited.length >= FREE_CITY_LIMIT) {
        toast({
          title: "City limit reached 🔒",
          description: `Free users can explore ${FREE_CITY_LIMIT} cities. Upgrade to AfroHub Plus for unlimited access.`,
        });
        setOpen(false);
        setSearch("");
        return;
      }
    }
    addVisitedCity(city.id);
    onCityChange(city);
    setOpen(false);
    setSearch("");
  };

  const visited = getVisitedCities();
  const remainingFree = Math.max(0, FREE_CITY_LIMIT - visited.length);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 group"
      >
        <MapPin size={16} className="text-primary" />
        <span className="text-sm font-medium text-foreground">
          {selectedCity.flag} {selectedCity.name}
        </span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearch(""); }} />

          <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-elevated z-50 overflow-hidden w-[min(calc(100vw-2rem),28rem)]">
            {/* Search input */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search cities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              {!isAdmin && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  {remainingFree > 0 ? (
                    <>
                      <MapPin size={12} className="text-primary" />
                      <span>{remainingFree} free city switch{remainingFree !== 1 ? "es" : ""} remaining</span>
                    </>
                  ) : (
                    <>
                      <Crown size={12} className="text-primary" />
                      <span className="text-primary font-medium">Upgrade for unlimited cities</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* City list */}
            <div className="overflow-y-auto max-h-[50vh]">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No cities found for "{search}"
                </div>
              ) : (
                filtered.map((city) => {
                  const isSelected = city.id === selectedCity.id;
                  const isVisited = visited.includes(city.id);
                  const isLocked = !isAdmin && !isVisited && visited.length >= FREE_CITY_LIMIT;

                  return (
                    <button
                      key={city.id}
                      onClick={() => handleSelect(city)}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                        isLocked
                          ? "opacity-50 hover:bg-secondary/30"
                          : "hover:bg-secondary/50"
                      }`}
                    >
                      <span className="text-lg">{city.flag}</span>
                      <span className="text-sm font-medium text-foreground flex-1 text-left">
                        {city.name}
                      </span>
                      {isSelected && <Check size={16} className="text-primary" />}
                      {isLocked && <Lock size={14} className="text-muted-foreground" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CityPicker;
