// Mock flight data — prices from a given origin city to popular destinations
export interface FlightDeal {
  id: string;
  destination: string;
  destinationCity: string; // matches cityCoords key
  destinationFlag: string;
  airline: string;
  price: number; // USD
  currency: string;
  departDate: string;
  returnDate: string;
  stops: number;
  duration: string;
}

export interface FlightRoute {
  destinationCity: string;
  destinationName: string;
  destinationFlag: string;
  price: number;
  coords: [number, number];
}

// Generate flights from a given origin
export const getFlightDeals = (originCity: string): FlightDeal[] => {
  const allDeals: Record<string, FlightDeal[]> = {
    austin: [
      { id: "f1", destination: "Lagos, Nigeria", destinationCity: "lagos", destinationFlag: "🇳🇬", airline: "United", price: 847, currency: "USD", departDate: "Apr 15", returnDate: "Apr 25", stops: 1, duration: "16h 30m" },
      { id: "f2", destination: "Accra, Ghana", destinationCity: "accra", destinationFlag: "🇬🇭", airline: "Delta", price: 792, currency: "USD", departDate: "Apr 18", returnDate: "Apr 28", stops: 1, duration: "15h 45m" },
      { id: "f3", destination: "London, UK", destinationCity: "london", destinationFlag: "🇬🇧", airline: "British Airways", price: 485, currency: "USD", departDate: "Apr 12", returnDate: "Apr 22", stops: 0, duration: "9h 40m" },
      { id: "f4", destination: "Paris, France", destinationCity: "paris", destinationFlag: "🇫🇷", airline: "Air France", price: 523, currency: "USD", departDate: "Apr 20", returnDate: "May 1", stops: 1, duration: "11h 15m" },
      { id: "f5", destination: "Atlanta, GA", destinationCity: "atlanta", destinationFlag: "🇺🇸", airline: "Southwest", price: 127, currency: "USD", departDate: "Apr 10", returnDate: "Apr 14", stops: 0, duration: "2h 25m" },
      { id: "f6", destination: "New York, NY", destinationCity: "nyc", destinationFlag: "🇺🇸", airline: "JetBlue", price: 198, currency: "USD", departDate: "Apr 11", returnDate: "Apr 16", stops: 0, duration: "3h 45m" },
      { id: "f7", destination: "Miami, FL", destinationCity: "miami", destinationFlag: "🇺🇸", airline: "American", price: 156, currency: "USD", departDate: "Apr 13", returnDate: "Apr 18", stops: 0, duration: "2h 55m" },
      { id: "f8", destination: "Nairobi, Kenya", destinationCity: "nairobi", destinationFlag: "🇰🇪", airline: "Ethiopian", price: 912, currency: "USD", departDate: "Apr 22", returnDate: "May 3", stops: 1, duration: "18h 20m" },
      { id: "f9", destination: "Johannesburg, SA", destinationCity: "johannesburg", destinationFlag: "🇿🇦", airline: "South African", price: 1045, currency: "USD", departDate: "Apr 25", returnDate: "May 5", stops: 1, duration: "20h 10m" },
      { id: "f10", destination: "Toronto, Canada", destinationCity: "toronto", destinationFlag: "🇨🇦", airline: "Air Canada", price: 245, currency: "USD", departDate: "Apr 14", returnDate: "Apr 20", stops: 0, duration: "3h 30m" },
      { id: "f11", destination: "Kingston, Jamaica", destinationCity: "kingston", destinationFlag: "🇯🇲", airline: "Caribbean Airlines", price: 385, currency: "USD", departDate: "Apr 16", returnDate: "Apr 23", stops: 1, duration: "5h 45m" },
      { id: "f12", destination: "Dakar, Senegal", destinationCity: "dakar", destinationFlag: "🇸🇳", airline: "Delta", price: 875, currency: "USD", departDate: "Apr 19", returnDate: "Apr 29", stops: 1, duration: "14h 30m" },
      { id: "f13", destination: "Chicago, IL", destinationCity: "chicago", destinationFlag: "🇺🇸", airline: "United", price: 142, currency: "USD", departDate: "Apr 10", returnDate: "Apr 15", stops: 0, duration: "2h 50m" },
      { id: "f14", destination: "Los Angeles, CA", destinationCity: "losangeles", destinationFlag: "🇺🇸", airline: "Spirit", price: 119, currency: "USD", departDate: "Apr 12", returnDate: "Apr 17", stops: 0, duration: "3h 15m" },
      { id: "f15", destination: "São Paulo, Brazil", destinationCity: "saopaulo", destinationFlag: "🇧🇷", airline: "LATAM", price: 645, currency: "USD", departDate: "Apr 21", returnDate: "May 2", stops: 1, duration: "12h 40m" },
    ],
    nyc: [
      { id: "f1", destination: "Lagos, Nigeria", destinationCity: "lagos", destinationFlag: "🇳🇬", airline: "Delta", price: 695, currency: "USD", departDate: "Apr 15", returnDate: "Apr 25", stops: 0, duration: "10h 45m" },
      { id: "f2", destination: "Accra, Ghana", destinationCity: "accra", destinationFlag: "🇬🇭", airline: "United", price: 712, currency: "USD", departDate: "Apr 18", returnDate: "Apr 28", stops: 0, duration: "10h 30m" },
      { id: "f3", destination: "London, UK", destinationCity: "london", destinationFlag: "🇬🇧", airline: "British Airways", price: 389, currency: "USD", departDate: "Apr 12", returnDate: "Apr 22", stops: 0, duration: "7h 10m" },
      { id: "f4", destination: "Paris, France", destinationCity: "paris", destinationFlag: "🇫🇷", airline: "Air France", price: 425, currency: "USD", departDate: "Apr 20", returnDate: "May 1", stops: 0, duration: "7h 30m" },
      { id: "f5", destination: "Atlanta, GA", destinationCity: "atlanta", destinationFlag: "🇺🇸", airline: "Delta", price: 98, currency: "USD", departDate: "Apr 10", returnDate: "Apr 14", stops: 0, duration: "2h 15m" },
      { id: "f6", destination: "Miami, FL", destinationCity: "miami", destinationFlag: "🇺🇸", airline: "JetBlue", price: 112, currency: "USD", departDate: "Apr 13", returnDate: "Apr 18", stops: 0, duration: "3h 10m" },
      { id: "f7", destination: "Nairobi, Kenya", destinationCity: "nairobi", destinationFlag: "🇰🇪", airline: "Ethiopian", price: 785, currency: "USD", departDate: "Apr 22", returnDate: "May 3", stops: 1, duration: "16h 20m" },
      { id: "f8", destination: "Toronto, Canada", destinationCity: "toronto", destinationFlag: "🇨🇦", airline: "Air Canada", price: 175, currency: "USD", departDate: "Apr 14", returnDate: "Apr 20", stops: 0, duration: "1h 30m" },
      { id: "f9", destination: "Johannesburg, SA", destinationCity: "johannesburg", destinationFlag: "🇿🇦", airline: "South African", price: 895, currency: "USD", departDate: "Apr 25", returnDate: "May 5", stops: 1, duration: "17h 30m" },
      { id: "f10", destination: "Kingston, Jamaica", destinationCity: "kingston", destinationFlag: "🇯🇲", airline: "JetBlue", price: 289, currency: "USD", departDate: "Apr 16", returnDate: "Apr 23", stops: 0, duration: "3h 45m" },
    ],
    atlanta: [
      { id: "f1", destination: "Lagos, Nigeria", destinationCity: "lagos", destinationFlag: "🇳🇬", airline: "Delta", price: 725, currency: "USD", departDate: "Apr 15", returnDate: "Apr 25", stops: 0, duration: "10h 30m" },
      { id: "f2", destination: "Accra, Ghana", destinationCity: "accra", destinationFlag: "🇬🇭", airline: "Delta", price: 745, currency: "USD", departDate: "Apr 18", returnDate: "Apr 28", stops: 0, duration: "10h 15m" },
      { id: "f3", destination: "London, UK", destinationCity: "london", destinationFlag: "🇬🇧", airline: "Virgin Atlantic", price: 445, currency: "USD", departDate: "Apr 12", returnDate: "Apr 22", stops: 0, duration: "8h 45m" },
      { id: "f4", destination: "New York, NY", destinationCity: "nyc", destinationFlag: "🇺🇸", airline: "Delta", price: 89, currency: "USD", departDate: "Apr 10", returnDate: "Apr 14", stops: 0, duration: "2h 10m" },
      { id: "f5", destination: "Miami, FL", destinationCity: "miami", destinationFlag: "🇺🇸", airline: "Southwest", price: 78, currency: "USD", departDate: "Apr 13", returnDate: "Apr 18", stops: 0, duration: "1h 45m" },
      { id: "f6", destination: "Nairobi, Kenya", destinationCity: "nairobi", destinationFlag: "🇰🇪", airline: "Ethiopian", price: 825, currency: "USD", departDate: "Apr 22", returnDate: "May 3", stops: 1, duration: "17h 00m" },
      { id: "f7", destination: "Kingston, Jamaica", destinationCity: "kingston", destinationFlag: "🇯🇲", airline: "Caribbean Airlines", price: 315, currency: "USD", departDate: "Apr 16", returnDate: "Apr 23", stops: 0, duration: "3h 15m" },
      { id: "f8", destination: "Austin, TX", destinationCity: "austin", destinationFlag: "🇺🇸", airline: "Southwest", price: 95, currency: "USD", departDate: "Apr 11", returnDate: "Apr 16", stops: 0, duration: "2h 30m" },
    ],
    london: [
      { id: "f1", destination: "Lagos, Nigeria", destinationCity: "lagos", destinationFlag: "🇳🇬", airline: "British Airways", price: 420, currency: "USD", departDate: "Apr 15", returnDate: "Apr 25", stops: 0, duration: "6h 30m" },
      { id: "f2", destination: "Accra, Ghana", destinationCity: "accra", destinationFlag: "🇬🇭", airline: "British Airways", price: 395, currency: "USD", departDate: "Apr 18", returnDate: "Apr 28", stops: 0, duration: "6h 15m" },
      { id: "f3", destination: "New York, NY", destinationCity: "nyc", destinationFlag: "🇺🇸", airline: "British Airways", price: 375, currency: "USD", departDate: "Apr 12", returnDate: "Apr 22", stops: 0, duration: "7h 30m" },
      { id: "f4", destination: "Paris, France", destinationCity: "paris", destinationFlag: "🇫🇷", airline: "Eurostar", price: 89, currency: "USD", departDate: "Apr 20", returnDate: "May 1", stops: 0, duration: "2h 15m" },
      { id: "f5", destination: "Nairobi, Kenya", destinationCity: "nairobi", destinationFlag: "🇰🇪", airline: "Kenya Airways", price: 565, currency: "USD", departDate: "Apr 22", returnDate: "May 3", stops: 0, duration: "8h 30m" },
      { id: "f6", destination: "Johannesburg, SA", destinationCity: "johannesburg", destinationFlag: "🇿🇦", airline: "British Airways", price: 625, currency: "USD", departDate: "Apr 25", returnDate: "May 5", stops: 0, duration: "11h 15m" },
      { id: "f7", destination: "Kingston, Jamaica", destinationCity: "kingston", destinationFlag: "🇯🇲", airline: "Virgin Atlantic", price: 485, currency: "USD", departDate: "Apr 16", returnDate: "Apr 23", stops: 0, duration: "10h 00m" },
      { id: "f8", destination: "Amsterdam, NL", destinationCity: "amsterdam", destinationFlag: "🇳🇱", airline: "KLM", price: 65, currency: "USD", departDate: "Apr 14", returnDate: "Apr 20", stops: 0, duration: "1h 15m" },
    ],
    paris: [
      { id: "f1", destination: "Lagos, Nigeria", destinationCity: "lagos", destinationFlag: "🇳🇬", airline: "Air France", price: 445, currency: "USD", departDate: "Apr 15", returnDate: "Apr 25", stops: 0, duration: "6h 45m" },
      { id: "f2", destination: "Dakar, Senegal", destinationCity: "dakar", destinationFlag: "🇸🇳", airline: "Air France", price: 345, currency: "USD", departDate: "Apr 18", returnDate: "Apr 28", stops: 0, duration: "5h 30m" },
      { id: "f3", destination: "London, UK", destinationCity: "london", destinationFlag: "🇬🇧", airline: "Eurostar", price: 85, currency: "USD", departDate: "Apr 12", returnDate: "Apr 22", stops: 0, duration: "2h 15m" },
      { id: "f4", destination: "New York, NY", destinationCity: "nyc", destinationFlag: "🇺🇸", airline: "Air France", price: 415, currency: "USD", departDate: "Apr 20", returnDate: "May 1", stops: 0, duration: "8h 15m" },
      { id: "f5", destination: "Abidjan, Ivory Coast", destinationCity: "abidjan", destinationFlag: "🇨🇮", airline: "Air France", price: 375, currency: "USD", departDate: "Apr 22", returnDate: "May 3", stops: 0, duration: "6h 00m" },
      { id: "f6", destination: "Marrakech, Morocco", destinationCity: "marrakech", destinationFlag: "🇲🇦", airline: "Royal Air Maroc", price: 125, currency: "USD", departDate: "Apr 14", returnDate: "Apr 20", stops: 0, duration: "3h 15m" },
    ],
  };

  // Default fallback — generate generic deals for any city not explicitly listed
  const deals = allDeals[originCity];
  if (deals) return deals;

  // Fallback generic flights
  return [
    { id: "f1", destination: "Lagos, Nigeria", destinationCity: "lagos", destinationFlag: "🇳🇬", airline: "Ethiopian", price: 850, currency: "USD", departDate: "Apr 15", returnDate: "Apr 25", stops: 1, duration: "14h 30m" },
    { id: "f2", destination: "Accra, Ghana", destinationCity: "accra", destinationFlag: "🇬🇭", airline: "Delta", price: 795, currency: "USD", departDate: "Apr 18", returnDate: "Apr 28", stops: 1, duration: "13h 45m" },
    { id: "f3", destination: "London, UK", destinationCity: "london", destinationFlag: "🇬🇧", airline: "British Airways", price: 520, currency: "USD", departDate: "Apr 12", returnDate: "Apr 22", stops: 1, duration: "10h 30m" },
    { id: "f4", destination: "New York, NY", destinationCity: "nyc", destinationFlag: "🇺🇸", airline: "United", price: 285, currency: "USD", departDate: "Apr 10", returnDate: "Apr 14", stops: 0, duration: "4h 00m" },
    { id: "f5", destination: "Nairobi, Kenya", destinationCity: "nairobi", destinationFlag: "🇰🇪", airline: "Kenya Airways", price: 920, currency: "USD", departDate: "Apr 22", returnDate: "May 3", stops: 1, duration: "17h 15m" },
    { id: "f6", destination: "Atlanta, GA", destinationCity: "atlanta", destinationFlag: "🇺🇸", airline: "Delta", price: 165, currency: "USD", departDate: "Apr 11", returnDate: "Apr 16", stops: 0, duration: "3h 00m" },
    { id: "f7", destination: "Paris, France", destinationCity: "paris", destinationFlag: "🇫🇷", airline: "Air France", price: 545, currency: "USD", departDate: "Apr 20", returnDate: "May 1", stops: 1, duration: "11h 00m" },
    { id: "f8", destination: "Kingston, Jamaica", destinationCity: "kingston", destinationFlag: "🇯🇲", airline: "Caribbean Airlines", price: 395, currency: "USD", departDate: "Apr 16", returnDate: "Apr 23", stops: 1, duration: "6h 30m" },
  ];
};

