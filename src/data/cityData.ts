import eventParty from "@/assets/event-party.jpg";
import eventBrunch from "@/assets/event-brunch.jpg";
import eventConcert from "@/assets/event-concert.jpg";
import eventFeteMusique from "@/assets/event-fete-musique.jpg";
import eventAfricanArt from "@/assets/event-african-art.jpg";
import eventFootball from "@/assets/event-football.jpg";
import eventRapConcert from "@/assets/event-rap-concert.jpg";
import eventGrime from "@/assets/event-grime.jpg";
import eventUkAfrobeats from "@/assets/event-uk-afrobeats.jpg";
import eventNyfw from "@/assets/event-nyfw.jpg";
import eventNycHiphop from "@/assets/event-nyc-hiphop.jpg";
import eventStreetwearShow from "@/assets/event-streetwear-show.jpg";
import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";
import profileWoman2 from "@/assets/profile-woman-2.jpg";

export interface City {
  id: string;
  name: string;
  flag: string;
}

export const cities: City[] = [
  { id: "austin", name: "Austin, TX", flag: "🇺🇸" },
  { id: "dallas", name: "Dallas, TX", flag: "🇺🇸" },
  { id: "houston", name: "Houston, TX", flag: "🇺🇸" },
  { id: "sanantonio", name: "San Antonio, TX", flag: "🇺🇸" },
  { id: "paris", name: "Paris, France", flag: "🇫🇷" },
  { id: "london", name: "London, England", flag: "🇬🇧" },
  { id: "nyc", name: "New York City, NY", flag: "🇺🇸" },
];

export interface FeedPost {
  id: number;
  author: string | null;
  avatar: string | null;
  location: string;
  time: string;
  text: string | null;
  image: string | null;
  likes: number;
  comments: number;
  type: "post" | "event";
  eventTitle?: string;
  eventDate?: string;
  eventVenue?: string;
  attending?: number;
  city: string;
}

export interface EventItem {
  id: number;
  title: string;
  host: string;
  date: string;
  venue: string;
  city: string;
  distance: string;
  image: string;
  attending: number;
  free: boolean;
  price?: string;
  category?: string;
}

