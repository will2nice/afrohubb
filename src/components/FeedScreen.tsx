import { MapPin, Search, Bell, Heart, MessageCircle, Share2, Bookmark, Users } from "lucide-react";
import eventParty from "@/assets/event-party.jpg";
import eventBrunch from "@/assets/event-brunch.jpg";
import eventConcert from "@/assets/event-concert.jpg";
import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";

const chips = ["For You", "Nearby", "Diaspora", "Culture", "Business", "Dating Tips", "New Here"];

const posts = [
  {
    id: 1,
    author: "Amara Johnson",
    avatar: profileWoman1,
    location: "Austin, TX",
    time: "2h ago",
    text: "Just moved to Austin from Lagos! Looking for my people here 🇳🇬✨ Who's going to Afrobeats Night this Friday?",
    image: eventParty,
    likes: 47,
    comments: 12,
    type: "post" as const,
  },
  {
    id: 2,
    author: "Diaspora Brunch Club",
    avatar: null,
    location: "Houston, TX",
    time: "Today",
    text: null,
    image: eventBrunch,
    likes: 128,
    comments: 34,
    type: "event" as const,
    eventTitle: "Diaspora Brunch — Sunday Edition",
    eventDate: "Sun, Mar 9 · 11:00 AM",
    eventVenue: "The Grove Houston",
    attending: 86,
  },
  {
    id: 3,
    author: "Kwame Asante",
    avatar: profileMan1,
    location: "Dallas, TX",
    time: "5h ago",
    text: "The tech meetup last night was incredible. So many brilliant minds from the diaspora building amazing things. Can't wait for the next one! 💡",
    image: null,
    likes: 93,
    comments: 21,
    type: "post" as const,
  },
  {
    id: 4,
    author: null,
    avatar: null,
    location: "Austin, TX",
    time: "This Saturday",
    text: null,
    image: eventConcert,
    likes: 256,
    comments: 45,
    type: "event" as const,
    eventTitle: "Afrobeats Live — Burna Boy Tribute Night",
    eventDate: "Sat, Mar 8 · 9:00 PM",
    eventVenue: "Empire Control Room",
    attending: 342,
  },
];

const FeedScreen = () => {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-1.5">
            <MapPin size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Austin, TX</span>
            <svg width="10" height="6" viewBox="0 0 10 6" className="text-muted-foreground ml-0.5">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <Search size={20} className="text-muted-foreground" />
            </button>
            <button className="p-2 rounded-full hover:bg-secondary transition-colors relative">
              <Bell size={20} className="text-muted-foreground" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full gradient-gold" />
            </button>
          </div>
        </div>
      </header>

      {/* Chips */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide max-w-lg mx-auto">
        <div className="flex gap-2 w-max">
          {chips.map((chip, i) => (
            <button
              key={chip}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                i === 0
                  ? "gradient-gold text-primary-foreground shadow-gold"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 space-y-4 max-w-lg mx-auto">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up"
          >
            {/* Author row */}
            {post.author && (
              <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                {post.avatar ? (
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                    <Users size={18} className="text-primary-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{post.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {post.location} · {post.time}
                  </p>
                </div>
                {post.type === "event" && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold gradient-gold text-primary-foreground uppercase tracking-wider">
                    Event
                  </span>
                )}
              </div>
            )}

            {/* Text */}
            {post.text && (
              <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.text}</p>
            )}

            {/* Image */}
            {post.image && (
              <div className="relative">
                <img
                  src={post.image}
                  alt=""
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
                {post.type === "event" && post.eventTitle && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-4 pt-12">
                    <h3 className="font-display font-bold text-foreground text-lg leading-tight">
                      {post.eventTitle}
                    </h3>
                    <p className="text-sm text-primary mt-1">{post.eventDate}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{post.eventVenue}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        {post.attending} attending
                      </span>
                      <button className="px-5 py-2 rounded-full gradient-gold text-primary-foreground text-sm font-semibold shadow-gold transition-transform hover:scale-105 active:scale-95">
                        RSVP
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 px-3 py-3 border-t border-border">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
                <Heart size={18} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
                <MessageCircle size={18} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{post.comments}</span>
              </button>
              <button className="p-1.5 rounded-full hover:bg-secondary transition-colors">
                <Share2 size={18} className="text-muted-foreground" />
              </button>
              <div className="flex-1" />
              <button className="p-1.5 rounded-full hover:bg-secondary transition-colors">
                <Bookmark size={18} className="text-muted-foreground" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default FeedScreen;
