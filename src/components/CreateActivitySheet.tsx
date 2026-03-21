import { useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, MapPin, Lock, Globe, Users, Sparkles, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@/contexts/ThemeContext";

const CATEGORIES = [
  { id: "food", emoji: "🍽️", label: "Food & Drinks", desc: "Restaurants, cafes, bars" },
  { id: "nightlife", emoji: "🎉", label: "Nightlife", desc: "Clubs, parties, events" },
  { id: "outdoor", emoji: "🥾", label: "Outdoor & Active", desc: "Hiking, sports, fitness" },
  { id: "sightseeing", emoji: "🗺️", label: "Sightseeing", desc: "Tours, landmarks, exploring" },
  { id: "entertainment", emoji: "🎭", label: "Entertainment", desc: "Movies, shows, museums" },
  { id: "shopping", emoji: "🛍️", label: "Shopping", desc: "Markets, malls, boutiques" },
  { id: "wellness", emoji: "🧘", label: "Wellness", desc: "Yoga, spa, meditation" },
  { id: "rideshare", emoji: "🚗", label: "Rideshare", desc: "Split rides, carpools" },
  { id: "social", emoji: "💬", label: "Social", desc: "Hangout, chat, meet up" },
  { id: "other", emoji: "✨", label: "Other", desc: "Something else" },
];

const activityPinIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:50%;background:hsl(340,80%,55%);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    location_label: string;
    is_public: boolean;
    max_spots: number | null;
  }) => void;
  initialCenter?: [number, number];
  isPending?: boolean;
}

type Step = "describe" | "category" | "location" | "visibility";

const FlyToPosition = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  const prevPos = useRef(position);
  if (prevPos.current[0] !== position[0] || prevPos.current[1] !== position[1]) {
    prevPos.current = position;
    map.flyTo(position, 16, { duration: 0.8 });
  }
  return null;
};

const LocationPicker = ({ position, onPositionChange }: { position: [number, number]; onPositionChange: (pos: [number, number]) => void }) => {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return <Marker position={position} icon={activityPinIcon} />;
};

