import { useState } from "react";
import { X, Ticket, Minus, Plus, Loader2 } from "lucide-react";
import { useTicketTypes, useCreateCheckout } from "@/hooks/useTickets";

interface TicketPurchaseSheetProps {
  eventId: string;
  eventTitle: string;
  open: boolean;
  onClose: () => void;
}

const TicketPurchaseSheet = ({ eventId, eventTitle, open, onClose }: TicketPurchaseSheetProps) => {
  const { data: ticketTypes = [], isLoading } = useTicketTypes(eventId);
  const checkout = useCreateCheckout();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!open) return null;

  const selectedType = ticketTypes.find((t: any) => t.id === selectedTicket);
  const available = selectedType ? selectedType.quantity_total - selectedType.quantity_sold : 0;

  const handleCheckout = () => {
    if (!selectedTicket) return;
    checkout.mutate({ ticketTypeId: selectedTicket, quantity });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm mx-4 mb-8 sm:mb-0 bg-card rounded-2xl border border-border shadow-2xl p-5 animate-slide-up">
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-secondary">
          <X size={18} className="text-muted-foreground" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Ticket size={20} className="text-primary" />
          <h3 className="font-display font-bold text-foreground text-base pr-8 leading-tight">
            {eventTitle}
          </h3>
        </div>

        {isLoading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="animate-spin text-primary" size={24} />
          </div>
        ) : ticketTypes.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No tickets available for this event yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ticketTypes.map((tt: any) => {
              const avail = tt.quantity_total - tt.quantity_sold;
              const isSelected = selectedTicket === tt.id;
              return (
                <button
                  key={tt.id}
                  onClick={() => { setSelectedTicket(tt.id); setQuantity(1); }}
                  disabled={avail <= 0}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : avail <= 0
                        ? "border-border bg-muted opacity-50 cursor-not-allowed"
                        : "border-border bg-secondary hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{tt.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {avail > 0 ? `${avail} remaining` : "Sold out"}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {tt.price_cents === 0 ? "Free" : `$${(tt.price_cents / 100).toFixed(2)}`}
                    </span>
                  </div>
                </button>
              );
            })}

            {selectedTicket && available > 0 && (
              <>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 rounded-full bg-secondary border border-border hover:bg-muted"
                    >
                      <Minus size={14} className="text-foreground" />
                    </button>
                    <span className="text-sm font-bold text-foreground w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(available, Math.min(10, quantity + 1)))}
                      className="p-1.5 rounded-full bg-secondary border border-border hover:bg-muted"
                    >
                      <Plus size={14} className="text-foreground" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">
                    {selectedType!.price_cents === 0
                      ? "Free"
                      : `$${((selectedType!.price_cents * quantity) / 100).toFixed(2)}`}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkout.isPending}
                  className="w-full py-3 rounded-xl gradient-gold text-primary-foreground font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {checkout.isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Ticket size={16} /> Buy Tickets
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketPurchaseSheet;