// Get flight routes for map visualization
export const getFlightRoutes = (originCity: string): FlightRoute[] => {
  const cityCoords: Record<string, [number, number]> = {
    lagos: [6.5244, 3.3792],
    accra: [5.6037, -0.1870],
    london: [51.5074, -0.1278],
    paris: [48.8566, 2.3522],
    atlanta: [33.7490, -84.3880],
    nyc: [40.7128, -74.006],
    miami: [25.7617, -80.1918],
    nairobi: [-1.2921, 36.8219],
    johannesburg: [-26.2041, 28.0473],
    toronto: [43.6532, -79.3832],
    kingston: [18.0179, -76.8099],
    dakar: [14.7167, -17.4677],
    chicago: [41.8781, -87.6298],
    losangeles: [34.0522, -118.2437],
    saopaulo: [-23.5505, -46.6333],
    amsterdam: [52.3676, 4.9041],
    abidjan: [5.3600, -4.0083],
    marrakech: [31.6295, -7.9811],
    austin: [30.2672, -97.7431],
  };

  const deals = getFlightDeals(originCity);
  return deals
    .filter(d => cityCoords[d.destinationCity])
    .map(d => ({
      destinationCity: d.destinationCity,
      destinationName: d.destination,
      destinationFlag: d.destinationFlag,
      price: d.price,
      coords: cityCoords[d.destinationCity],
    }));
};
