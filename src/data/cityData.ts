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
  // Paris
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
];
