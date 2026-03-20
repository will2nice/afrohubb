import { useState, useRef } from "react";
import { ArrowRight, ArrowLeft, MapPin, Heart, Camera, Globe, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cities } from "@/data/cityData";
import { trackEvent } from "@/lib/posthog";
import { trackOnboardingCompleted, trackOnboardingStep, trackOnboardingDropoff } from "@/lib/analytics";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const INTERESTS = [
  "🥁 Afrobeats", "🎶 Amapiano", "🎉 Parties", "🎪 Festivals",
  "🌙 Nightlife", "🥂 Brunch", "🎵 Music", "💃 Dance",
  "🎨 Art & Culture", "💼 Networking", "🍽️ Food & Drink",
  "🏀 Sports", "👗 Fashion", "💻 Tech", "✈️ Travel", "🧘 Wellness",
];

const LOOKING_FOR = [
  { id: "friends", emoji: "🤝", label: "Friends" },
  { id: "events", emoji: "🎉", label: "Events" },
  { id: "community", emoji: "🌍", label: "Community" },
  { id: "networking", emoji: "💼", label: "Networking" },
  { id: "dating", emoji: "💕", label: "Dating" },
];

const LANGUAGES = [
  "English", "French", "Spanish", "Portuguese", "Arabic",
  "Swahili", "Yoruba", "Igbo", "Hausa", "Amharic",
  "Wolof", "Twi", "Zulu", "Lingala", "Creole",
];

const POPULAR_CITIES = [
  "London", "Paris", "New York", "Lagos", "Accra",
  "Nairobi", "Toronto", "Atlanta", "Houston", "Amsterdam",
  "Brussels", "Berlin", "Johannesburg", "Dakar", "Abidjan",
];

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [nationality, setNationality] = useState("");
  const [diasporaRoots, setDiasporaRoots] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;
  const STEP_NAMES = ["location", "interests", "goals", "photo", "background"];
  const progress = ((step + 1) / totalSteps) * 100;

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

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

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let avatarUrl: string | undefined;
      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const path = `${user.id}/avatar.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("avatars")
          .upload(path, photoFile, { upsert: true });
        if (!uploadErr) {
          const { data } = supabase.storage.from("avatars").getPublicUrl(path);
          avatarUrl = data.publicUrl;
        }
      }

      const updates: Record<string, unknown> = {
        city: selectedCity,
        interests: selectedInterests.map((i) => i.replace(/^.+\s/, "")),
        looking_for: selectedGoals,
        nationality,
        diaspora_roots: diasporaRoots,
        languages: selectedLanguages,
        bio,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      };
      if (avatarUrl) updates.avatar_url = avatarUrl;

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      trackEvent("onboarding_completed", {
        city: selectedCity,
        interests_count: selectedInterests.length,
        goals: selectedGoals,
        has_photo: !!photoFile,
      });
      trackOnboardingCompleted(step + 1);

      onComplete();
    } catch (err: any) {
      toast({ title: "Error saving profile", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const canAdvance = () => {
    if (step === 0) return selectedCity.length > 0;
    if (step === 1) return selectedInterests.length >= 2;
    if (step === 2) return selectedGoals.length >= 1;
    return true;
  };

  const next = () => {
    trackOnboardingStep(step, STEP_NAMES[step], "completed");
    if (step < totalSteps - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      trackOnboardingStep(nextStep, STEP_NAMES[nextStep], "started");
    } else {
      handleFinish();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="text-muted-foreground p-1">
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="w-6" />
          )}
          <span className="text-xs text-muted-foreground font-medium">
            Step {step + 1} of {totalSteps}
          </span>
          <button
            onClick={() => { trackOnboardingDropoff(step, STEP_NAMES[step]); handleFinish(); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip
          </button>
        </div>
        <Progress value={progress} className="h-1.5 bg-muted" />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-6 overflow-y-auto pb-28">
        {/* Step 0: Location */}
        {step === 0 && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <MapPin className="text-primary mb-3" size={32} />
              <h2 className="text-xl font-bold text-foreground mb-1">Where's home right now?</h2>
              <p className="text-sm text-muted-foreground">
                We'll connect you with your local Afro-diaspora community
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city.toLowerCase())}
                  className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                    selectedCity === city.toLowerCase()
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or type your city..."
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value.toLowerCase())}
              className="mt-4 w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        )}

        {/* Step 1: Interests */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <Sparkles className="text-primary mb-3" size={32} />
              <h2 className="text-xl font-bold text-foreground mb-1">What's your vibe?</h2>
              <p className="text-sm text-muted-foreground">
                Pick what resonates — we'll curate your Afro experience
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedInterests.includes(interest)
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <Heart className="text-primary mb-3" size={32} />
              <h2 className="text-xl font-bold text-foreground mb-1">What are you looking for?</h2>
              <p className="text-sm text-muted-foreground">
                Help us understand what matters most to you
              </p>
            </div>
            <div className="space-y-3">
              {LOOKING_FOR.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleGoal(item.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-left transition-all ${
                    selectedGoals.includes(item.id)
                      ? "bg-primary/15 border-2 border-primary text-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                  {selectedGoals.includes(item.id) && (
                    <Check size={18} className="ml-auto text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Photo */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <Camera className="text-primary mb-3" size={32} />
              <h2 className="text-xl font-bold text-foreground mb-1">Add a profile photo</h2>
              <p className="text-sm text-muted-foreground">
                People are more likely to connect with real faces
              </p>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={() => fileRef.current?.click()}
                className="w-36 h-36 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center overflow-hidden hover:border-primary transition-colors mb-4"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={40} className="text-muted-foreground" />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoSelect}
              />
              <p className="text-xs text-muted-foreground">Tap to upload • Max 5MB</p>
            </div>
          </div>
        )}

        {/* Step 4: Background */}
        {step === 4 && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <Globe className="text-primary mb-3" size={32} />
              <h2 className="text-xl font-bold text-foreground mb-1">Tell us about yourself</h2>
              <p className="text-sm text-muted-foreground">
                Optional — share your roots and languages
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Nationality or Diaspora Roots
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="e.g. Nigerian-American, Haitian-French"
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Languages Spoken
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedLanguages.includes(lang)
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Short Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A little about you..."
                  maxLength={200}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <p className="text-xs text-muted-foreground text-right mt-1">{bio.length}/200</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/90 backdrop-blur-lg border-t border-border">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={next}
            disabled={!canAdvance() || saving}
            className="w-full h-12 rounded-xl text-sm font-semibold gap-2"
          >
            {saving ? "Saving..." : step === totalSteps - 1 ? "Get Started" : "Continue"}
            {!saving && <ArrowRight size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
