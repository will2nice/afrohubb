import { useState } from "react";
import { ChevronDown, ChevronUp, Package, ShoppingBag, Loader2, Check } from "lucide-react";
import { useBottlePackages, useCreateReservation } from "@/hooks/useReservations";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface EventAddOnsProps {
  eventId: string;
}

const EventAddOns = ({ eventId }: EventAddOnsProps) => {
  const { data: addons, isLoading } = useBottlePackages(eventId);
  const [expanded, setExpanded] = useState(false);
  const [orderingId, setOrderingId] = useState<string | null>(null);
  const [orderedIds, setOrderedIds] = useState<Set<string>>(new Set());
  const createReservation = useCreateReservation();
  const { user } = useAuth();
  const { toast } = useToast();

  if (isLoading || !addons?.length) return null;

  const handlePreOrder = async (addon: any) => {
    if (!user) {
      toast({ title: "Sign in to pre-order", description: "Create an account to place pre-orders.", variant: "destructive" });
      return;
    }
    setOrderingId(addon.id);
    try {
      await createReservation.mutateAsync({
        event_id: eventId,
        table_type_id: null,
        bottle_package_id: addon.id,
        guest_count: 1,
        arrival_time: "",
        special_notes: `Pre-order: ${addon.name}`,
        total_cents: addon.price_cents,
      });
      setOrderedIds((prev) => new Set(prev).add(addon.id));
    } catch {
      // toast handled by hook
    } finally {
      setOrderingId(null);
    }
  };

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs font-semibold text-primary w-full"
      >
        <Package size={13} />
        <span>{addons.length} add-on{addons.length > 1 ? "s" : ""} available · Pre-order now</span>
        {expanded ? <ChevronUp size={13} className="ml-auto" /> : <ChevronDown size={13} className="ml-auto" />}
      </button>
      {expanded && (
        <div className="mt-2 space-y-1.5">
          {addons.map((a: any) => {
            const isOrdering = orderingId === a.id;
            const isOrdered = orderedIds.has(a.id);

            return (
              <div key={a.id} className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 border border-border">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate">{a.name}</p>
                  {a.description && <p className="text-[10px] text-muted-foreground truncate">{a.description}</p>}
                  {a.includes?.length > 0 && (
                    <p className="text-[10px] text-primary mt-0.5 truncate">{(a.includes as string[]).join(" · ")}</p>
                  )}
                </div>
                <span className="text-xs font-bold text-foreground whitespace-nowrap">
                  ${(a.price_cents / 100).toFixed(0)}
                </span>
                {isOrdered ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-green-500 whitespace-nowrap">
                    <Check size={12} /> Ordered
                  </span>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePreOrder(a); }}
                    disabled={isOrdering}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold gradient-gold text-primary-foreground shadow-gold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    {isOrdering ? <Loader2 size={10} className="animate-spin" /> : <ShoppingBag size={10} />}
                    Pre-order
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventAddOns;
