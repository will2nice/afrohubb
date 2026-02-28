import { useState } from "react";
import { GraduationCap, Search, Users, Calendar, ChevronRight, ArrowLeft, MapPin, MessageCircle, UserPlus, Filter } from "lucide-react";
import { campusSchools, campusEvents, campusPeers, type CampusSchool, type SchoolType } from "@/data/campusData";

type CampusView = "list" | "school";
type SchoolTab = "events" | "peers";
type SchoolFilter = "all" | "hbcu" | "asa";

const CampusScreen = () => {
  const [view, setView] = useState<CampusView>("list");
  const [selectedSchool, setSelectedSchool] = useState<CampusSchool | null>(null);
  const [schoolTab, setSchoolTab] = useState<SchoolTab>("events");
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState<SchoolFilter>("all");
  const [connectedPeers, setConnectedPeers] = useState<Set<number>>(new Set());

  const filteredSchools = campusSchools
    .filter(s => schoolFilter === "all" || s.type === schoolFilter)
    .filter(s =>
      searchQuery === "" ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.state.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const schoolEvents = selectedSchool
    ? campusEvents.filter(e => e.schoolId === selectedSchool.id)
    : [];

  const schoolPeers = selectedSchool
    ? campusPeers.filter(p => p.schoolId === selectedSchool.id)
    : [];

  const openSchool = (school: CampusSchool) => {
    setSelectedSchool(school);
    setView("school");
    setSchoolTab("events");
  };

  const toggleConnect = (peerId: number) => {
    setConnectedPeers(prev => {
      const next = new Set(prev);
      if (next.has(peerId)) next.delete(peerId);
      else next.add(peerId);
      return next;
    });
  };

  // School detail view
  if (view === "school" && selectedSchool) {
    return (
      <div className="min-h-screen pb-24">
        {/* Header */}
        <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-3">
              <button onClick={() => setView("list")} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
                <ArrowLeft size={20} className="text-foreground" />
              </button>
              <div className="flex-1">
                <h1 className="font-display text-lg font-bold text-foreground">{selectedSchool.shortName}</h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin size={10} />
                  {selectedSchool.city}, {selectedSchool.state}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                selectedSchool.type === "hbcu"
                  ? "gradient-gold text-primary-foreground"
                  : "bg-accent text-accent-foreground"
              }`}>
                {selectedSchool.type === "hbcu" ? "HBCU" : "ASA"}
              </span>
            </div>

            {/* School stats */}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users size={14} className="text-primary" />
                <span>{selectedSchool.memberCount} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} className="text-primary" />
                <span>{selectedSchool.upcomingEvents} upcoming events</span>
              </div>
              <span className="text-muted-foreground/60">🎨 {selectedSchool.colors}</span>
            </div>

            {/* Tabs */}
            <div className="flex mt-3 gap-1 bg-secondary rounded-xl p-1">
              <button
                onClick={() => setSchoolTab("events")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  schoolTab === "events"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                <Calendar size={14} className="inline mr-1.5" />
                Events
              </button>
              <button
                onClick={() => setSchoolTab("peers")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  schoolTab === "peers"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                <Users size={14} className="inline mr-1.5" />
                Peers
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 py-4 space-y-3 max-w-lg mx-auto">
          {schoolTab === "events" ? (
            schoolEvents.length === 0 ? (
              <div className="text-center py-16">
                <Calendar size={40} className="text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-sm text-muted-foreground">No upcoming events</p>
              </div>
            ) : (
              schoolEvents.map(event => (
                <article key={event.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up">
                  <img src={event.image} alt={event.title} className="w-full aspect-[16/9] object-cover" loading="lazy" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary text-secondary-foreground">{event.category}</span>
                    </div>
                    <h3 className="font-display font-bold text-foreground text-base leading-tight">{event.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-primary" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        <Users size={12} className="inline mr-1" />
                        {event.attendees} attending
                      </span>
                      <button className="px-4 py-1.5 rounded-full text-xs font-semibold gradient-gold text-primary-foreground shadow-gold hover:scale-105 active:scale-95 transition-all">
                        RSVP
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )
          ) : (
            schoolPeers.length === 0 ? (
              <div className="text-center py-16">
                <Users size={40} className="text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-sm text-muted-foreground">No peers found at this school</p>
              </div>
            ) : (
              schoolPeers.map(peer => {
                const isConnected = connectedPeers.has(peer.id);
                return (
                  <div key={peer.id} className="bg-card rounded-2xl border border-border p-4 flex gap-3 items-start animate-slide-up">
                    <img src={peer.avatar} alt={peer.name} className="w-14 h-14 rounded-full object-cover border-2 border-border" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-foreground text-sm">{peer.name}</h3>
                        <span className="text-sm">{peer.flag}</span>
                        <span className="text-xs text-muted-foreground">• {peer.age}</span>
                      </div>
                      <p className="text-xs text-primary font-medium">{peer.major} • {peer.year}</p>
                      <p className="text-xs text-muted-foreground mt-1">{peer.bio}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => toggleConnect(peer.id)}
                        className={`p-2 rounded-full transition-all ${
                          isConnected
                            ? "bg-green-500/20 text-green-400"
                            : "bg-secondary text-muted-foreground hover:text-primary"
                        }`}
                      >
                        {isConnected ? <Users size={16} /> : <UserPlus size={16} />}
                      </button>
                      <button className="p-2 rounded-full bg-secondary text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>
    );
  }

  // School list view
  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display text-xl font-bold text-gradient-gold flex items-center gap-2">
              <GraduationCap size={22} className="text-primary" />
              Campus
            </h1>
          </div>

          <div className="relative mb-3">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search schools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Filter chips */}
          <div className="flex gap-2">
            {(["all", "hbcu", "asa"] as SchoolFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setSchoolFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  schoolFilter === f
                    ? "gradient-gold text-primary-foreground shadow-gold"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {f === "all" ? "All Schools" : f === "hbcu" ? "HBCUs" : "ASA Schools"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="px-4 py-3 max-w-lg mx-auto">
        <p className="text-xs text-muted-foreground mb-3">{filteredSchools.length} schools</p>

        <div className="space-y-2">
          {filteredSchools.map(school => (
            <button
              key={school.id}
              onClick={() => openSchool(school)}
              className="w-full bg-card rounded-xl border border-border p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors text-left animate-slide-up"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                school.type === "hbcu"
                  ? "gradient-gold"
                  : "bg-accent"
              }`}>
                <GraduationCap size={20} className={school.type === "hbcu" ? "text-primary-foreground" : "text-accent-foreground"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-sm truncate">{school.name}</h3>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    school.type === "hbcu"
                      ? "bg-primary/20 text-primary"
                      : "bg-accent/50 text-accent-foreground"
                  }`}>
                    {school.type === "hbcu" ? "HBCU" : "ASA"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{school.city}, {school.state} • {school.memberCount} members</p>
              </div>
              <div className="flex items-center gap-2">
                {school.upcomingEvents > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">
                    {school.upcomingEvents} events
                  </span>
                )}
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampusScreen;
