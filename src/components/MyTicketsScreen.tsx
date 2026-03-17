import { useState } from "react";
import { ArrowLeft, Ticket, QrCode, Calendar, MapPin, Users, Wine, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useMyOrders } from "@/hooks/useTickets";
import { useMyReservations } from "@/hooks/useReservations";

interface MyTicketsScreenProps {
  onBack: () => void;
}

const MyTicketsScreen = ({ onBack }: MyTicketsScreenProps) => {
  const { data: orders, isLoading: ordersLoading } = useMyOrders();
  const { data: reservations, isLoading: resLoading } = useMyReservations();
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [tab, setTab] = useState<"tickets" | "reservations">("tickets");

  const paidOrders = (orders || []).filter((o: any) => o.status === "paid");

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-foreground"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-bold text-foreground font-['Space_Grotesk']">My Tickets</h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-4">
        <button
          onClick={() => setTab("tickets")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
            tab === "tickets" ? "gradient-gold text-primary-foreground shadow-gold" : "bg-secondary text-muted-foreground border border-border"
          }`}
        >
          <Ticket size={14} className="inline mr-1.5" />Tickets
        </button>
        <button
          onClick={() => setTab("reservations")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
            tab === "reservations" ? "gradient-gold text-primary-foreground shadow-gold" : "bg-secondary text-muted-foreground border border-border"
          }`}
        >
          <Wine size={14} className="inline mr-1.5" />Tables
        </button>
      </div>

      <div className="p-4 space-y-4">
        {tab === "tickets" && (
          <>
            {ordersLoading ? (
              <div className="text-center py-16"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : paidOrders.length === 0 ? (
              <div className="text-center py-16">
                <QrCode size={40} className="text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-sm text-muted-foreground">No tickets yet</p>
                <p className="text-xs text-muted-foreground mt-1">Purchase event tickets to see them here</p>
              </div>
            ) : (
              paidOrders.map((order: any) => {
                const isExpanded = expandedTicket === order.id;
                return (
                  <div key={order.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
                    <button
                      onClick={() => setExpandedTicket(isExpanded ? null : order.id)}
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-display font-bold text-foreground">{order.events?.title || "Event"}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar size={12} className="text-primary" />{order.events?.date ? new Date(order.events.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : ""}</span>
                            <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" />{order.events?.location || ""}</span>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">{order.ticket_types?.name || "Ticket"}</span>
                            <span className="text-xs text-muted-foreground">x{order.quantity}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <QrCode size={20} className="text-primary" />
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-dashed border-border p-6 flex flex-col items-center bg-secondary/50 animate-slide-up">
                        <div className="bg-white p-4 rounded-2xl shadow-lg">
                          <QRCodeSVG
                            value={order.check_in_code || order.id}
                            size={180}
                            level="H"
                            includeMargin
                          />
                        </div>
                        <p className="mt-3 text-xs font-mono text-muted-foreground tracking-widest">{order.check_in_code || order.id.slice(0, 12)}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">Show this QR code at the door</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {tab === "reservations" && (
          <>
            {resLoading ? (
              <div className="text-center py-16"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : !reservations?.length ? (
              <div className="text-center py-16">
                <Wine size={40} className="text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-sm text-muted-foreground">No table reservations</p>
                <p className="text-xs text-muted-foreground mt-1">Book a VIP table to see it here</p>
              </div>
            ) : (
              reservations.map((res: any) => {
                const isExpanded = expandedTicket === res.id;
                return (
                  <div key={res.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
                    <button onClick={() => setExpandedTicket(isExpanded ? null : res.id)} className="w-full text-left p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-display font-bold text-foreground">{(res.events as any)?.title || "Event"}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Users size={12} className="text-primary" />{res.table_types?.name || "Table"}</span>
                            <span className="flex items-center gap-1"><Clock size={12} className="text-primary" />{res.arrival_time}</span>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{res.guest_count} guests</span>
                            {res.bottle_packages && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">{res.bottle_packages.name}</span>}
                            <span className="ml-auto font-bold text-foreground text-sm">${(res.total_cents / 100).toFixed(0)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <QrCode size={20} className="text-primary" />
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-dashed border-border p-6 flex flex-col items-center bg-secondary/50 animate-slide-up">
                        <div className="bg-white p-4 rounded-2xl shadow-lg">
                          <QRCodeSVG value={res.check_in_code || res.id} size={180} level="H" includeMargin />
                        </div>
                        <p className="mt-3 text-xs font-mono text-muted-foreground tracking-widest">{res.check_in_code || res.id.slice(0, 12)}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">Show this QR code at the door</p>
                        {res.special_notes && <p className="mt-2 text-xs text-muted-foreground italic">"{res.special_notes}"</p>}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyTicketsScreen;
