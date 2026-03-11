import { getProfileCompleteness } from "@/hooks/useTrustSafety";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

interface ProfileCompletenessProps {
  profile: any;
  compact?: boolean;
  onEditProfile?: () => void;
}

const ProfileCompleteness = ({ profile, compact = false, onEditProfile }: ProfileCompletenessProps) => {
  const { percentage, missing } = getProfileCompleteness(profile);

  if (percentage === 100) {
    if (compact) return null;
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <CheckCircle2 size={16} className="text-emerald-500" />
        <span className="text-xs font-medium text-emerald-600">Profile complete!</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Progress value={percentage} className="h-1.5 flex-1" />
        <span className="text-[10px] font-bold text-muted-foreground">{percentage}%</span>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Profile completeness</p>
        <span className="text-sm font-bold text-primary">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
      {missing.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Missing:</p>
          <div className="flex flex-wrap gap-1.5">
            {missing.slice(0, 4).map((m) => (
              <span key={m} className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">
                {m}
              </span>
            ))}
            {missing.length > 4 && (
              <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">
                +{missing.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
      {onEditProfile && (
        <button onClick={onEditProfile} className="w-full py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
          Complete your profile
        </button>
      )}
    </div>
  );
};

export default ProfileCompleteness;
