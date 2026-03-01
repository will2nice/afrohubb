import { useState } from "react";
import { MapPin, Search, ChevronDown, Check, UtensilsCrossed, Dumbbell, Moon, X, ExternalLink, Church } from "lucide-react";
import { cities, type City } from "@/data/cityData";
import { usePlaces, type Place } from "@/hooks/usePlaces";

const categories = [
  { id: "all", label: "All", icon: MapPin },
  { id: "restaurant", label: "Food", icon: UtensilsCrossed },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "prayer", label: "Prayer", icon: Church },
];

const subcategoryFilters = ["All", "African", "Caribbean", "Soul Food", "Run Club", "Gym", "Mosque", "Church", "Synagogue"];

const categoryColors: Record<string, string> = {
  African: "bg-amber-100 text-amber-700",
  Caribbean: "bg-emerald-100 text-emerald-700",
  "Soul Food": "bg-orange-100 text-orange-700",
  "Run Club": "bg-blue-100 text-blue-700",
  Gym: "bg-purple-100 text-purple-700",
  Mosque: "bg-teal-100 text-teal-700",
  Church: "bg-rose-100 text-rose-700",
  Synagogue: "bg-indigo-100 text-indigo-700",
};

interface PlacesScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const PlacesScreen = ({ selectedCity, onCityChange }: PlacesScreenProps) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubcategory, setActiveSubcategory] = useState("All");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const { places, isLoading } = usePlaces(selectedCity.id);

  const filtered = places.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    if (activeSubcategory !== "All" && p.subcategory !== activeSubcategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.cuisine_type?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const ramadanPlaces = places.filter(p => p.is_ramadan_friendly);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-gradient-gold">Places</h1>
          <button onClick={() => setShowCityPicker(!showCityPicker)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border">
            <MapPin size={14} className="text-primary" />
            <span className="text-sm font-medium text-foreground">{selectedCity.flag} {selectedCity.name}</span>
            <ChevronDown size={14} className={`text-muted-foreground transition-transform ${showCityPicker ? "rotate-180" : ""}`} />
          </button>
        </div>

        {showCityPicker && (
          <div className="absolute left-4 right-4 top-full mt-1 bg-card border border-border rounded-xl shadow-elevated z-50 overflow-y-auto max-h-[60vh] animate-slide-up">
            {cities.map((city) => (
              <button key={city.id} onClick={() => { onCityChange(city); setShowCityPicker(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors">
                <span className="text-lg">{city.flag}</span>
                <span className="text-sm font-medium text-foreground flex-1 text-left">{city.name}</span>
                {city.id === selectedCity.id && <Check size={16} className="text-primary" />}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="mt-3 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants, gyms, mosques..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setActiveSubcategory("All"); }}
                className={`px-3 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeCategory === cat.id ? "gradient-gold text-primary-foreground" : "bg-secondary text-muted-foreground border border-border"
                }`}
              >
                <Icon size={14} /> {cat.label}
              </button>
            );
          })}
        </div>

        {/* Subcategory chips */}
        <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
          {subcategoryFilters.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubcategory(sub)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                activeSubcategory === sub ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground border border-border"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 mt-4 space-y-4">
        {/* Ramadan section */}
        {ramadanPlaces.length > 0 && activeCategory === "all" && activeSubcategory === "All" && !search && (
          <div>
            <h2 className="font-display font-bold text-foreground text-sm mb-2 flex items-center gap-2">
              <Moon size={16} className="text-primary" /> Ramadan & Iftar Spots
            </h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {ramadanPlaces.slice(0, 6).map((place) => (
                <button
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className="flex-shrink-0 w-40 bg-card rounded-xl border border-border overflow-hidden text-left hover:ring-2 hover:ring-primary/30 transition-all"
                >
                  <div className="h-20 bg-gradient-to-br from-teal-900/40 to-emerald-900/40 flex items-center justify-center">
                    <Moon size={24} className="text-teal-400" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] font-semibold text-foreground leading-tight line-clamp-2">{place.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{place.subcategory}</p>
                    {place.is_halal && <span className="text-[9px] font-bold text-emerald-500">✓ Halal</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          <h2 className="font-display font-bold text-foreground text-sm mb-2">
            {filtered.length} {activeCategory === "all" ? "places" : activeCategory === "restaurant" ? "restaurants" : activeCategory === "fitness" ? "fitness spots" : "prayer spaces"} in {selectedCity.name}
          </h2>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading places...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No places found. Try a different city or filter.</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((place) => (
                <button
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className="w-full bg-card rounded-xl border border-border p-3 text-left hover:ring-2 hover:ring-primary/20 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      {place.category === "restaurant" && <UtensilsCrossed size={20} className="text-primary" />}
                      {place.category === "fitness" && <Dumbbell size={20} className="text-blue-400" />}
                      {place.category === "prayer" && <Church size={20} className="text-teal-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-foreground text-sm truncate">{place.name}</h3>
                        {place.price_range && <span className="text-[10px] text-muted-foreground font-medium">{place.price_range}</span>}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {place.subcategory && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${categoryColors[place.subcategory] || "bg-secondary text-muted-foreground"}`}>
                            {place.subcategory}
                          </span>
                        )}
                        {place.cuisine_type && (
                          <span className="text-[10px] text-muted-foreground">{place.cuisine_type}</span>
                        )}
                        {place.is_halal && <span className="text-[9px] font-bold text-emerald-500">Halal</span>}
                      </div>
                      {place.description && (
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{place.description}</p>
                      )}
                      {place.address && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <MapPin size={10} /> {place.address}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Place detail overlay */}
      {selectedPlace && (
        <>
          <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm" onClick={() => setSelectedPlace(null)} />
          <div className="fixed bottom-20 left-4 right-4 z-50 max-w-lg mx-auto animate-slide-up">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-elevated">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-foreground text-lg">{selectedPlace.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {selectedPlace.subcategory && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${categoryColors[selectedPlace.subcategory] || "bg-secondary text-muted-foreground"}`}>
                          {selectedPlace.subcategory}
                        </span>
                      )}
                      {selectedPlace.cuisine_type && <span className="text-xs text-muted-foreground">{selectedPlace.cuisine_type}</span>}
                      {selectedPlace.price_range && <span className="text-xs font-bold text-primary">{selectedPlace.price_range}</span>}
                    </div>
                  </div>
                  <button onClick={() => setSelectedPlace(null)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <X size={16} className="text-foreground" />
                  </button>
                </div>

                {selectedPlace.description && (
                  <p className="text-sm text-muted-foreground mb-3">{selectedPlace.description}</p>
                )}

                {selectedPlace.address && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <MapPin size={14} className="text-primary flex-shrink-0" />
                    <span>{selectedPlace.address}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 mt-3">
                  {selectedPlace.is_halal && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">✓ Halal</span>
                  )}
                  {selectedPlace.is_ramadan_friendly && (
                    <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-semibold">🌙 Ramadan Friendly</span>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  {selectedPlace.website && (
                    <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 rounded-full gradient-gold text-primary-foreground text-sm font-semibold text-center flex items-center justify-center gap-1">
                      Visit <ExternalLink size={14} />
                    </a>
                  )}
                  {selectedPlace.latitude && selectedPlace.longitude && (
                    <a
                      href={`https://maps.google.com/?q=${selectedPlace.latitude},${selectedPlace.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-full bg-secondary border border-border text-foreground text-sm font-semibold text-center flex items-center justify-center gap-1"
                    >
                      <MapPin size={14} /> Directions
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlacesScreen;
