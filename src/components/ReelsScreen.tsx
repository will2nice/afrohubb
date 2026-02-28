import { useState, useRef } from "react";
import { Heart, MessageCircle, Share2, Music, Bookmark, Volume2, VolumeX, Tv, ChefHat, Flame, Crown, ChevronLeft, ChevronRight, Instagram, Star } from "lucide-react";
import reel1 from "@/assets/reel-1.jpg";
import reel2 from "@/assets/reel-2.jpg";
import reel3 from "@/assets/reel-3.jpg";
import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileWoman2 from "@/assets/profile-woman-2.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";
import eventConcert from "@/assets/event-concert.jpg";
import eventParty from "@/assets/event-party.jpg";
import eventBrunch from "@/assets/event-brunch.jpg";
import eventAfricanArt from "@/assets/event-african-art.jpg";
import crushW1 from "@/assets/crush-woman-1.jpg";
import crushW2 from "@/assets/crush-woman-2.jpg";
import crushW3 from "@/assets/crush-woman-3.jpg";
import crushW4 from "@/assets/crush-woman-4.jpg";
import crushM1 from "@/assets/crush-man-1.jpg";
import crushM2 from "@/assets/crush-man-2.jpg";

type ReelCategory = "trending" | "afrolove" | "cooking" | "crush";

// --- Crush data ---
type CrushProfile = {
  id: number;
  name: string;
  age: number;
  country: string;
  flag: string;
  image: string;
  bio: string;
  votes: string;
  tag: "WCW" | "MCM";
};

const crushProfiles: CrushProfile[] = [
  { id: 100, name: "Aïssatou", age: 24, country: "Senegal", flag: "🇸🇳", image: crushW1, bio: "Model & dancer from Dakar. Spreading joy one smile at a time ✨", votes: "24.8K", tag: "WCW" },
  { id: 101, name: "Trevon", age: 27, country: "Jamaica", flag: "🇯🇲", image: crushM1, bio: "Photographer & creative. Capturing beauty across the diaspora 📸", votes: "18.3K", tag: "MCM" },
  { id: 102, name: "Nala", age: 23, country: "Ethiopia", flag: "🇪🇹", image: crushW2, bio: "Med student by day, Afrobeats queen by night 💃", votes: "31.2K", tag: "WCW" },
  { id: 103, name: "Chidinma", age: 25, country: "Nigeria", flag: "🇳🇬", image: crushW3, bio: "Fashion designer. Ankara is my love language 🧵👑", votes: "42.1K", tag: "WCW" },
  { id: 104, name: "Kweku", age: 26, country: "Ghana", flag: "🇬🇭", image: crushM2, bio: "Producer & musician. Making beats that move the culture 🎵", votes: "15.7K", tag: "MCM" },
  { id: 105, name: "Amara", age: 22, country: "Trinidad", flag: "🇹🇹", image: crushW4, bio: "Island girl in the city. Living life unapologetically 🌺", votes: "37.6K", tag: "WCW" },
];

const getDayLabel = () => {
  const day = new Date().getDay();
  if (day === 1) return { label: "Man Crush Monday 🔥", sub: "#MCM" };
  if (day === 3) return { label: "Woman Crush Wednesday 👑", sub: "#WCW" };
  return { label: "Crush of the Day 💫", sub: "#CrushOfTheDay" };
};

