import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Users, Calendar, Navigation, ChevronDown, Check, ChevronUp, X, Heart, Briefcase, ExternalLink, Ticket } from "lucide-react";
import { events as allEvents, cities, type City } from "@/data/cityData";
import { cityResources, type CityResource } from "@/data/resourceData";
import { diasporaHubs, type DiasporaHub } from "@/data/diasporaHubs";
import { useEvents } from "@/hooks/useEvents";

// City coordinates - includes Brazil
const cityCoords: Record<string, [number, number]> = {
  austin: [30.2672, -97.7431],
  dallas: [32.7767, -96.7970],
  fortworth: [32.7555, -97.3308],
  arlington: [32.7357, -97.1081],
  irving: [32.8140, -96.9489],
  richardson: [32.9483, -96.7299],
  carrollton: [32.9537, -96.8903],
  coppell: [32.9546, -97.0150],
  houston: [29.7604, -95.3698],
  sanantonio: [29.4241, -98.4936],
  // US Major Cities
  nyc: [40.7128, -74.006],
  atlanta: [33.7490, -84.3880],
  miami: [25.7617, -80.1918],
  orlando: [28.5383, -81.3792],
  philadelphia: [39.9526, -75.1652],
  raleigh: [35.7796, -78.6382],
  nashville: [36.1627, -86.7816],
  memphis: [35.1495, -90.0490],
  desmoines: [41.5868, -93.6250],
  minneapolis: [44.9778, -93.2650],
  milwaukee: [43.0389, -87.9065],
  seattle: [47.6062, -122.3321],
  dc: [38.9072, -77.0369],
  portland: [45.5152, -122.6784],
  boston: [42.3601, -71.0589],
  losangeles: [34.0522, -118.2437],
  sanfrancisco: [37.7749, -122.4194],
  sandiego: [32.7157, -117.1611],
  lasvegas: [36.1699, -115.1398],
  phoenix: [33.4484, -112.0740],
  scottsdale: [33.4942, -111.9261],
  denver: [39.7392, -104.9903],
  chicago: [41.8781, -87.6298],
  detroit: [42.3314, -83.0458],
  grandrapids: [42.9634, -85.6681],
  lansing: [42.7325, -84.5555],
  cleveland: [41.4993, -81.6944],
  kansascity: [39.0997, -94.5786],
  lincoln: [40.8136, -96.7026],
  omaha: [41.2565, -95.9345],
  wichita: [37.6872, -97.3301],
  lubbock: [33.5779, -101.8552],
  richmond: [37.5407, -77.4360],
  norfolk: [36.8508, -76.2859],
  providence: [41.8240, -71.4128],
  bridgeport: [41.1865, -73.1952],
  manchester: [42.9956, -71.4548],
  siouxfalls: [43.5446, -96.7311],
  fargo: [46.8772, -96.7898],
  saltlakecity: [40.7608, -111.8910],
  // Canada
  toronto: [43.6532, -79.3832],
  calgary: [51.0447, -114.0719],
  montreal: [45.5017, -73.5673],
  // Europe
  paris: [48.8566, 2.3522],
  london: [51.5074, -0.1278],
  brussels: [50.8503, 4.3517],
  amsterdam: [52.3676, 4.9041],
  rotterdam: [51.9244, 4.4777],
  antwerp: [51.2194, 4.4025],
  barcelona: [41.3874, 2.1686],
  madrid: [40.4168, -3.7038],
  bordeaux: [44.8378, -0.5792],
  stockholm: [59.3293, 18.0686],
  rome: [41.9028, 12.4964],
  positano: [40.6281, 14.4850],
  athens: [37.9838, 23.7275],
  istanbul: [41.0082, 28.9784],
  berlin: [52.5200, 13.4050],
  dublin: [53.3498, -6.2603],
  copenhagen: [55.6761, 12.5683],
  oslo: [59.9139, 10.7522],
  helsinki: [60.1699, 24.9384],
  // Brazil
  rio: [-22.9068, -43.1729],
  saopaulo: [-23.5505, -46.6333],
  salvador: [-12.9714, -38.5124],
};

// Custom marker icons
const eventIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,hsl(25,95%,55%),hsl(43,96%,56%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(0,0%,5%)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/></svg>
  </div>`,
  iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
});

const eventbriteIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,hsl(14,100%,53%),hsl(25,100%,60%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/></svg>
  </div>`,
  iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
});

const poshIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,hsl(270,80%,60%),hsl(290,70%,55%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/></svg>
  </div>`,
  iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
});

const personIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:32px;height:32px;border-radius:50%;background:hsl(0,0%,16%);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(43,96%,56%);">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(43,96%,56%)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  </div>`,
  iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32],
});

const groupIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,hsl(320,70%,50%),hsl(280,70%,55%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  </div>`,
  iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -40],
});

const nonprofitIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,hsl(150,70%,40%),hsl(170,60%,45%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  </div>`,
  iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
});

const hiringIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,hsl(210,80%,50%),hsl(230,70%,55%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
  </div>`,
  iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
});

const youIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:20px;height:20px;border-radius:50%;background:hsl(43,96%,56%);box-shadow:0 0 0 6px hsla(43,96%,56%,0.25),0 4px 12px rgba(0,0,0,0.4);border:3px solid hsl(0,0%,7%);"></div>`,
  iconSize: [20, 20], iconAnchor: [10, 10],
});

const getAllEventPositions = () => {
  return allEvents.map((event) => {
    const eventCity = cityCoords[event.city] || cityCoords.austin;
    const seed = event.id * 137;
    const lat = eventCity[0] + (((seed % 100) - 50) / 500);
    const lng = eventCity[1] + ((((seed * 7) % 100) - 50) / 400);
    return { ...event, lat, lng };
  });
};

const getAllPeople = () => {
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

  const cityLabels: Record<string, string> = {
    austin: "ATX", dallas: "DAL", houston: "HOU", sanantonio: "SA",
    paris: "PAR", london: "LDN", nyc: "NYC",
    brussels: "BXL", amsterdam: "AMS", rotterdam: "RTD", antwerp: "ANT",
    barcelona: "BCN", madrid: "MAD", bordeaux: "BDX", stockholm: "STO",
    rome: "ROM", positano: "POS", athens: "ATH", istanbul: "IST",
    berlin: "BER", dublin: "DUB", copenhagen: "CPH", oslo: "OSL", helsinki: "HEL",
    rio: "RIO", saopaulo: "SP", salvador: "SSA",
  };

  const allPeople: { name: string; age: number; status: string; vibe: string; lat: number; lng: number }[] = [];
  Object.keys(cityCoords).forEach((cityId, ci) => {
    const center = cityCoords[cityId];
    const label = cityLabels[cityId] || cityId.toUpperCase().slice(0, 3);
    const count = 2 + (ci % 2);
    for (let i = 0; i < count; i++) {
      const p = basePeople[(ci * 3 + i) % basePeople.length];
      allPeople.push({ ...p, name: `${p.name} (${label})`, lat: center[0] + (((i * 53 + 17) % 120 - 60) / 600), lng: center[1] + (((i * 37 + 29) % 120 - 60) / 500) });
    }
  });
  return allPeople;
};

