import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Globe from "react-globe.gl";
import { MapPin, Users, Calendar, Navigation, ChevronDown, Check, ChevronUp, X } from "lucide-react";
import { events as allEvents, cities, type City } from "@/data/cityData";
import { cityCoords } from "@/data/globeCoords";

interface PointData {
  lat: number;
  lng: number;
  color: string;
  radius: number;
  altitude: number;
  type: "event" | "person" | "group";
  label: string;
  data?: any;
}

// People data generator
const basePeople = [
  { name: "Amara", age: 24, status: "Looking for events", vibe: "🎶" },
  { name: "Kofi", age: 27, status: "Down to hang", vibe: "🏀" },
  { name: "Chidera", age: 22, status: "New in town!", vibe: "✈️" },
  { name: "Sophie", age: 25, status: "Looking for brunch crew", vibe: "🥂" },
  { name: "Dayo", age: 29, status: "Down to hang", vibe: "🎧" },
  { name: "Nneka", age: 23, status: "Want to explore the city", vibe: "🌆" },
  { name: "Marcus", age: 26, status: "Looking for events", vibe: "🔥" },
  { name: "Jasmine", age: 24, status: "Down for anything", vibe: "💃" },
  { name: "Tunde", age: 28, status: "Looking for gym buddy", vibe: "💪" },
  { name: "Priya", age: 25, status: "Foodie exploring", vibe: "🍜" },
  { name: "Kwame", age: 30, status: "Networking & vibes", vibe: "🤝" },
  { name: "Zara", age: 21, status: "Just moved here!", vibe: "🌟" },
];

const getAllPeople = () => {
  const allPeople: { name: string; age: number; status: string; vibe: string; lat: number; lng: number; city: string }[] = [];
  Object.keys(cityCoords).forEach((cityId, ci) => {
    const center = cityCoords[cityId];
    const count = 2 + (ci % 2);
    for (let i = 0; i < count; i++) {
      const p = basePeople[(ci * 3 + i) % basePeople.length];
      allPeople.push({
        ...p,
        city: cityId,
        lat: center[0] + (((i * 53 + 17) % 120 - 60) / 600),
        lng: center[1] + (((i * 37 + 29) % 120 - 60) / 500),
      });
    }
  });
  return allPeople;
};

const getAllGroups = () => {
  const cityGroups: Record<string, { name: string; members: string[]; description: string }[]> = {
    austin: [{ name: "Girls Night Out 💅", members: ["Jasmine", "Nneka", "Sophie", "Zara", "Priya"], description: "5 women looking for guys to hang out with tonight!" }],
    dallas: [{ name: "Deep Ellum Girls 💃", members: ["Tasha", "Ayo", "Kemi", "Bria"], description: "Exploring Deep Ellum tonight!" }],
    houston: [{ name: "H-Town Queens 👑", members: ["Chioma", "Adaeze", "Fatou", "Nadia"], description: "Linking up in Midtown tonight!" }],
    nyc: [{ name: "NYC Diaspora 🗽", members: ["Amara", "Kofi", "Chidera"], description: "African diaspora in NYC!" }],
    london: [{ name: "London Afrobeats 🇬🇧", members: ["Tayo", "Ngozi", "Kwesi"], description: "Afrobeats lovers in London!" }],
    paris: [{ name: "Paris Afro Crew 🇫🇷", members: ["Moussa", "Aïssatou", "Sékou"], description: "West African community in Paris!" }],
    lagos: [{ name: "Lagos Island Gang 🇳🇬", members: ["Tolu", "Chidi", "Amina", "Bayo"], description: "Detty December crew!" }],
    nairobi: [{ name: "Nairobi Creatives 🇰🇪", members: ["Wanjiku", "Otieno", "Achieng"], description: "Art & music in Nairobi!" }],
    accra: [{ name: "Accra Year of Return 🇬🇭", members: ["Kwesi", "Abena", "Kofi"], description: "Diaspora returnees in Accra!" }],
    johannesburg: [{ name: "Jozi Amapiano Crew 🇿🇦", members: ["Thando", "Sipho", "Nomsa", "Buhle"], description: "Amapiano lovers in Joburg!" }],
    kigali: [{ name: "Kigali Tech Hub 🇷🇼", members: ["Jean", "Claudine", "Patrick"], description: "Tech community in Kigali!" }],
    addisababa: [{ name: "Addis Vibes 🇪🇹", members: ["Hana", "Dawit", "Meron"], description: "Ethiopian cultural events!" }],
    kinshasa: [{ name: "Kin la Belle 🇨🇩", members: ["Fiston", "Nadège", "Patrick", "Merveille"], description: "Rumba & sapeur culture!" }],
    dakar: [{ name: "Dakar Creatives 🇸🇳", members: ["Ousmane", "Fatou", "Aminata"], description: "Art & music in Dakar!" }],
    cairo: [{ name: "Cairo Nights 🇪🇬", members: ["Ahmed", "Nour", "Yara"], description: "Nightlife in Cairo!" }],
    capetown: [{ name: "Cape Town Vibes 🇿🇦", members: ["Lebo", "Mandla", "Zinhle", "Tumi"], description: "Jazz & culture in Cape Town!" }],
  };

  const allGroupsArr: { name: string; members: string[]; description: string; lat: number; lng: number; city: string }[] = [];
  Object.keys(cityGroups).forEach((cityId) => {
    const center = cityCoords[cityId];
    if (!center) return;
    cityGroups[cityId].forEach((g, i) => {
      allGroupsArr.push({
        ...g,
        city: cityId,
        lat: center[0] + (((i * 43 + 11) % 80 - 40) / 500),
        lng: center[1] + (((i * 31 + 19) % 80 - 40) / 400),
      });
    });
  });
  return allGroupsArr;
};

