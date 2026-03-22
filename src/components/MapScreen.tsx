import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useScreenView } from "@/hooks/useAnalytics";
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_MAP_ID } from "@/lib/googleMaps";
import { useTheme } from "@/contexts/ThemeContext";
import { MapPin, Users, Calendar, Navigation, ChevronDown, Check, ChevronUp, X, Heart, Briefcase, ExternalLink, Ticket, UtensilsCrossed, Dumbbell, Moon, Globe, HandHelping, Music, Plane, Crosshair, Loader2, Search, Clock, Flame, Ruler, Plus, Lock } from "lucide-react";
import { events as allEvents, cities, type City, AFRO_NATION_EVENT_ID, SXSW_EVENT_ID } from "@/data/cityData";
import afroNationIcon from "@/assets/afro-nation-icon.webp";
import sxswIcon from "@/assets/sxsw-icon.png";
import CityPicker from "@/components/CityPicker";
import { cityResources, type CityResource } from "@/data/resourceData";
import { diasporaHubs, type DiasporaHub } from "@/data/diasporaHubs";
import { useEvents } from "@/hooks/useEvents";
import { usePlaces } from "@/hooks/usePlaces";
import { getFlightRoutes } from "@/data/flightData";
import { useActivities, type Activity } from "@/hooks/useActivities";
import { useAuth } from "@/contexts/AuthContext";
import CreateActivitySheet from "@/components/CreateActivitySheet";

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
  toronto: [43.6532, -79.3832],
  calgary: [51.0447, -114.0719],
  montreal: [45.5017, -73.5673],
  paris: [48.8566, 2.3522],
  london: [51.5074, -0.1278],
  birmingham: [52.4862, -1.8904],
  manchesteruk: [53.4808, -2.2426],
  liverpool: [53.4084, -2.9916],
  nottingham: [52.9548, -1.1581],
  oxford: [51.7520, -1.2577],
  brussels: [50.8503, 4.3517],
  amsterdam: [52.3676, 4.9041],
  rotterdam: [51.9244, 4.4777],
  antwerp: [51.2194, 4.4025],
  barcelona: [41.3874, 2.1686],
  madrid: [40.4168, -3.7038],
  portimao: [37.1386, -8.5380],
  lisbon: [38.7223, -9.1393],
  vienna: [48.2082, 16.3738],
  zurich: [47.3769, 8.5417],
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
  sydney: [-33.8688, 151.2093],
  melbourne: [-37.8136, 144.9631],
  brisbane: [-27.4698, 153.0251],
  perth: [-31.9505, 115.8605],
  adelaide: [-34.9285, 138.6007],
  rio: [-22.9068, -43.1729],
  saopaulo: [-23.5505, -46.6333],
  salvador: [-12.9714, -38.5124],
  sanjuan: [18.4655, -66.1057],
  kingston: [18.0179, -76.8099],
  santodomingo: [18.4861, -69.9312],
  havana: [23.1136, -82.3666],
  portofspain: [10.6596, -61.5086],
  georgetown: [6.8013, -58.1551],
  bridgetownbb: [13.0969, -59.6145],
  panama: [8.9824, -79.5199],
  cartagena: [10.3910, -75.5364],
  cali: [3.4516, -76.5320],
  quito: [-0.1807, -78.4678],
  limon: [9.9907, -83.0359],
  belize: [17.5046, -88.1962],
  managua: [12.1150, -86.2362],
  tegucigalpa: [14.0723, -87.1921],
  cairo: [30.0444, 31.2357],
  luxor: [25.6872, 32.6396],
  khartoum: [15.5007, 32.5599],
  addisababa: [9.0192, 38.7525],
  nairobi: [-1.2921, 36.8219],
  daressalaam: [-6.7924, 39.2083],
  zanzibar: [-6.1659, 39.2026],
  lagos: [6.5244, 3.3792],
  abuja: [9.0579, 7.4951],
  accra: [5.6037, -0.1870],
  dakar: [14.7167, -17.4677],
  johannesburg: [-26.2041, 28.0473],
  capetown: [-33.9249, 18.4241],
  kinshasa: [-4.4419, 15.2663],
  marrakech: [31.6295, -7.9811],
  kampala: [0.3476, 32.5825],
  kigali: [-1.9403, 29.8739],
  abidjan: [5.3600, -4.0083],
  bamako: [12.6392, -8.0029],
  luanda: [-8.8390, 13.2894],
  maputo: [-25.9692, 32.5732],
  harare: [-17.8252, 31.0335],
  windhoek: [-22.5609, 17.0658],
  douala: [4.0511, 9.7679],
  conakry: [9.6412, -13.5784],
  ndjamena: [12.1348, 15.0557],
  niamey: [13.5127, 2.1128],
  ouagadougou: [12.3714, -1.5197],
  juba: [4.8594, 31.5713],
  asmara: [15.3229, 38.9251],
  mogadishu: [2.0469, 45.3182],
  antananarivo: [-18.8792, 47.5079],
  lome: [6.1725, 1.2314],
  cotonou: [6.3703, 2.3912],
  freetown: [8.4657, -13.2317],
  monrovia: [6.2907, -10.7605],
  bangui: [4.3947, 18.5582],
  nouakchott: [18.0735, -15.9582],
  libreville: [0.4162, 9.4673],
  brazzaville: [-4.2634, 15.2429],
  djibouti: [11.5721, 43.1456],
  lusaka: [-15.3875, 28.3228],
  lilongwe: [-13.9626, 33.7741],
  gaborone: [-24.6282, 25.9231],
  tripoli: [32.8872, 13.1913],
  tunis: [36.8065, 10.1815],
  algiers: [36.7538, 3.0588],
  banjul: [13.4549, -16.5790],
  bissau: [11.8037, -15.1804],
  malabo: [3.7504, 8.7371],
  praia: [14.9315, -23.5133],
  mbabane: [-26.3054, 31.1367],
  maseru: [-29.3167, 27.4833],
  moroni: [-11.7172, 43.2473],
  portlouis: [-20.1609, 57.5012],
};

// Marker pin components
const EventPin = () => (
  <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-background"
    style={{ background: "linear-gradient(135deg, hsl(25,95%,55%), hsl(43,96%,56%))" }}>
    <Calendar size={16} strokeWidth={2.5} className="text-background" />
  </div>
);

