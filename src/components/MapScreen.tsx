import { useEffect, useState, useMemo, useCallback } from "react";
import { useScreenView } from "@/hooks/useAnalytics";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Users, Calendar, Navigation, ChevronDown, Check, ChevronUp, X, Heart, Briefcase, ExternalLink, Ticket, UtensilsCrossed, Dumbbell, Moon, Globe, HandHelping, Music, Plane, Crosshair, Loader2, Search, Clock, Flame, Ruler } from "lucide-react";
import { events as allEvents, cities, type City, AFRO_NATION_EVENT_ID } from "@/data/cityData";
import afroNationIcon from "@/assets/afro-nation-icon.webp";
import CityPicker from "@/components/CityPicker";
import { cityResources, type CityResource } from "@/data/resourceData";
import { diasporaHubs, type DiasporaHub } from "@/data/diasporaHubs";
import { useEvents } from "@/hooks/useEvents";
import { usePlaces } from "@/hooks/usePlaces";
import { getFlightRoutes } from "@/data/flightData";

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
  // Australia
  sydney: [-33.8688, 151.2093],
  melbourne: [-37.8136, 144.9631],
  brisbane: [-27.4698, 153.0251],
  perth: [-31.9505, 115.8605],
  adelaide: [-34.9285, 138.6007],
  // Brazil
  rio: [-22.9068, -43.1729],
  saopaulo: [-23.5505, -46.6333],
  salvador: [-12.9714, -38.5124],
  // Caribbean & Latin America
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
  // Africa
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
  // Africa — remaining
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

const diceIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,hsl(200,80%,50%),hsl(220,70%,55%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="8" cy="8" r="1.5" fill="white"/><circle cx="16" cy="16" r="1.5" fill="white"/></svg>
  </div>`,
  iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
});

const shotgunIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,hsl(340,80%,55%),hsl(10,80%,55%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
  </div>`,
  iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
});

const billettoIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,hsl(170,70%,45%),hsl(190,60%,50%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/></svg>
  </div>`,
  iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
});

const afroNationMapIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:44px;height:44px;border-radius:50%;background:#f5f0e1;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px hsl(320,70%,45%),0 4px 16px rgba(0,0,0,0.5);border:2px solid hsl(0,0%,7%);overflow:hidden;">
    <img src="${afroNationIcon}" style="width:38px;height:38px;object-fit:cover;border-radius:50%;" />
  </div>`,
  iconSize: [44, 44], iconAnchor: [22, 44], popupAnchor: [0, -44],
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

const createResourceIcon = (category: string, type: string) => {
  const flag = categoryFlagMap[category];
  if (flag && type === "nonprofit") {
    return new L.DivIcon({
      className: "custom-marker",
      html: `<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,hsl(150,70%,40%),hsl(170,60%,45%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);position:relative;">
        <span style="font-size:20px;line-height:1;">${flag.length > 4 ? flag.slice(0, 2) : flag}</span>
      </div>`,
      iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -40],
    });
  }
  // Default nonprofit icon (no diaspora flag)
  if (type === "nonprofit") {
    return new L.DivIcon({
      className: "custom-marker",
      html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,hsl(150,70%,40%),hsl(170,60%,45%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      </div>`,
      iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
    });
  }
  // Hiring icon
  return hiringIcon;
};

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

const restaurantIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,hsl(25,90%,50%),hsl(35,85%,55%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
    <span style="font-size:14px;">🍽️</span>
  </div>`,
  iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32],
});

const fitnessIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,hsl(210,80%,50%),hsl(230,70%,55%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
    <span style="font-size:14px;">💪</span>
  </div>`,
  iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32],
});

const prayerIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,hsl(170,70%,40%),hsl(190,60%,45%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid hsl(0,0%,7%);">
    <span style="font-size:14px;">🕌</span>
  </div>`,
  iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32],
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

const userLocationIcon = new L.DivIcon({
  html: `<div style="width:18px;height:18px;border-radius:50%;background:hsl(217,91%,60%);border:3px solid white;box-shadow:0 0 8px rgba(59,130,246,0.5);"></div>`,
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const NearMeButton = ({ onLocated }: { onLocated: (lat: number, lng: number) => void }) => {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(() => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 14, { animate: true });
        onLocated(latitude, longitude);
        setLoading(false);
      },
      () => setLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [map, onLocated]);

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-36 right-3 z-[1000] p-2.5 rounded-full bg-card/95 backdrop-blur-lg border border-border shadow-lg text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
      title="Near me"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <Crosshair size={18} />}
    </button>
  );
};

interface MapScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

type TimeFilter = "all" | "tonight" | "weekend" | "thisweek";

