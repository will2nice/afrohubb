import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DollarSign, Ticket, UtensilsCrossed, Sparkles, TrendingUp,
  Calendar, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RevenueStream {
  label: string;
  icon: React.ReactNode;
  totalCents: number;
  count: number;
  feeRate: number; // platform take rate
  color: string;
}

interface DailyRevenue {
  day: string;
  totalCents: number;
}

const RevenueAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [ticketRevenue, setTicketRevenue] = useState({ totalCents: 0, feeCents: 0, count: 0 });
  const [tableRevenue, setTableRevenue] = useState({ totalCents: 0, feeCents: 0, count: 0 });
  const [conciergeRevenue, setConciergeRevenue] = useState({ totalCents: 0, count: 0 });
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("30d");

  const fetchRevenue = async () => {
    setLoading(true);

    const cutoff = period === "all"
      ? "2020-01-01"
      : new Date(Date.now() - (period === "7d" ? 7 : 30) * 86400000).toISOString();

    const [ordersRes, reservationsRes, conciergeRes] = await Promise.all([
      supabase
        .from("orders")
        .select("total_cents, application_fee_cents, quantity, created_at, status")
        .eq("status", "completed")
        .gte("created_at", cutoff),
      supabase
        .from("reservations")
        .select("total_cents, deposit_paid_cents, created_at, status")
        .in("status", ["confirmed", "completed"])
        .gte("created_at", cutoff),
      supabase
        .from("concierge_requests")
        .select("payment_status, created_at")
        .eq("payment_status", "paid")
        .gte("created_at", cutoff),
    ]);

    // Ticket revenue
    const orders = ordersRes.data || [];
    const ticketTotal = orders.reduce((s, o) => s + (o.total_cents || 0), 0);
    const ticketFees = orders.reduce((s, o) => s + (o.application_fee_cents || 0), 0);

    // Table/VIP revenue (10% platform fee)
    const reservations = reservationsRes.data || [];
    const tableTotal = reservations.reduce((s, r) => s + (r.total_cents || 0), 0);
    const tableFees = Math.round(tableTotal * 0.1);

    // Concierge ($25 flat = 2500 cents each)
    const conciergeCount = (conciergeRes.data || []).length;
    const conciergeTotal = conciergeCount * 2500;

    setTicketRevenue({ totalCents: ticketTotal, feeCents: ticketFees, count: orders.length });
    setTableRevenue({ totalCents: tableTotal, feeCents: tableFees, count: reservations.length });
    setConciergeRevenue({ totalCents: conciergeTotal, count: conciergeCount });

    // Daily revenue aggregation
    const dayMap = new Map<string, number>();
    orders.forEach((o) => {
      const day = new Date(o.created_at).toISOString().split("T")[0];
      dayMap.set(day, (dayMap.get(day) || 0) + (o.application_fee_cents || 0));
    });
    reservations.forEach((r) => {
      const day = new Date(r.created_at).toISOString().split("T")[0];
      dayMap.set(day, (dayMap.get(day) || 0) + Math.round((r.total_cents || 0) * 0.1));
    });
    (conciergeRes.data || []).forEach((c: any) => {
      const day = new Date(c.created_at).toISOString().split("T")[0];
      dayMap.set(day, (dayMap.get(day) || 0) + 2500);
    });

    const sorted = [...dayMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, totalCents]) => ({ day, totalCents }));
    setDailyRevenue(sorted);

    setLoading(false);
  };

  useEffect(() => {
    fetchRevenue();
  }, [period]);

  const formatCurrency = (cents: number) =>
    `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totalPlatformRevenue =
    ticketRevenue.feeCents + tableRevenue.feeCents + conciergeRevenue.totalCents;

  const totalGMV =
    ticketRevenue.totalCents + tableRevenue.totalCents + conciergeRevenue.totalCents;

  const streams: RevenueStream[] = [
    {
      label: "Ticket Sales",
      icon: <Ticket size={16} />,
      totalCents: ticketRevenue.totalCents,
      count: ticketRevenue.count,
      feeRate: ticketRevenue.totalCents > 0
        ? (ticketRevenue.feeCents / ticketRevenue.totalCents) * 100
        : 10,
      color: "bg-primary",
    },
    {
      label: "Table / VIP Bookings",
      icon: <UtensilsCrossed size={16} />,
      totalCents: tableRevenue.totalCents,
      count: tableRevenue.count,
      feeRate: 10,
      color: "bg-amber-500",
    },
    {
      label: "Personal Concierge",
      icon: <Sparkles size={16} />,
      totalCents: conciergeRevenue.totalCents,
      count: conciergeRevenue.count,
      feeRate: 100,
      color: "bg-emerald-500",
    },
  ];

  const maxDaily = Math.max(...dailyRevenue.map((d) => d.totalCents), 1);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground text-sm">Loading revenue data...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <div className="flex gap-2">
        {(["7d", "30d", "all"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              period === p
                ? "gradient-gold text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "All Time"}
          </button>
        ))}
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-emerald-500" />
            <span className="text-xs text-muted-foreground">Platform Revenue</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPlatformRevenue)}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Your take from all streams</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-primary" />
            <span className="text-xs text-muted-foreground">Total GMV</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalGMV)}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Gross merchandise value</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Ticket size={16} className="text-primary" />
            <span className="text-xs text-muted-foreground">Total Orders</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {ticketRevenue.count + tableRevenue.count + conciergeRevenue.count}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-primary" />
            <span className="text-xs text-muted-foreground">Take Rate</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {totalGMV > 0 ? ((totalPlatformRevenue / totalGMV) * 100).toFixed(1) : "0.0"}%
          </p>
        </div>
      </div>

      {/* Revenue by Stream */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <DollarSign size={16} className="text-primary" /> Revenue by Stream
        </h3>
        {streams.map((stream) => {
          const platformCut =
            stream.label === "Ticket Sales"
              ? ticketRevenue.feeCents
              : stream.label === "Table / VIP Bookings"
              ? tableRevenue.feeCents
              : conciergeRevenue.totalCents;
          const pct = totalPlatformRevenue > 0 ? (platformCut / totalPlatformRevenue) * 100 : 0;

          return (
            <div key={stream.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${stream.color}/10 flex items-center justify-center text-foreground`}>
                    {stream.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{stream.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {stream.count} transactions · {stream.feeRate}% take rate
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{formatCurrency(platformCut)}</p>
                  <p className="text-[10px] text-muted-foreground">
                    of {formatCurrency(stream.totalCents)} GMV
                  </p>
                </div>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
          );
        })}
      </div>

      {/* Daily Revenue Chart */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Calendar size={16} className="text-primary" /> Daily Platform Revenue
        </h3>
        {dailyRevenue.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">No revenue recorded yet</p>
        ) : (
          <>
            <div className="flex items-end gap-[2px] h-28">
              {dailyRevenue.map((d) => (
                <div
                  key={d.day}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative"
                >
                  <div
                    className="w-full rounded-t bg-emerald-500/70 hover:bg-emerald-500 transition-colors min-h-[2px]"
                    style={{ height: `${(d.totalCents / maxDaily) * 100}%` }}
                  />
                  <div className="absolute -top-8 bg-card border border-border rounded px-1.5 py-0.5 text-[9px] text-foreground font-medium hidden group-hover:block whitespace-nowrap z-10">
                    {new Date(d.day).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                    : {formatCurrency(d.totalCents)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground">
              <span>
                {new Date(dailyRevenue[0]?.day).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span>
                {new Date(dailyRevenue[dailyRevenue.length - 1]?.day).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Projected Monthly */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <ArrowUpRight size={16} className="text-emerald-500" /> Projected Monthly Revenue
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(() => {
            const daysInPeriod = dailyRevenue.length || 1;
            const dailyAvg = totalPlatformRevenue / daysInPeriod;
            const monthlyProjected = Math.round(dailyAvg * 30);
            const yearlyProjected = Math.round(dailyAvg * 365);
            return (
              <>
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground">Monthly</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(monthlyProjected)}</p>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground">Annual (est.)</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(yearlyProjected)}</p>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