const EventbritePin = () => (
  <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-background"
    style={{ background: "linear-gradient(135deg, hsl(14,100%,53%), hsl(25,100%,60%))" }}>
    <Ticket size={16} strokeWidth={2.5} className="text-white" />
  </div>
);

const PoshPin = () => (
  <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-background"
    style={{ background: "linear-gradient(135deg, hsl(270,80%,60%), hsl(290,70%,55%))" }}>
    <Ticket size={16} strokeWidth={2.5} className="text-white" />
  </div>
);

const DicePin = () => (
  <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-background"
    style={{ background: "linear-gradient(135deg, hsl(200,80%,50%), hsl(220,70%,55%))" }}>
    <span className="text-sm">🎲</span>
  </div>
);

const ShotgunPin = () => (
  <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-background"
    style={{ background: "linear-gradient(135deg, hsl(340,80%,55%), hsl(10,80%,55%))" }}>
    <Music size={16} strokeWidth={2.5} className="text-white" />
  </div>
);

const BillettoPin = () => (
  <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-background"
    style={{ background: "linear-gradient(135deg, hsl(170,70%,45%), hsl(190,60%,50%))" }}>
    <Ticket size={16} strokeWidth={2.5} className="text-white" />
  </div>
);

const AfroNationPin = () => (
  <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg border-2 border-background overflow-hidden"
    style={{ background: "#f5f0e1", boxShadow: "0 0 0 3px hsl(320,70%,45%), 0 4px 16px rgba(0,0,0,0.5)" }}>
    <img src={afroNationIcon} alt="Afro Nation" className="w-[38px] h-[38px] object-cover rounded-full" />
  </div>
);

const SXSWPin = () => (
  <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg border-2 border-background overflow-hidden"
    style={{ background: "#ffffff", boxShadow: "0 0 0 3px hsl(0,0%,10%), 0 4px 16px rgba(0,0,0,0.5)" }}>
    <img src={sxswIcon} alt="SXSW" className="w-9 h-9 object-contain" />
  </div>
);

const PersonPin = () => (
  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2"
    style={{ background: "hsl(0,0%,16%)", borderColor: "hsl(43,96%,56%)" }}>
    <Users size={14} strokeWidth={2.5} style={{ color: "hsl(43,96%,56%)" }} />
  </div>
);

const GroupPin = () => (
  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-background"
    style={{ background: "linear-gradient(135deg, hsl(320,70%,50%), hsl(280,70%,55%))" }}>
    <Users size={18} strokeWidth={2} className="text-white" />
  </div>
);

const ResourcePin = ({ type, flag }: { type: string; flag?: string }) => (
  <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-background"
    style={{ background: type === "nonprofit" ? "linear-gradient(135deg, hsl(150,70%,40%), hsl(170,60%,45%))" : "linear-gradient(135deg, hsl(210,80%,50%), hsl(230,70%,55%))" }}>
    {flag ? <span className="text-lg leading-none">{flag.length > 4 ? flag.slice(0, 2) : flag}</span> :
      type === "nonprofit" ? <Heart size={16} strokeWidth={2.5} className="text-white" /> :
        <Briefcase size={16} strokeWidth={2.5} className="text-white" />}
  </div>
);

const YouPin = () => (
  <div className="w-5 h-5 rounded-full border-3 border-background"
    style={{ background: "hsl(43,96%,56%)", boxShadow: "0 0 0 6px hsla(43,96%,56%,0.25), 0 4px 12px rgba(0,0,0,0.4)", borderWidth: 3, borderColor: "hsl(0,0%,7%)" }} />
);

const UserLocationPin = () => (
  <div className="w-[18px] h-[18px] rounded-full"
    style={{ background: "hsl(217,91%,60%)", border: "3px solid white", boxShadow: "0 0 8px rgba(59,130,246,0.5)" }} />
);

const PlacePin = ({ category }: { category: string }) => (
  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-background"
    style={{ background: category === "restaurant" ? "linear-gradient(135deg, hsl(25,90%,50%), hsl(35,85%,55%))" : category === "fitness" ? "linear-gradient(135deg, hsl(210,80%,50%), hsl(230,70%,55%))" : "linear-gradient(135deg, hsl(170,70%,40%), hsl(190,60%,45%))" }}>
    <span className="text-sm">{category === "restaurant" ? "🍽️" : category === "fitness" ? "💪" : "🕌"}</span>
  </div>
);

const ActivityPin = ({ emoji, isPrivate }: { emoji: string; isPrivate: boolean }) => (
  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg relative"
    style={{ background: "linear-gradient(135deg, hsl(340,80%,55%), hsl(350,70%,50%))", border: isPrivate ? "3px solid hsl(45,90%,50%)" : "3px solid white" }}>
    <span className="text-lg leading-none">{emoji}</span>
    {isPrivate && (
      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white"
        style={{ background: "hsl(45,90%,50%)" }}>
        <Lock size={8} className="text-white" />
      </div>
    )}
  </div>
);

