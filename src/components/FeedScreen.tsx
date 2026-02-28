import { useState } from "react";
import { MapPin, Search, Bell, Heart, MessageCircle, Share2, Bookmark, Users, ChevronDown, Check } from "lucide-react";
import { cities, feedPosts, type City } from "@/data/cityData";

const chips = ["For You", "Nearby", "Diaspora", "Culture", "Business", "Dating Tips", "New Here"];

interface FeedScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const FeedScreen = ({ selectedCity, onCityChange }: FeedScreenProps) => {
  const [showCityPicker, setShowCityPicker] = useState(false);

  const posts = feedPosts.filter((p) => p.city === selectedCity.id);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={() => setShowCityPicker(!showCityPicker)}
            className="flex items-center gap-1.5 group"
          >
            <MapPin size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">{selectedCity.flag} {selectedCity.name}</span>
            <ChevronDown size={14} className={`text-muted-foreground transition-transform ${showCityPicker ? "rotate-180" : ""}`} />
          </button>
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
            {post.author && (
              <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                {post.avatar ? (
                  <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-border" />
                ) : (
                  <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                    <Users size={18} className="text-primary-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.location} · {post.time}</p>
                </div>
                {post.type === "event" && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold gradient-gold text-primary-foreground uppercase tracking-wider">Event</span>
                )}
              </div>
            )}

            {post.text && (
              <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.text}</p>
            )}

            {post.image && (
              <div className="relative">
                <img src={post.image} alt="" className="w-full aspect-[4/3] object-cover" loading="lazy" />
                {post.type === "event" && post.eventTitle && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-4 pt-12">
                    <h3 className="font-display font-bold text-foreground text-lg leading-tight">{post.eventTitle}</h3>
                    <p className="text-sm text-primary mt-1">{post.eventDate}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{post.eventVenue}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">{post.attending} attending</span>
                      <button className="px-5 py-2 rounded-full gradient-gold text-primary-foreground text-sm font-semibold shadow-gold transition-transform hover:scale-105 active:scale-95">RSVP</button>
                    </div>
                  </div>
                )}
              </div>
            )}

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