const getAllGroups = () => {
  const cityGroups: Record<string, { name: string; members: string[]; description: string }[]> = {
    austin: [{ name: "Girls Night Out 💅", members: ["Jasmine", "Nneka", "Sophie", "Zara", "Priya"], description: "5 women looking for guys to hang out with tonight!" }, { name: "Culture Crew 🎭", members: ["Amara", "Chidera", "Dayo"], description: "Exploring art galleries & live music." }],
    dallas: [{ name: "Deep Ellum Girls 💃", members: ["Tasha", "Ayo", "Kemi", "Bria"], description: "Exploring Deep Ellum tonight!" }],
    houston: [{ name: "H-Town Queens 👑", members: ["Chioma", "Adaeze", "Fatou", "Nadia"], description: "Linking up in Midtown tonight!" }],
    nyc: [{ name: "NYC Diaspora 🗽", members: ["Amara", "Kofi", "Chidera"], description: "African diaspora in NYC!" }],
    london: [{ name: "London Afrobeats 🇬🇧", members: ["Tayo", "Ngozi", "Kwesi"], description: "Afrobeats lovers in London!" }],
    paris: [{ name: "Paris Afro Crew 🇫🇷", members: ["Moussa", "Aïssatou", "Sékou"], description: "West African community in Paris!" }],
    rio: [{ name: "Rio Afro Brasileiro 🇧🇷", members: ["Carlos", "Mariana", "João", "Aline"], description: "Celebrating Afro-Brazilian culture in Rio!" }],
    saopaulo: [{ name: "SP Black Movement 🇧🇷", members: ["Rafael", "Camila", "Lucas"], description: "Black culture & events in São Paulo!" }],
    salvador: [{ name: "Salvador Axé 🇧🇷", members: ["Ana", "Pedro", "Luísa", "Diego"], description: "The heart of Afro-Brazilian culture!" }],
    brussels: [{ name: "Matonge Crew 🇨🇩", members: ["Fiston", "Nadège", "Patrick"], description: "Congolese community in Brussels!" }],
    amsterdam: [{ name: "Kwaku Squad 🇸🇷", members: ["Jaylen", "Shaniqua", "Devon"], description: "Surinamese crew!" }],
    berlin: [{ name: "Berlin Afro Collective 🇩🇪", members: ["Ama", "Yaw", "Efua"], description: "Afro-German community events!" }],
  };

  const allGroupsArr: { name: string; members: string[]; description: string; lat: number; lng: number }[] = [];
  Object.keys(cityGroups).forEach((cityId) => {
    const center = cityCoords[cityId];
    if (!center) return;
    cityGroups[cityId].forEach((g, i) => {
      allGroupsArr.push({ ...g, lat: center[0] + (((i * 43 + 11) % 80 - 40) / 500), lng: center[1] + (((i * 31 + 19) % 80 - 40) / 400) });
    });
  });
  return allGroupsArr;
};

const getResourcePositions = () => {
  return cityResources.map((resource) => {
    const center = cityCoords[resource.city] || cityCoords.austin;
    const seed = resource.id * 179;
    const lat = center[0] + (((seed % 100) - 50) / 550);
    const lng = center[1] + ((((seed * 11) % 100) - 50) / 450);
    return { ...resource, lat, lng };
  });
};

