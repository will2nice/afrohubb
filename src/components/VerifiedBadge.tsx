import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  size?: number;
  className?: string;
  type?: "user" | "organizer";
}

const VerifiedBadge = ({ size = 14, className = "", type = "user" }: VerifiedBadgeProps) => {
  return (
    <BadgeCheck
      size={size}
      className={`inline-block shrink-0 ${type === "organizer" ? "text-primary" : "text-blue-500"} ${className}`}
      fill="currentColor"
      stroke="hsl(var(--card))"
    />
  );
};

export default VerifiedBadge;