export const feedPosts: FeedPost[] = [
  // Austin
  {
    id: 1, author: "Amara Johnson", avatar: profileWoman1, location: "Austin, TX", time: "2h ago",
    text: "Just moved to Austin from Lagos! Looking for my people here 🇳🇬✨ Who's going to Afrobeats Night this Friday?",
    image: eventParty, likes: 47, comments: 12, type: "post", city: "austin",
  },
  {
    id: 2, author: "Diaspora Brunch Club", avatar: null, location: "Houston, TX", time: "Today",
    text: null, image: eventBrunch, likes: 128, comments: 34, type: "event", city: "austin",
    eventTitle: "Diaspora Brunch — Sunday Edition", eventDate: "Sun, Mar 9 · 11:00 AM",
    eventVenue: "The Grove Houston", attending: 86,
  },
  {
    id: 3, author: "Kwame Asante", avatar: profileMan1, location: "Dallas, TX", time: "5h ago",
    text: "The tech meetup last night was incredible. So many brilliant minds from the diaspora building amazing things. Can't wait for the next one! 💡",
    image: null, likes: 93, comments: 21, type: "post", city: "austin",
  },
  {
    id: 4, author: null, avatar: null, location: "Austin, TX", time: "This Saturday",
    text: null, image: eventConcert, likes: 256, comments: 45, type: "event", city: "austin",
    eventTitle: "Afrobeats Live — Burna Boy Tribute Night", eventDate: "Sat, Mar 8 · 9:00 PM",
    eventVenue: "Empire Control Room", attending: 342,
  },
  // Dallas
  {
    id: 50, author: "Tasha Williams", avatar: profileWoman1, location: "Dallas, TX", time: "1h ago",
    text: "Deep Ellum is on FIRE tonight 🔥 Three Afrobeats parties all on the same block. Dallas diaspora is growing fr!",
    image: eventParty, likes: 134, comments: 28, type: "post", city: "dallas",
  },
  {
    id: 51, author: null, avatar: null, location: "Dallas, TX", time: "This Saturday",
    text: null, image: eventConcert, likes: 312, comments: 67, type: "event", city: "dallas",
    eventTitle: "Afro Beats Party — Dallas Edition", eventDate: "Sat, Mar 15 · 10:00 PM",
    eventVenue: "Stereo Live Dallas", attending: 520,
  },
  // Houston
  {
    id: 55, author: "Chidera Eze", avatar: profileMan2, location: "Houston, TX", time: "2h ago",
    text: "H-Town Afrobeats scene is UNMATCHED 🇳🇬 Who's pulling up to the Colors event this weekend?",
    image: eventUkAfrobeats, likes: 278, comments: 56, type: "post", city: "houston",
  },
  {
    id: 56, author: null, avatar: null, location: "Houston, TX", time: "This Friday",
    text: null, image: eventParty, likes: 445, comments: 89, type: "event", city: "houston",
    eventTitle: "Colors Festival Houston", eventDate: "Fri, Mar 14 · 7:00 PM",
    eventVenue: "Discovery Green", attending: 3500,
  },
  // San Antonio
  {
    id: 60, author: "Maya Rodriguez", avatar: profileWoman2, location: "San Antonio, TX", time: "3h ago",
    text: "San Antonio's first-ever Afro Nation watch party is happening at the Riverwalk! Who knew SA had this energy?! 🔥🇺🇸",
    image: eventFootball, likes: 89, comments: 14, type: "post", city: "sanantonio",
  },
  {
    id: 61, author: null, avatar: null, location: "San Antonio, TX", time: "This Weekend",
    text: null, image: eventConcert, likes: 156, comments: 34, type: "event", city: "sanantonio",
    eventTitle: "Afro Beats Party — SA Vibes", eventDate: "Sat, Mar 15 · 9:00 PM",
    eventVenue: "Paper Tiger", attending: 280,
  },
  
  {
    id: 10, author: "Sophie Diallo", avatar: profileWoman2, location: "Paris, France", time: "1h ago",
    text: "La Fête de la Musique commence bientôt ! 🎶 Qui sera au concert de Fally Ipupa au Zénith ? C'est going to be legendary 🔥🇨🇩",
    image: eventFeteMusique, likes: 312, comments: 87, type: "post", city: "paris",
  },
  {
    id: 11, author: "AfroHub Paris", avatar: null, location: "Paris, France", time: "Today",
    text: null, image: eventRapConcert, likes: 548, comments: 124, type: "event", city: "paris",
    eventTitle: "MHD en Concert — Afro Trap Night", eventDate: "Fri, Jun 13 · 8:30 PM",
    eventVenue: "L'Olympia", attending: 2400,
  },
  {
    id: 12, author: "Moussa Traoré", avatar: profileMan2, location: "Paris, France", time: "3h ago",
    text: "L'expo d'art africain contemporain au Palais de Tokyo est incroyable. Des artistes du Congo, Sénégal, Côte d'Ivoire… Allez-y ! 🎨✨",
    image: eventAfricanArt, likes: 189, comments: 42, type: "post", city: "paris",
  },
  {
    id: 13, author: null, avatar: null, location: "Paris, France", time: "This Weekend",
    text: null, image: eventFootball, likes: 421, comments: 98, type: "event", city: "paris",
    eventTitle: "AFCON Inspired Football Tournament", eventDate: "Sat, Jun 14 · 2:00 PM",
    eventVenue: "Stade Charléty", attending: 1200,
  },
  {
    id: 14, author: "Awa Ndiaye", avatar: profileWoman1, location: "Paris, France", time: "6h ago",
    text: "Stromae + Aya Nakamura on the same stage for Fête de la Musique?! Paris is THE place to be this June 🇫🇷🎤 Who's pulling up?",
    image: null, likes: 734, comments: 201, type: "post", city: "paris",
  },
  // London
  {
    id: 20, author: "Chidera Okafor", avatar: profileMan1, location: "London, England", time: "45m ago",
    text: "Skepta just announced a surprise show at Brixton Academy next week 🤯🇬🇧 This is NOT a drill. Who's coming?!",
    image: eventGrime, likes: 892, comments: 234, type: "post", city: "london",
  },
  {
    id: 21, author: "AfroHub London", avatar: null, location: "London, England", time: "Today",
    text: null, image: eventUkAfrobeats, likes: 1247, comments: 312, type: "event", city: "london",
    eventTitle: "Davido — Timeless Tour London", eventDate: "Sat, Jul 19 · 7:00 PM",
    eventVenue: "The O2 Arena", attending: 20000,
  },
  {
    id: 22, author: "Abena Mensah", avatar: profileWoman2, location: "London, England", time: "2h ago",
    text: "The UK Afrobeats scene is absolutely on fire right now 🔥 J Hus, Kojo Funds, and Burna Boy all in London this summer? We are SO blessed 🙏🏾",
    image: null, likes: 567, comments: 143, type: "post", city: "london",
  },
  {
    id: 23, author: null, avatar: null, location: "London, England", time: "Next Friday",
    text: null, image: eventGrime, likes: 1823, comments: 456, type: "event", city: "london",
    eventTitle: "Grime Legends Live — Skepta Headline", eventDate: "Fri, Jul 18 · 9:00 PM",
    eventVenue: "O2 Academy Brixton", attending: 4900,
  },
  {
    id: 24, author: "Kweku Thompson", avatar: profileMan2, location: "London, England", time: "4h ago",
    text: "Just copped tickets for Wizkid at Wembley. MIL went in 30 minutes 😭 London, this summer is going to be LEGENDARY 🦅🇳🇬",
    image: eventConcert, likes: 1456, comments: 378, type: "post", city: "london",
  },
  // New York City
  {
    id: 30, author: "Marcus Williams", avatar: profileMan1, location: "New York City, NY", time: "30m ago",
    text: "Jadakiss & The Lox just announced a surprise show at the Apollo. Harlem stand UP 🗽🔥 This is real hip-hop, no cap.",
    image: eventNycHiphop, likes: 1823, comments: 567, type: "post", city: "nyc",
  },
  {
    id: 31, author: "AfroHub NYC", avatar: null, location: "New York City, NY", time: "Today",
    text: null, image: eventNyfw, likes: 2341, comments: 412, type: "event", city: "nyc",
    eventTitle: "New York Fashion Week — Fall 2026", eventDate: "Sep 8–13 · All Day",
    eventVenue: "Spring Studios, Manhattan", attending: 50000,
  },
  {
    id: 32, author: "Jasmine Carter", avatar: profileWoman2, location: "New York City, NY", time: "1h ago",
    text: "NYFW lineup is INSANE this year — KidSuper, Balenciaga, Yeezy, YSL, and Louis Vuitton all in one week?! My wallet is crying but my closet is thriving 👗✨",
    image: eventStreetwearShow, likes: 1567, comments: 389, type: "post", city: "nyc",
  },
  {
    id: 33, author: null, avatar: null, location: "New York City, NY", time: "Next Week",
    text: null, image: eventNycHiphop, likes: 3421, comments: 876, type: "event", city: "nyc",
    eventTitle: "Dipset — Diplomatic Immunity Tour", eventDate: "Fri, Sep 12 · 9:00 PM",
    eventVenue: "Madison Square Garden", attending: 18000,
  },
  {
    id: 34, author: "Devon Jackson", avatar: profileMan2, location: "New York City, NY", time: "3h ago",
    text: "Who Decides War show was absolutely MIND-BLOWING. Ev Bravado is a genius. The craftsmanship, the storytelling through fashion… NYC is the center of the universe fr 🌍🪡",
    image: eventNyfw, likes: 2189, comments: 534, type: "post", city: "nyc",
  },
];

