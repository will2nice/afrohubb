import { useState } from "react";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { useBottlePackages } from "@/hooks/useReservations";

interface EventAddOnsProps {
  eventId: string;
}

const EventAddOns = ({ eventId }: EventAddOnsProps) => {
  const { data: addons, isLoading } = useBottlePackages(eventId);
  const [expanded, setExpanded] = useState(false);

  if (isLoading || !addons?.length) return null;

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs font-semibold text-primary w-full"
      >
        <Package size={13} />
        <span>{addons.length} add-on{addons.length > 1 ? "s" : ""} available</span>
        {expanded ? <ChevronUp size={13} className="ml-auto" /> : <ChevronDown size={13} className="ml-auto" />}
      </button>
      {expanded && (
        <div className="mt-2 space-y-1.5">
          {addons.map((a: any) => (
            <div key={a.id} className="flex items-center justify-between bg-secondary rounded-lg px-3 py-2 border border-border">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate">{a.name}</p>
                {a.description && <p className="text-[10px] text-muted-foreground truncate">{a.description}</p>}
                {a.includes?.length > 0 && (
                  <p className="text-[10px] text-primary mt-0.5 truncate">{(a.includes as string[]).join(" · ")}</p>
                )}
              </div>
              <span className="text-xs font-bold text-foreground ml-3 whitespace-nowrap">
                ${(a.price_cents / 100).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventAddOns;