const CreateActivitySheet = ({ open, onClose, onSubmit, initialCenter = [30.2672, -97.7431], isPending }: Props) => {
  const { theme } = useTheme();
  const [step, setStep] = useState<Step>("describe");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [position, setPosition] = useState<[number, number]>(initialCenter);
  const [locationLabel, setLocationLabel] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [maxSpots, setMaxSpots] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  const searchPlaces = useCallback(async (query: string) => {
    if (query.length < 3) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch { setSearchResults([]); }
    setSearching(false);
  }, []);

  const handleSearchInput = useCallback((val: string) => {
    setSearchQuery(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchPlaces(val), 400);
  }, [searchPlaces]);

  const selectPlace = useCallback((place: { display_name: string; lat: string; lon: string }) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setPosition([lat, lng]);
    setLocationLabel(place.display_name.split(",").slice(0, 2).join(","));
    setSearchQuery(place.display_name.split(",").slice(0, 2).join(", "));
    setSearchResults([]);
  }, []);

  const reset = useCallback(() => {
    setStep("describe");
    setDescription("");
    setCategory("");
    setPosition(initialCenter);
    setLocationLabel("");
    setIsPublic(true);
    setMaxSpots("");
    setSearchQuery("");
    setSearchResults([]);
  }, [initialCenter]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const catLabel = CATEGORIES.find((c) => c.id === category)?.label || category;
    onSubmit({
      title: catLabel,
      description: description.trim(),
      category,
      latitude: position[0],
      longitude: position[1],
      location_label: locationLabel,
      is_public: isPublic,
      max_spots: maxSpots ? parseInt(maxSpots) : null,
    });
    reset();
  };

  if (!open) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-[2000]" onClick={handleClose} />
      <div className="fixed inset-0 z-[2001] flex items-end sm:items-end justify-center">
        <div className="w-full h-full sm:h-auto sm:max-h-[90vh] max-w-lg bg-card sm:rounded-t-3xl border-0 sm:border sm:border-border sm:border-b-0 shadow-elevated flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3 shrink-0">
            {step !== "describe" ? (
              <button
                onClick={() => {
                  if (step === "category") setStep("describe");
                  else if (step === "location") setStep("category");
                  else if (step === "visibility") setStep("location");
                }}
                className="flex items-center gap-1 text-sm font-medium text-foreground"
              >
                <ChevronLeft size={18} /> Back
              </button>
            ) : (
              <div />
            )}
            <h2 className="font-display font-bold text-foreground text-base">
              {step === "describe" && "I want to..."}
              {step === "category" && "What type?"}
              {step === "location" && "Set Location"}
              {step === "visibility" && "Who can join?"}
            </h2>
            <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>

          {/* Steps */}
          <div className="flex-1 overflow-y-auto px-5 pb-24 sm:pb-8 min-h-0">
            {/* Step 1: Describe */}
            {step === "describe" && (
              <div className="space-y-5 py-2">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <Sparkles size={28} className="text-primary" />
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground">Describe what you want to do — keep it casual!</p>
                <textarea
                  autoFocus
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="grab coffee, hang out at the park, explore the city..."
                  rows={3}
                  className="w-full text-base text-foreground placeholder:text-muted-foreground bg-secondary/50 rounded-2xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none p-4 resize-none transition-colors"
                  maxLength={200}
                />
                <p className="text-right text-[10px] text-muted-foreground">{description.length}/200</p>
                <button
                  onClick={() => description.trim() && setStep("category")}
                  disabled={!description.trim()}
                  className="w-full py-4 rounded-2xl bg-muted text-muted-foreground font-bold text-base disabled:opacity-40 transition-all enabled:bg-primary enabled:text-primary-foreground"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Step 2: Category */}
            {step === "category" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all ${
                        category === cat.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      <span className="text-3xl">{cat.emoji}</span>
                      <span className={`text-sm font-bold ${category === cat.id ? "text-primary" : "text-foreground"}`}>{cat.label}</span>
                      <span className="text-[11px] text-muted-foreground text-center">{cat.desc}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => category && setStep("location")}
                  disabled={!category}
                  className="w-full py-4 rounded-2xl bg-muted text-muted-foreground font-bold text-base disabled:opacity-40 transition-all enabled:bg-primary enabled:text-primary-foreground sticky bottom-0"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Step 3: Location picker */}
            {step === "location" && (
              <div className="space-y-3">
                {/* Search bar */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    placeholder="Search for a place, bar, restaurant..."
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                  />
                  {searching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Search results dropdown */}
                {searchResults.length > 0 && (
                  <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg max-h-48 overflow-y-auto">
                    {searchResults.map((place, i) => (
                      <button
                        key={i}
                        onClick={() => selectPlace(place)}
                        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-secondary/50 transition-colors border-b border-border last:border-0"
                      >
                        <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                        <span className="text-sm text-foreground line-clamp-2">{place.display_name}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="bg-secondary/50 rounded-xl p-3 flex items-start gap-2">
                  <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {locationLabel || "Tap the map or search above"}
                    </p>
                    <p className="text-xs text-muted-foreground">Pin a spot for your hangout</p>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-border h-64">
                  <MapContainer
                    center={initialCenter}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                  >
                    <TileLayer
                      url={theme === "dark"
                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      }
                    />
                    <LocationPicker position={position} onPositionChange={(pos) => {
                      setPosition(pos);
                      setLocationLabel("");
                      setSearchQuery("");
                    }} />
                    <FlyToPosition position={position} />
                  </MapContainer>
                </div>

                <button
                  onClick={() => setStep("visibility")}
                  className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base"
                >
                  Set Activity Location
                </button>
              </div>
            )}

            {/* Step 4: Public/Private */}
            {step === "visibility" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <button
                    onClick={() => setIsPublic(true)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      isPublic ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Globe size={24} className="text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold text-foreground">Public</p>
                      <p className="text-xs text-muted-foreground">Anyone can join instantly</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setIsPublic(false)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      !isPublic ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Lock size={24} className="text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold text-foreground">Private</p>
                      <p className="text-xs text-muted-foreground">People request to join, you approve</p>
                    </div>
                  </button>
                </div>

                {/* Max spots */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Max spots (optional)</label>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground" />
                    <input
                      type="number"
                      value={maxSpots}
                      onChange={(e) => setMaxSpots(e.target.value)}
                      placeholder="Unlimited"
                      min={1}
                      max={50}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base disabled:opacity-50"
                >
                  {isPending ? "Creating..." : "Create Activity 🎉"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default CreateActivitySheet;
