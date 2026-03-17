import { useState } from "react";
import { ArrowLeft, QrCode, Search, UserCheck, Users, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useEventCheckIns, useCheckIn, useLookupCheckInCode } from "@/hooks/useCheckIns";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";

interface CheckInScreenProps {
  onBack: () => void;
}

const CheckInScreen = ({ onBack }: CheckInScreenProps) => {
  const { user } = useAuth();
  const { events } = useEvents();
  const myEvents = events.filter((e) => e.creator_id === user?.id);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(myEvents[0]?.id || null);
  const { data: checkIns, isLoading: checkInsLoading } = useEventCheckIns(selectedEventId || undefined);
  const checkIn = useCheckIn();
  const lookup = useLookupCheckInCode();

  const [codeInput, setCodeInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [lookupResult, setLookupResult] = useState<any>(null);

  const handleLookup = () => {
    if (!codeInput.trim()) return;
    lookup.mutate(codeInput.trim(), {
      onSuccess: (result) => setLookupResult(result),
      onError: () => setLookupResult(null),
    });
  };

  const handleCheckInFromLookup = () => {
    if (!lookupResult || !selectedEventId) return;
    const d = lookupResult.data;
    checkIn.mutate(
      {
        event_id: selectedEventId,
        user_id: d.user_id,
        order_id: lookupResult.type === "order" ? d.id : undefined,
        reservation_id: lookupResult.type === "reservation" ? d.id : undefined,
        method: "qr",
      },
      { onSuccess: () => { setLookupResult(null); setCodeInput(""); } }
    );
  };

  const handleManualCheckIn = (userId: string) => {
    if (!selectedEventId) return;
    checkIn.mutate({ event_id: selectedEventId, user_id: userId, method: "manual" });
  };

  const checkedInIds = new Set((checkIns || []).map((c: any) => c.user_id));
  const totalCheckedIn = checkIns?.length || 0;

  const filteredCheckIns = (checkIns || []).filter((c: any) =>
    !searchQuery || (c.profiles as any)?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-foreground"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-bold text-foreground font-['Space_Grotesk']">Check-In</h1>
      </header>

      <div className="p-4 space-y-5">
        {/* Event Selector */}
        {myEvents.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {myEvents.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setSelectedEventId(ev.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedEventId === ev.id ? "gradient-gold text-primary-foreground" : "bg-secondary text-muted-foreground border border-border"
                }`}
              >{ev.title}</button>
            ))}
          </div>
        )}

        {/* Live count */}
        <div className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-foreground">{totalCheckedIn}</p>
            <p className="text-xs text-muted-foreground">checked in</p>
          </div>
          <div className="w-14 h-14 rounded-full gradient-gold flex items-center justify-center">
            <Users size={24} className="text-primary-foreground" />
          </div>
        </div>

        {/* QR / Code Scanner */}
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <QrCode size={16} className="text-primary" /> Scan or Enter Code
          </h3>
          <div className="flex gap-2">
            <input
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              placeholder="Enter ticket code..."
              className="flex-1 px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleLookup}
              disabled={lookup.isPending || !codeInput.trim()}
              className="px-4 py-2.5 rounded-xl gradient-gold text-primary-foreground text-sm font-semibold"
            >
              {lookup.isPending ? <Loader2 size={16} className="animate-spin" /> : "Lookup"}
            </button>
          </div>

          {lookup.isError && (
            <div className="flex items-center gap-2 text-destructive text-xs">
              <XCircle size={14} /> Invalid code — no ticket found
            </div>
          )}

          {lookupResult && (
            <div className="bg-secondary rounded-xl p-4 border border-border space-y-2 animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {(lookupResult.data.profiles as any)?.avatar_url ? (
                    <img src={(lookupResult.data.profiles as any).avatar_url} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <UserCheck size={18} className="text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{(lookupResult.data.profiles as any)?.display_name || "Guest"}</p>
                  <p className="text-xs text-muted-foreground">
                    {lookupResult.type === "order"
                      ? `${lookupResult.data.ticket_types?.name || "Ticket"} × ${lookupResult.data.quantity}`
                      : `Table: ${lookupResult.data.table_types?.name || "Table"} · ${lookupResult.data.guest_count} guests`}
                  </p>
                </div>
                {checkedInIds.has(lookupResult.data.user_id) ? (
                  <span className="flex items-center gap-1 text-xs text-green-500 font-medium"><CheckCircle size={14} /> In</span>
                ) : (
                  <button
                    onClick={handleCheckInFromLookup}
                    disabled={checkIn.isPending}
                    className="px-3 py-1.5 rounded-full gradient-gold text-primary-foreground text-xs font-semibold"
                  >
                    {checkIn.isPending ? <Loader2 size={14} className="animate-spin" /> : "Check In"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Checked-in list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Attendance Log</h3>
          </div>
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search attendees..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {checkInsLoading ? (
            <div className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" /></div>
          ) : filteredCheckIns.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle size={28} className="text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-xs text-muted-foreground">No check-ins yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCheckIns.map((c: any) => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{(c.profiles as any)?.display_name || "Guest"}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(c.checked_in_at).toLocaleTimeString()} · {c.method}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInScreen;
