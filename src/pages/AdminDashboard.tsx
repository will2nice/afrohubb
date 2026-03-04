import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Users, LogOut, ArrowLeft, Search, Trash2,
  TrendingUp, Gift, Clock, RefreshCw, Instagram, MapPin, Filter
} from "lucide-react";

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  referral_code: string;
  referred_by: string | null;
  referral_count: number;
  position: number;
  created_at: string;
  avatar_url: string | null;
  age: number | null;
  city: string | null;
  country: string | null;
  bio: string | null;
  instagram_handle: string | null;
}

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"position" | "referrals" | "date">("position");
  const [countryFilter, setCountryFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("waitlist_signups")
      .select("*")
      .order(
        sortBy === "referrals" ? "referral_count" : sortBy === "date" ? "created_at" : "position",
        { ascending: sortBy !== "referrals" }
      );

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setEntries((data as WaitlistEntry[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, [sortBy]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("waitlist_signups").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast({ title: "Removed from waitlist" });
    }
  };

  const uniqueCountries = [...new Set(entries.map((e) => e.country).filter(Boolean))] as string[];

  const filtered = entries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.phone && e.phone.includes(search)) ||
      (e.city && e.city.toLowerCase().includes(search.toLowerCase()));
    const matchesCountry = !countryFilter || e.country === countryFilter;
    return matchesSearch && matchesCountry;
  });

  const totalReferrals = entries.reduce((sum, e) => sum + e.referral_count, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/app")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-display text-lg font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchEntries} className="p-2 text-muted-foreground hover:text-foreground">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={signOut} className="p-2 text-muted-foreground hover:text-foreground">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Users size={20} className="mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold text-foreground">{entries.length}</p>
            <p className="text-xs text-muted-foreground">Signups</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Gift size={20} className="mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold text-foreground">{totalReferrals}</p>
            <p className="text-xs text-muted-foreground">Referrals</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <TrendingUp size={20} className="mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold text-foreground">
              {entries.length > 0 ? (totalReferrals / entries.length).toFixed(1) : 0}
            </p>
            <p className="text-xs text-muted-foreground">Avg Refs</p>
          </div>
        </div>

        {/* Search + Sort + Filters */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search name, email, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl bg-secondary text-foreground border border-border text-sm focus:outline-none"
            >
              <option value="position">Position</option>
              <option value="referrals">Top Referrers</option>
              <option value="date">Newest</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-colors ${showFilters ? "bg-primary/10 border-primary/30 text-primary" : "bg-secondary border-border text-muted-foreground"}`}
            >
              <Filter size={18} />
            </button>
          </div>
          {showFilters && uniqueCountries.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setCountryFilter("")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!countryFilter ? "gradient-gold text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
              >
                All Countries
              </button>
              {uniqueCountries.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountryFilter(c === countryFilter ? "" : c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${countryFilter === c ? "gradient-gold text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* List */}
        <div className="space-y-2">
          {loading && entries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No signups found</div>
          ) : (
            filtered.map((entry) => (
              <div key={entry.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
                {/* Avatar or position badge */}
                {entry.avatar_url ? (
                  <div className="relative shrink-0">
                    <img
                      src={entry.avatar_url}
                      alt={entry.name}
                      className="w-14 h-14 rounded-xl object-cover ring-2 ring-border"
                    />
                    <span className="absolute -top-1.5 -left-1.5 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      #{entry.position}
                    </span>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">#{entry.position}</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground text-sm truncate">{entry.name}</p>
                    {entry.age && (
                      <span className="text-xs text-muted-foreground">{entry.age}y</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{entry.email}</p>
                  {entry.bio && (
                    <p className="text-xs text-foreground/70 mt-1 line-clamp-2">{entry.bio}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {(entry.city || entry.country) && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin size={12} />
                        {[entry.city, entry.country].filter(Boolean).join(", ")}
                      </span>
                    )}
                    {entry.instagram_handle && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Instagram size={12} /> @{entry.instagram_handle.replace("@", "")}
                      </span>
                    )}
                    <span className="text-xs text-primary font-medium flex items-center gap-1">
                      <Gift size={12} /> {entry.referral_count} referrals
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} /> {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  title="Remove from waitlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
