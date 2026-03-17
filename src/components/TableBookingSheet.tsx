import { useState } from "react";
import { X, Users, Clock, Package, Loader2, ChevronDown, ChevronUp, StickyNote } from "lucide-react";
import { useTableTypes, useBottlePackages, useCreateReservation } from "@/hooks/useReservations";

interface TableBookingSheetProps {
  eventId: string;
  eventTitle: string;
  open: boolean;
  onClose: () => void;
}

const TableBookingSheet = ({ eventId, eventTitle, open, onClose }: TableBookingSheetProps) => {
  const { data: tables, isLoading: tablesLoading } = useTableTypes(eventId);
  const { data: bottles, isLoading: bottlesLoading } = useBottlePackages(eventId);
  const createReservation = useCreateReservation();

  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedBottle, setSelectedBottle] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(2);
  const [arrivalTime, setArrivalTime] = useState("10:00 PM");
  const [specialNotes, setSpecialNotes] = useState("");
  const [showBottles, setShowBottles] = useState(false);

  if (!open) return null;

  const selectedTableData = tables?.find((t: any) => t.id === selectedTable);
  const selectedBottleData = bottles?.find((b: any) => b.id === selectedBottle);
  const tableCents = selectedTableData?.price_cents || 0;
  const bottleCents = selectedBottleData?.price_cents || 0;
  const totalCents = tableCents + bottleCents;
  const depositCents = selectedTableData?.deposit_cents || 0;

  const handleBook = () => {
    createReservation.mutate(
      {
        event_id: eventId,
        table_type_id: selectedTable,
        bottle_package_id: selectedBottle,
        guest_count: guestCount,
        arrival_time: arrivalTime,
        special_notes: specialNotes,
        total_cents: totalCents,
      },
      { onSuccess: () => onClose() }
    );
  };

  const arrivalTimes = ["9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM", "12:00 AM"];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-t-3xl border-t border-border shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-display font-bold text-foreground text-lg">Book a Table</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{eventTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary"><X size={20} className="text-muted-foreground" /></button>
        </div>

        <div className="p-5 space-y-6">
          {/* Table Selection */}
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users size={16} className="text-primary" /> Select Table
            </h3>
            {tablesLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
            ) : !tables?.length ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No tables available for this event.</p>
            ) : (
              <div className="space-y-2">
                {tables.map((t: any) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTable(selectedTable === t.id ? null : t.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedTable === t.id ? "border-primary bg-primary/10" : "border-border bg-secondary hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Up to {t.capacity} guests{t.description ? ` · ${t.description}` : ""}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground text-sm">${(t.price_cents / 100).toFixed(0)}</p>
                        {t.deposit_cents > 0 && (
                          <p className="text-[10px] text-primary">${(t.deposit_cents / 100).toFixed(0)} deposit</p>
                        )}
                        <p className="text-[10px] text-muted-foreground">{t.quantity_available}/{t.quantity_total} left</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Guest Count */}
          {selectedTable && (
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users size={16} className="text-primary" /> Guests
              </h3>
              <div className="flex items-center gap-4 bg-secondary rounded-xl p-3 border border-border">
                <button
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground font-bold"
                >−</button>
                <span className="text-lg font-bold text-foreground min-w-[2rem] text-center">{guestCount}</span>
                <button
                  onClick={() => setGuestCount(Math.min(selectedTableData?.capacity || 20, guestCount + 1))}
                  className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground font-bold"
                >+</button>
                <span className="text-xs text-muted-foreground ml-auto">max {selectedTableData?.capacity}</span>
              </div>
            </section>
          )}

          {/* Arrival Time */}
          {selectedTable && (
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock size={16} className="text-primary" /> Arrival Time
              </h3>
              <div className="flex gap-2 flex-wrap">
                {arrivalTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setArrivalTime(time)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      arrivalTime === time ? "gradient-gold text-primary-foreground" : "bg-secondary text-muted-foreground border border-border hover:bg-muted"
                    }`}
                  >{time}</button>
                ))}
              </div>
            </section>
          )}

          {/* Bottle Packages */}
          {selectedTable && (
            <section>
              <button onClick={() => setShowBottles(!showBottles)} className="flex items-center gap-2 text-sm font-semibold text-foreground w-full">
                <Package size={16} className="text-primary" /> Add-ons & Extras
                {showBottles ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
              </button>
              {showBottles && (
                <div className="mt-3 space-y-2">
                  {bottlesLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mx-auto" />
                  ) : !bottles?.length ? (
                    <p className="text-xs text-muted-foreground text-center py-2">No add-ons available.</p>
                  ) : (
                    bottles.map((b: any) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBottle(selectedBottle === b.id ? null : b.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          selectedBottle === b.id ? "border-primary bg-primary/10" : "border-border bg-secondary hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-foreground text-sm">{b.name}</p>
                            {b.description && <p className="text-[11px] text-muted-foreground mt-0.5">{b.description}</p>}
                            {b.includes?.length > 0 && (
                              <p className="text-[10px] text-primary mt-1">{(b.includes as string[]).join(" · ")}</p>
                            )}
                          </div>
                          <p className="font-bold text-foreground text-sm">${(b.price_cents / 100).toFixed(0)}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </section>
          )}

          {/* Special Notes */}
          {selectedTable && (
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <StickyNote size={16} className="text-primary" /> Special Notes
              </h3>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Birthday, anniversary, dietary needs..."
                className="w-full p-3 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </section>
          )}

          {/* Total + Book */}
          {selectedTable && (
            <div className="bg-secondary rounded-2xl p-4 border border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Table</span>
                <span className="text-foreground font-medium">${(tableCents / 100).toFixed(0)}</span>
              </div>
              {selectedBottle && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Add-on</span>
                  <span className="text-foreground font-medium">${(bottleCents / 100).toFixed(0)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-foreground text-lg">${(totalCents / 100).toFixed(0)}</span>
              </div>
              {depositCents > 0 && (
                <p className="text-xs text-primary text-center">Deposit required: ${(depositCents / 100).toFixed(0)}</p>
              )}
              <button
                onClick={handleBook}
                disabled={createReservation.isPending}
                className="w-full py-3 rounded-xl gradient-gold text-primary-foreground font-semibold text-sm shadow-gold hover:scale-[1.02] active:scale-[0.98] transition-all mt-2 flex items-center justify-center gap-2"
              >
                {createReservation.isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                Confirm Reservation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableBookingSheet;