// Generate hub icon with flags arranged in a circle
const createHubIcon = (hub: DiasporaHub) => {
  const flags = hub.communities.map(c => c.countryFlag);
  const count = flags.length;
  const size = 56;
  const radius = 20;
  const centerX = size / 2;
  const centerY = size / 2;
  
  const flagElements = flags.slice(0, 6).map((flag, i) => {
    const angle = (i * (2 * Math.PI / Math.min(count, 6))) - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle) - 7;
    const y = centerY + radius * Math.sin(angle) - 7;
    return `<span style="position:absolute;left:${x}px;top:${y}px;font-size:13px;line-height:1;">${flag}</span>`;
  }).join("");

  const totalPop = hub.communities.reduce((sum, c) => {
    const num = parseInt(c.population.replace(/[^0-9]/g, "")) || 0;
    return sum + num;
  }, 0);
  const popLabel = totalPop >= 100000 ? `${Math.round(totalPop / 1000)}K` : totalPop >= 1000 ? `${Math.round(totalPop / 1000)}K` : `${totalPop}`;

  return new L.DivIcon({
    className: "custom-marker",
    html: `<div style="width:${size}px;height:${size}px;position:relative;">
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
        <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,hsl(25,95%,55%),hsl(43,96%,56%));display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px hsl(0,0%,7%),0 0 16px rgba(243,186,47,0.4);z-index:2;">
          <span style="font-size:9px;font-weight:800;color:hsl(0,0%,5%);letter-spacing:-0.5px;">${popLabel}</span>
        </div>
      </div>
      ${flagElements}
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Prepare hub positions
const hubPositions = diasporaHubs.filter(h => cityCoords[h.cityId]).map(hub => ({
  ...hub,
  lat: cityCoords[hub.cityId][0],
  lng: cityCoords[hub.cityId][1],
}));

const allEventPositions = getAllEventPositions();
const allPeople = getAllPeople();
const allGroups = getAllGroups();
const allResources = getResourcePositions();

const MapController = ({ targetCity, onZoomDone }: { targetCity: string | null; onZoomDone: () => void }) => {
  const map = useMap();
  useEffect(() => {
    if (targetCity && cityCoords[targetCity]) {
      map.setView(cityCoords[targetCity], 12, { animate: true });
      onZoomDone();
    }
  }, [targetCity, map, onZoomDone]);
  return null;
};

interface MapScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const MapScreen = ({ selectedCity, onCityChange }: MapScreenProps) => {
  const [showEvents, setShowEvents] = useState(true);
  const [showPeople, setShowPeople] = useState(true);
  const [showGroups, setShowGroups] = useState(true);
  const [showResources, setShowResources] = useState(true);
  const [showHubs, setShowHubs] = useState(true);
  const [showEventbrite, setShowEventbrite] = useState(true);
  const [showPosh, setShowPosh] = useState(true);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [zoomTarget, setZoomTarget] = useState<string | null>(selectedCity.id);
  const [nearbyCollapsed, setNearbyCollapsed] = useState(false);
  const [selectedNearbyEvent, setSelectedNearbyEvent] = useState<typeof allEventPositions[0] | null>(null);

  const { events: dbEvents } = useEvents();

  const dbEventPositions = useMemo(() => {
    return dbEvents.filter(e => {
      const source = (e as any).source;
      return source === "eventbrite" || source === "posh";
    }).map((e) => {
      const city = (e as any).city || "austin";
      const center = cityCoords[city] || cityCoords.austin;
      const seed = e.id.split("").reduce((a: number, b: string) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
      const lat = center[0] + (((Math.abs(seed) % 100) - 50) / 500);
      const lng = center[1] + ((((Math.abs(seed) * 7) % 100) - 50) / 400);
      return {
        ...e,
        lat,
        lng,
        source: (e as any).source as string,
        external_url: (e as any).external_url as string | null,
      };
    });
  }, [dbEvents]);

  const center = cityCoords[selectedCity.id] || cityCoords.austin;

  const handleEventClick = (cityId: string) => {
    setZoomTarget(cityId);
    const city = cities.find(c => c.id === cityId);
    if (city) onCityChange(city);
  };

  const handleCitySelect = (city: City) => {
    onCityChange(city);
    setZoomTarget(city.id);
    setShowCityPicker(false);
  };

  // Prioritize Posh/Eventbrite DB events in "Nearby This Week"
  const dbNearby = dbEventPositions
    .filter(e => e.city === selectedCity.id)
    .map(e => ({
      id: Math.abs(e.id.split("").reduce((a: number, b: string) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)),
      title: e.title,
      host: e.source === "posh" ? "via Posh" : "via Eventbrite",
      date: new Date(e.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      venue: e.location || "",
      city: e.city,
      distance: "",
      image: e.image_url || "/placeholder.svg",
      attending: 0,
      free: e.price === "Free",
      price: e.price || undefined,
      category: e.category,
      lat: e.lat,
      lng: e.lng,
      source: e.source,
      external_url: e.external_url,
    }));
  const mockNearby = allEventPositions.filter(e => e.city === selectedCity.id);
  const nearbyEvents = [...dbNearby, ...mockNearby].slice(0, 8);

  return (
    <div className="fixed inset-0 bg-background">
      <header className="absolute top-0 left-0 right-0 z-[1000] glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Navigation size={18} className="text-primary" />
            <h1 className="font-display text-lg font-bold text-gradient-gold">Explore</h1>
          </div>
          <button onClick={() => setShowCityPicker(!showCityPicker)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border">
            <MapPin size={14} className="text-primary" />
            <span className="text-sm font-medium text-foreground">{selectedCity.flag} {selectedCity.name}</span>
            <ChevronDown size={14} className={`text-muted-foreground transition-transform ${showCityPicker ? "rotate-180" : ""}`} />
          </button>
        </div>

        {showCityPicker && (
          <div className="absolute left-4 right-4 top-full mt-1 bg-card border border-border rounded-xl shadow-elevated z-50 overflow-y-auto max-h-[60vh] animate-slide-up max-w-lg mx-auto">
            {cities.map((city) => (
              <button key={city.id} onClick={() => handleCitySelect(city)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors">
                <span className="text-lg">{city.flag}</span>
                <span className="text-sm font-medium text-foreground flex-1 text-left">{city.name}</span>
                {city.id === selectedCity.id && <Check size={16} className="text-primary" />}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="absolute top-16 left-4 right-4 z-[1000] max-w-lg mx-auto">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button onClick={() => setShowEvents(!showEvents)} className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card whitespace-nowrap ${showEvents ? "gradient-gold text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
            <Calendar size={14} /> Events
          </button>
          <button onClick={() => setShowPeople(!showPeople)} className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card whitespace-nowrap ${showPeople ? "gradient-gold text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
            <Users size={14} /> People
          </button>
          <button onClick={() => setShowGroups(!showGroups)} className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card whitespace-nowrap ${showGroups ? "bg-[hsl(320,70%,50%)] text-white" : "bg-card text-muted-foreground border border-border"}`}>
            <Users size={14} /> Groups
          </button>
          <button onClick={() => setShowResources(!showResources)} className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card whitespace-nowrap ${showResources ? "bg-[hsl(150,70%,40%)] text-white" : "bg-card text-muted-foreground border border-border"}`}>
            <Heart size={14} /> Resources
          </button>
          <button onClick={() => setShowHubs(!showHubs)} className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card whitespace-nowrap ${showHubs ? "bg-[hsl(25,95%,55%)] text-white" : "bg-card text-muted-foreground border border-border"}`}>
            <MapPin size={14} /> Hubs
          </button>
          <button onClick={() => setShowEventbrite(!showEventbrite)} className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card whitespace-nowrap ${showEventbrite ? "bg-[hsl(14,100%,53%)] text-white" : "bg-card text-muted-foreground border border-border"}`}>
            <Ticket size={14} /> Eventbrite
          </button>
          <button onClick={() => setShowPosh(!showPosh)} className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card whitespace-nowrap ${showPosh ? "bg-[hsl(270,80%,60%)] text-white" : "bg-card text-muted-foreground border border-border"}`}>
            <Ticket size={14} /> Posh
          </button>
        </div>
      </div>

      <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }} zoomControl={false} attributionControl={false} minZoom={2} maxBoundsViscosity={0} worldCopyJump={true}>
        <MapController targetCity={zoomTarget} onZoomDone={() => setZoomTarget(null)} />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        <Marker position={center} icon={youIcon}>
          <Popup className="afro-popup"><div className="text-sm font-semibold">📍 You are here</div></Popup>
        </Marker>

        {showEvents && allEventPositions.map((event) => (
          <Marker key={`event-${event.id}`} position={[event.lat, event.lng]} icon={eventIcon} eventHandlers={{ click: () => handleEventClick(event.city) }}>
            <Popup className="afro-popup" maxWidth={280}>
              <div className="p-1">
                <img src={event.image} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
                <h3 className="font-bold text-sm leading-tight">{event.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{event.host}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500"><span>{event.date}</span></div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500"><span>{event.venue}</span></div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{event.attending >= 1000 ? `${(event.attending / 1000).toFixed(1)}K` : event.attending} attending</span>
                  {event.price && <span className="text-xs font-bold text-amber-600">{event.price}</span>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {showPeople && allPeople.map((person, i) => (
          <Marker key={`person-${i}`} position={[person.lat, person.lng]} icon={personIcon}>
            <Popup className="afro-popup">
              <div className="p-1">
                <p className="font-bold text-sm">{person.vibe} {person.name}, {person.age}</p>
                <p className="text-xs text-gray-500">{person.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {showGroups && allGroups.map((group, i) => (
          <Marker key={`group-${i}`} position={[group.lat, group.lng]} icon={groupIcon}>
            <Popup className="afro-popup" maxWidth={260}>
              <div className="p-1">
                <p className="font-bold text-sm">{group.name}</p>
                <p className="text-xs text-gray-500 mt-1">{group.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {group.members.map((m) => (
                    <span key={m} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-medium">{m}</span>
                  ))}
                </div>
                <button className="w-full mt-2 py-1.5 rounded-full bg-purple-500 text-white text-xs font-semibold">Request to Join</button>
              </div>
            </Popup>
          </Marker>
        ))}

        {showResources && allResources.map((resource) => (
          <Marker key={`resource-${resource.id}`} position={[resource.lat, resource.lng]} icon={resource.type === "nonprofit" ? nonprofitIcon : hiringIcon}>
            <Popup className="afro-popup" maxWidth={280}>
              <div className="p-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${resource.type === "nonprofit" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                    {resource.type === "nonprofit" ? "Nonprofit" : "Hiring"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">{resource.category}</span>
                </div>
                <h3 className="font-bold text-sm leading-tight">{resource.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{resource.description}</p>
                {resource.website && (
                  <a href={resource.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 mt-1 block">Visit Website →</a>
                )}
                <button className={`w-full mt-2 py-1.5 rounded-full text-white text-xs font-semibold ${resource.type === "nonprofit" ? "bg-emerald-500" : "bg-blue-500"}`}>
                  {resource.type === "nonprofit" ? "Learn More" : "View Openings"}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {showHubs && hubPositions.map((hub) => (
          <Marker key={`hub-${hub.cityId}`} position={[hub.lat, hub.lng]} icon={createHubIcon(hub)} eventHandlers={{ click: () => handleEventClick(hub.cityId) }}>
            <Popup className="afro-popup" maxWidth={300}>
              <div className="p-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{hub.flag}</span>
                  <div>
                    <h3 className="font-bold text-sm">{hub.city}</h3>
                    <p className="text-[10px] text-gray-500">{hub.state} · Diaspora Hub</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {hub.communities.map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{c.countryFlag}</span>
                        <span className="text-xs font-medium">{c.country}</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-600">{c.population}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Eventbrite events from DB */}
        {showEventbrite && dbEventPositions.filter(e => e.source === "eventbrite").map((event) => (
          <Marker key={`eb-${event.id}`} position={[event.lat, event.lng]} icon={eventbriteIcon} eventHandlers={{ click: () => handleEventClick(event.city) }}>
            <Popup className="afro-popup" maxWidth={280}>
              <div className="p-1">
                {event.image_url && <img src={event.image_url} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">Eventbrite</span>
                </div>
                <h3 className="font-bold text-sm leading-tight">{event.title}</h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                  <span>{new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                </div>
                {event.location && <div className="text-xs text-gray-500 mt-1">{event.location}</div>}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-amber-600">{event.price || "Free"}</span>
                  {event.external_url && (
                    <a href={event.external_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 flex items-center gap-1">
                      View <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Posh events from DB */}
        {showPosh && dbEventPositions.filter(e => e.source === "posh").map((event) => (
          <Marker key={`posh-${event.id}`} position={[event.lat, event.lng]} icon={poshIcon} eventHandlers={{ click: () => handleEventClick(event.city) }}>
            <Popup className="afro-popup" maxWidth={280}>
              <div className="p-1">
                {event.image_url && <img src={event.image_url} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">Posh</span>
                </div>
                <h3 className="font-bold text-sm leading-tight">{event.title}</h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                  <span>{new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                </div>
                {event.location && <div className="text-xs text-gray-500 mt-1">{event.location}</div>}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-purple-600">{event.price || "Free"}</span>
                  {event.external_url && (
                    <a href={event.external_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-500 flex items-center gap-1">
                      View <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Selected event detail overlay */}
      {selectedNearbyEvent && (
        <>
          <div className="fixed inset-0 z-[1001] bg-background/40" onClick={() => setSelectedNearbyEvent(null)} />
          <div className="absolute bottom-20 left-4 right-4 z-[1002] max-w-lg mx-auto animate-slide-up">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-elevated">
              <div className="relative">
                <img src={selectedNearbyEvent.image} alt="" className="w-full h-40 object-cover" />
                <button onClick={() => setSelectedNearbyEvent(null)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
                  <X size={16} className="text-foreground" />
                </button>
                {selectedNearbyEvent.price && (
                  <span className="absolute top-2 left-2 px-3 py-1 rounded-full gradient-gold text-primary-foreground text-xs font-semibold">{selectedNearbyEvent.price}</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-foreground text-lg">{selectedNearbyEvent.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{selectedNearbyEvent.host}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar size={14} className="text-primary" /><span>{selectedNearbyEvent.date}</span></div>
                  <div className="flex items-center gap-1"><MapPin size={14} className="text-primary" /><span>{selectedNearbyEvent.venue}</span></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">{selectedNearbyEvent.attending} attending</span>
                  <button className="px-5 py-2 rounded-full gradient-gold text-primary-foreground text-sm font-semibold shadow-gold">RSVP</button>
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
              {nearbyCollapsed ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
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
                      <p className="text-[11px] font-semibold text-foreground leading-tight line-clamp-2">{event.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{event.date.split("·")[0]}</p>
                      {event.price && <p className="text-[10px] font-bold text-primary mt-0.5">{event.price}</p>}
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
