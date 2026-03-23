import { useState, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Users, Gift, Share2, Copy, Check, Sparkles, Camera, Instagram, X, Zap } from "lucide-react";

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

type AccessType = "waitlist" | "instant";

const Waitlist = () => {
  const [step, setStep] = useState<"landing" | "form" | "result">("landing");
  const [accessType, setAccessType] = useState<AccessType>("waitlist");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");

  const [photos, setPhotos] = useState<(File | null)[]>([null, null, null]);
  const [photoPreviews, setPhotoPreviews] = useState<(string | null)[]>([null, null, null]);
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SignupResult | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref") || new URLSearchParams(window.location.search).get("ref");

  const handlePhotoSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Photo too large", description: "Max 5MB", variant: "destructive" });
      return;
    }
    const newPhotos = [...photos];
    newPhotos[index] = file;
    setPhotos(newPhotos);

    const newPreviews = [...photoPreviews];
    newPreviews[index] = URL.createObjectURL(file);
    setPhotoPreviews(newPreviews);
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
    const newPreviews = [...photoPreviews];
    if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]!);
    newPreviews[index] = null;
    setPhotoPreviews(newPreviews);
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("waitlist-photos").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("waitlist-photos").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedPhotos = photos.filter(Boolean) as File[];
      let avatarUrl: string | null = null;
      if (uploadedPhotos.length > 0) {
        avatarUrl = await uploadPhoto(uploadedPhotos[0]);
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
            setStep("result");
            toast({ title: "Welcome back! 👋", description: "You're already on the list." });
            return;
          }
        }
        throw error;
      }

      setResult(data);
      setStep("result");
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

  // ─── LANDING ───
  if (step === "landing") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm flex flex-col items-center space-y-12">
          <h1 className="text-6xl sm:text-7xl font-display font-bold tracking-tight text-black">
            AFROHUB
          </h1>

          <div className="w-full space-y-4">
            <button
              onClick={() => { setAccessType("waitlist"); setStep("form"); }}
              className="w-full py-4 rounded-2xl bg-black text-white font-bold text-base tracking-wide hover:bg-black/90 transition-colors"
            >
              Join Waitlist
            </button>
            <button
              onClick={() => { setAccessType("instant"); setStep("form"); }}
              className="w-full py-4 rounded-2xl border-2 border-black text-black font-bold text-base tracking-wide hover:bg-black/5 transition-colors flex items-center justify-center gap-2"
            >
              <Zap size={18} /> Instant Access — $25
            </button>
          </div>

          {refCode && (
            <p className="text-sm text-black/60 font-medium">🎉 You were invited by a friend!</p>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULT ───
  if (step === "result" && result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-black/5 flex items-center justify-center">
            <Sparkles size={36} className="text-black" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold text-black">You're on the list!</h1>
            <p className="text-black/50 text-sm">
              You're <span className="font-bold text-black">#{result.position}</span> on the waitlist
            </p>
          </div>
          <div className="bg-black/[0.03] border border-black/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Gift size={20} className="text-black" />
              <span className="font-semibold text-black">Invite friends, move up</span>
            </div>
            <p className="text-black/50 text-xs leading-relaxed">
              Each friend who joins moves you up. Get 5 referrals for early access.
            </p>
            <div className="bg-white rounded-xl p-4 flex items-center justify-between border border-black/10">
              <div>
                <p className="text-2xl font-bold text-black">{result.referral_count}</p>
                <p className="text-xs text-black/40">Referrals</p>
              </div>
              <div className="h-10 w-px bg-black/10" />
              <div>
                <p className="text-2xl font-bold text-black">#{result.position}</p>
                <p className="text-xs text-black/40">Position</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 flex items-center gap-2 border border-black/10">
              <input readOnly value={referralLink} className="flex-1 bg-transparent text-xs text-black truncate outline-none" />
              <button onClick={copyLink} className="shrink-0 p-2 rounded-lg bg-black/5 text-black hover:bg-black/10 transition-colors">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <button onClick={shareLink} className="w-full py-3 rounded-xl bg-black text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-black/90 transition-colors">
              <Share2 size={16} /> Share your link
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── FORM ───
  const inputClass = "w-full px-4 py-3 rounded-xl bg-black/[0.03] text-black placeholder:text-black/30 border border-black/10 focus:outline-none focus:ring-2 focus:ring-black/20 text-sm";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => setStep("landing")} className="p-2 -ml-2 text-black/40 hover:text-black transition-colors">
            <ArrowRight size={20} className="rotate-180" />
          </button>
          <h1 className="font-display text-2xl font-bold text-black">AFROHUB</h1>
          <div className="w-9" />
        </div>

        <div className="text-center space-y-1">
          <p className="text-black font-semibold text-lg">
            {accessType === "instant" ? "Instant Access — $25" : "Join the Waitlist"}
          </p>
          <p className="text-black/40 text-xs">Tell us about yourself</p>
        </div>

        {/* Photos — up to 3 */}
        <div className="flex justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative">
              <button
                type="button"
                onClick={() => fileInputRefs[i].current?.click()}
                className="w-24 h-24 rounded-2xl bg-black/[0.03] border-2 border-dashed border-black/10 hover:border-black/20 transition-colors flex items-center justify-center overflow-hidden"
              >
                {photoPreviews[i] ? (
                  <img src={photoPreviews[i]!} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Camera size={20} className="mx-auto text-black/20" />
                    <span className="text-[10px] text-black/20 mt-1 block">
                      {i === 0 ? "Main" : `Photo ${i + 1}`}
                    </span>
                  </div>
                )}
              </button>
              {photoPreviews[i] && (
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center"
                >
                  <X size={10} />
                </button>
              )}
              <input ref={fileInputRefs[i]} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoSelect(i, e)} />
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
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
            <Instagram size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
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
            className="w-full py-3.5 rounded-xl bg-black text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-black/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : accessType === "instant" ? "Continue to Payment — $25" : "Join the Waitlist"}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-xs text-black/30">
          Already an admin?{" "}
          <a href="/auth" className="text-black font-semibold hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Waitlist;
