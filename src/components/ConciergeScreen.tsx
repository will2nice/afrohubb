import { useState } from "react";
import { ArrowLeft, Crown, Calendar, Users, DollarSign, Sparkles, Check, MapPin, PartyPopper, Wine, Utensils, Dumbbell, Music, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { type City } from "@/data/cityData";

interface Props {
  selectedCity: City;
  onBack: () => void;
}

const INTEREST_OPTIONS = [
  { id: "parties", label: "Parties & Clubs", icon: PartyPopper, emoji: "🎉" },
  { id: "bars", label: "Bars & Lounges", icon: Wine, emoji: "🍸" },
  { id: "speakeasy", label: "Speakeasies", icon: Moon, emoji: "🌙" },
  { id: "dinners", label: "Dinners & Food", icon: Utensils, emoji: "🍽️" },
  { id: "social", label: "Social Events", icon: Users, emoji: "👥" },
  { id: "concerts", label: "Concerts & Music", icon: Music, emoji: "🎵" },
  { id: "bowling", label: "Bowling & Games", icon: Dumbbell, emoji: "🎳" },
  { id: "nightlife", label: "Nightlife", icon: Moon, emoji: "✨" },
];

const BUDGET_OPTIONS = ["$0–50", "$50–150", "$150–300", "$300+", "No limit"];

const ConciergeScreen = ({ selectedCity, onBack }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<"info" | "submitting" | "done">("info");

  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (selectedInterests.length === 0) {
      toast({ title: "Select at least one interest", variant: "destructive" });
      return;
    }

    setStep("submitting");

    try {
      const { error } = await supabase.from("concierge_requests" as any).insert({
        user_id: user.id,
        city: selectedCity.id,
        arrival_date: arrivalDate || null,
        departure_date: departureDate || null,
        group_size: groupSize,
        interests: selectedInterests,
        budget: budget || null,
        special_notes: notes,
        status: "pending",
        payment_status: "unpaid",
      } as any);

      if (error) throw error;

      setStep("done");
      toast({ title: "Request submitted! 🎉", description: "A concierge agent will reach out to you shortly." });
    } catch (err: any) {
      console.error("Concierge submit error:", err);
      toast({ title: "Error submitting request", description: err.message, variant: "destructive" });
      setStep("info");
    }
  };

  if (step === "done") {
    return (
      <div className="min-h-screen pb-24">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={onBack} className="p-1"><ArrowLeft size={20} /></button>
          <h2 className="font-semibold">Concierge</h2>
        </div>
        <div className="flex flex-col items-center justify-center px-6 pt-20 text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">You're All Set!</h2>
          <p className="text-muted-foreground max-w-xs">
            A personal concierge agent for {selectedCity.flag} {selectedCity.name} will be in touch via your messages soon.
          </p>
          <p className="text-sm text-muted-foreground">
            They'll curate the perfect itinerary based on your preferences.
          </p>
          <Button onClick={onBack} className="mt-4 rounded-full px-8">
            Back to Discover
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={onBack} className="p-1"><ArrowLeft size={20} /></button>
        <div className="flex-1">
          <h2 className="font-semibold text-sm">Personal Concierge</h2>
          <p className="text-xs text-muted-foreground">{selectedCity.flag} {selectedCity.name}</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10">
          <Crown size={14} className="text-primary" />
          <span className="text-xs font-semibold text-primary">$25</span>
        </div>
      </div>

      {/* Hero */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Your City, Your Way</h1>
            <p className="text-sm text-muted-foreground">Real people. Real recommendations.</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Tell us what you're looking for and a local concierge agent will personally curate the best experiences in {selectedCity.name} — from exclusive parties to hidden speakeasies.
        </p>
      </div>

      <div className="px-5 space-y-6">
        {/* Interests */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            What are you looking for? *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {INTEREST_OPTIONS.map((opt) => {
              const selected = selectedInterests.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleInterest(opt.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-foreground mb-1.5 block">
              <Calendar size={14} className="inline mr-1" />
              Arrival
            </label>
            <Input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground mb-1.5 block">
              <Calendar size={14} className="inline mr-1" />
              Departure
            </label>
            <Input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Group Size */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-1.5 block">
            <Users size={14} className="inline mr-1" />
            Group Size
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => setGroupSize(n)}
                className={`w-10 h-10 rounded-xl border text-sm font-semibold transition-all ${
                  groupSize === n
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
              >
                {n === 6 ? "6+" : n}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-1.5 block">
            <DollarSign size={14} className="inline mr-1" />
            Budget per person
          </label>
          <div className="flex flex-wrap gap-2">
            {BUDGET_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setBudget(opt)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                  budget === opt
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-1.5 block">
            Anything else we should know?
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Birthday celebration, prefer upscale venues, want to meet locals..."
            className="rounded-xl min-h-[80px]"
            maxLength={500}
          />
        </div>

        {/* Submit */}
        <div className="pb-6">
          <Button
            onClick={handleSubmit}
            disabled={step === "submitting" || selectedInterests.length === 0}
            className="w-full rounded-full h-12 text-base font-semibold"
          >
            {step === "submitting" ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Crown size={18} />
                Submit Request — $25
              </span>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Payment will be collected after a concierge is assigned to you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConciergeScreen;
