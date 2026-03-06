import { useState } from "react";
import { ArrowLeft, Plus, Ticket, DollarSign, TrendingUp, ExternalLink, Loader2, Trash2, Edit3, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEvents } from "@/hooks/useEvents";
import { useTicketTypes, usePromoterStripeAccount, useStripeConnectOnboard, useMyOrders } from "@/hooks/useTickets";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface PromoterDashboardProps {
  onBack: () => void;
}

const PromoterDashboard = ({ onBack }: PromoterDashboardProps) => {
  const { user } = useAuth();
  const { events } = useEvents();
  const stripeAccount = usePromoterStripeAccount();
  const stripeOnboard = useStripeConnectOnboard();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const myEvents = events.filter((e) => e.creator_id === user?.id);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground font-['Space_Grotesk']">Promoter Dashboard</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Stripe Connect Status */}
        <StripeConnectCard
          account={stripeAccount.data}
          loading={stripeAccount.isLoading}
          onOnboard={() => stripeOnboard.mutate()}
          onboarding={stripeOnboard.isPending}
        />

        {/* My Events */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">My Events</h2>
          {myEvents.length === 0 ? (
            <Card className="border-dashed border-border">
              <CardContent className="p-6 text-center text-muted-foreground text-sm">
                No events yet. Create an event from the Events tab to get started.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {myEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEventId(selectedEventId === event.id ? null : event.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${
                    selectedEventId === event.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-foreground text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.city} · {new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <Ticket className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ticket Management for selected event */}
        {selectedEventId && (
          <TicketManager eventId={selectedEventId} />
        )}

        {/* Sales Overview */}
        <SalesOverview userId={user?.id} />
      </div>
    </div>
  );
};

/* ─── Stripe Connect Card ─── */
const StripeConnectCard = ({
  account,
  loading,
  onOnboard,
  onboarding,
}: {
  account: any;
  loading: boolean;
  onOnboard: () => void;
  onboarding: boolean;
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const isOnboarded = account?.onboarding_complete;

  return (
    <Card className={isOnboarded ? "border-primary/30" : "border-accent/40"}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          Payout Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isOnboarded ? (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-foreground">Stripe Connected — Payouts active</span>
          </div>
        ) : account ? (
          <>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">Onboarding incomplete</span>
            </div>
            <Button size="sm" onClick={onOnboard} disabled={onboarding} className="w-full">
              {onboarding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ExternalLink className="w-4 h-4 mr-2" />}
              Complete Stripe Setup
            </Button>
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              Connect your Stripe account to receive payouts from ticket sales. AfroHub handles all payments — funds go directly to you.
            </p>
            <Button size="sm" onClick={onOnboard} disabled={onboarding} className="w-full">
              {onboarding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ExternalLink className="w-4 h-4 mr-2" />}
              Set Up Stripe Connect
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

/* ─── Ticket Manager ─── */
const TicketManager = ({ eventId }: { eventId: string }) => {
  const { data: tickets, isLoading } = useTicketTypes(eventId);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("General Admission");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("100");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    setSaving(true);
    const priceCents = Math.round(parseFloat(price || "0") * 100);
    const { error } = await supabase.from("ticket_types").insert({
      event_id: eventId,
      name,
      price_cents: priceCents,
      currency: "usd",
      quantity_total: parseInt(qty) || 100,
      quantity_sold: 0,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Ticket type added" });
      setAdding(false);
      setName("General Admission");
      setPrice("");
      setQty("100");
      queryClient.invalidateQueries({ queryKey: ["ticket_types", eventId] });
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("ticket_types").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["ticket_types", eventId] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-foreground">Ticket Types</h2>
        <Button size="sm" variant="outline" onClick={() => setAdding(!adding)}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      {adding && (
        <Card className="mb-3">
          <CardContent className="p-4 space-y-3">
            <div>
              <Label className="text-xs">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. VIP, Early Bird" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Price ($)</Label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <Label className="text-xs">Quantity</Label>
                <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
              </div>
            </div>
            <Button size="sm" onClick={handleAdd} disabled={saving} className="w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Ticket Type
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : tickets && tickets.length > 0 ? (
        <div className="space-y-2">
          {tickets.map((t: any) => (
            <Card key={t.id}>
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ${(t.price_cents / 100).toFixed(2)} · {t.quantity_sold}/{t.quantity_total} sold
                  </p>
                </div>
                <button onClick={() => handleDelete(t.id)} className="text-destructive hover:text-destructive/80">
                  <Trash2 className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No ticket types yet.</p>
      )}
    </div>
  );
};

/* ─── Sales Overview ─── */
const SalesOverview = ({ userId }: { userId?: string }) => {
  const { data: orders, isLoading } = useMyOrders();

  // Filter to orders for events this user created
  const myEventOrders = (orders || []).filter(
    (o: any) => o.events?.creator_id === userId && o.status === "paid"
  );

  const totalRevenue = myEventOrders.reduce((sum: number, o: any) => sum + (o.total_cents || 0), 0);
  const totalFees = myEventOrders.reduce((sum: number, o: any) => sum + (o.application_fee_cents || 0), 0);
  const totalTicketsSold = myEventOrders.reduce((sum: number, o: any) => sum + (o.quantity || 0), 0);
  const netPayout = totalRevenue - totalFees;

  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" /> Sales Overview
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{totalTicketsSold}</p>
                <p className="text-xs text-muted-foreground">Tickets Sold</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">${(totalRevenue / 100).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Gross Revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-destructive">${(totalFees / 100).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Platform Fees</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-500">${(netPayout / 100).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Net Payout</p>
              </CardContent>
            </Card>
          </div>

          {myEventOrders.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Recent Sales</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {myEventOrders.slice(0, 10).map((o: any) => (
                    <div key={o.id} className="px-4 py-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-foreground">{o.ticket_types?.name || "Ticket"}</p>
                        <p className="text-xs text-muted-foreground">
                          {o.events?.title} · x{o.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-foreground">${(o.total_cents / 100).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PromoterDashboard;
