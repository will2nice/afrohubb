import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Users, Calendar, Navigation, Ticket } from "lucide-react";
import { events as allEvents, cities, type City } from "@/data/cityData";

// City coordinates
const cityCoords: Record<string, [number, number]> = {
  austin: [30.2672, -97.7431],
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
  return cityEvents.map((event, i) => {
    const seed = event.id * 137;
    const lat = center[0] + (((seed % 100) - 50) / 500);
    const lng = center[1] + ((((seed * 7) % 100) - 50) / 400);
    return { ...event, lat, lng };
  });
};

// People nearby (mock)
const getNearbyPeople = (cityId: string) => {
  const center = cityCoords[cityId] || cityCoords.austin;
  const names = ["Amara", "Kofi", "Chidera", "Sophie", "Dayo", "Nneka", "Marcus", "Jasmine"];
  return names.slice(0, 5).map((name, i) => ({
    name,
    lat: center[0] + (((i * 53 + 17) % 80 - 40) / 600),
    lng: center[1] + (((i * 37 + 29) % 80 - 40) / 500),
    status: i % 2 === 0 ? "Looking for events" : "Down to hang",
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
}

const MapScreen = ({ selectedCity }: MapScreenProps) => {
  const [showEvents, setShowEvents] = useState(true);
  const [showPeople, setShowPeople] = useState(true);
  const center = cityCoords[selectedCity.id] || cityCoords.austin;
  const eventPositions = getEventPositions(selectedCity.id);
  const nearbyPeople = getNearbyPeople(selectedCity.id);

  return (
    <div className="fixed inset-0 bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-[1000] glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Navigation size={18} className="text-primary" />
            <h1 className="font-display text-lg font-bold text-gradient-gold">Explore</h1>
          </div>
          <span className="text-sm text-muted-foreground">{selectedCity.flag} {selectedCity.name}</span>
        </div>
      </header>

      {/* Toggle filters */}
      <div className="absolute top-16 left-4 right-4 z-[1000] max-w-lg mx-auto">
        <div className="flex gap-2">
          <button
            onClick={() => setShowEvents(!showEvents)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card ${
              showEvents ? "gradient-gold text-primary-foreground" : "bg-card text-muted-foreground border border-border"
            }`}
          >
            <Calendar size={14} />
            Events ({eventPositions.length})
          </button>
          <button
            onClick={() => setShowPeople(!showPeople)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card ${
              showPeople ? "gradient-gold text-primary-foreground" : "bg-card text-muted-foreground border border-border"
            }`}
          >
            <Users size={14} />
            People Nearby
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
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

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
                <p className="font-bold text-sm">{person.name}</p>
                <p className="text-xs text-gray-500">{person.status}</p>
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
            <span className="text-xs text-primary font-semibold">{eventPositions.length} events</span>
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