// --- Reel data ---
const reelData: Record<Exclude<ReelCategory, "crush">, { id: number; author: string; avatar: string; image: string; caption: string; song: string; likes: string; comments: string; shares: string }[]> = {
  trending: [
    { id: 1, author: "Dayo", avatar: profileMan2, image: reel1, caption: "This Afrobeats challenge is taking over 🔥💃 #AfroHub #DanceChallenge", song: "CKay — Love Nwantiti", likes: "19.3K", comments: "842", shares: "1.2K" },
    { id: 2, author: "Nneka Cooks", avatar: profileWoman1, image: reel2, caption: "The REAL jollof recipe. No debates 🍚🔥 Drop your country flag if you claim the best jollof!", song: "Original Sound — Nneka Cooks", likes: "42.1K", comments: "3.8K", shares: "5.6K" },
    { id: 3, author: "Kofi Styles", avatar: profileMan1, image: reel3, caption: "Ankara drip check ✨ Where my fashion lovers at? #AfricanFashion #Ankara", song: "Burna Boy — City Boys", likes: "8.7K", comments: "412", shares: "967" },
    { id: 4, author: "Amara Vibes", avatar: profileWoman2, image: eventConcert, caption: "Burna Boy concert was INSANE last night 🎤🔥 Houston showed out!! #BurnaBoyConcert #Afrobeats", song: "Burna Boy — Last Last", likes: "67.2K", comments: "5.1K", shares: "8.3K" },
    { id: 5, author: "DJ Kwame", avatar: profileMan2, image: eventParty, caption: "Saturday night set was different 🎧🕺 When the amapiano drops and everyone goes crazy #DJLife #Amapiano", song: "DJ Kwame — Live Set Mix", likes: "31.5K", comments: "2.4K", shares: "4.1K" },
  ],
  afrolove: [
    { id: 10, author: "Afro Love Show", avatar: profileWoman1, image: eventConcert, caption: "💕 Episode 12: Will Amara choose Kofi or Darius? The finale is TONIGHT! Tune in at 8PM EST on AfroHub Live #AfroLove #DatingShow", song: "🎬 Afro Love — Season 2", likes: "89.4K", comments: "12.3K", shares: "15.7K" },
    { id: 11, author: "Afro Love Show", avatar: profileWoman2, image: reel1, caption: "The chemistry between these two is UNREAL 🔥 Who's rooting for Team Amara? Drop a 💛 #AfroLove", song: "Tems — Free Mind", likes: "54.2K", comments: "8.1K", shares: "9.4K" },
    { id: 12, author: "Behind The Scenes", avatar: profileMan1, image: eventParty, caption: "Exclusive: The rose ceremony had everyone in tears 😭🌹 This is what real love looks like #AfroLoveBTS", song: "Wizkid — Essence", likes: "73.8K", comments: "9.6K", shares: "11.2K" },
    { id: 13, author: "Afro Love Clips", avatar: profileWoman1, image: reel3, caption: "\"I came here to find love and I found my soulmate\" 😭💍 The proposal scene from Episode 10 #AfroLove #Proposal", song: "Burna Boy — Anybody", likes: "102K", comments: "15.4K", shares: "22.1K" },
    { id: 14, author: "Afro Love Cast", avatar: profileMan2, image: reel2, caption: "Meet the new cast for Season 3! 12 singles from across the diaspora looking for love 💕 Applications still open!", song: "🎬 Afro Love — Season 3 Teaser", likes: "67.9K", comments: "18.2K", shares: "25.6K" },
  ],
  cooking: [
    { id: 20, author: "Mama Nneka 🇳🇬", avatar: profileWoman1, image: eventBrunch, caption: "How to make authentic Jollof Rice the Nigerian way 🍚🔥 My grandmother's secret recipe! Step by step #NigerianFood #JollofRice", song: "Original Sound — Mama Nneka", likes: "156K", comments: "22.3K", shares: "45.1K" },
    { id: 21, author: "Chef Fatou 🇸🇳", avatar: profileWoman2, image: eventAfricanArt, caption: "Thieboudienne (Senegalese Fish & Rice) 🐟🍅 The national dish that will change your life! #SenegaleseFood", song: "Youssou N'Dour — 7 Seconds", likes: "89.7K", comments: "11.4K", shares: "18.9K" },
    { id: 22, author: "Chef Amara 🇪🇹", avatar: profileWoman1, image: reel2, caption: "Ethiopian Injera from scratch! 🫓 The fermentation process takes 3 days but it's SO worth it #EthiopianFood #Injera", song: "Original Sound — Chef Amara", likes: "67.3K", comments: "8.9K", shares: "14.2K" },
    { id: 23, author: "Mama Ghana 🇬🇭", avatar: profileWoman2, image: eventBrunch, caption: "Kelewele & Waakye — the ultimate Ghanaian street food combo 🇬🇭🔥 Who can handle the spice? #GhanaianFood", song: "Sarkodie — Adonai", likes: "45.2K", comments: "6.7K", shares: "10.3K" },
    { id: 24, author: "Chef Chioma 🇨🇲", avatar: profileWoman1, image: eventAfricanArt, caption: "Ndolé (Cameroonian Bitter Leaf Stew) 🍲 My mom taught me this recipe and now I'm teaching you! #CameroonianFood", song: "Original Sound — Chef Chioma", likes: "38.1K", comments: "5.4K", shares: "8.7K" },
  ],
};

