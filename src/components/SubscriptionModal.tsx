import { useState } from "react";
import { Crown, Check, X, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PLANS = [
  {
    id: "weekly",
    label: "1 Week",
    price: "$4.99",
    perDay: "$0.71/day",
    popular: false,
  },
  {
    id: "monthly",
    label: "1 Month",
    price: "$9.99",
    perDay: "$0.33/day",
    popular: true,
  },
  {
    id: "3months",
    label: "3 Months",
    price: "$19.99",
    perDay: "$0.22/day",
    popular: false,
  },
  {
    id: "6months",
    label: "6 Months",
    price: "$34.99",
    perDay: "$0.19/day",
    popular: false,
  },
  {
    id: "yearly",
    label: "1 Year",
    price: "$49.99",
    perDay: "$0.14/day",
    popular: false,
  },
];

const PERKS = [
  "See all event attendees — names, ages & bios",
  "Unlimited city exploration",
  "Message & connect with anyone",
  "Priority matching & double-date mode",
  "Exclusive events & early access",
];

const SubscriptionModal = ({ open, onOpenChange }: SubscriptionModalProps) => {
  const [selected, setSelected] = useState("monthly");

  const handleSubscribe = () => {
    // For now, just close and show a toast — Stripe integration later
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl border-border bg-card p-0 overflow-hidden gap-0 [&>button]:hidden">
        {/* Hero header */}
        <div
          className="relative px-6 pt-8 pb-5 text-center"
          style={{ background: "var(--gradient-gold)" }}
        >
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
          >
            <X size={16} className="text-primary-foreground" />
          </button>
          <Crown size={36} className="mx-auto text-primary-foreground mb-2" />
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-display font-bold text-primary-foreground">
              AfroHub Plus
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80 text-xs">
              Unlock the full experience
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Perks */}
          <ul className="space-y-2">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-2">
                <Check size={14} className="text-primary mt-0.5 shrink-0" />
                <span className="text-xs text-foreground">{perk}</span>
              </li>
            ))}
          </ul>

          {/* Plans */}
          <div className="space-y-2">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                  selected === plan.id
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border bg-secondary/50 hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selected === plan.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {selected === plan.id && (
                      <Check size={12} className="text-primary-foreground" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {plan.label}
                      </span>
                      {plan.popular && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold gradient-gold text-primary-foreground flex items-center gap-1">
                          <Sparkles size={10} /> BEST VALUE
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {plan.perDay}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {plan.price}
                </span>
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleSubscribe}
            className="w-full py-3.5 rounded-2xl gradient-gold text-primary-foreground font-semibold text-sm shadow-gold hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Subscribe Now 👑
          </button>

          <p className="text-[10px] text-muted-foreground text-center">
            Cancel anytime · Secure payment coming soon
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
