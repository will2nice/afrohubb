import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Users, Gift, Share2, Copy, Check, Sparkles, Camera, Instagram } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface SignupResult {
  referral_code: string;
  position: number;
  referral_count: number;
}

const COUNTRIES = [
  "🇺🇸 United States", "🇬🇧 United Kingdom", "🇫🇷 France", "🇨🇦 Canada",
  "🇳🇬 Nigeria", "🇬🇭 Ghana", "🇰🇪 Kenya", "🇿🇦 South Africa",
  "🇨🇩 DR Congo", "🇸🇳 Senegal", "🇨🇮 Côte d'Ivoire", "🇨🇲 Cameroon",
  "🇪🇹 Ethiopia", "🇹🇿 Tanzania", "🇺🇬 Uganda", "🇯🇲 Jamaica",
  "🇹🇹 Trinidad & Tobago", "🇧🇷 Brazil", "🇩🇪 Germany", "🇳🇱 Netherlands",
  "🇧🇪 Belgium", "🇪🇸 Spain", "🇮🇹 Italy", "🇦🇺 Australia", "Other",
];

const Waitlist = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SignupResult | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Photo too large", description: "Max 5MB", variant: "destructive" });
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return null;
    const ext = photoFile.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("waitlist-photos").upload(path, photoFile);
    if (error) throw error;
    const { data } = supabase.storage.from("waitlist-photos").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl: string | null = null;
      if (photoFile) {
        avatarUrl = await uploadPhoto();
      }

      const { data, error } = await supabase
        .from("waitlist_signups")
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          referred_by: refCode || null,
          avatar_url: avatarUrl,
          age: age ? parseInt(age) : null,
          city: city.trim() || null,
          country: country || null,
          bio: bio.trim() || null,
          instagram_handle: instagram.trim() || null,
        } as any)
        .select("referral_code, position, referral_count")
        .single();

      if (error) {
        if (error.code === "23505") {
          const { data: existing } = await supabase
            .from("waitlist_signups")
            .select("referral_code, position, referral_count")
            .eq("email", email.trim().toLowerCase())
            .single();
          if (existing) {
            setResult(existing);
            toast({ title: "Welcome back! 👋", description: "You're already on the list." });
            return;
          }
        }
        throw error;
      }

      setResult(data);
      toast({ title: "You're in! 🎉", description: "Welcome to the waitlist." });
    } catch (err: any) {
      toast({ title: "Oops", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const referralLink = result ? `${window.location.origin}/waitlist?ref=${result.referral_code}` : "";
  const copyLink = () => { navigator.clipboard.writeText(referralLink); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const shareLink = async () => { if (navigator.share) { await navigator.share({ title: "Join AfroHub", text: "Join the AfroHub waitlist!", url: referralLink }); } else { copyLink(); } };

  if (result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles size={36} className="text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold text-foreground">You're on the list!</h1>
            <p className="text-muted-foreground text-sm">
              You're <span className="font-bold text-primary">#{result.position}</span> on the waitlist
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Gift size={20} className="text-primary" />
              <span className="font-semibold text-foreground">Invite friends, move up</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Each friend who joins with your link moves you up the list. Get 5 referrals for early access.
            </p>
            <div className="bg-secondary rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{result.referral_count}</p>
                <p className="text-xs text-muted-foreground">Referrals</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-primary">#{result.position}</p>
                <p className="text-xs text-muted-foreground">Position</p>
              </div>
            </div>
            <div className="bg-secondary rounded-xl p-3 flex items-center gap-2">
              <input readOnly value={referralLink} className="flex-1 bg-transparent text-xs text-foreground truncate outline-none" />
              <button onClick={copyLink} className="shrink-0 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <button onClick={shareLink} className="w-full py-3 rounded-xl gradient-gold text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <Share2 size={16} /> Share your link
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-3">
          <h1 className="font-display text-4xl font-bold text-gradient-gold">AfroHub</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The diaspora community app is coming soon. Join the waitlist to get early access.
          </p>
          {refCode && (
            <p className="text-xs text-primary font-medium">🎉 You were invited by a friend!</p>
          )}
        </div>

        {/* Perks */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-3 text-center space-y-1">
            <Users size={20} className="mx-auto text-primary" />
            <p className="text-xs font-medium text-foreground">Early Access</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center space-y-1">
            <Gift size={20} className="mx-auto text-primary" />
            <p className="text-xs font-medium text-foreground">Referral Rewards</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Photo upload */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full bg-secondary border-2 border-dashed border-border hover:border-primary/40 transition-colors flex items-center justify-center overflow-hidden"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Camera size={24} className="mx-auto text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground mt-1 block">Add photo</span>
                </div>
              )}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
          </div>

          <input type="text" placeholder="Your name *" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
          <input type="email" placeholder="Email address *" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
          <input type="tel" placeholder="Phone number (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} min="16" max="99" className={inputClass} />
            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
          </div>

          <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass + " appearance-none"}>
            <option value="">Country / Origin</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <textarea
            placeholder="Tell us about yourself (optional)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={200}
            rows={2}
            className={inputClass + " resize-none"}
          />

          <div className="relative">
            <Instagram size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Instagram handle (optional)"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className={inputClass + " pl-10"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-gold text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join the Waitlist"}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Already an admin?{" "}
          <a href="/auth" className="text-primary font-semibold hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Waitlist;
