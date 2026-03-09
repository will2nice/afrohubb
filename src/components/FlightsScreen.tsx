import { useState, useMemo } from "react";
import { Plane, ArrowRight, Clock, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { type City } from "@/data/cityData";
import { getFlightDeals, type FlightDeal } from "@/data/flightData";
import CityPicker from "@/components/CityPicker";

interface FlightsScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

type SortKey = "price" | "duration" | "stops";

const FlightsScreen = ({ selectedCity, onCityChange }: FlightsScreenProps) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("price");

  const deals = useMemo(() => getFlightDeals(selectedCity.id), [selectedCity.id]);

  const filtered = useMemo(() => {
    let list = deals;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.destination.toLowerCase().includes(q) ||
          d.airline.toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "stops") return a.stops - b.stops;
      return a.duration.localeCompare(b.duration);
    });
    return list;
  }, [deals, search, sortBy]);

  const getPriceColor = (price: number) => {
    if (price < 200) return "text-green-400";
    if (price < 500) return "text-primary";
    return "text-orange-400";
  };

  return (
    <div className="min-h-screen bg-background pb-36">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Plane size={20} className="text-primary" />
                Flights
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                From {selectedCity.flag} {selectedCity.name}
              </p>
            </div>
            <CityPicker selectedCity={selectedCity} onCityChange={onCityChange} />
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search destination or airline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Sort pills */}
          <div className="flex gap-2 pb-2">
            {([
              { key: "price" as SortKey, label: "Cheapest" },
              { key: "duration" as SortKey, label: "Fastest" },
              { key: "stops" as SortKey, label: "Fewest Stops" },
            ]).map((s) => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  sortBy === s.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Flight cards */}
      <div className="px-4 pt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No flights found matching "{search}"
          </div>
        ) : (
          filtered.map((deal) => (
            <FlightCard key={deal.id} deal={deal} priceColor={getPriceColor(deal.price)} />
          ))
        )}
      </div>
    </div>
  );
};

const FlightCard = ({ deal, priceColor }: { deal: FlightDeal; priceColor: string }) => (
  <div className="bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-all">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{deal.destinationFlag}</span>
        <div>
          <h3 className="text-sm font-bold text-foreground">{deal.destination}</h3>
          <p className="text-xs text-muted-foreground">{deal.airline}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-xl font-black ${priceColor}`}>${deal.price}</p>
        <p className="text-[10px] text-muted-foreground">round trip</p>
      </div>
    </div>

    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <Plane size={12} />
        <span>{deal.departDate}</span>
        <ArrowRight size={10} />
        <span>{deal.returnDate}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock size={12} />
        <span>{deal.duration}</span>
      </div>
      <div className="flex items-center gap-1">
        <RotateCcw size={12} />
        <span>{deal.stops === 0 ? "Nonstop" : `${deal.stops} stop`}</span>
      </div>
    </div>
  </div>
);

export default FlightsScreen;