export const events: EventItem[] = [
  // Austin
  {
    id: 1, title: "Afrobeats Night — Friday Vibes", host: "AfroHub Community",
    date: "Fri, Mar 7 · 9:00 PM", venue: "Cedar Street Courtyard", city: "austin",
    distance: "2.3 mi", image: eventParty, attending: 186, free: false,
  },
  {
    id: 2, title: "Diaspora Brunch — Sunday Edition", host: "Diaspora Brunch Club",
    date: "Sun, Mar 9 · 11:00 AM", venue: "The Grove Houston", city: "austin",
    distance: "165 mi", image: eventBrunch, attending: 86, free: true,
  },
  {
    id: 3, title: "Burna Boy Tribute Night", host: "Empire Control Room",
    date: "Sat, Mar 8 · 9:00 PM", venue: "Empire Control Room", city: "austin",
    distance: "1.8 mi", image: eventConcert, attending: 342, free: false,
  },
  // Austin — additional events
  { id: 4, title: "Neon Nights — Rooftop Party", host: "Vibe Collective ATX", date: "Fri, Mar 7 · 10:00 PM", venue: "The Rooftop at W Austin", city: "austin", distance: "1.2 mi", image: eventParty, attending: 240, free: false, price: "$30", category: "Party" },
  { id: 5, title: "ATX Day Party — All White Affair", host: "AfroHub Austin", date: "Sat, Mar 8 · 2:00 PM", venue: "The Creek & The Cave", city: "austin", distance: "3.1 mi", image: eventBrunch, attending: 175, free: false, price: "$25", category: "Party" },
  { id: 6, title: "Late Night Vibes — R&B Edition", host: "Mood Music ATX", date: "Sat, Mar 8 · 11:00 PM", venue: "Kingdom Nightclub", city: "austin", distance: "2.5 mi", image: eventParty, attending: 310, free: false, price: "$20", category: "Party" },
  { id: 7, title: "Sunset Social — Poolside Party", host: "Day Shift Collective", date: "Sun, Mar 9 · 1:00 PM", venue: "The LINE Hotel Pool", city: "austin", distance: "1.8 mi", image: eventBrunch, attending: 150, free: false, price: "$35", category: "Party" },
  { id: 8, title: "Glow Up — Neon Paint Party", host: "Neon Tribe ATX", date: "Fri, Mar 14 · 9:00 PM", venue: "Emo's Austin", city: "austin", distance: "2.0 mi", image: eventParty, attending: 420, free: false, price: "$25", category: "Party" },
  { id: 100, title: "6-a-Side Soccer Tournament", host: "ATX Diaspora Sports", date: "Sat, Mar 8 · 10:00 AM", venue: "Zilker Park Fields", city: "austin", distance: "2.8 mi", image: eventFootball, attending: 120, free: true, category: "Soccer" },
  { id: 101, title: "African Legends Soccer Match", host: "Naija FC Austin", date: "Sun, Mar 9 · 3:00 PM", venue: "House Park", city: "austin", distance: "1.5 mi", image: eventFootball, attending: 95, free: true, category: "Soccer" },
  { id: 102, title: "AFCON Watch Party — Live", host: "AfroHub Sports ATX", date: "Sat, Mar 8 · 12:00 PM", venue: "Haymaker Austin", city: "austin", distance: "1.3 mi", image: eventFootball, attending: 85, free: true, category: "Watch Party" },
  { id: 103, title: "Premier League Watch Party", host: "Soccer Social ATX", date: "Sun, Mar 9 · 9:00 AM", venue: "Black Sheep Lodge", city: "austin", distance: "3.5 mi", image: eventFootball, attending: 60, free: true, category: "Watch Party" },
  { id: 104, title: "FIFA Tournament — $500 Prize Pool", host: "Game On ATX", date: "Fri, Mar 7 · 7:00 PM", venue: "Plex Esports Lounge", city: "austin", distance: "4.2 mi", image: eventNycHiphop, attending: 64, free: false, price: "$15", category: "FIFA Gaming" },
  { id: 105, title: "FIFA 26 Pro-Am Night", host: "Console Kings ATX", date: "Sat, Mar 15 · 6:00 PM", venue: "Vigilante Bar", city: "austin", distance: "2.1 mi", image: eventNycHiphop, attending: 48, free: false, price: "$10", category: "FIFA Gaming" },
  { id: 106, title: "Colors Festival ATX 2026", host: "Colors Worldwide", date: "Sat, Mar 15 · 4:00 PM", venue: "Fiesta Gardens", city: "austin", distance: "3.0 mi", image: eventUkAfrobeats, attending: 2800, free: false, price: "$55", category: "Festival" },
  { id: 107, title: "Afro Beats Party — ATX", host: "AfroHub Community", date: "Fri, Mar 14 · 10:00 PM", venue: "Vulcan Gas Company", city: "austin", distance: "1.4 mi", image: eventParty, attending: 380, free: false, price: "$20", category: "Afrobeats" },
  { id: 108, title: "Mansion Pool Party", host: "Elite Events ATX", date: "Sun, Mar 16 · 12:00 PM", venue: "Private Venue", city: "austin", distance: "5.0 mi", image: eventBrunch, attending: 200, free: false, price: "$40", category: "Party" },
  { id: 109, title: "Diaspora Networking Mixer", host: "Black Professionals ATX", date: "Thu, Mar 13 · 6:00 PM", venue: "Capital Factory", city: "austin", distance: "1.0 mi", image: eventAfricanArt, attending: 130, free: true, category: "Networking" },
  { id: 110, title: "Live Band Karaoke Night", host: "Vibes & Lyrics ATX", date: "Wed, Mar 12 · 8:00 PM", venue: "The Far Out Lounge", city: "austin", distance: "4.5 mi", image: eventConcert, attending: 95, free: false, price: "$10", category: "Party" },

  // Dallas
  { id: 200, title: "Deep Ellum Block Party", host: "AfroHub Dallas", date: "Fri, Mar 7 · 9:00 PM", venue: "Deep Ellum Art Co", city: "dallas", distance: "1.5 mi", image: eventParty, attending: 350, free: false, price: "$25", category: "Party" },
  { id: 201, title: "Uptown Rooftop Soirée", host: "Luxe Events DFW", date: "Sat, Mar 8 · 8:00 PM", venue: "HG Sply Co Rooftop", city: "dallas", distance: "2.3 mi", image: eventParty, attending: 280, free: false, price: "$35", category: "Party" },
  { id: 202, title: "Diaspora Day Party — All Black", host: "Culture Collective DFW", date: "Sat, Mar 8 · 2:00 PM", venue: "The Statler Hotel Pool", city: "dallas", distance: "1.8 mi", image: eventBrunch, attending: 220, free: false, price: "$30", category: "Party" },
  { id: 203, title: "Midnight Vibes — Afro House", host: "Afro House DFW", date: "Sat, Mar 8 · 11:00 PM", venue: "It'll Do Club", city: "dallas", distance: "1.2 mi", image: eventParty, attending: 400, free: false, price: "$20", category: "Party" },
  { id: 204, title: "Sunday Funday Brunch Party", host: "Brunch & Beats DFW", date: "Sun, Mar 9 · 12:00 PM", venue: "The Rustic", city: "dallas", distance: "2.5 mi", image: eventBrunch, attending: 190, free: false, price: "$40", category: "Party" },
  { id: 205, title: "Neon Glow Party — Dallas", host: "Glow Gang DFW", date: "Fri, Mar 14 · 10:00 PM", venue: "Stereo Live Dallas", city: "dallas", distance: "4.0 mi", image: eventParty, attending: 520, free: false, price: "$25", category: "Party" },
  { id: 206, title: "Penthouse Pool Party", host: "Elevated Events DFW", date: "Sun, Mar 9 · 1:00 PM", venue: "W Dallas Rooftop", city: "dallas", distance: "1.9 mi", image: eventBrunch, attending: 160, free: false, price: "$45", category: "Party" },
  { id: 207, title: "Latin x Afro Fusion Night", host: "Fusion Dallas", date: "Thu, Mar 13 · 9:00 PM", venue: "The Green Room", city: "dallas", distance: "3.1 mi", image: eventParty, attending: 275, free: false, price: "$20", category: "Party" },
  { id: 208, title: "R&B vs Afrobeats Night", host: "Vibes Only DFW", date: "Fri, Mar 7 · 10:00 PM", venue: "House of Blues Dallas", city: "dallas", distance: "1.6 mi", image: eventRapConcert, attending: 450, free: false, price: "$30", category: "Party" },
  { id: 209, title: "Warehouse Party — Underground", host: "Underground DFW", date: "Sat, Mar 15 · 11:00 PM", venue: "Undisclosed Location", city: "dallas", distance: "2.0 mi", image: eventParty, attending: 300, free: false, price: "$15", category: "Party" },
  { id: 210, title: "FC Dallas Community Match", host: "DFW Diaspora Soccer", date: "Sat, Mar 8 · 10:00 AM", venue: "Toyota Stadium Fields", city: "dallas", distance: "8.5 mi", image: eventFootball, attending: 140, free: true, category: "Soccer" },
  { id: 211, title: "African Nations Cup — 5v5", host: "Naija FC Dallas", date: "Sun, Mar 9 · 2:00 PM", venue: "MoneyGram Park", city: "dallas", distance: "3.2 mi", image: eventFootball, attending: 110, free: true, category: "Soccer" },
  { id: 212, title: "Champions League Watch Party", host: "Soccer Social DFW", date: "Tue, Mar 11 · 2:00 PM", venue: "Frankie's Sports Bar", city: "dallas", distance: "2.8 mi", image: eventFootball, attending: 75, free: true, category: "Watch Party" },
  { id: 213, title: "AFCON Finals Watch Party", host: "AfroHub Sports DFW", date: "Sun, Mar 9 · 4:00 PM", venue: "Nodding Donkey", city: "dallas", distance: "2.1 mi", image: eventFootball, attending: 95, free: true, category: "Watch Party" },
  { id: 214, title: "FIFA 26 Tournament — DFW", host: "Game Zone Dallas", date: "Fri, Mar 7 · 6:00 PM", venue: "Nerd Bunker DFW", city: "dallas", distance: "5.0 mi", image: eventNycHiphop, attending: 56, free: false, price: "$15", category: "FIFA Gaming" },
  { id: 215, title: "FIFA Pro-Am Championship", host: "Console Kings DFW", date: "Sat, Mar 15 · 5:00 PM", venue: "GameStop HQ Lounge", city: "dallas", distance: "6.2 mi", image: eventNycHiphop, attending: 42, free: false, price: "$10", category: "FIFA Gaming" },
  { id: 216, title: "Colors Festival Dallas 2026", host: "Colors Worldwide", date: "Sat, Mar 15 · 3:00 PM", venue: "Fair Park", city: "dallas", distance: "3.5 mi", image: eventUkAfrobeats, attending: 3200, free: false, price: "$60", category: "Festival" },
  { id: 217, title: "Afro Beats Party — Dallas", host: "AfroHub Dallas", date: "Fri, Mar 14 · 10:00 PM", venue: "House of Blues Dallas", city: "dallas", distance: "1.6 mi", image: eventParty, attending: 480, free: false, price: "$25", category: "Afrobeats" },

  // Houston
  { id: 300, title: "Midtown Block Party", host: "AfroHub Houston", date: "Fri, Mar 7 · 9:00 PM", venue: "Midtown Houston", city: "houston", distance: "1.0 mi", image: eventParty, attending: 420, free: false, price: "$20", category: "Party" },
  { id: 301, title: "H-Town Gala Night", host: "Luxe Events HTX", date: "Sat, Mar 8 · 8:00 PM", venue: "The Post Oak Hotel", city: "houston", distance: "4.5 mi", image: eventParty, attending: 300, free: false, price: "$50", category: "Party" },
  { id: 302, title: "Third Ward Day Party", host: "Culture Collective HTX", date: "Sat, Mar 8 · 2:00 PM", venue: "Emancipation Park", city: "houston", distance: "2.0 mi", image: eventBrunch, attending: 250, free: true, category: "Party" },
  { id: 303, title: "Warehouse Rave — Afro Tech", host: "AfroTech HTX", date: "Sat, Mar 8 · 11:00 PM", venue: "Warehouse Live", city: "houston", distance: "1.5 mi", image: eventParty, attending: 550, free: false, price: "$25", category: "Party" },
  { id: 304, title: "Brunch & Mimosas — HTX Style", host: "Brunch Babes HTX", date: "Sun, Mar 9 · 11:00 AM", venue: "State of Grace", city: "houston", distance: "3.2 mi", image: eventBrunch, attending: 180, free: false, price: "$45", category: "Party" },
  { id: 305, title: "Yacht Party Houston", host: "Elevated Events HTX", date: "Sun, Mar 9 · 3:00 PM", venue: "Kemah Boardwalk Marina", city: "houston", distance: "12.0 mi", image: eventParty, attending: 120, free: false, price: "$75", category: "Party" },
  { id: 306, title: "Galleria Rooftop Party", host: "Sky High HTX", date: "Fri, Mar 14 · 9:00 PM", venue: "Z on 23 Rooftop", city: "houston", distance: "5.0 mi", image: eventParty, attending: 280, free: false, price: "$30", category: "Party" },
  { id: 307, title: "Amapiano Night — Houston", host: "Amapiano Collective", date: "Thu, Mar 13 · 9:00 PM", venue: "Club Tropicana", city: "houston", distance: "2.8 mi", image: eventRapConcert, attending: 350, free: false, price: "$20", category: "Party" },
  { id: 308, title: "Sip & Paint After Dark", host: "Creative Souls HTX", date: "Wed, Mar 12 · 7:00 PM", venue: "Bisong Art Gallery", city: "houston", distance: "3.5 mi", image: eventAfricanArt, attending: 80, free: false, price: "$35", category: "Party" },
  { id: 309, title: "Blackout Party — All Black Everything", host: "Night Shift HTX", date: "Sat, Mar 15 · 10:00 PM", venue: "Clé Houston", city: "houston", distance: "1.2 mi", image: eventParty, attending: 600, free: false, price: "$30", category: "Party" },
  { id: 310, title: "Houston Dynamo Community Match", host: "HTX Diaspora Soccer", date: "Sat, Mar 8 · 10:00 AM", venue: "Shell Energy Stadium", city: "houston", distance: "2.0 mi", image: eventFootball, attending: 180, free: true, category: "Soccer" },
  { id: 311, title: "African All-Stars Soccer", host: "Naija FC Houston", date: "Sun, Mar 9 · 3:00 PM", venue: "Bear Creek Park", city: "houston", distance: "8.0 mi", image: eventFootball, attending: 130, free: true, category: "Soccer" },
  { id: 312, title: "EPL Watch Party — Arsenal vs Spurs", host: "Soccer Social HTX", date: "Sat, Mar 8 · 11:30 AM", venue: "Richmond Arms Pub", city: "houston", distance: "4.5 mi", image: eventFootball, attending: 90, free: true, category: "Watch Party" },
  { id: 313, title: "World Cup Qualifier Watch Party", host: "AfroHub Sports HTX", date: "Tue, Mar 11 · 6:00 PM", venue: "Lucky's Pub", city: "houston", distance: "1.8 mi", image: eventFootball, attending: 110, free: true, category: "Watch Party" },
  { id: 314, title: "FIFA 26 Tournament — HTX", host: "Game On Houston", date: "Fri, Mar 7 · 7:00 PM", venue: "Pixel 8 Lounge", city: "houston", distance: "3.0 mi", image: eventNycHiphop, attending: 72, free: false, price: "$15", category: "FIFA Gaming" },
  { id: 315, title: "FIFA Pro League Night", host: "Console Kings HTX", date: "Sat, Mar 15 · 6:00 PM", venue: "EVO Lounge", city: "houston", distance: "4.2 mi", image: eventNycHiphop, attending: 55, free: false, price: "$10", category: "FIFA Gaming" },
  { id: 316, title: "Colors Festival Houston 2026", host: "Colors Worldwide", date: "Sat, Mar 15 · 3:00 PM", venue: "Discovery Green", city: "houston", distance: "1.5 mi", image: eventUkAfrobeats, attending: 4500, free: false, price: "$55", category: "Festival" },
  { id: 317, title: "Afro Beats Party — Houston", host: "AfroHub Houston", date: "Fri, Mar 14 · 10:00 PM", venue: "Warehouse Live", city: "houston", distance: "1.5 mi", image: eventParty, attending: 520, free: false, price: "$20", category: "Afrobeats" },

  // San Antonio
  { id: 400, title: "Riverwalk Night Party", host: "AfroHub San Antonio", date: "Fri, Mar 7 · 9:00 PM", venue: "The Esquire Tavern", city: "sanantonio", distance: "0.8 mi", image: eventParty, attending: 200, free: false, price: "$20", category: "Party" },
  { id: 401, title: "Alamo City Rooftop Party", host: "SA Vibes Collective", date: "Sat, Mar 8 · 8:00 PM", venue: "Paramour Rooftop", city: "sanantonio", distance: "1.0 mi", image: eventParty, attending: 260, free: false, price: "$25", category: "Party" },
  { id: 402, title: "Southtown Art & Party Night", host: "Culture Collective SA", date: "Sat, Mar 8 · 3:00 PM", venue: "Blue Star Arts Complex", city: "sanantonio", distance: "1.5 mi", image: eventAfricanArt, attending: 150, free: true, category: "Party" },
  { id: 403, title: "Midnight Rodeo — Afrobeats Mix", host: "Afro Rodeo SA", date: "Sat, Mar 8 · 11:00 PM", venue: "Cowboys Dancehall", city: "sanantonio", distance: "6.0 mi", image: eventParty, attending: 380, free: false, price: "$15", category: "Party" },
  { id: 404, title: "Pearl Brewery Brunch Party", host: "Brunch & Beats SA", date: "Sun, Mar 9 · 11:00 AM", venue: "The Pearl", city: "sanantonio", distance: "2.0 mi", image: eventBrunch, attending: 140, free: false, price: "$35", category: "Party" },
  { id: 405, title: "Fiesta Afro Fusion Night", host: "Fusion SA", date: "Fri, Mar 14 · 9:00 PM", venue: "Paper Tiger", city: "sanantonio", distance: "2.5 mi", image: eventParty, attending: 300, free: false, price: "$20", category: "Party" },
  { id: 406, title: "Sunset Sessions — Outdoor Vibes", host: "SA Sunset Collective", date: "Sun, Mar 9 · 4:00 PM", venue: "La Villita", city: "sanantonio", distance: "0.5 mi", image: eventBrunch, attending: 120, free: true, category: "Party" },
  { id: 407, title: "Hookah & Beats Lounge Night", host: "Cloud 9 SA", date: "Thu, Mar 13 · 8:00 PM", venue: "Smoke BBQ Lounge", city: "sanantonio", distance: "3.0 mi", image: eventParty, attending: 95, free: false, price: "$15", category: "Party" },
  { id: 408, title: "Glow Party San Antonio", host: "Neon Nights SA", date: "Sat, Mar 15 · 10:00 PM", venue: "Aztec Theatre", city: "sanantonio", distance: "0.7 mi", image: eventParty, attending: 350, free: false, price: "$25", category: "Party" },
  { id: 409, title: "Taco & Afrobeats Festival", host: "SA Food & Beats", date: "Sun, Mar 16 · 12:00 PM", venue: "Market Square", city: "sanantonio", distance: "1.0 mi", image: eventBrunch, attending: 280, free: false, price: "$10", category: "Party" },
  { id: 410, title: "San Antonio FC Community Day", host: "SA Diaspora Soccer", date: "Sat, Mar 8 · 10:00 AM", venue: "Toyota Field", city: "sanantonio", distance: "7.0 mi", image: eventFootball, attending: 160, free: true, category: "Soccer" },
  { id: 411, title: "5-a-Side African Cup", host: "Naija FC San Antonio", date: "Sun, Mar 9 · 2:00 PM", venue: "McAllister Park Fields", city: "sanantonio", distance: "5.5 mi", image: eventFootball, attending: 90, free: true, category: "Soccer" },
  { id: 412, title: "La Liga Watch Party", host: "Soccer Social SA", date: "Sat, Mar 8 · 1:00 PM", venue: "The Ticket Sports Pub", city: "sanantonio", distance: "3.0 mi", image: eventFootball, attending: 65, free: true, category: "Watch Party" },
  { id: 413, title: "AFCON Watch Party — SA Edition", host: "AfroHub Sports SA", date: "Sun, Mar 9 · 5:00 PM", venue: "Big Hops Growler Station", city: "sanantonio", distance: "2.5 mi", image: eventFootball, attending: 80, free: true, category: "Watch Party" },
  { id: 414, title: "FIFA 26 Tournament — SA", host: "Game On SA", date: "Fri, Mar 7 · 7:00 PM", venue: "Level Up Lounge SA", city: "sanantonio", distance: "4.0 mi", image: eventNycHiphop, attending: 40, free: false, price: "$15", category: "FIFA Gaming" },
  { id: 415, title: "FIFA Community Cup Night", host: "Console Kings SA", date: "Sat, Mar 15 · 5:00 PM", venue: "Retro Game Bar SA", city: "sanantonio", distance: "3.5 mi", image: eventNycHiphop, attending: 35, free: false, price: "$10", category: "FIFA Gaming" },
  { id: 416, title: "Colors Festival San Antonio", host: "Colors Worldwide", date: "Sat, Mar 15 · 3:00 PM", venue: "Hemisfair Park", city: "sanantonio", distance: "0.8 mi", image: eventUkAfrobeats, attending: 2200, free: false, price: "$50", category: "Festival" },
  { id: 417, title: "Afro Beats Party — San Antonio", host: "AfroHub San Antonio", date: "Fri, Mar 14 · 10:00 PM", venue: "Paper Tiger", city: "sanantonio", distance: "2.5 mi", image: eventParty, attending: 320, free: false, price: "$20", category: "Afrobeats" },

  // Paris
  {
    id: 10, title: "Fête de la Musique 2026", host: "Ville de Paris",
    date: "Jun 12–15 · All Day", venue: "Across Paris", city: "paris",
    distance: "📍 Citywide", image: eventFeteMusique, attending: 15000, free: true,
  },
  {
    id: 11, title: "MHD en Concert — Afro Trap Night", host: "Live Nation France",
    date: "Fri, Jun 13 · 8:30 PM", venue: "L'Olympia", city: "paris",
    distance: "1.2 km", image: eventRapConcert, attending: 2400, free: false,
  },
  {
    id: 12, title: "Guy2Bezbar — Summer Tour", host: "Believe Music",
    date: "Sat, Jun 14 · 9:00 PM", venue: "Le Bataclan", city: "paris",
    distance: "2.1 km", image: eventRapConcert, attending: 1500, free: false,
  },
  {
    id: 13, title: "Stromae × Aya Nakamura — Live", host: "Because Music",
    date: "Sun, Jun 15 · 7:00 PM", venue: "Accor Arena", city: "paris",
    distance: "5.4 km", image: eventConcert, attending: 18000, free: false,
  },
  {
    id: 14, title: "AFCON Inspired Football Games", host: "AfroHub Paris Sports",
    date: "Sat, Jun 14 · 2:00 PM", venue: "Stade Charléty", city: "paris",
    distance: "4.8 km", image: eventFootball, attending: 1200, free: true,
  },
  {
    id: 15, title: "Fally Ipupa — Tokooos World Tour", host: "Wati B Productions",
    date: "Fri, Jun 13 · 9:30 PM", venue: "Zénith Paris", city: "paris",
    distance: "6.2 km", image: eventRapConcert, attending: 6300, free: false,
  },
  {
    id: 16, title: "African Contemporary Art Show", host: "Palais de Tokyo",
    date: "Jun 12–22 · 10:00 AM", venue: "Palais de Tokyo", city: "paris",
    distance: "3.1 km", image: eventAfricanArt, attending: 4500, free: false,
  },
  // London
  {
    id: 20, title: "Skepta — Live at Brixton", host: "Boy Better Know",
    date: "Fri, Jul 18 · 9:00 PM", venue: "O2 Academy Brixton", city: "london",
    distance: "3.2 mi", image: eventGrime, attending: 4900, free: false,
  },
  {
    id: 21, title: "J Hus — Beautiful & Blessed Tour", host: "Black Butter Records",
    date: "Sat, Jul 19 · 8:00 PM", venue: "OVO Arena Wembley", city: "london",
    distance: "8.1 mi", image: eventUkAfrobeats, attending: 12500, free: false,
  },
  {
    id: 22, title: "Kojo Funds — Summer Vibes Live", host: "AfroHub London",
    date: "Thu, Jul 17 · 8:30 PM", venue: "KOKO Camden", city: "london",
    distance: "2.4 mi", image: eventUkAfrobeats, attending: 1400, free: false,
  },
  {
    id: 23, title: "Grime Shutdown — Legends Night", host: "Boy Better Know × Rinse FM",
    date: "Fri, Jul 18 · 10:00 PM", venue: "Printworks London", city: "london",
    distance: "4.7 mi", image: eventGrime, attending: 3000, free: false,
  },
  {
    id: 24, title: "UK Afrobeats Summer Festival", host: "Afro Nation UK",
    date: "Jul 19–20 · 12:00 PM", venue: "Crystal Palace Park", city: "london",
    distance: "6.3 mi", image: eventUkAfrobeats, attending: 25000, free: false,
  },
  {
    id: 25, title: "Davido — Timeless Tour", host: "Live Nation UK",
    date: "Sat, Jul 19 · 7:00 PM", venue: "The O2 Arena", city: "london",
    distance: "5.9 mi", image: eventConcert, attending: 20000, free: false,
  },
  {
    id: 26, title: "Wizkid — Made in Lagos Live", host: "Starboy Entertainment",
    date: "Sun, Jul 20 · 7:30 PM", venue: "Wembley Stadium", city: "london",
    distance: "8.5 mi", image: eventConcert, attending: 45000, free: false,
  },
  {
    id: 27, title: "Burna Boy — Love, Damini Tour", host: "Spaceship Entertainment",
    date: "Sat, Jul 26 · 8:00 PM", venue: "Tottenham Hotspur Stadium", city: "london",
    distance: "7.2 mi", image: eventRapConcert, attending: 62000, free: false,
  },
  // New York City — Hip-Hop
  {
    id: 30, title: "Jadakiss & The Lox — Live at the Apollo", host: "D-Block Entertainment",
    date: "Thu, Sep 11 · 8:00 PM", venue: "Apollo Theater, Harlem", city: "nyc",
    distance: "5.2 mi", image: eventNycHiphop, attending: 1500, free: false,
    price: "$85", category: "Hip-Hop",
  },
  {
    id: 31, title: "Dipset — Diplomatic Immunity Tour", host: "Diplomat Records",
    date: "Fri, Sep 12 · 9:00 PM", venue: "Madison Square Garden", city: "nyc",
    distance: "2.1 mi", image: eventNycHiphop, attending: 18000, free: false,
    price: "$120", category: "Hip-Hop",
  },
  {
    id: 32, title: "Who Decides War — NYFW Show", host: "Ev Bravado × Tërrön Duvernay",
    date: "Mon, Sep 8 · 6:00 PM", venue: "Spring Studios, Tribeca", city: "nyc",
    distance: "1.8 mi", image: eventNyfw, attending: 800, free: false,
    price: "$250", category: "Fashion",
  },
  // New York City — Fashion Shows
  {
    id: 33, title: "KidSuper — \"Dreams Don't Die\" Runway", host: "KidSuper Studios",
    date: "Tue, Sep 9 · 4:00 PM", venue: "Brooklyn Navy Yard", city: "nyc",
    distance: "3.4 mi", image: eventStreetwearShow, attending: 1200, free: false,
    price: "$175", category: "Fashion",
  },
  {
    id: 34, title: "Balenciaga — Fall 2026 Collection", host: "Balenciaga × Demna",
    date: "Wed, Sep 10 · 7:00 PM", venue: "The Park Avenue Armory", city: "nyc",
    distance: "2.8 mi", image: eventNyfw, attending: 2000, free: false,
    price: "$500", category: "Fashion",
  },
  {
    id: 35, title: "Yeezy — Season 10 Showcase", host: "Yeezy × Ye",
    date: "Thu, Sep 11 · 5:00 PM", venue: "Pier 17, Seaport District", city: "nyc",
    distance: "1.5 mi", image: eventNyfw, attending: 3500, free: false,
    price: "$350", category: "Fashion",
  },
  {
    id: 36, title: "YSL — Saint Laurent Fall Show", host: "Yves Saint Laurent",
    date: "Fri, Sep 12 · 6:30 PM", venue: "The Met Cloisters", city: "nyc",
    distance: "9.1 mi", image: eventNyfw, attending: 1800, free: false,
    price: "$450", category: "Fashion",
  },
  {
    id: 37, title: "Louis Vuitton — Men's Fall 2026", host: "Louis Vuitton × Pharrell",
    date: "Sat, Sep 13 · 8:00 PM", venue: "Javits Center", city: "nyc",
    distance: "3.6 mi", image: eventNyfw, attending: 5000, free: false,
    price: "$600", category: "Fashion",
  },
  // New York City — Afrobeats & R&B
  {
    id: 40, title: "Wizkid — More Love, Less Ego Tour", host: "Starboy Entertainment",
    date: "Fri, Sep 19 · 8:00 PM", venue: "Barclays Center, Brooklyn", city: "nyc",
    distance: "4.1 mi", image: eventUkAfrobeats, attending: 19000, free: false,
    price: "$95", category: "Afrobeats",
  },
  {
    id: 41, title: "Burna Boy — Stadium Tour NYC", host: "Spaceship Entertainment",
    date: "Sat, Sep 20 · 7:30 PM", venue: "MetLife Stadium, NJ", city: "nyc",
    distance: "8.2 mi", image: eventRapConcert, attending: 55000, free: false,
    price: "$125", category: "Afrobeats",
  },
  {
    id: 42, title: "Davido — Timeless Tour NYC", host: "DMW / Sony Music",
    date: "Thu, Sep 18 · 8:30 PM", venue: "Madison Square Garden", city: "nyc",
    distance: "2.1 mi", image: eventConcert, attending: 20000, free: false,
    price: "$110", category: "Afrobeats",
  },
  {
    id: 43, title: "Rema — Rave & Roses World Tour", host: "Mavin Records",
    date: "Wed, Sep 17 · 9:00 PM", venue: "Radio City Music Hall", city: "nyc",
    distance: "2.4 mi", image: eventUkAfrobeats, attending: 6000, free: false,
    price: "$85", category: "Afrobeats",
  },
  {
    id: 44, title: "Falz — The Experience NYC", host: "Bahd Guys Records",
    date: "Sun, Sep 21 · 7:00 PM", venue: "Kings Theatre, Brooklyn", city: "nyc",
    distance: "5.8 mi", image: eventParty, attending: 3200, free: false,
    price: "$65", category: "Afrobeats",
  },
  {
    id: 45, title: "Fally Ipupa — Tokooos World Tour", host: "Wati B Productions",
    date: "Fri, Sep 26 · 9:00 PM", venue: "Beacon Theatre", city: "nyc",
    distance: "3.7 mi", image: eventRapConcert, attending: 2800, free: false,
    price: "$90", category: "Afrobeats",
  },
  {
    id: 46, title: "Brent Faiyaz — Larger Than Life Tour", host: "Lost Kids",
    date: "Sat, Sep 27 · 8:00 PM", venue: "Forest Hills Stadium, Queens", city: "nyc",
    distance: "9.3 mi", image: eventNycHiphop, attending: 14000, free: false,
    price: "$100", category: "R&B",
  },
  {
    id: 47, title: "Awilo Longomba — Coupe Bibamba Live", host: "Soukous Stars Intl",
    date: "Fri, Oct 3 · 9:30 PM", venue: "Terminal 5, Hell's Kitchen", city: "nyc",
    distance: "2.9 mi", image: eventParty, attending: 3000, free: false,
    price: "$75", category: "Afrobeats",
  },
  {
    id: 48, title: "Koffi Olomidé — Legend of Rumba", host: "Quartier Latin Intl",
    date: "Sat, Oct 4 · 8:30 PM", venue: "Apollo Theater, Harlem", city: "nyc",
    distance: "5.2 mi", image: eventConcert, attending: 1500, free: false,
    price: "$80", category: "Afrobeats",
  },
  {
    id: 49, title: "Afro Nation NYC 2026", host: "Afro Nation",
    date: "Oct 10–12 · 12:00 PM", venue: "Randall's Island Park", city: "nyc",
    distance: "4.5 mi", image: eventUkAfrobeats, attending: 40000, free: false,
    price: "$199", category: "Festival",
  },
];