const MapScreen = ({ selectedCity, onCityChange }: MapScreenProps) => {
  useScreenView("map", { city: selectedCity.id });
  const [showEvents, setShowEvents] = useState(true);
  const [showPeople, setShowPeople] = useState(true);
  const [showGroups, setShowGroups] = useState(true);
  const [showResources, setShowResources] = useState(true);
  const [showHubs, setShowHubs] = useState(true);
  const [showEventbrite, setShowEventbrite] = useState(true);
  const [showPosh, setShowPosh] = useState(true);
  const [showPlaces, setShowPlaces] = useState(true);
  const [showAfroNation, setShowAfroNation] = useState(true);
  const [showFlights, setShowFlights] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [zoomTarget, setZoomTarget] = useState<string | null>(selectedCity.id);
  const [nearbyCollapsed, setNearbyCollapsed] = useState(false);
  const [selectedNearbyEvent, setSelectedNearbyEvent] = useState<typeof allEventPositions[0] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapSearch, setMapSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null); // km
  const [showTrending, setShowTrending] = useState(false);

  const { events: dbEvents } = useEvents();
  const { places: dbPlaces } = usePlaces();

  // Time filter helpers
  const now = useMemo(() => new Date(), []);
  const isTonight = useCallback((dateStr: string) => {
    const d = new Date(dateStr);
    return d.toDateString() === now.toDateString() && d.getHours() >= 17;
  }, [now]);
  const isThisWeekend = useCallback((dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDay();
    const diff = (day === 0 ? 0 : 6 - day);
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

  // Distance filter helper (Haversine)
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
      return {
        ...e,
        lat,
        lng,
        source: (e as any).source as string,
        external_url: (e as any).external_url as string | null,
      };
    }).filter(e => passesTimeFilter(e.date) && passesDistanceFilter(e.lat, e.lng));
  }, [dbEvents, passesTimeFilter, passesDistanceFilter]);

  // Trending locations — cities with most events
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

  const handleCitySelect = (city: City) => {
    onCityChange(city);
    setZoomTarget(city.id);
    setShowCityPicker(false);
  };

  // Match Explore Events page ordering: pinned Posh mock → DB Posh → other DB → unpinned mock
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

      {/* Compact search bar overlay */}
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

          {/* Search results dropdown */}
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

      <div className="absolute top-28 left-4 right-4 z-[1000] max-w-lg mx-auto">
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
          <button onClick={() => setShowFlights(!showFlights)} className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-card whitespace-nowrap ${showFlights ? "bg-[hsl(210,90%,55%)] text-white" : "bg-card text-muted-foreground border border-border"}`}>
            <Plane size={14} /> Flights
          </button>
        </div>
      </div>

      <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }} zoomControl={false} attributionControl={false} minZoom={2} maxBoundsViscosity={0} worldCopyJump={true}>
        <MapController targetCity={zoomTarget} onZoomDone={() => setZoomTarget(null)} />
        <NearMeButton onLocated={(lat, lng) => setUserLocation([lat, lng])} />
        {userLocation && <Marker position={userLocation} icon={userLocationIcon}><Popup>You are here</Popup></Marker>}
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        <Marker position={center} icon={youIcon}>
          <Popup className="afro-popup"><div className="text-sm font-semibold">📍 You are here</div></Popup>
        </Marker>

        {/* Flight route lines */}
        {showFlights && flightRoutes.map((route) => {
          const mid: [number, number] = [
            (center[0] + route.coords[0]) / 2 + Math.abs(center[1] - route.coords[1]) * 0.15,
            (center[1] + route.coords[1]) / 2,
          ];
          return (
            <Polyline
              key={`flight-line-${route.destinationCity}`}
              positions={[center, mid, route.coords]}
              pathOptions={{ color: "hsl(210,90%,55%)", weight: 2, opacity: 0.6, dashArray: "8 6" }}
            />
          );
        })}
        {/* Flight price markers */}
        {showFlights && flightRoutes.map((route) => {
          const priceLabel = new L.DivIcon({
            className: "flight-price-marker",
            html: `<div style="background:hsl(210,90%,55%);color:white;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.2);">$${route.price}</div>`,
            iconSize: [60, 24],
            iconAnchor: [30, 12],
          });
          return (
            <Marker key={`flight-price-${route.destinationCity}`} position={route.coords} icon={priceLabel}>
              <Popup className="afro-popup" maxWidth={240}>
                <div className="p-2">
                  <p className="font-bold text-sm">{route.destinationFlag} {route.destinationName}</p>
                  <p className="text-xs text-gray-500 mt-1">From <strong>${route.price}</strong> round trip</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
        {showEvents && allEventPositions.filter(e => !e.host?.toLowerCase().includes("afro nation")).map((event) => (
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

        {/* Afro Nation events with custom icon */}
        {showAfroNation && allEventPositions.filter(e => e.host?.toLowerCase().includes("afro nation")).map((event) => (
          <Marker key={`an-${event.id}`} position={[event.lat, event.lng]} icon={afroNationMapIcon} eventHandlers={{ click: () => handleEventClick(event.city) }}>
            <Popup className="afro-popup" maxWidth={280}>
              <div className="p-1">
                <div className="flex items-center gap-2 mb-2">
                  <img src={afroNationIcon} alt="Afro Nation" className="w-8 h-8 rounded-full object-cover" />
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">Afro Nation</span>
                </div>
                <img src={event.image} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
                <h3 className="font-bold text-sm leading-tight">{event.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{event.host}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500"><span>{event.date}</span></div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500"><span>{event.venue}</span></div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{event.attending >= 1000 ? `${(event.attending / 1000).toFixed(1)}K` : event.attending} attending</span>
                  {event.price && <span className="text-xs font-bold text-purple-600">{event.price}</span>}
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
          <Marker key={`resource-${resource.id}`} position={[resource.lat, resource.lng]} icon={createResourceIcon(resource.category, resource.type)}>
            <Popup className="afro-popup" maxWidth={300}>
              <div className="p-2">
                {/* Type & Category badges */}
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${resource.type === "nonprofit" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                    {resource.type === "nonprofit" ? "💚 Nonprofit" : "💼 Hiring"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">{resource.category}</span>
                </div>

                {/* Name */}
                <h3 className="font-bold text-sm leading-tight text-gray-900">{resource.name}</h3>

                {/* Description */}
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{resource.description}</p>

                {/* City */}
                <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="capitalize">{resource.city}</span>
                </div>

                {/* Website link */}
                {resource.website && (
                  <a
                    href={resource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 mt-2.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-xs font-medium text-blue-600"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    Visit Website
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-white text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm"
                    onClick={() => {
                      if (resource.website) window.open(resource.website, "_blank");
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                    Contact
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-white text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm"
                    onClick={() => {
                      const helpTab = document.querySelector('[data-tab="help"]') as HTMLElement;
                      if (helpTab) helpTab.click();
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    Ask for Help
                  </button>
                </div>
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

        {/* DICE events from DB */}
        {showEventbrite && dbEventPositions.filter(e => e.source === "dice").map((event) => (
          <Marker key={`dice-${event.id}`} position={[event.lat, event.lng]} icon={diceIcon} eventHandlers={{ click: () => handleEventClick(event.city) }}>
            <Popup className="afro-popup" maxWidth={280}>
              <div className="p-1">
                {event.image_url && <img src={event.image_url} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">DICE</span>
                </div>
                <h3 className="font-bold text-sm leading-tight">{event.title}</h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                  <span>{new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                </div>
                {event.location && <div className="text-xs text-gray-500 mt-1">{event.location}</div>}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-blue-600">{event.price || "Free"}</span>
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

        {/* Shotgun events from DB */}
        {showEventbrite && dbEventPositions.filter(e => e.source === "shotgun").map((event) => (
          <Marker key={`sg-${event.id}`} position={[event.lat, event.lng]} icon={shotgunIcon} eventHandlers={{ click: () => handleEventClick(event.city) }}>
            <Popup className="afro-popup" maxWidth={280}>
              <div className="p-1">
                {event.image_url && <img src={event.image_url} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700">Shotgun</span>
                </div>
                <h3 className="font-bold text-sm leading-tight">{event.title}</h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                  <span>{new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                </div>
                {event.location && <div className="text-xs text-gray-500 mt-1">{event.location}</div>}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-pink-600">{event.price || "Free"}</span>
                  {event.external_url && (
                    <a href={event.external_url} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-500 flex items-center gap-1">
                      View <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Billetto events from DB */}
        {showEventbrite && dbEventPositions.filter(e => e.source === "billetto").map((event) => (
          <Marker key={`bl-${event.id}`} position={[event.lat, event.lng]} icon={billettoIcon} eventHandlers={{ click: () => handleEventClick(event.city) }}>
            <Popup className="afro-popup" maxWidth={280}>
              <div className="p-1">
                {event.image_url && <img src={event.image_url} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-700">Billetto</span>
                </div>
                <h3 className="font-bold text-sm leading-tight">{event.title}</h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                  <span>{new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                </div>
                {event.location && <div className="text-xs text-gray-500 mt-1">{event.location}</div>}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-teal-600">{event.price || "Free"}</span>
                  {event.external_url && (
                    <a href={event.external_url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-500 flex items-center gap-1">
                      View <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Places from DB */}
        {showPlaces && dbPlaces.filter(p => p.latitude && p.longitude).map((place) => (
          <Marker
            key={`place-${place.id}`}
            position={[place.latitude!, place.longitude!]}
            icon={place.category === "restaurant" ? restaurantIcon : place.category === "fitness" ? fitnessIcon : prayerIcon}
          >
            <Popup className="afro-popup" maxWidth={280}>
              <div className="p-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    place.category === "restaurant" ? "bg-amber-100 text-amber-700" :
                    place.category === "fitness" ? "bg-blue-100 text-blue-700" :
                    "bg-teal-100 text-teal-700"
                  }`}>
                    {place.subcategory || place.category}
                  </span>
                  {place.cuisine_type && <span className="text-[10px] text-gray-500">{place.cuisine_type}</span>}
                  {place.is_halal && <span className="text-[9px] font-bold text-emerald-500">Halal</span>}
                </div>
                <h3 className="font-bold text-sm leading-tight">{place.name}</h3>
                {place.description && <p className="text-xs text-gray-500 mt-1">{place.description}</p>}
                {place.address && <p className="text-[10px] text-gray-400 mt-1">📍 {place.address}</p>}
                {place.price_range && <span className="text-xs font-bold text-amber-600">{place.price_range}</span>}
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