const categoryTabs: { id: ReelCategory; label: string; icon: typeof Flame }[] = [
  { id: "trending", label: "Trending", icon: Flame },
  { id: "crush", label: "Crush", icon: Crown },
  { id: "afrolove", label: "Afro Love", icon: Tv },
  { id: "cooking", label: "Cooking", icon: ChefHat },
];

// --- Crush Gallery Component ---
const CrushGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [voted, setVoted] = useState<Set<number>>(new Set());
  const [crushFilter, setCrushFilter] = useState<"all" | "WCW" | "MCM">("all");

  const filtered = crushFilter === "all" ? crushProfiles : crushProfiles.filter((p) => p.tag === crushFilter);
  const profile = filtered[currentIndex % filtered.length];
  const dayInfo = getDayLabel();

  const goNext = () => setCurrentIndex((i) => (i + 1) % filtered.length);
  const goPrev = () => setCurrentIndex((i) => (i - 1 + filtered.length) % filtered.length);
  const toggleVote = (id: number) => {
    setVoted((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-background via-background/80 to-transparent pb-4">
        <div className="px-4 pt-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold text-foreground flex items-center gap-1.5">
              <Crown size={18} className="text-primary" /> {dayInfo.label}
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">Vote for the most beautiful faces of the diaspora</p>
          </div>
          <span className="text-xs font-bold text-primary">{dayInfo.sub}</span>
        </div>
        {/* Filter chips */}
        <div className="flex gap-1.5 px-4 mt-2">
          {(["all", "WCW", "MCM"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setCrushFilter(f); setCurrentIndex(0); }}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                crushFilter === f ? "gradient-gold text-primary-foreground shadow-gold" : "bg-secondary text-muted-foreground"
              }`}
            >
              {f === "all" ? "All ✨" : f === "WCW" ? "Women 👑" : "Men 🔥"}
            </button>
          ))}
        </div>
      </div>

      {/* Main card */}
      {profile && (
        <div className="flex-1 relative mt-[100px] mb-[60px] mx-3" key={`crush-${profile.id}-${crushFilter}`}>
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-elevated border border-border/20 animate-fade-in">
            <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />

            {/* Tag badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 rounded-full gradient-gold text-primary-foreground text-[10px] font-bold shadow-gold flex items-center gap-1">
                <Crown size={10} /> {profile.tag}
              </span>
            </div>

            {/* Vote count */}
            <div className="absolute top-3 right-3 z-10">
              <span className="px-2.5 py-1 rounded-full bg-background/60 backdrop-blur-sm text-foreground text-[10px] font-bold flex items-center gap-1">
                <Star size={10} className="text-primary" /> {profile.votes} votes
              </span>
            </div>

            {/* Bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent p-4 pt-20 z-10">
              <div className="flex items-end justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-display font-bold text-foreground">
                    {profile.name}, {profile.age}
                  </h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    {profile.flag} {profile.country}
                  </p>
                  <p className="text-xs text-foreground/80 mt-1.5 leading-relaxed">{profile.bio}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-3 ml-3">
                  <button
                    onClick={() => toggleVote(profile.id)}
                    className="flex flex-col items-center gap-0.5 transition-transform active:scale-90"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      voted.has(profile.id) ? "gradient-gold shadow-gold" : "bg-secondary border border-border"
                    }`}>
                      <Crown size={22} className={voted.has(profile.id) ? "text-primary-foreground" : "text-foreground"} />
                    </div>
                    <span className="text-[9px] font-semibold text-muted-foreground">Vote</span>
                  </button>
                  <button className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                    <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center">
                      <Share2 size={20} className="text-foreground" />
                    </div>
                    <span className="text-[9px] font-semibold text-muted-foreground">Share</span>
                  </button>
                  <button className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                    <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center">
                      <Instagram size={20} className="text-foreground" />
                    </div>
                    <span className="text-[9px] font-semibold text-muted-foreground">Follow</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Nav arrows */}
          <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center z-20 hover:bg-secondary transition-colors">
            <ChevronLeft size={16} className="text-foreground" />
          </button>
          <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center z-20 hover:bg-secondary transition-colors">
            <ChevronRight size={16} className="text-foreground" />
          </button>
        </div>
      )}

      {/* Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
        {filtered.map((_, i) => (
          <button key={i} onClick={() => setCurrentIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentIndex % filtered.length ? "bg-primary w-5" : "bg-muted-foreground/30"}`} />
        ))}
      </div>
    </div>
  );
};

// --- Main Reels Screen ---
const ReelsScreen = () => {
  const [category, setCategory] = useState<ReelCategory>("trending");
  const [currentReel, setCurrentReel] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [showHeart, setShowHeart] = useState(false);
  const [muted, setMuted] = useState(false);
  const [following, setFollowing] = useState<Set<number>>(new Set());
  const touchStartY = useRef(0);

  const switchCategory = (cat: ReelCategory) => { setCategory(cat); setCurrentReel(0); };

  // Crush mode renders a completely different layout
  if (category === "crush") {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="relative w-[85%] max-w-[380px] h-[calc(100vh-130px)] rounded-3xl overflow-hidden shadow-elevated border border-border/30">
          {/* Category tabs at top */}
          <div className="absolute top-0 left-0 right-0 z-30">
            <div className="flex gap-1 px-3 pt-3">
              {categoryTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => switchCategory(tab.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                      category === tab.id ? "gradient-gold text-primary-foreground shadow-gold" : "bg-background/30 text-foreground/80 backdrop-blur-sm"
                    }`}>
                    <Icon size={12} />{tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="pt-10 h-full">
            <CrushGallery />
          </div>
        </div>
      </div>
    );
  }

  // Standard reel mode
  const reels = reelData[category];
  const reel = reels[currentReel % reels.length];

  const handleScroll = (direction: "up" | "down") => {
    if (direction === "down" && currentReel < reels.length - 1) setCurrentReel((i) => i + 1);
    else if (direction === "up" && currentReel > 0) setCurrentReel((i) => i - 1);
  };
  const toggleLike = (id: number) => { setLiked((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };
  const handleDoubleTap = (id: number) => { if (!liked.has(id)) setLiked((prev) => new Set(prev).add(id)); setShowHeart(true); setTimeout(() => setShowHeart(false), 800); };
  const toggleSave = (id: number) => { setSaved((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };
  const toggleFollow = (id: number) => { setFollowing((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div
        className="relative w-[85%] max-w-[380px] h-[calc(100vh-130px)] rounded-3xl overflow-hidden shadow-elevated border border-border/30"
        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => {
          const diff = touchStartY.current - e.changedTouches[0].clientY;
          if (diff > 60) handleScroll("down");
          else if (diff < -60) handleScroll("up");
        }}
      >
        {reel && (
          <div className="relative w-full h-full animate-fade-in" key={`${category}-${reel.id}`}>
            <img src={reel.image} alt="" className="w-full h-full object-cover" onDoubleClick={() => handleDoubleTap(reel.id)} />

            {showHeart && (
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                <Heart size={80} className="text-red-500 animate-scale-in" fill="currentColor" style={{ animation: "scale-in 0.3s ease-out, fade-out 0.5s ease-out 0.3s forwards" }} />
              </div>
            )}

            {/* Top gradient & header */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background/70 to-transparent z-10">
              <div className="flex items-center justify-between px-4 pt-4">
                <h1 className="font-display text-lg font-bold text-foreground">Reels</h1>
                <button onClick={() => setMuted(!muted)} className="p-2 rounded-full bg-background/20 backdrop-blur-sm">
                  {muted ? <VolumeX size={16} className="text-foreground" /> : <Volume2 size={16} className="text-foreground" />}
                </button>
              </div>
              <div className="flex gap-1 px-3 mt-2">
                {categoryTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} onClick={() => switchCategory(tab.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                        category === tab.id ? "gradient-gold text-primary-foreground shadow-gold" : "bg-background/30 text-foreground/80 backdrop-blur-sm"
                      }`}>
                      <Icon size={12} />{tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute top-1.5 left-3 right-3 flex gap-1 z-20">
              {reels.map((_, i) => (
                <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden bg-foreground/20">
                  <div className={`h-full rounded-full transition-all duration-500 ${i < currentReel ? "w-full gradient-gold" : i === currentReel ? "w-full gradient-gold animate-pulse" : "w-0"}`} />
                </div>
              ))}
            </div>

            {/* Right side actions */}
            <div className="absolute right-3 bottom-28 flex flex-col items-center gap-4 z-10">
              <div className="relative mb-1">
                <img src={reel.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary" />
                {!following.has(reel.id) && (
                  <button onClick={() => toggleFollow(reel.id)} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full gradient-gold flex items-center justify-center text-primary-foreground text-xs font-bold">+</button>
                )}
              </div>
              <button onClick={() => toggleLike(reel.id)} className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${liked.has(reel.id) ? "bg-red-500/20" : "bg-background/20"}`}>
                  <Heart size={22} className={`transition-colors ${liked.has(reel.id) ? "text-red-500" : "text-foreground"}`} fill={liked.has(reel.id) ? "currentColor" : "none"} />
                </div>
                <span className="text-[10px] font-semibold text-foreground">{reel.likes}</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center backdrop-blur-sm"><MessageCircle size={22} className="text-foreground" /></div>
                <span className="text-[10px] font-semibold text-foreground">{reel.comments}</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center backdrop-blur-sm"><Share2 size={22} className="text-foreground" /></div>
                <span className="text-[10px] font-semibold text-foreground">{reel.shares}</span>
              </button>
              <button onClick={() => toggleSave(reel.id)} className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${saved.has(reel.id) ? "bg-primary/20" : "bg-background/20"}`}>
                  <Bookmark size={22} className={`transition-colors ${saved.has(reel.id) ? "text-primary" : "text-foreground"}`} fill={saved.has(reel.id) ? "currentColor" : "none"} />
                </div>
              </button>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-3 left-0 right-14 p-4 bg-gradient-to-t from-background/80 via-background/40 to-transparent pt-16 z-10">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-sm font-bold text-foreground">{reel.author}</span>
                {following.has(reel.id) && <span className="text-[10px] text-primary font-semibold">Following</span>}
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed mb-2 line-clamp-2">{reel.caption}</p>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-background/20 backdrop-blur-sm w-fit">
                <Music size={11} className="text-foreground/70 animate-pulse" />
                <p className="text-[10px] text-foreground/80 truncate max-w-[180px]">{reel.song}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation arrows */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[76px] flex items-center gap-3 z-20">
        <button onClick={() => handleScroll("up")} disabled={currentReel === 0} className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center disabled:opacity-30 transition-opacity hover:bg-secondary">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="m18 15-6-6-6 6"/></svg>
        </button>
        <span className="text-xs font-semibold text-muted-foreground">{currentReel + 1}/{reels.length}</span>
        <button onClick={() => handleScroll("down")} disabled={currentReel === reels.length - 1} className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center disabled:opacity-30 transition-opacity hover:bg-secondary">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>
    </div>
  );
};

export default ReelsScreen;
