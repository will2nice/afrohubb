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
  // USA
  { id: "austin", name: "Austin, TX", flag: "🇺🇸" },
  { id: "dallas", name: "Dallas, TX", flag: "🇺🇸" },
  { id: "houston", name: "Houston, TX", flag: "🇺🇸" },
  { id: "sanantonio", name: "San Antonio, TX", flag: "🇺🇸" },
  { id: "nyc", name: "New York City, NY", flag: "🇺🇸" },
  // Europe
  { id: "london", name: "London, England", flag: "🇬🇧" },
  { id: "paris", name: "Paris, France", flag: "🇫🇷" },
  { id: "brussels", name: "Brussels, Belgium", flag: "🇧🇪" },
  { id: "amsterdam", name: "Amsterdam, Netherlands", flag: "🇳🇱" },
  { id: "rotterdam", name: "Rotterdam, Netherlands", flag: "🇳🇱" },
  { id: "antwerp", name: "Antwerp, Belgium", flag: "🇧🇪" },
  { id: "barcelona", name: "Barcelona, Spain", flag: "🇪🇸" },
  { id: "madrid", name: "Madrid, Spain", flag: "🇪🇸" },
  { id: "bordeaux", name: "Bordeaux, France", flag: "🇫🇷" },
  { id: "stockholm", name: "Stockholm, Sweden", flag: "🇸🇪" },
  { id: "rome", name: "Rome, Italy", flag: "🇮🇹" },
  { id: "positano", name: "Positano, Italy", flag: "🇮🇹" },
  { id: "athens", name: "Athens, Greece", flag: "🇬🇷" },
  { id: "istanbul", name: "Istanbul, Turkey", flag: "🇹🇷" },
  { id: "berlin", name: "Berlin, Germany", flag: "🇩🇪" },
  { id: "dublin", name: "Dublin, Ireland", flag: "🇮🇪" },
  { id: "copenhagen", name: "Copenhagen, Denmark", flag: "🇩🇰" },
  { id: "oslo", name: "Oslo, Norway", flag: "🇳🇴" },
  { id: "helsinki", name: "Helsinki, Finland", flag: "🇫🇮" },
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
  // ========== EUROPEAN CITIES ==========

  // Brussels
  { id: 500, title: "Afro Nation Brussels", host: "Afro Nation EU", date: "Sat, Jul 5 · 2:00 PM", venue: "Bois de la Cambre", city: "brussels", distance: "3.2 km", image: eventUkAfrobeats, attending: 8000, free: false, price: "€55", category: "Festival" },
  { id: 501, title: "Burna Boy — Brussels Stop", host: "Spaceship Ent.", date: "Fri, Jul 4 · 8:00 PM", venue: "Forest National", city: "brussels", distance: "5.1 km", image: eventRapConcert, attending: 8500, free: false, price: "€75", category: "Afrobeats" },
  { id: 502, title: "Congolese Rumba Night", host: "Matonge Culture Hub", date: "Sat, Jul 5 · 10:00 PM", venue: "Espace Matonge", city: "brussels", distance: "1.0 km", image: eventParty, attending: 450, free: false, price: "€20", category: "Party" },
  { id: 503, title: "Diaspora Brunch Brussels", host: "Afro Brunch BXL", date: "Sun, Jul 6 · 11:00 AM", venue: "Place du Châtelain", city: "brussels", distance: "1.5 km", image: eventBrunch, attending: 120, free: false, price: "€35", category: "Party" },
  { id: 504, title: "AFCON Watch Party — Brussels", host: "AfroHub Sports BXL", date: "Sun, Jul 6 · 4:00 PM", venue: "O'Reilly's Sports Bar", city: "brussels", distance: "0.8 km", image: eventFootball, attending: 200, free: true, category: "Watch Party" },

  // Amsterdam
  { id: 510, title: "Afrobeats Festival Amsterdam", host: "Afro Nation NL", date: "Sat, Jul 12 · 1:00 PM", venue: "Westerpark", city: "amsterdam", distance: "2.5 km", image: eventUkAfrobeats, attending: 12000, free: false, price: "€50", category: "Festival" },
  { id: 511, title: "Davido — Amsterdam Live", host: "Live Nation NL", date: "Fri, Jul 11 · 8:30 PM", venue: "AFAS Live", city: "amsterdam", distance: "4.0 km", image: eventConcert, attending: 6000, free: false, price: "€65", category: "Afrobeats" },
  { id: 512, title: "Amapiano Nights Amsterdam", host: "Amapiano NL", date: "Sat, Jul 12 · 11:00 PM", venue: "Paradiso", city: "amsterdam", distance: "1.2 km", image: eventParty, attending: 800, free: false, price: "€25", category: "Party" },
  { id: 513, title: "Surinamese Heritage Festival", host: "Suriname Society NL", date: "Sun, Jul 13 · 12:00 PM", venue: "Bijlmerpark", city: "amsterdam", distance: "6.0 km", image: eventAfricanArt, attending: 3500, free: true, category: "Festival" },
  { id: 514, title: "Kwaku Summer Festival", host: "Kwaku Foundation", date: "Jul 12–13 · All Day", venue: "Nelson Mandelapark", city: "amsterdam", distance: "5.5 km", image: eventUkAfrobeats, attending: 20000, free: true, category: "Festival" },

  // Rotterdam
  { id: 520, title: "Rotterdam Carnival — Afro Edition", host: "Zomercarnaval", date: "Sat, Jul 19 · 12:00 PM", venue: "City Center Rotterdam", city: "rotterdam", distance: "0.5 km", image: eventUkAfrobeats, attending: 25000, free: true, category: "Festival" },
  { id: 521, title: "Afrobeats vs Dancehall Night", host: "Vibes Rotterdam", date: "Fri, Jul 18 · 10:00 PM", venue: "Maassilo", city: "rotterdam", distance: "3.0 km", image: eventParty, attending: 1200, free: false, price: "€20", category: "Party" },
  { id: 522, title: "Cape Verdean Night Rotterdam", host: "Cabo Verde Society NL", date: "Sat, Jul 19 · 9:00 PM", venue: "Annabel Rotterdam", city: "rotterdam", distance: "1.5 km", image: eventParty, attending: 500, free: false, price: "€15", category: "Party" },
  { id: 523, title: "African Food Market Rotterdam", host: "AfroHub Rotterdam", date: "Sun, Jul 20 · 11:00 AM", venue: "Markthal", city: "rotterdam", distance: "0.8 km", image: eventBrunch, attending: 2000, free: true, category: "Party" },

  // Antwerp
  { id: 530, title: "Antwerp Afro Night", host: "AfroHub Antwerp", date: "Sat, Jul 5 · 10:00 PM", venue: "Café d'Anvers", city: "antwerp", distance: "1.0 km", image: eventParty, attending: 600, free: false, price: "€18", category: "Party" },
  { id: 531, title: "Congolese Music Festival", host: "Congo Culture BE", date: "Sun, Jul 6 · 2:00 PM", venue: "Park Spoor Noord", city: "antwerp", distance: "2.5 km", image: eventConcert, attending: 3000, free: true, category: "Festival" },
  { id: 532, title: "Diaspora Art Exhibition Antwerp", host: "MoMu & AfroArt", date: "Jul 5–20 · 10:00 AM", venue: "MoMu Antwerp", city: "antwerp", distance: "0.5 km", image: eventAfricanArt, attending: 1500, free: false, price: "€12", category: "Party" },
  { id: 533, title: "Wizkid — Antwerp Show", host: "Starboy Ent.", date: "Fri, Jul 4 · 8:00 PM", venue: "Sportpaleis", city: "antwerp", distance: "4.0 km", image: eventConcert, attending: 15000, free: false, price: "€70", category: "Afrobeats" },

  // Barcelona
  { id: 540, title: "Afro Nation Barcelona", host: "Afro Nation", date: "Jul 3–5 · 12:00 PM", venue: "Playa de la Mar Bella", city: "barcelona", distance: "4.0 km", image: eventUkAfrobeats, attending: 35000, free: false, price: "€89", category: "Festival" },
  { id: 541, title: "Burna Boy — Barcelona Live", host: "Spaceship Ent.", date: "Thu, Jul 3 · 9:00 PM", venue: "Palau Sant Jordi", city: "barcelona", distance: "5.5 km", image: eventRapConcert, attending: 17000, free: false, price: "€80", category: "Afrobeats" },
  { id: 542, title: "Amapiano Beach Party", host: "Vibes Barcelona", date: "Sat, Jul 5 · 3:00 PM", venue: "Bogatell Beach", city: "barcelona", distance: "3.0 km", image: eventParty, attending: 2000, free: false, price: "€30", category: "Party" },
  { id: 543, title: "Afro-Latin Fusion Night", host: "AfroHub Barcelona", date: "Fri, Jul 4 · 11:00 PM", venue: "Razzmatazz", city: "barcelona", distance: "2.5 km", image: eventParty, attending: 1500, free: false, price: "€25", category: "Party" },
  { id: 544, title: "Diaspora Brunch Barcelona", host: "Afro Brunch BCN", date: "Sun, Jul 6 · 11:00 AM", venue: "La Boqueria Area", city: "barcelona", distance: "1.0 km", image: eventBrunch, attending: 100, free: false, price: "€40", category: "Party" },

  // Madrid
  { id: 550, title: "Afrobeats Madrid Festival", host: "AfroHub Madrid", date: "Sat, Jul 12 · 2:00 PM", venue: "Casa de Campo", city: "madrid", distance: "4.0 km", image: eventUkAfrobeats, attending: 8000, free: false, price: "€45", category: "Festival" },
  { id: 551, title: "Rema — Madrid Show", host: "Mavin Records", date: "Fri, Jul 11 · 9:00 PM", venue: "WiZink Center", city: "madrid", distance: "2.0 km", image: eventConcert, attending: 12000, free: false, price: "€60", category: "Afrobeats" },
  { id: 552, title: "Rooftop Afro Party Madrid", host: "Sky Vibes Madrid", date: "Sat, Jul 12 · 10:00 PM", venue: "Azotea del Círculo", city: "madrid", distance: "0.5 km", image: eventParty, attending: 300, free: false, price: "€35", category: "Party" },
  { id: 553, title: "Fútbol & Jollof Sunday", host: "Naija FC Madrid", date: "Sun, Jul 13 · 12:00 PM", venue: "Retiro Park", city: "madrid", distance: "1.5 km", image: eventFootball, attending: 150, free: true, category: "Soccer" },
  { id: 554, title: "Equatorial Guinea Culture Night", host: "GQ Community Madrid", date: "Fri, Jul 11 · 8:00 PM", venue: "Centro Cultural Conde Duque", city: "madrid", distance: "1.0 km", image: eventAfricanArt, attending: 400, free: true, category: "Party" },

  // Bordeaux
  { id: 560, title: "Bordeaux Afro Festival", host: "AfroHub Bordeaux", date: "Sat, Jul 19 · 3:00 PM", venue: "Quais de Bordeaux", city: "bordeaux", distance: "1.0 km", image: eventUkAfrobeats, attending: 5000, free: false, price: "€35", category: "Festival" },
  { id: 561, title: "Fally Ipupa — Bordeaux Live", host: "Wati B Productions", date: "Fri, Jul 18 · 9:00 PM", venue: "Arkéa Arena", city: "bordeaux", distance: "6.0 km", image: eventRapConcert, attending: 8000, free: false, price: "€55", category: "Afrobeats" },
  { id: 562, title: "Soirée Afro-Caribéenne", host: "Vibes Bordeaux", date: "Sat, Jul 19 · 11:00 PM", venue: "I.Boat", city: "bordeaux", distance: "1.5 km", image: eventParty, attending: 600, free: false, price: "€15", category: "Party" },
  { id: 563, title: "Brunch Diaspora Bordeaux", host: "Afro Brunch BDX", date: "Sun, Jul 20 · 11:00 AM", venue: "Darwin Écosystème", city: "bordeaux", distance: "2.0 km", image: eventBrunch, attending: 90, free: false, price: "€30", category: "Party" },

  // Stockholm
  { id: 570, title: "Stockholm Afrobeats Night", host: "AfroHub Stockholm", date: "Sat, Aug 2 · 10:00 PM", venue: "Berns", city: "stockholm", distance: "0.5 km", image: eventParty, attending: 800, free: false, price: "350 SEK", category: "Party" },
  { id: 571, title: "Somali Cultural Festival", host: "Somali Society SE", date: "Sun, Aug 3 · 12:00 PM", venue: "Kungsträdgården", city: "stockholm", distance: "0.3 km", image: eventAfricanArt, attending: 4000, free: true, category: "Festival" },
  { id: 572, title: "Wizkid — Stockholm Live", host: "Starboy Ent.", date: "Fri, Aug 1 · 8:00 PM", venue: "Avicii Arena", city: "stockholm", distance: "3.0 km", image: eventConcert, attending: 12000, free: false, price: "600 SEK", category: "Afrobeats" },
  { id: 573, title: "Eritrean Music Night", host: "Eritrea House SE", date: "Sat, Aug 2 · 8:00 PM", venue: "Münchenbryggeriet", city: "stockholm", distance: "1.5 km", image: eventConcert, attending: 500, free: false, price: "250 SEK", category: "Party" },

  // Rome
  { id: 580, title: "Roma Afro Festival", host: "AfroHub Roma", date: "Sat, Jul 26 · 3:00 PM", venue: "Villa Ada", city: "rome", distance: "4.0 km", image: eventUkAfrobeats, attending: 6000, free: false, price: "€30", category: "Festival" },
  { id: 581, title: "Nigerian Independence Party Roma", host: "Naija Community IT", date: "Wed, Oct 1 · 8:00 PM", venue: "Lanificio 159", city: "rome", distance: "5.0 km", image: eventParty, attending: 800, free: false, price: "€20", category: "Party" },
  { id: 582, title: "Davido — Roma Concert", host: "Live Nation IT", date: "Fri, Jul 25 · 9:00 PM", venue: "Auditorium Parco della Musica", city: "rome", distance: "3.5 km", image: eventConcert, attending: 5000, free: false, price: "€60", category: "Afrobeats" },
  { id: 583, title: "African Art in Rome", host: "MAXXI Museum", date: "Jul 25–Aug 15 · 10:00 AM", venue: "MAXXI Museum", city: "rome", distance: "3.0 km", image: eventAfricanArt, attending: 2500, free: false, price: "€15", category: "Party" },

  // Positano
  { id: 590, title: "Amalfi Coast Sunset Party", host: "Luxe Vibes Positano", date: "Sat, Aug 9 · 5:00 PM", venue: "Da Adolfo Beach Club", city: "positano", distance: "0.5 km", image: eventParty, attending: 150, free: false, price: "€80", category: "Party" },
  { id: 591, title: "Afrobeats on the Coast", host: "AfroHub Italia", date: "Fri, Aug 8 · 9:00 PM", venue: "Music on the Rocks", city: "positano", distance: "0.3 km", image: eventConcert, attending: 400, free: false, price: "€50", category: "Party" },
  { id: 592, title: "Yacht Party Positano", host: "Elite Events IT", date: "Sun, Aug 10 · 1:00 PM", venue: "Positano Marina", city: "positano", distance: "0.2 km", image: eventBrunch, attending: 60, free: false, price: "€120", category: "Party" },

  // Athens
  { id: 600, title: "Athens Afro Festival", host: "AfroHub Athens", date: "Sat, Aug 16 · 3:00 PM", venue: "Technopolis", city: "athens", distance: "2.0 km", image: eventUkAfrobeats, attending: 4000, free: false, price: "€25", category: "Festival" },
  { id: 601, title: "Amapiano Beach Athens", host: "Vibes Athens", date: "Sat, Aug 16 · 11:00 PM", venue: "Bolivar Beach Bar", city: "athens", distance: "8.0 km", image: eventParty, attending: 1200, free: false, price: "€20", category: "Party" },
  { id: 602, title: "Burna Boy — Athens Live", host: "Spaceship Ent.", date: "Fri, Aug 15 · 9:00 PM", venue: "OAKA Stadium", city: "athens", distance: "6.0 km", image: eventRapConcert, attending: 15000, free: false, price: "€70", category: "Afrobeats" },
  { id: 603, title: "African Cuisine Festival Athens", host: "Afro Food GR", date: "Sun, Aug 17 · 12:00 PM", venue: "Monastiraki Square", city: "athens", distance: "0.5 km", image: eventBrunch, attending: 800, free: true, category: "Party" },

  // Istanbul
  { id: 610, title: "Istanbul Afrobeats Night", host: "AfroHub Istanbul", date: "Sat, Aug 23 · 10:00 PM", venue: "Klein Kadıköy", city: "istanbul", distance: "1.5 km", image: eventParty, attending: 700, free: false, price: "₺400", category: "Party" },
  { id: 611, title: "African Students Festival Istanbul", host: "African Union IST", date: "Sun, Aug 24 · 1:00 PM", venue: "Maçka Park", city: "istanbul", distance: "2.0 km", image: eventAfricanArt, attending: 2000, free: true, category: "Festival" },
  { id: 612, title: "Bosphorus Yacht Party", host: "Elite Events IST", date: "Sat, Aug 23 · 4:00 PM", venue: "Bosphorus Strait", city: "istanbul", distance: "0.5 km", image: eventParty, attending: 120, free: false, price: "₺800", category: "Party" },
  { id: 613, title: "Wizkid — Istanbul Show", host: "Starboy Ent.", date: "Fri, Aug 22 · 9:00 PM", venue: "Volkswagen Arena", city: "istanbul", distance: "5.0 km", image: eventConcert, attending: 8000, free: false, price: "₺600", category: "Afrobeats" },

  // Berlin
  { id: 620, title: "Karneval der Kulturen — Afro Stage", host: "KdK Berlin", date: "Jun 7–9 · All Day", venue: "Kreuzberg Streets", city: "berlin", distance: "2.0 km", image: eventUkAfrobeats, attending: 30000, free: true, category: "Festival" },
  { id: 621, title: "Afrobeats Berlin Warehouse", host: "AfroHub Berlin", date: "Sat, Jun 7 · 11:00 PM", venue: "Sisyphos", city: "berlin", distance: "8.0 km", image: eventParty, attending: 2000, free: false, price: "€18", category: "Party" },
  { id: 622, title: "Nigerian Independence Gala Berlin", host: "Naija Community DE", date: "Wed, Oct 1 · 7:00 PM", venue: "Festsaal Kreuzberg", city: "berlin", distance: "2.5 km", image: eventParty, attending: 600, free: false, price: "€25", category: "Party" },
  { id: 623, title: "Rema — Berlin Concert", host: "Mavin Records", date: "Fri, Jun 6 · 8:30 PM", venue: "Mercedes-Benz Arena", city: "berlin", distance: "3.0 km", image: eventConcert, attending: 14000, free: false, price: "€55", category: "Afrobeats" },
  { id: 624, title: "African Film Festival Berlin", host: "Afrika Filmfest", date: "Jun 6–10 · 6:00 PM", venue: "Babylon Cinema", city: "berlin", distance: "1.5 km", image: eventAfricanArt, attending: 1800, free: false, price: "€12", category: "Party" },

  // Dublin
  { id: 630, title: "Dublin Afrobeats Festival", host: "AfroHub Dublin", date: "Sat, Jul 26 · 2:00 PM", venue: "Phoenix Park", city: "dublin", distance: "3.5 km", image: eventUkAfrobeats, attending: 5000, free: false, price: "€35", category: "Festival" },
  { id: 631, title: "Burna Boy — Dublin Live", host: "Spaceship Ent.", date: "Fri, Jul 25 · 8:00 PM", venue: "3Arena", city: "dublin", distance: "2.0 km", image: eventRapConcert, attending: 9000, free: false, price: "€65", category: "Afrobeats" },
  { id: 632, title: "Jollof Wars Dublin", host: "Naija Community IE", date: "Sun, Jul 27 · 12:00 PM", venue: "Smithfield Square", city: "dublin", distance: "1.0 km", image: eventBrunch, attending: 500, free: false, price: "€10", category: "Party" },
  { id: 633, title: "African Professionals Mixer", host: "Afro Network IE", date: "Thu, Jul 24 · 6:00 PM", venue: "The Marker Hotel", city: "dublin", distance: "2.5 km", image: eventAfricanArt, attending: 200, free: true, category: "Networking" },

  // Copenhagen
  { id: 640, title: "Copenhagen Carnival — Afro Float", host: "CPH Carnival", date: "Jun 7–8 · All Day", venue: "Fælledparken", city: "copenhagen", distance: "2.0 km", image: eventUkAfrobeats, attending: 15000, free: true, category: "Festival" },
  { id: 641, title: "Amapiano Night Copenhagen", host: "Vibes CPH", date: "Sat, Jun 7 · 11:00 PM", venue: "Culture Box", city: "copenhagen", distance: "0.5 km", image: eventParty, attending: 500, free: false, price: "150 DKK", category: "Party" },
  { id: 642, title: "Davido — Copenhagen Show", host: "Live Nation DK", date: "Fri, Jun 6 · 8:00 PM", venue: "Royal Arena", city: "copenhagen", distance: "3.0 km", image: eventConcert, attending: 10000, free: false, price: "500 DKK", category: "Afrobeats" },
  { id: 643, title: "Somali Heritage Day CPH", host: "Somali Society DK", date: "Sun, Jun 8 · 12:00 PM", venue: "Nørrebroparken", city: "copenhagen", distance: "1.5 km", image: eventAfricanArt, attending: 2000, free: true, category: "Festival" },

  // Oslo
  { id: 650, title: "Oslo Afro Festival", host: "AfroHub Oslo", date: "Sat, Aug 9 · 2:00 PM", venue: "Frognerparken", city: "oslo", distance: "2.5 km", image: eventUkAfrobeats, attending: 4000, free: false, price: "350 NOK", category: "Festival" },
  { id: 651, title: "Afrobeats Night Oslo", host: "Vibes Oslo", date: "Sat, Aug 9 · 10:00 PM", venue: "Blå", city: "oslo", distance: "1.0 km", image: eventParty, attending: 600, free: false, price: "200 NOK", category: "Party" },
  { id: 652, title: "Wizkid — Oslo Concert", host: "Starboy Ent.", date: "Fri, Aug 8 · 8:00 PM", venue: "Oslo Spektrum", city: "oslo", distance: "0.5 km", image: eventConcert, attending: 8000, free: false, price: "500 NOK", category: "Afrobeats" },
  { id: 653, title: "Eritrean Festival Oslo", host: "Eritrea Community NO", date: "Sun, Aug 10 · 1:00 PM", venue: "Tøyenparken", city: "oslo", distance: "2.0 km", image: eventAfricanArt, attending: 3000, free: true, category: "Festival" },

  // Helsinki
  { id: 660, title: "Helsinki Afro Night", host: "AfroHub Helsinki", date: "Sat, Aug 16 · 10:00 PM", venue: "Ääniwalli", city: "helsinki", distance: "1.0 km", image: eventParty, attending: 400, free: false, price: "€20", category: "Party" },
  { id: 661, title: "Somali Cultural Day Helsinki", host: "Somali Society FI", date: "Sun, Aug 17 · 12:00 PM", venue: "Kaisaniemi Park", city: "helsinki", distance: "0.5 km", image: eventAfricanArt, attending: 2500, free: true, category: "Festival" },
  { id: 662, title: "Burna Boy — Helsinki Show", host: "Spaceship Ent.", date: "Fri, Aug 15 · 8:00 PM", venue: "Helsinki Ice Hall", city: "helsinki", distance: "2.0 km", image: eventRapConcert, attending: 6000, free: false, price: "€55", category: "Afrobeats" },
  { id: 663, title: "African Food Festival Helsinki", host: "Afro Kitchen FI", date: "Sat, Aug 16 · 11:00 AM", venue: "Senate Square", city: "helsinki", distance: "0.3 km", image: eventBrunch, attending: 1500, free: true, category: "Party" },
];
