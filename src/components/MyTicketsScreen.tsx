import { useState } from "react";
import { ArrowLeft, Ticket, QrCode, Calendar, MapPin, Users, Wine, Clock, ChevronDown, ChevronUp, Download, Send, Share2, Check, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useMyOrders } from "@/hooks/useTickets";
import { useMyReservations } from "@/hooks/useReservations";
import { useTicketTransfers } from "@/hooks/useTicketTransfers";
import { useToast } from "@/hooks/use-toast";

interface MyTicketsScreenProps {
  onBack: () => void;
}

const MyTicketsScreen = ({ onBack }: MyTicketsScreenProps) => {
  const { data: orders, isLoading: ordersLoading } = useMyOrders();
  const { data: reservations, isLoading: resLoading } = useMyReservations();
  const { transferTicket, isPending: transferring } = useTicketTransfers();
  const { toast } = useToast();
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [tab, setTab] = useState<"tickets" | "reservations">("tickets");
  const [transferOrderId, setTransferOrderId] = useState<string | null>(null);
  const [transferEmail, setTransferEmail] = useState("");

  const paidOrders = (orders || []).filter((o: any) => o.status === "paid");

  const handleDownloadPass = (order: any) => {
    const event = order.events;
    const ticketData = {
      eventName: event?.title || "Event",
      date: event?.date ? new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "",
      time: event?.date ? new Date(event.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "",
      venue: event?.location || "",
      ticketType: order.ticket_types?.name || "General Admission",
      quantity: order.quantity,
      total: `$${(order.total_cents / 100).toFixed(2)}`,
      code: order.check_in_code || order.id.slice(0, 12),
      orderId: order.id,
    };

    // Generate a downloadable HTML pass
    const passHTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${ticketData.eventName} - Ticket</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#111;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.pass{background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:24px;max-width:380px;width:100%;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.header{background:linear-gradient(135deg,#d4a574,#c4956a);padding:24px;text-align:center}
.header h1{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#1a1a2e}
.header h2{font-size:20px;font-weight:800;color:#1a1a2e;margin-top:8px;line-height:1.3}
.body{padding:24px}
.row{display:flex;justify-content:space-between;margin-bottom:16px}
.field label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;display:block;margin-bottom:4px}
.field p{font-size:14px;font-weight:600}
.divider{border-top:1px dashed #333;margin:20px 0}
.qr{text-align:center;padding:20px;background:#fff;border-radius:16px;margin:0 auto;width:fit-content}
.qr img{width:180px;height:180px}
.code{text-align:center;margin-top:12px;font-family:monospace;font-size:14px;letter-spacing:3px;color:#d4a574}
.footer{text-align:center;padding:16px;font-size:11px;color:#555}
.badge{display:inline-block;background:#d4a574;color:#1a1a2e;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;margin-top:8px}
</style></head><body>
<div class="pass">
<div class="header">
<h1>🎫 AfroHub Ticket</h1>
<h2>${ticketData.eventName}</h2>
<span class="badge">${ticketData.ticketType} × ${ticketData.quantity}</span>
</div>
<div class="body">
<div class="row"><div class="field"><label>Date</label><p>${ticketData.date}</p></div><div class="field"><label>Time</label><p>${ticketData.time}</p></div></div>
<div class="row"><div class="field"><label>Venue</label><p>${ticketData.venue}</p></div><div class="field"><label>Total Paid</label><p>${ticketData.total}</p></div></div>
<div class="divider"></div>
<div class="qr"><svg id="qr"></svg></div>
<p class="code">${ticketData.code}</p>
</div>
<div class="footer">Show this pass at the door • AfroHub</div>
</div>
<script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"><\/script>
<script>
QRCode.toCanvas(document.createElement('canvas'),${JSON.stringify(ticketData.code)},{width:180,margin:0},function(err,canvas){
if(!err){var img=document.createElement('img');img.src=canvas.toDataURL();document.querySelector('.qr').innerHTML='';document.querySelector('.qr').appendChild(img);}
});
<\/script>
</body></html>`;

    const blob = new Blob([passHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ticket-${ticketData.code}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Ticket downloaded! 🎫", description: "Open the file to view your pass" });
  };

  const handleTransfer = async (orderId: string) => {
    if (!transferEmail.trim()) return;
    try {
      await transferTicket({ orderId, toEmail: transferEmail.trim() });
      toast({ title: "Ticket transfer sent! ✉️", description: `Transfer request sent to ${transferEmail}` });
      setTransferOrderId(null);
      setTransferEmail("");
    } catch (err: any) {
      toast({ title: "Transfer failed", description: err.message, variant: "destructive" });
    }
  };

  const handleShare = async (order: any) => {
    const event = order.events;
    const text = `🎫 I'm going to ${event?.title || "an event"}! ${event?.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""} at ${event?.location || ""}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: event?.title || "My Ticket", text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard! 📋" });
    }
  };

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
                const isTransferring = transferOrderId === order.id;
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
                            <span className="text-xs font-semibold text-foreground ml-auto">${(order.total_cents / 100).toFixed(2)}</span>
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

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 mt-4 w-full">
                          <button
                            onClick={() => handleDownloadPass(order)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                          >
                            <Download size={14} /> Save Pass
                          </button>
                          <button
                            onClick={() => setTransferOrderId(isTransferring ? null : order.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                          >
                            <Send size={14} /> Transfer
                          </button>
                          <button
                            onClick={() => handleShare(order)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                          >
                            <Share2 size={14} /> Share
                          </button>
                        </div>

                        {/* Transfer form */}
                        {isTransferring && (
                          <div className="mt-3 w-full flex gap-2">
                            <input
                              type="email"
                              placeholder="Recipient's email"
                              value={transferEmail}
                              onChange={(e) => setTransferEmail(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <button
                              onClick={() => handleTransfer(order.id)}
                              disabled={transferring || !transferEmail.trim()}
                              className="px-4 py-2 rounded-xl gradient-gold text-primary-foreground text-sm font-semibold disabled:opacity-50 flex items-center gap-1"
                            >
                              {transferring ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                              Send
                            </button>
                          </div>
                        )}
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