const allPeople = getAllPeople();
const allGroups = getAllGroups();

interface MapScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const MapScreen = ({ selectedCity, onCityChange }: MapScreenProps) => {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [showEvents, setShowEvents] = useState(true);
  const [showPeople, setShowPeople] = useState(true);
  const [showGroups, setShowGroups] = useState(true);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [nearbyCollapsed, setNearbyCollapsed] = useState(false);
  const [selectedNearbyEvent, setSelectedNearbyEvent] = useState<any>(null);
  const [globeReady, setGlobeReady] = useState(false);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fly to selected city
  useEffect(() => {
    if (globeRef.current && cityCoords[selectedCity.id] && globeReady) {
      const [lat, lng] = cityCoords[selectedCity.id];
      globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 1000);
    }
  }, [selectedCity, globeReady]);

  // Initial globe setup
  const handleGlobeReady = useCallback(() => {
    setGlobeReady(true);
    if (globeRef.current) {
      // Set initial view
      const [lat, lng] = cityCoords[selectedCity.id] || [0, 20];
      globeRef.current.pointOfView({ lat, lng, altitude: 2.5 }, 0);

      // Enable auto-rotation
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
      }
    }
  }, [selectedCity.id]);

  // Generate points data
  const pointsData = useMemo(() => {
    const points: PointData[] = [];

    if (showEvents) {
      allEvents.forEach((event) => {
        const coords = cityCoords[event.city];
        if (!coords) return;
        const seed = event.id * 137;
        points.push({
          lat: coords[0] + (((seed % 100) - 50) / 800),
          lng: coords[1] + ((((seed * 7) % 100) - 50) / 600),
          color: "#f59e0b",
          radius: 0.35,
          altitude: 0.01,
          type: "event",
          label: `📅 ${event.title}\n${event.date}\n📍 ${event.venue}`,
          data: event,
        });
      });
    }

    if (showPeople) {
      allPeople.forEach((person) => {
        points.push({
          lat: person.lat,
          lng: person.lng,
          color: "#60a5fa",
          radius: 0.2,
          altitude: 0.005,
          type: "person",
          label: `${person.vibe} ${person.name}, ${person.age}\n${person.status}`,
        });
      });
    }

    if (showGroups) {
      allGroups.forEach((group) => {
        points.push({
          lat: group.lat,
          lng: group.lng,
          color: "#c084fc",
          radius: 0.45,
          altitude: 0.015,
          type: "group",
          label: `${group.name}\n${group.description}\n👥 ${group.members.length} members`,
        });
      });
    }

    return points;
  }, [showEvents, showPeople, showGroups]);

  const handleCitySelect = (city: City) => {
    onCityChange(city);
    setShowCityPicker(false);
    if (globeRef.current && cityCoords[city.id]) {
      const [lat, lng] = cityCoords[city.id];
      globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 1000);
      // Stop auto-rotate when user selects a city
      const controls = globeRef.current.controls();
      if (controls) controls.autoRotate = false;
    }
  };

  const handlePointClick = useCallback((point: any) => {
    if (point.type === "event" && point.data) {
      setSelectedNearbyEvent(point.data);
      // Stop auto-rotate
      if (globeRef.current) {
        const controls = globeRef.current.controls();
        if (controls) controls.autoRotate = false;
      }
    }
  }, []);

  const nearbyEvents = allEvents.filter((e) => e.city === selectedCity.id).slice(0, 5);

  // Group cities by region for the picker
  const africaCities = cities.filter(c => {
    const coords = cityCoords[c.id];
    if (!coords) return false;
    return coords[0] >= -35 && coords[0] <= 38 && coords[1] >= -25 && coords[1] <= 55;
  });

  return (
    <div ref={containerRef} className="fixed inset-0 bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-[1000] glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Navigation size={18} className="text-primary" />
            <h1 className="font-display text-lg font-bold text-gradient-gold">Explore</h1>
          </div>
          <button
            onClick={() => setShowCityPicker(!showCityPicker)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border"
          >
            <MapPin size={14} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedCity.flag} {selectedCity.name}
            </span>
            <ChevronDown
              size={14}
              className={`text-muted-foreground transition-transform ${showCityPicker ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {showCityPicker && (
          <div className="absolute left-4 right-4 top-full mt-1 bg-card border border-border rounded-xl shadow-elevated z-50 overflow-y-auto max-h-[60vh] animate-slide-up max-w-lg mx-auto">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCitySelect(city)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
              >
                <span className="text-lg">{city.flag}</span>
                <span className="text-sm font-medium text-foreground flex-1 text-left">{city.name}</span>
                {city.id === selectedCity.id && <Check size={16} className="text-primary" />}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Filter toggles */}
      <div className="absolute top-16 left-4 right-4 z-[1000] max-w-lg mx-auto">
        <div className="flex gap-2">
          <button
            onClick={() => setShowEvents(!showEvents)}
            className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card ${
              showEvents ? "gradient-gold text-primary-foreground" : "bg-card text-muted-foreground border border-border"
            }`}
          >
            <Calendar size={14} /> Events ({allEvents.length})
          </button>
          <button
            onClick={() => setShowPeople(!showPeople)}
            className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card ${
              showPeople ? "gradient-gold text-primary-foreground" : "bg-card text-muted-foreground border border-border"
            }`}
          >
            <Users size={14} /> People ({allPeople.length})
          </button>
          <button
            onClick={() => setShowGroups(!showGroups)}
            className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card ${
              showGroups ? "bg-[hsl(280,70%,55%)] text-white" : "bg-card text-muted-foreground border border-border"
            }`}
          >
            <Users size={14} /> Groups ({allGroups.length})
          </button>
        </div>
      </div>

      {/* 3D Globe */}
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(8,18,35,1)"
        atmosphereColor="hsl(140, 50%, 60%)"
        atmosphereAltitude={0.18}
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius="radius"
        pointAltitude="altitude"
        pointLabel="label"
        onPointClick={handlePointClick}
        onGlobeReady={handleGlobeReady}
        animateIn={true}
      />

      {/* Selected event detail overlay */}
      {selectedNearbyEvent && (
        <>
          <div
            className="fixed inset-0 z-[1001] bg-background/40"
            onClick={() => setSelectedNearbyEvent(null)}
          />
          <div className="absolute bottom-20 left-4 right-4 z-[1002] max-w-lg mx-auto animate-slide-up">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-elevated">
              <div className="relative">
                <img src={selectedNearbyEvent.image} alt="" className="w-full h-40 object-cover" />
                <button
                  onClick={() => setSelectedNearbyEvent(null)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
                >
                  <X size={16} className="text-foreground" />
                </button>
                {selectedNearbyEvent.price && (
                  <span className="absolute top-2 left-2 px-3 py-1 rounded-full gradient-gold text-primary-foreground text-xs font-semibold">
                    {selectedNearbyEvent.price}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-foreground text-lg">{selectedNearbyEvent.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{selectedNearbyEvent.host}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-primary" />
                    <span>{selectedNearbyEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-primary" />
                    <span>{selectedNearbyEvent.venue}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">
                    {selectedNearbyEvent.attending >= 1000
                      ? `${(selectedNearbyEvent.attending / 1000).toFixed(1)}K`
                      : selectedNearbyEvent.attending}{" "}
                    attending
                  </span>
                  <button className="px-5 py-2 rounded-full gradient-gold text-primary-foreground text-sm font-semibold shadow-gold">
                    RSVP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom info card - collapsible */}
      <div className="absolute bottom-20 left-4 right-4 z-[1000] max-w-lg mx-auto">
        <div className="bg-card/95 backdrop-blur-md rounded-2xl border border-border shadow-elevated overflow-hidden">
          <button
            onClick={() => setNearbyCollapsed(!nearbyCollapsed)}
            className="w-full flex items-center justify-between px-4 py-3"
          >
            <h3 className="font-display font-bold text-foreground text-sm">Nearby This Week</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary font-semibold">{nearbyEvents.length} events</span>
              {nearbyCollapsed ? (
                <ChevronUp size={16} className="text-muted-foreground" />
              ) : (
                <ChevronDown size={16} className="text-muted-foreground" />
              )}
            </div>
          </button>
          {!nearbyCollapsed && (
            <div className="px-4 pb-3">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {nearbyEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedNearbyEvent(event)}
                    className="flex-shrink-0 w-36 bg-secondary rounded-xl overflow-hidden text-left hover:ring-2 hover:ring-primary/30 transition-all"
                  >
                    <img src={event.image} alt="" className="w-full h-16 object-cover" />
                    <div className="p-2">
                      <p className="text-[11px] font-semibold text-foreground leading-tight line-clamp-2">
                        {event.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{event.date.split("·")[0]}</p>
                      {event.price && (
                        <p className="text-[10px] font-bold text-primary mt-0.5">{event.price}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
