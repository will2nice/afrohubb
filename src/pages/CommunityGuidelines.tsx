import { ArrowLeft, Shield, Users, Heart, AlertTriangle, Ban, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sections = [
  {
    icon: Heart,
    title: "Respect Everyone",
    items: [
      "Treat all members with dignity and respect regardless of background, ethnicity, religion, gender, or sexual orientation.",
      "No hate speech, slurs, or discriminatory language.",
      "Be kind in disagreements — debate ideas, not people.",
    ],
  },
  {
    icon: Shield,
    title: "Keep It Safe",
    items: [
      "Never share personal information of others without consent.",
      "No doxxing, threats, or intimidation.",
      "Report any behavior that makes you feel unsafe.",
    ],
  },
  {
    icon: Users,
    title: "Be Authentic",
    items: [
      "Use real photos and accurate information on your profile.",
      "No impersonation of other people or organizations.",
      "Fake profiles will be removed.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "No Spam or Scams",
    items: [
      "Do not post unsolicited promotions or advertisements.",
      "No pyramid schemes, MLMs, or fraudulent offers.",
      "Event listings must be genuine and accurate.",
    ],
  },
  {
    icon: Ban,
    title: "Prohibited Content",
    items: [
      "No explicit, pornographic, or sexually suggestive content.",
      "No glorification of violence or illegal activities.",
      "No content promoting drug use or substance abuse.",
    ],
  },
  {
    icon: Eye,
    title: "Moderation & Enforcement",
    items: [
      "Our team reviews reports within 24 hours.",
      "Violations result in warnings, temporary suspensions, or permanent bans.",
      "Repeated offenses lead to account termination.",
      "You can appeal moderation decisions by contacting support.",
    ],
  },
];

const CommunityGuidelines = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <h1 className="font-display text-lg font-bold text-foreground">Community Guidelines</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center mx-auto">
            <Shield size={28} className="text-primary-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">Our Community Standards</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            AfroHub is built on trust, respect, and unity. These guidelines help keep our community safe for everyone.
          </p>
        </div>

        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon size={16} className="text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        <p className="text-center text-xs text-muted-foreground pb-8">
          By using AfroHub, you agree to follow these guidelines.<br />
          Last updated: March 2026
        </p>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
