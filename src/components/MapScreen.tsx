import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Users, Calendar, Navigation, ChevronDown, Check } from "lucide-react";
import { events as allEvents, cities, type City } from "@/data/cityData";

// City coordinates
const cityCoords: Record<string, [number, number]> = {
  austin: [30.2672, -97.7431],
  dallas: [32.7767, -96.7970],
  houston: [29.7604, -95.3698],
  sanantonio: [29.4241, -98.4936],
  paris: [48.8566, 2.3522],
  london: [51.5074, -0.1278],
  nyc: [40.7128, -74.006],
};

// Custom marker icons
const eventIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,hsl(25,95%,55%),hsl(43,96%,56%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(0,0%,5%)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/></svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const personIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:32px;height:32px;border-radius:50%;background:hsl(0,0%,16%);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(43,96%,56%);">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(43,96%,56%)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const groupIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,hsl(320,70%,50%),hsl(280,70%,55%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const youIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:20px;height:20px;border-radius:50%;background:hsl(43,96%,56%);box-shadow:0 0 0 6px hsla(43,96%,56%,0.25),0 4px 12px rgba(0,0,0,0.4);border:3px solid hsl(0,0%,7%);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Generate random nearby positions for events
const getEventPositions = (cityId: string) => {
  const center = cityCoords[cityId] || cityCoords.austin;
  const cityEvents = allEvents.filter((e) => e.city === cityId);
  return cityEvents.map((event) => {
    const seed = event.id * 137;
    const lat = center[0] + (((seed % 100) - 50) / 500);
    const lng = center[1] + ((((seed * 7) % 100) - 50) / 400);
    return { ...event, lat, lng };
  });
};

// 12 people nearby + 1 group
const getNearbyPeople = (cityId: string) => {
  const center = cityCoords[cityId] || cityCoords.austin;
  const people = [
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
  return people.map((p, i) => ({
    ...p,
    lat: center[0] + (((i * 53 + 17) % 120 - 60) / 600),
    lng: center[1] + (((i * 37 + 29) % 120 - 60) / 500),
  }));
};

// Groups per city
const getGroups = (cityId: string) => {
  const center = cityCoords[cityId] || cityCoords.austin;
  const cityGroups: Record<string, { name: string; members: string[]; description: string }[]> = {
    austin: [
      { name: "Girls Night Out 💅", members: ["Jasmine", "Nneka", "Sophie", "Zara", "Priya"], description: "5 women looking for guys to hang out with tonight! Bar-hopping downtown." },
      { name: "Culture Crew 🎭", members: ["Amara", "Chidera", "Dayo"], description: "Exploring art galleries & live music. Everyone welcome!" },
      { name: "Foodies United 🍕", members: ["Tunde", "Kwame", "Marcus", "Kofi"], description: "4 guys doing a food crawl. Join us!" },
      { name: "Soccer Squad ⚽", members: ["Kofi", "Dayo", "Tunde", "Marcus"], description: "Looking for players for pickup soccer at Zilker!" },
      { name: "Brunch Babes 🥂", members: ["Amara", "Sophie", "Zara"], description: "Sunday brunch crew looking for more people!" },
    ],
    dallas: [
      { name: "Deep Ellum Girls 💃", members: ["Tasha", "Ayo", "Kemi", "Bria", "Fatima"], description: "5 women exploring Deep Ellum tonight! Come hang!" },
      { name: "DFW Ballers 🏀", members: ["Kwame", "Tunde", "Deji", "Marcus"], description: "Sports & vibes crew. Looking for more!" },
      { name: "Afro Foodies DFW 🍜", members: ["Priya", "Nneka", "Sophie"], description: "Food crawl through Bishop Arts District!" },
      { name: "FIFA Squad 🎮", members: ["Deji", "Kofi", "Jalen", "Emeka"], description: "FIFA tournament prep. Need 2 more players!" },
      { name: "Networking Crew 🤝", members: ["Kwame", "Tasha", "Marcus"], description: "Professionals linking up in Dallas!" },
    ],
    houston: [
      { name: "H-Town Queens 👑", members: ["Chioma", "Adaeze", "Fatou", "Nadia", "Imani"], description: "5 women looking to link up in Midtown tonight!" },
      { name: "Third Ward Crew 🔥", members: ["Dayo", "Marcus", "Jalen", "Emeka"], description: "Exploring Third Ward culture. Pull up!" },
      { name: "Yacht Life 🛥️", members: ["Sophie", "Zara", "Priya"], description: "Planning a yacht party. Need more people!" },
      { name: "Soccer Sundays ⚽", members: ["Kofi", "Tunde", "Rashid", "Moussa"], description: "Weekly pickup soccer at Bear Creek!" },
      { name: "Art & Music 🎨", members: ["Amara", "Chidera", "Nneka"], description: "Gallery hopping in the Museum District!" },
    ],
    sanantonio: [
      { name: "Riverwalk Ladies 🌊", members: ["Maya", "Jasmine", "Priya", "Zara", "Aisha"], description: "5 women on the Riverwalk looking for guys to hang!" },
      { name: "Alamo City Squad 🤠", members: ["Kofi", "Dayo", "Tunde", "Marcus"], description: "Guys exploring SA nightlife. Join us!" },
      { name: "Fiesta Crew 🎉", members: ["Sophie", "Nneka", "Amara"], description: "Getting ready for Fiesta season!" },
      { name: "SA Soccer League ⚽", members: ["Kwame", "Rashid", "Moussa", "Emeka"], description: "Looking for players for our 5-a-side team!" },
      { name: "Taco Crawl 🌮", members: ["Tunde", "Priya", "Chidera"], description: "Best tacos in SA food crawl. Everyone welcome!" },
    ],
  };
  const defaultGroups = cityGroups.austin;
  const groups = cityGroups[cityId] || defaultGroups;
  return groups.map((g, i) => ({
    ...g,
    lat: center[0] + (((i * 43 + 11) % 80 - 40) / 500),
    lng: center[1] + (((i * 31 + 19) % 80 - 40) / 400),
  }));
};

// Component to recenter map when city changes
const RecenterMap = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 13, { animate: true });
  }, [coords, map]);
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
  const [showCityPicker, setShowCityPicker] = useState(false);
  const center = cityCoords[selectedCity.id] || cityCoords.austin;
  const eventPositions = getEventPositions(selectedCity.id);
  const nearbyPeople = getNearbyPeople(selectedCity.id);
  const groups = getGroups(selectedCity.id);

  return (
    <div className="fixed inset-0 bg-background">
      {/* Header with city picker */}
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
            <span className="text-sm font-medium text-foreground">{selectedCity.flag} {selectedCity.name}</span>
            <ChevronDown size={14} className={`text-muted-foreground transition-transform ${showCityPicker ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* City picker dropdown */}
        {showCityPicker && (
          <div className="absolute left-4 right-4 top-full mt-1 bg-card border border-border rounded-xl shadow-elevated z-50 overflow-hidden animate-slide-up max-w-lg mx-auto">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => { onCityChange(city); setShowCityPicker(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
              >
                <span className="text-lg">{city.flag}</span>
                <span className="text-sm font-medium text-foreground flex-1 text-left">{city.name}</span>
                {city.id === selectedCity.id && (
                  <Check size={16} className="text-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Toggle filters */}
      <div className="absolute top-16 left-4 right-4 z-[1000] max-w-lg mx-auto">
        <div className="flex gap-2">
          <button
            onClick={() => setShowEvents(!showEvents)}
            className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card ${
              showEvents ? "gradient-gold text-primary-foreground" : "bg-card text-muted-foreground border border-border"
            }`}
          >
            <Calendar size={14} />
            Events ({eventPositions.length})
          </button>
          <button
            onClick={() => setShowPeople(!showPeople)}
            className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card ${
              showPeople ? "gradient-gold text-primary-foreground" : "bg-card text-muted-foreground border border-border"
            }`}
          >
            <Users size={14} />
            People ({nearbyPeople.length})
          </button>
          <button
            onClick={() => setShowGroups(!showGroups)}
            className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card ${
              showGroups ? "bg-[hsl(320,70%,50%)] text-white" : "bg-card text-muted-foreground border border-border"
            }`}
          >
            <Users size={14} />
            Groups ({groups.length})
          </button>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <RecenterMap coords={center} />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {/* You are here */}
        <Marker position={center} icon={youIcon}>
          <Popup className="afro-popup">
            <div className="text-sm font-semibold">📍 You are here</div>
          </Popup>
        </Marker>

        {/* Event markers */}
        {showEvents && eventPositions.map((event) => (
          <Marker key={`event-${event.id}`} position={[event.lat, event.lng]} icon={eventIcon}>
            <Popup className="afro-popup" maxWidth={280}>
              <div className="p-1">
                <img src={event.image} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
                <h3 className="font-bold text-sm leading-tight">{event.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{event.host}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{event.attending >= 1000 ? `${(event.attending / 1000).toFixed(1)}K` : event.attending} attending</span>
                  {event.price && (
                    <span className="text-xs font-bold text-amber-600">{event.price}</span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* People markers */}
        {showPeople && nearbyPeople.map((person, i) => (
          <Marker key={`person-${i}`} position={[person.lat, person.lng]} icon={personIcon}>
            <Popup className="afro-popup">
              <div className="p-1">
                <p className="font-bold text-sm">{person.vibe} {person.name}, {person.age}</p>
                <p className="text-xs text-gray-500">{person.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Group markers */}
        {showGroups && groups.map((group, i) => (
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
                <button className="w-full mt-2 py-1.5 rounded-full bg-purple-500 text-white text-xs font-semibold">
                  Request to Join
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Bottom info card */}
      <div className="absolute bottom-20 left-4 right-4 z-[1000] max-w-lg mx-auto">
        <div className="bg-card/95 backdrop-blur-md rounded-2xl border border-border p-4 shadow-elevated">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-bold text-foreground text-sm">Nearby This Week</h3>
            <span className="text-xs text-primary font-semibold">{eventPositions.length} events · {nearbyPeople.length} people</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {eventPositions.slice(0, 5).map((event) => (
              <div key={event.id} className="flex-shrink-0 w-36 bg-secondary rounded-xl overflow-hidden">
                <img src={event.image} alt="" className="w-full h-16 object-cover" />
                <div className="p-2">
                  <p className="text-[11px] font-semibold text-foreground leading-tight line-clamp-2">{event.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{event.date.split("·")[0]}</p>
                  {event.price && (
                    <p className="text-[10px] font-bold text-primary mt-0.5">{event.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
