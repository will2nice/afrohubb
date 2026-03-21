import { useState, useCallback } from "react";
import { X, ChevronLeft, MapPin, Lock, Globe, Users, Sparkles } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

const LocationPicker = ({ position, onPositionChange }: { position: [number, number]; onPositionChange: (pos: [number, number]) => void }) => {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return <Marker position={position} icon={activityPinIcon} />;
};

const CreateActivitySheet = ({ open, onClose, onSubmit, initialCenter = [30.2672, -97.7431], isPending }: Props) => {
  const [step, setStep] = useState<Step>("describe");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [position, setPosition] = useState<[number, number]>(initialCenter);
  const [isPublic, setIsPublic] = useState(true);
  const [maxSpots, setMaxSpots] = useState("");

  const reset = useCallback(() => {
    setStep("describe");
    setDescription("");
    setCategory("");
    setPosition(initialCenter);
    setIsPublic(true);
    setMaxSpots("");
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
      location_label: "",
      is_public: isPublic,
      max_spots: maxSpots ? parseInt(maxSpots) : null,
    });
    reset();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-[2000]" onClick={handleClose} />
      <div className="fixed inset-x-0 bottom-0 z-[2001] flex items-end justify-center">
        <div className="w-full max-w-lg bg-card rounded-t-3xl border border-border border-b-0 shadow-elevated flex flex-col" style={{ maxHeight: "90vh" }}>
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
          <div className="flex-1 overflow-y-auto px-5 pb-8 min-h-0">
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
                <div className="bg-secondary/50 rounded-xl p-3 flex items-start gap-2">
                  <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Tap the map to set location</p>
                    <p className="text-xs text-muted-foreground">Choose a general area for your hangout</p>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-border h-64">
                  <MapContainer
                    center={initialCenter}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker position={position} onPositionChange={setPosition} />
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
    </>
  );
};

export default CreateActivitySheet;