const HubPin = ({ hub }: { hub: DiasporaHub }) => {
  const flags = hub.communities.map(c => c.countryFlag);
  const totalPop = hub.communities.reduce((sum, c) => {
    const num = parseInt(c.population.replace(/[^0-9]/g, "")) || 0;
    return sum + num;
  }, 0);
  const popLabel = totalPop >= 1000 ? `${Math.round(totalPop / 1000)}K` : `${totalPop}`;

  return (
    <div className="relative" style={{ width: 56, height: 56 }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-7 h-7 rounded-full flex items-center justify-center z-10"
          style={{ background: "linear-gradient(135deg, hsl(25,95%,55%), hsl(43,96%,56%))", boxShadow: "0 0 0 3px hsl(0,0%,7%), 0 0 16px rgba(243,186,47,0.4)" }}>
          <span className="text-[9px] font-extrabold" style={{ color: "hsl(0,0%,5%)", letterSpacing: -0.5 }}>{popLabel}</span>
        </div>
      </div>
      {flags.slice(0, 6).map((flag, i) => {
        const angle = (i * (2 * Math.PI / Math.min(flags.length, 6))) - Math.PI / 2;
        const x = 28 + 20 * Math.cos(angle) - 7;
        const y = 28 + 20 * Math.sin(angle) - 7;
        return <span key={i} className="absolute text-[13px] leading-none" style={{ left: x, top: y }}>{flag}</span>;
      })}
    </div>
  );
};

// Map community category to country flag
const categoryFlagMap: Record<string, string> = {
  "Nigerian Community": "🇳🇬",
  "Ghanaian Community": "🇬🇭",
  "Ethiopian Community": "🇪🇹",
  "Habesha Community": "🇪🇹🇪🇷",
  "Eritrean Community": "🇪🇷",
  "Somali Community": "🇸🇴",
  "Sudanese Community": "🇸🇩",
  "South Sudanese Community": "🇸🇸",
  "Congolese Community": "🇨🇩",
  "Kenyan Community": "🇰🇪",
  "Haitian Community": "🇭🇹",
};

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

const hubPositions = diasporaHubs.filter(h => cityCoords[h.cityId]).map(hub => ({
  ...hub,
  lat: cityCoords[hub.cityId][0],
  lng: cityCoords[hub.cityId][1],
}));

const allEventPositions = getAllEventPositions();
const allPeople = getAllPeople();
const allGroups = getAllGroups();
const allResources = getResourcePositions();

const CATEGORY_EMOJI: Record<string, string> = {
  food: "🍽️", nightlife: "🎉", outdoor: "🥾", sightseeing: "🗺️",
  entertainment: "🎭", shopping: "🛍️", wellness: "🧘", rideshare: "🚗",
  social: "💬", other: "✨",
};

// Country bounding boxes
const countryBounds: Record<string, { name: string; bounds: { north: number; south: number; east: number; west: number } }> = {
  US: { name: "United States", bounds: { south: 24.5, west: -125.0, north: 49.5, east: -66.5 } },
  CA: { name: "Canada", bounds: { south: 41.7, west: -141.0, north: 83.1, east: -52.6 } },
  GB: { name: "United Kingdom", bounds: { south: 49.9, west: -8.6, north: 60.8, east: 1.8 } },
  FR: { name: "France", bounds: { south: 41.3, west: -5.1, north: 51.1, east: 9.6 } },
  DE: { name: "Germany", bounds: { south: 47.3, west: 5.9, north: 55.1, east: 15.0 } },
  BR: { name: "Brazil", bounds: { south: -33.8, west: -73.9, north: 5.3, east: -34.8 } },
  NG: { name: "Nigeria", bounds: { south: 4.3, west: 2.7, north: 13.9, east: 14.7 } },
  GH: { name: "Ghana", bounds: { south: 4.7, west: -3.3, north: 11.2, east: 1.2 } },
  KE: { name: "Kenya", bounds: { south: -4.7, west: 33.9, north: 5.0, east: 41.9 } },
  ZA: { name: "South Africa", bounds: { south: -34.8, west: 16.5, north: -22.1, east: 32.9 } },
  AU: { name: "Australia", bounds: { south: -43.6, west: 113.2, north: -10.7, east: 153.6 } },
};

const cityToCountry: Record<string, string> = {
  austin: "US", dallas: "US", fortworth: "US", arlington: "US", irving: "US", richardson: "US",
  carrollton: "US", coppell: "US", houston: "US", sanantonio: "US", nyc: "US", atlanta: "US",
  miami: "US", orlando: "US", philadelphia: "US", raleigh: "US", nashville: "US", memphis: "US",
  desmoines: "US", minneapolis: "US", milwaukee: "US", seattle: "US", dc: "US", portland: "US",
  boston: "US", losangeles: "US", sanfrancisco: "US", sandiego: "US", lasvegas: "US", phoenix: "US",
  scottsdale: "US", denver: "US", chicago: "US", detroit: "US", grandrapids: "US", lansing: "US",
  cleveland: "US", kansascity: "US", lincoln: "US", omaha: "US", wichita: "US", lubbock: "US",
  richmond: "US", norfolk: "US", providence: "US", bridgeport: "US", manchester: "US",
  siouxfalls: "US", fargo: "US", saltlakecity: "US",
  toronto: "CA", calgary: "CA", montreal: "CA",
  paris: "FR", bordeaux: "FR",
  london: "GB", birmingham: "GB", manchesteruk: "GB", liverpool: "GB", nottingham: "GB", oxford: "GB",
  brussels: "BE", antwerp: "BE",
  amsterdam: "NL", rotterdam: "NL",
  barcelona: "ES", madrid: "ES",
  rio: "BR", saopaulo: "BR", salvador: "BR",
  sydney: "AU", melbourne: "AU", brisbane: "AU", perth: "AU", adelaide: "AU",
  lagos: "NG", abuja: "NG", accra: "GH", nairobi: "KE",
  johannesburg: "ZA", capetown: "ZA",
  berlin: "DE",
};

// Google Maps inner components
const MapController = ({ targetCity, onZoomDone }: { targetCity: string | null; onZoomDone: () => void }) => {
  const map = useMap();
  useEffect(() => {
    if (targetCity && cityCoords[targetCity] && map) {
      map.panTo({ lat: cityCoords[targetCity][0], lng: cityCoords[targetCity][1] });
      map.setZoom(12);
      onZoomDone();
    }
  }, [targetCity, map, onZoomDone]);
  return null;
};

const FlightPolylines = ({ center, routes }: { center: [number, number]; routes: { coords: [number, number]; destinationCity: string; destinationName: string; destinationFlag: string; price: number }[] }) => {
  const map = useMap();
  const polylinesRef = useRef<any[]>([]);

  useEffect(() => {
    if (!map || !window.google?.maps) return;
    // Clean up old polylines
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    routes.forEach(route => {
      const mid = {
        lat: (center[0] + route.coords[0]) / 2 + Math.abs(center[1] - route.coords[1]) * 0.15,
        lng: (center[1] + route.coords[1]) / 2,
      };
      const polyline = new window.google.maps.Polyline({
        path: [
          { lat: center[0], lng: center[1] },
          mid,
          { lat: route.coords[0], lng: route.coords[1] },
        ],
        strokeColor: "hsl(210,90%,55%)",
        strokeWeight: 2,
        strokeOpacity: 0.6,
        geodesic: true,
      });
      polyline.setMap(map);
      polylinesRef.current.push(polyline);
    });

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, center, routes]);

  return null;
};

type TimeFilter = "all" | "tonight" | "weekend" | "thisweek";

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface MapScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const MapScreen = ({ selectedCity, onCityChange }: MapScreenProps) => {
  useScreenView("map_screen");
  const { theme } = useTheme();

  const [showEvents, setShowEvents] = useState(true);
  const [showPeople, setShowPeople] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showHubs, setShowHubs] = useState(false);
  const [showEventbrite, setShowEventbrite] = useState(true);
  const [showPosh, setShowPosh] = useState(true);
  const [showPlaces, setShowPlaces] = useState(false);
  const [showAfroNation, setShowAfroNation] = useState(true);
  const [showSXSW, setShowSXSW] = useState(false);
  const [showFlights, setShowFlights] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [zoomTarget, setZoomTarget] = useState<string | null>(selectedCity.id);
  const [nearbyCollapsed, setNearbyCollapsed] = useState(false);
  const [selectedNearbyEvent, setSelectedNearbyEvent] = useState<typeof allEventPositions[0] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapSearch, setMapSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const [showTrending, setShowTrending] = useState(false);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [showCreateActivity, setShowCreateActivity] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [openInfoWindow, setOpenInfoWindow] = useState<{ type: string; id: string | number; position: { lat: number; lng: number }; data: any } | null>(null);
  const [locating, setLocating] = useState(false);

  const { user } = useAuth();
  const { activities, createActivity, joinActivity, myParticipation } = useActivities();

  const handleBoundsChange = useCallback((bounds: MapBounds) => {
    setMapBounds(bounds);
  }, []);

  const inView = useCallback((lat: number, lng: number) => {
    if (!mapBounds) return true;
    const pad = 0.15;
    const latPad = (mapBounds.north - mapBounds.south) * pad;
    const lngPad = (mapBounds.east - mapBounds.west) * pad;
    return lat >= mapBounds.south - latPad && lat <= mapBounds.north + latPad &&
           lng >= mapBounds.west - lngPad && lng <= mapBounds.east + lngPad;
  }, [mapBounds]);

  const { events: dbEvents } = useEvents();
  const { places: dbPlaces } = usePlaces();

  const now = useMemo(() => new Date(), []);
  const isTonight = useCallback((dateStr: string) => {
    const d = new Date(dateStr);
    return d.toDateString() === now.toDateString() && d.getHours() >= 17;
  }, [now]);
  const isThisWeekend = useCallback((dateStr: string) => {
    const d = new Date(dateStr);
    const friday = new Date(now); friday.setDate(now.getDate() + (5 - now.getDay() + 7) % 7);
    friday.setHours(0, 0, 0, 0);
    const sunday = new Date(friday); sunday.setDate(friday.getDate() + 2); sunday.setHours(23, 59, 59);
    return d >= friday && d <= sunday;
  }, [now]);
  const isThisWeek = useCallback((dateStr: string) => {
    const d = new Date(dateStr);
    const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7);
    return d >= now && d <= weekEnd;
  }, [now]);
  const passesTimeFilter = useCallback((dateStr: string) => {
    if (timeFilter === "all") return true;
    if (timeFilter === "tonight") return isTonight(dateStr);
    if (timeFilter === "weekend") return isThisWeekend(dateStr);
    if (timeFilter === "thisweek") return isThisWeek(dateStr);
    return true;
  }, [timeFilter, isTonight, isThisWeekend, isThisWeek]);

  const getDistanceKm = useCallback((lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }, []);
  const passesDistanceFilter = useCallback((lat: number, lng: number) => {
    if (!distanceFilter || !userLocation) return true;
    return getDistanceKm(userLocation[0], userLocation[1], lat, lng) <= distanceFilter;
  }, [distanceFilter, userLocation, getDistanceKm]);

  const dbEventPositions = useMemo(() => {
    return dbEvents.filter(e => {
      const source = (e as any).source;
      return source === "eventbrite" || source === "posh" || source === "dice" || source === "shotgun" || source === "billetto";
    }).map((e) => {
      const city = (e as any).city || "austin";
      const center = cityCoords[city] || cityCoords.austin;
      const seed = e.id.split("").reduce((a: number, b: string) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
      const lat = center[0] + (((Math.abs(seed) % 100) - 50) / 500);
      const lng = center[1] + ((((Math.abs(seed) * 7) % 100) - 50) / 400);
      return { ...e, lat, lng, source: (e as any).source as string, external_url: (e as any).external_url as string | null };
    }).filter(e => passesTimeFilter(e.date) && passesDistanceFilter(e.lat, e.lng));
  }, [dbEvents, passesTimeFilter, passesDistanceFilter]);

  const trendingLocations = useMemo(() => {
    const counts: Record<string, number> = {};
    [...allEventPositions, ...dbEventPositions].forEach(e => {
      const c = (e as any).city || "austin";
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([cityId, count]) => {
        const city = cities.find(c => c.id === cityId);
        return { cityId, name: city?.name || cityId, flag: city?.flag || "📍", count };
      });
  }, [dbEventPositions]);

  const center = cityCoords[selectedCity.id] || cityCoords.austin;
  const flightRoutes = useMemo(() => getFlightRoutes(selectedCity.id), [selectedCity.id]);

  const searchResults = useMemo(() => {
    const q = mapSearch.trim().toLowerCase();
    if (!q) return { events: [], places: [] };
    const matchedEvents = [...dbEventPositions, ...allEventPositions.map(e => ({ ...e, id: String(e.id), source: (e as any).source || "mock", external_url: null, image_url: e.image || null, location: e.venue || null, price: e.price || null, date: e.date || "", title: e.title, city: e.city, category: e.category || "" }))]
      .filter(e => e.title.toLowerCase().includes(q) || (e.location || "").toLowerCase().includes(q))
      .slice(0, 5);
    const matchedPlaces = dbPlaces
      .filter(p => p.name.toLowerCase().includes(q) || (p.cuisine_type || "").toLowerCase().includes(q) || (p.address || "").toLowerCase().includes(q))
      .slice(0, 5);
    return { events: matchedEvents, places: matchedPlaces };
  }, [mapSearch, dbEventPositions, dbPlaces]);

  const handleEventClick = (cityId: string) => {
    setZoomTarget(cityId);
    const city = cities.find(c => c.id === cityId);
    if (city) onCityChange(city);
  };

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleCountryZoom = useCallback(() => {
    // Find which country the current center is in
    const lat = center[0];
    const lng = center[1];
    const country = cityToCountry[selectedCity.id];
    if (country && countryBounds[country]) {
      return countryBounds[country].bounds;
    }
    return null;
  }, [center, selectedCity.id]);

  // Nearby events for bottom card
  const mapDbToNearby = (e: typeof dbEventPositions[0]) => ({
    id: Math.abs(e.id.split("").reduce((a: number, b: string) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)),
    title: e.title,
    host: e.source === "posh" ? "via Posh" : e.source === "dice" ? "via DICE" : e.source === "shotgun" ? "via Shotgun" : e.source === "billetto" ? "via Billetto" : "via Eventbrite",
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
  });
  const cityDbEvents = dbEventPositions.filter(e => e.city === selectedCity.id);
  const dbPoshNearby = cityDbEvents.filter(e => e.source === "posh").map(mapDbToNearby);
  const dbOtherNearby = cityDbEvents.filter(e => e.source !== "posh").map(mapDbToNearby);
  const mockNearby = allEventPositions.filter(e => e.city === selectedCity.id);
  const pinnedMockNearby = mockNearby.filter(e => (e as any).source === "posh");
  const unpinnedMockNearby = mockNearby.filter(e => (e as any).source !== "posh");
  const nearbyEvents = [...pinnedMockNearby, ...dbPoshNearby, ...dbOtherNearby, ...unpinnedMockNearby].slice(0, 8);

  return (
    <div className="fixed inset-0 bg-background">
      <header className="absolute top-0 left-0 right-0 z-[1000] glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Navigation size={18} className="text-primary" />
            <h1 className="font-display text-lg font-bold text-gradient-gold">Explore</h1>
          </div>
          <CityPicker selectedCity={selectedCity} onCityChange={(city) => { onCityChange(city); setZoomTarget(city.id); }} />
        </div>
      </header>

      {/* Search bar overlay */}
      <div className="absolute top-14 left-4 right-4 z-[1001] max-w-lg mx-auto">
        <div className="relative">
          <div className="flex items-center bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-card px-3 py-2 gap-2">
            <Search size={16} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              value={mapSearch}
              onChange={(e) => setMapSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search events & places..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            {mapSearch && (
              <button onClick={() => setMapSearch("")} className="text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>

          {searchFocused && mapSearch.trim() && (searchResults.events.length > 0 || searchResults.places.length > 0) && (
            <div className="mt-1 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-elevated max-h-64 overflow-y-auto">
              {searchResults.events.length > 0 && (
                <div className="p-2">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">Events</p>
                  {searchResults.events.map((e: any, i: number) => (
                    <button
                      key={`se-${i}`}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary/60 text-left transition-colors"
                      onMouseDown={() => {
                        if (e.lat && e.lng) {
                          setZoomTarget(e.city);
                          const city = cities.find(c => c.id === e.city);
                          if (city) onCityChange(city);
                        }
                        setMapSearch("");
                      }}
                    >
                      <Calendar size={14} className="text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{e.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{e.location || e.venue || e.city}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {searchResults.places.length > 0 && (
                <div className="p-2 border-t border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">Places</p>
                  {searchResults.places.map((p: any, i: number) => (
                    <button
                      key={`sp-${i}`}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary/60 text-left transition-colors"
                      onMouseDown={() => {
                        if (p.latitude && p.longitude) {
                          const city = cities.find(c => c.id === p.city);
                          if (city) { onCityChange(city); setZoomTarget(city.id); }
                        }
                        setMapSearch("");
                      }}
                    >
                      <UtensilsCrossed size={14} className="text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{p.cuisine_type || p.category} · {p.city}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {searchFocused && mapSearch.trim() && searchResults.events.length === 0 && searchResults.places.length === 0 && (
            <div className="mt-1 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-elevated p-4 text-center">
              <p className="text-xs text-muted-foreground">No results for "{mapSearch}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Layer toggles */}
      <div className="absolute top-28 left-4 right-4 z-[1000] max-w-lg mx-auto space-y-2">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {([
            { id: "all" as TimeFilter, label: "All Events", icon: Calendar },
            { id: "tonight" as TimeFilter, label: "Tonight 🌙", icon: Clock },
            { id: "weekend" as TimeFilter, label: "This Weekend", icon: Clock },
            { id: "thisweek" as TimeFilter, label: "This Week", icon: Clock },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTimeFilter(id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 shadow-card whitespace-nowrap ${
                timeFilter === id ? "gradient-gold text-primary-foreground" : "bg-card text-muted-foreground border border-border"
              }`}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
          {userLocation && (
            <>
              {([5, 10, 25] as const).map((km) => (
                <button
                  key={`d-${km}`}
                  onClick={() => setDistanceFilter(distanceFilter === km ? null : km)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 shadow-card whitespace-nowrap ${
                    distanceFilter === km ? "bg-[hsl(210,90%,55%)] text-white" : "bg-card text-muted-foreground border border-border"
                  }`}
                >
                  <Ruler size={12} /> {km}km
                </button>
              ))}
            </>
          )}
          <button
            onClick={() => setShowTrending(!showTrending)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 shadow-card whitespace-nowrap ${
              showTrending ? "bg-[hsl(340,80%,55%)] text-white" : "bg-card text-muted-foreground border border-border"
            }`}
          >
            <Flame size={12} /> Trending
          </button>
        </div>

        {showTrending && (
          <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-elevated p-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">🔥 Trending Locations</p>
            <div className="grid grid-cols-3 gap-1.5">
              {trendingLocations.map(({ cityId, name, flag, count }) => (
                <button
                  key={cityId}
                  onClick={() => {
                    const city = cities.find(c => c.id === cityId);
                    if (city) { onCityChange(city); setZoomTarget(cityId); }
                    setShowTrending(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-secondary/60 hover:bg-secondary text-left transition-colors"
                >
                  <span className="text-sm">{flag}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-foreground truncate">{name}</p>
                    <p className="text-[9px] text-primary font-semibold">{count} events</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

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
          <button onClick={() => setShowPlaces(!showPlaces)} className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card whitespace-nowrap ${showPlaces ? "bg-[hsl(25,90%,50%)] text-white" : "bg-card text-muted-foreground border border-border"}`}>
            <UtensilsCrossed size={14} /> Places
          </button>
          <button onClick={() => setShowAfroNation(!showAfroNation)} className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card whitespace-nowrap ${showAfroNation ? "bg-[hsl(310,60%,45%)] text-white" : "bg-card text-muted-foreground border border-border"}`}>
            <img src={afroNationIcon} alt="Afro Nation" className="w-4 h-4 rounded-full object-cover" /> Afro Nation
          </button>
          <button onClick={() => setShowSXSW(!showSXSW)} className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card whitespace-nowrap ${showSXSW ? "bg-[hsl(0,0%,10%)] text-white" : "bg-card text-muted-foreground border border-border"}`}>
            <img src={sxswIcon} alt="SXSW" className="w-4 h-4 object-contain" /> SXSW
          </button>
          <button onClick={() => setShowFlights(!showFlights)} className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card whitespace-nowrap ${showFlights ? "bg-[hsl(210,90%,55%)] text-white" : "bg-card text-muted-foreground border border-border"}`}>
            <Plane size={14} /> Flights
          </button>
        </div>
      </div>

      {/* Google Map */}
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={{ lat: center[0], lng: center[1] }}
          defaultZoom={12}
          mapId={GOOGLE_MAPS_MAP_ID}
          gestureHandling="greedy"
          disableDefaultUI={true}
          colorScheme={theme === "dark" ? "DARK" : "LIGHT"}
          style={{ height: "100%", width: "100%" }}
          onIdle={(e) => {
            const map = e.map;
            const bounds = map.getBounds();
            if (bounds) {
              const ne = bounds.getNorthEast();
              const sw = bounds.getSouthWest();
              handleBoundsChange({ north: ne.lat(), south: sw.lat(), east: ne.lng(), west: sw.lng() });
            }
          }}
        >
          <MapController targetCity={zoomTarget} onZoomDone={() => setZoomTarget(null)} />

          {/* Flight polylines */}
          {showFlights && <FlightPolylines center={center} routes={flightRoutes} />}

          {/* Flight price markers */}
          {showFlights && flightRoutes.map((route) => (
            <AdvancedMarker key={`flight-${route.destinationCity}`} position={{ lat: route.coords[0], lng: route.coords[1] }}
              onClick={() => setOpenInfoWindow({ type: "flight", id: route.destinationCity, position: { lat: route.coords[0], lng: route.coords[1] }, data: route })}>
              <div className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-lg"
                style={{ background: "hsl(210,90%,55%)", border: "1px solid rgba(255,255,255,0.2)" }}>
                ${route.price}
              </div>
            </AdvancedMarker>
          ))}

          {/* You marker */}
          <AdvancedMarker position={{ lat: center[0], lng: center[1] }}>
            <YouPin />
          </AdvancedMarker>

          {/* User location */}
          {userLocation && (
            <AdvancedMarker position={{ lat: userLocation[0], lng: userLocation[1] }}>
              <UserLocationPin />
            </AdvancedMarker>
          )}

          {/* Mock events */}
          {showEvents && allEventPositions.filter(e => !e.host?.toLowerCase().includes("afro nation") && e.source !== "sxsw" && inView(e.lat, e.lng)).map((event) => (
            <AdvancedMarker key={`event-${event.id}`} position={{ lat: event.lat, lng: event.lng }}
              onClick={() => setOpenInfoWindow({ type: "event", id: event.id, position: { lat: event.lat, lng: event.lng }, data: event })}>
              <EventPin />
            </AdvancedMarker>
          ))}

          {/* Afro Nation */}
          {showAfroNation && allEventPositions.filter(e => e.host?.toLowerCase().includes("afro nation") && inView(e.lat, e.lng)).map((event) => (
            <AdvancedMarker key={`an-${event.id}`} position={{ lat: event.lat, lng: event.lng }}
              onClick={() => setOpenInfoWindow({ type: "afronation", id: event.id, position: { lat: event.lat, lng: event.lng }, data: event })}>
              <AfroNationPin />
            </AdvancedMarker>
          ))}

          {/* SXSW */}
          {showSXSW && allEventPositions.filter(e => e.source === "sxsw" && inView(e.lat, e.lng)).map((event) => (
            <AdvancedMarker key={`sxsw-${event.id}`} position={{ lat: event.lat, lng: event.lng }}
              onClick={() => setOpenInfoWindow({ type: "sxsw", id: event.id, position: { lat: event.lat, lng: event.lng }, data: event })}>
              <SXSWPin />
            </AdvancedMarker>
          ))}

          {/* People */}
          {showPeople && allPeople.filter(p => inView(p.lat, p.lng)).map((person, i) => (
            <AdvancedMarker key={`person-${i}`} position={{ lat: person.lat, lng: person.lng }}
              onClick={() => setOpenInfoWindow({ type: "person", id: i, position: { lat: person.lat, lng: person.lng }, data: person })}>
              <PersonPin />
            </AdvancedMarker>
          ))}

          {/* Groups */}
          {showGroups && allGroups.filter(g => inView(g.lat, g.lng)).map((group, i) => (
            <AdvancedMarker key={`group-${i}`} position={{ lat: group.lat, lng: group.lng }}
              onClick={() => setOpenInfoWindow({ type: "group", id: i, position: { lat: group.lat, lng: group.lng }, data: group })}>
              <GroupPin />
            </AdvancedMarker>
          ))}

          {/* Resources */}
          {showResources && allResources.filter(r => inView(r.lat, r.lng)).map((resource) => (
            <AdvancedMarker key={`resource-${resource.id}`} position={{ lat: resource.lat, lng: resource.lng }}
              onClick={() => setOpenInfoWindow({ type: "resource", id: resource.id, position: { lat: resource.lat, lng: resource.lng }, data: resource })}>
              <ResourcePin type={resource.type} flag={categoryFlagMap[resource.category]} />
            </AdvancedMarker>
          ))}

          {/* Hubs */}
          {showHubs && hubPositions.filter(h => inView(h.lat, h.lng)).map((hub) => (
            <AdvancedMarker key={`hub-${hub.cityId}`} position={{ lat: hub.lat, lng: hub.lng }}
              onClick={() => setOpenInfoWindow({ type: "hub", id: hub.cityId, position: { lat: hub.lat, lng: hub.lng }, data: hub })}>
              <HubPin hub={hub} />
            </AdvancedMarker>
          ))}

          {/* DB Events: Eventbrite */}
          {showEventbrite && dbEventPositions.filter(e => e.source === "eventbrite" && inView(e.lat, e.lng)).map((event) => (
            <AdvancedMarker key={`eb-${event.id}`} position={{ lat: event.lat, lng: event.lng }}
              onClick={() => setOpenInfoWindow({ type: "eventbrite", id: event.id, position: { lat: event.lat, lng: event.lng }, data: event })}>
              <EventbritePin />
            </AdvancedMarker>
          ))}

          {/* DB Events: Posh */}
          {showPosh && dbEventPositions.filter(e => e.source === "posh" && inView(e.lat, e.lng)).map((event) => (
            <AdvancedMarker key={`posh-${event.id}`} position={{ lat: event.lat, lng: event.lng }}
              onClick={() => setOpenInfoWindow({ type: "posh", id: event.id, position: { lat: event.lat, lng: event.lng }, data: event })}>
              <PoshPin />
            </AdvancedMarker>
          ))}

          {/* DB Events: DICE */}
          {showEventbrite && dbEventPositions.filter(e => e.source === "dice" && inView(e.lat, e.lng)).map((event) => (
            <AdvancedMarker key={`dice-${event.id}`} position={{ lat: event.lat, lng: event.lng }}
              onClick={() => setOpenInfoWindow({ type: "dice", id: event.id, position: { lat: event.lat, lng: event.lng }, data: event })}>
              <DicePin />
            </AdvancedMarker>
          ))}

          {/* DB Events: Shotgun */}
          {showEventbrite && dbEventPositions.filter(e => e.source === "shotgun" && inView(e.lat, e.lng)).map((event) => (
            <AdvancedMarker key={`shotgun-${event.id}`} position={{ lat: event.lat, lng: event.lng }}
              onClick={() => setOpenInfoWindow({ type: "shotgun", id: event.id, position: { lat: event.lat, lng: event.lng }, data: event })}>
              <ShotgunPin />
            </AdvancedMarker>
          ))}

          {/* DB Events: Billetto */}
          {showEventbrite && dbEventPositions.filter(e => e.source === "billetto" && inView(e.lat, e.lng)).map((event) => (
            <AdvancedMarker key={`billetto-${event.id}`} position={{ lat: event.lat, lng: event.lng }}
              onClick={() => setOpenInfoWindow({ type: "billetto", id: event.id, position: { lat: event.lat, lng: event.lng }, data: event })}>
              <BillettoPin />
            </AdvancedMarker>
          ))}

          {/* Places */}
          {showPlaces && dbPlaces.filter(p => p.latitude && p.longitude && inView(p.latitude!, p.longitude!)).map((place) => (
            <AdvancedMarker key={`place-${place.id}`} position={{ lat: place.latitude!, lng: place.longitude! }}
              onClick={() => setOpenInfoWindow({ type: "place", id: place.id, position: { lat: place.latitude!, lng: place.longitude! }, data: place })}>
              <PlacePin category={place.category} />
            </AdvancedMarker>
          ))}

          {/* Activities */}
          {activities.filter(a => inView(a.latitude, a.longitude)).map((activity) => (
            <AdvancedMarker key={`activity-${activity.id}`} position={{ lat: activity.latitude, lng: activity.longitude }}
              onClick={() => setSelectedActivity(activity)}>
              <ActivityPin emoji={CATEGORY_EMOJI[activity.category] || "✨"} isPrivate={!activity.is_public} />
            </AdvancedMarker>
          ))}

          {/* Unified InfoWindow */}
          {openInfoWindow && (
            <InfoWindow
              position={openInfoWindow.position}
              onCloseClick={() => setOpenInfoWindow(null)}
              maxWidth={280}
            >
              {renderInfoContent(openInfoWindow)}
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Map controls — bottom right */}
      <div className="absolute bottom-24 right-4 z-[1000] flex flex-col gap-2">
        {/* Country zoom */}
        <button
          onClick={() => {
            const bounds = handleCountryZoom();
            // Just zoom out to level 5 for now
            setZoomTarget(selectedCity.id);
          }}
          className="w-10 h-10 rounded-full bg-card/95 backdrop-blur-md border border-border shadow-card flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <Globe size={18} className="text-foreground" />
        </button>
        {/* Near Me */}
        <button
          onClick={handleLocate}
          disabled={locating}
          className="w-10 h-10 rounded-full bg-card/95 backdrop-blur-md border border-border shadow-card flex items-center justify-center hover:bg-secondary transition-colors"
        >
          {locating ? <Loader2 size={18} className="text-primary animate-spin" /> : <Crosshair size={18} className="text-foreground" />}
        </button>
      </div>

      {/* FAB - Create Activity */}
      <button
        onClick={() => setShowCreateActivity(true)}
        className="absolute top-[13.5rem] left-4 z-[1000] w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
        title="Create Activity"
      >
        <Plus size={22} />
      </button>

      <CreateActivitySheet
        open={showCreateActivity}
        onClose={() => setShowCreateActivity(false)}
        onSubmit={(data) => {
          createActivity.mutate(data);
          setShowCreateActivity(false);
        }}
        initialCenter={[center[0], center[1]]}
        isPending={createActivity.isPending}
      />

      {/* Selected activity detail overlay */}
      {selectedActivity && (
        <>
          <div className="fixed inset-0 z-[1001] bg-background/40" onClick={() => setSelectedActivity(null)} />
          <div className="absolute bottom-20 left-4 right-4 z-[1002] max-w-lg mx-auto animate-slide-up">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-elevated">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                      {CATEGORY_EMOJI[selectedActivity.category] || "✨"}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground text-lg leading-tight">{selectedActivity.description || selectedActivity.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedActivity.is_public ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-700"}`}>
                          {selectedActivity.is_public ? "Public" : "Private"}
                        </span>
                        {selectedActivity.creator && (
                          <span className="text-xs text-muted-foreground">by {selectedActivity.creator.display_name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedActivity(null)} className="p-1.5 rounded-full hover:bg-secondary">
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-primary" />
                    <span>{selectedActivity.participant_count || 0} joined{selectedActivity.max_spots ? ` / ${selectedActivity.max_spots} spots` : ""}</span>
                  </div>
                </div>

                {user && selectedActivity.creator_id !== user.id && (
                  <div className="mt-4">
                    {(() => {
                      const myStatus = myParticipation.find(p => p.activity_id === selectedActivity.id);
                      if (myStatus?.status === "joined") {
                        return <div className="w-full py-3 rounded-xl bg-primary/10 text-primary text-center text-sm font-bold">You're in! 🎉</div>;
                      }
                      if (myStatus?.status === "pending") {
                        return <div className="w-full py-3 rounded-xl bg-amber-100 text-amber-700 text-center text-sm font-bold">Request pending ⏳</div>;
                      }
                      return (
                        <button
                          onClick={() => joinActivity.mutate({ activityId: selectedActivity.id, isPublic: selectedActivity.is_public })}
                          disabled={joinActivity.isPending}
                          className="w-full py-3 rounded-xl gradient-gold text-primary-foreground text-sm font-bold shadow-gold disabled:opacity-50"
                        >
                          {selectedActivity.is_public ? "Join Activity" : "Request to Join"}
                        </button>
                      );
                    })()}
                  </div>
                )}
                {user && selectedActivity.creator_id === user.id && (
                  <div className="w-full py-3 mt-4 rounded-xl bg-secondary text-muted-foreground text-center text-sm font-bold">Your Activity</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

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

      {/* Bottom info card */}
      <div className="absolute bottom-20 left-4 right-16 z-[999] max-w-lg">
        <div className="bg-card/95 backdrop-blur-md rounded-2xl border border-border shadow-elevated overflow-hidden">
          <button
            onClick={() => setNearbyCollapsed(!nearbyCollapsed)}
            className="w-full flex items-center justify-between px-4 py-3"
          >
            <h3 className="font-display font-bold text-foreground text-sm">
              {timeFilter === "tonight" ? "Events Tonight" : timeFilter === "weekend" ? "This Weekend" : timeFilter === "thisweek" ? "This Week" : "Nearby This Week"}
            </h3>
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

// Helper to render info window content based on marker type
function renderInfoContent(info: { type: string; data: any }) {
  const d = info.data;
  switch (info.type) {
    case "event":
    case "afronation":
    case "sxsw":
      return (
        <div className="p-1 max-w-[260px]">
          {d.image && <img src={d.image} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />}
          {info.type === "afronation" && (
            <div className="flex items-center gap-2 mb-1">
              <img src={afroNationIcon} alt="" className="w-6 h-6 rounded-full object-cover" />
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">Afro Nation</span>
            </div>
          )}
          {info.type === "sxsw" && (
            <div className="flex items-center gap-2 mb-1">
              <img src={sxswIcon} alt="" className="w-6 h-6 object-contain" />
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-900 text-white">SXSW 2026</span>
            </div>
          )}
          <h3 className="font-bold text-sm leading-tight">{d.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{d.host}</p>
          <div className="text-xs text-gray-500 mt-1">{d.date}</div>
          <div className="text-xs text-gray-500 mt-0.5">{d.venue}</div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">{d.attending >= 1000 ? `${(d.attending / 1000).toFixed(1)}K` : d.attending} attending</span>
            {d.price && <span className="text-xs font-bold text-amber-600">{d.price}</span>}
          </div>
        </div>
      );
    case "flight":
      return (
        <div className="p-2">
          <p className="font-bold text-sm">{d.destinationFlag} {d.destinationName}</p>
          <p className="text-xs text-gray-500 mt-1">From <strong>${d.price}</strong> round trip</p>
        </div>
      );
    case "person":
      return (
        <div className="p-1">
          <p className="font-bold text-sm">{d.vibe} {d.name}, {d.age}</p>
          <p className="text-xs text-gray-500">{d.status}</p>
        </div>
      );
    case "group":
      return (
        <div className="p-1">
          <p className="font-bold text-sm">{d.name}</p>
          <p className="text-xs text-gray-500 mt-1">{d.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {d.members.map((m: string) => (
              <span key={m} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-medium">{m}</span>
            ))}
          </div>
        </div>
      );
    case "resource":
      return (
        <div className="p-2">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${d.type === "nonprofit" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
              {d.type === "nonprofit" ? "💚 Nonprofit" : "💼 Hiring"}
            </span>
          </div>
          <h3 className="font-bold text-sm">{d.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{d.description}</p>
          {d.website && (
            <a href={d.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 mt-2 flex items-center gap-1">
              Visit Website <ExternalLink size={10} />
            </a>
          )}
        </div>
      );
    case "hub":
      return (
        <div className="p-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{d.flag}</span>
            <div>
              <h3 className="font-bold text-sm">{d.city}</h3>
              <p className="text-[10px] text-gray-500">{d.state} · Diaspora Hub</p>
            </div>
          </div>
          <div className="space-y-1">
            {d.communities.slice(0, 5).map((c: any, i: number) => (
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
      );
    case "eventbrite":
    case "posh":
    case "dice":
    case "shotgun":
    case "billetto":
      return (
        <div className="p-1 max-w-[260px]">
          {d.image_url && <img src={d.image_url} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />}
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              info.type === "eventbrite" ? "bg-orange-100 text-orange-700" :
              info.type === "posh" ? "bg-purple-100 text-purple-700" :
              info.type === "dice" ? "bg-blue-100 text-blue-700" :
              info.type === "shotgun" ? "bg-pink-100 text-pink-700" :
              "bg-teal-100 text-teal-700"
            }`}>
              {info.type.charAt(0).toUpperCase() + info.type.slice(1)}
            </span>
          </div>
          <h3 className="font-bold text-sm leading-tight">{d.title}</h3>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(d.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
          </div>
          {d.location && <div className="text-xs text-gray-500 mt-0.5">{d.location}</div>}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-bold text-amber-600">{d.price || "Free"}</span>
            {d.external_url && (
              <a href={d.external_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 flex items-center gap-1">
                View <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      );
    case "place":
      return (
        <div className="p-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              d.category === "restaurant" ? "bg-amber-100 text-amber-700" :
              d.category === "fitness" ? "bg-blue-100 text-blue-700" :
              "bg-teal-100 text-teal-700"
            }`}>
              {d.subcategory || d.category}
            </span>
            {d.cuisine_type && <span className="text-[10px] text-gray-500">{d.cuisine_type}</span>}
          </div>
          <h3 className="font-bold text-sm">{d.name}</h3>
          {d.description && <p className="text-xs text-gray-500 mt-1">{d.description}</p>}
          {d.address && <p className="text-[10px] text-gray-400 mt-1">📍 {d.address}</p>}
          {d.price_range && <span className="text-xs font-bold text-amber-600">{d.price_range}</span>}
        </div>
      );
    default:
      return null;
  }
}

export default MapScreen;
