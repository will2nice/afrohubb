import categoryParty from "@/assets/category-party.jpg";
import categoryLive from "@/assets/category-live.jpg";
import categoryFood from "@/assets/category-food.jpg";
import categoryActivities from "@/assets/category-activities.jpg";
import categoryArt from "@/assets/category-art.jpg";
import categoryNetworking from "@/assets/category-networking.jpg";
import categoryFitness from "@/assets/category-fitness.jpg";

const categories = [
  { id: "party", label: "party", image: categoryParty, number: "01" },
  { id: "live", label: "live performance", image: categoryLive, number: "02" },
  { id: "activities", label: "activities", image: categoryActivities, number: "03" },
  { id: "food", label: "food & drink", image: categoryFood, number: "04" },
  { id: "fitness", label: "fitness", image: categoryFitness, number: "05" },
  { id: "art", label: "art & fashion", image: categoryArt, number: "06" },
  { id: "networking", label: "networking", image: categoryNetworking, number: "07" },
];

interface EventCategoryBannersProps {
  onCategorySelect: (category: string) => void;
}

const EventCategoryBanners = ({ onCategorySelect }: EventCategoryBannersProps) => {
  return (
    <div className="px-4 max-w-lg mx-auto">
      <h2 className="font-display text-lg font-bold text-foreground mb-1">Discover more</h2>
      <p className="text-sm text-muted-foreground mb-4">explore categories to find your vibe</p>
      <div className="space-y-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategorySelect(cat.id)}
            className="relative w-full h-24 rounded-2xl overflow-hidden group"
          >
            <img
              src={cat.image}
              alt={cat.label}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-between px-5">
              <span className="text-xs font-mono text-white/70">{cat.number}</span>
              <h3 className="text-white font-display text-xl font-bold tracking-wide">{cat.label}</h3>
              <span className="text-xs font-mono text-white/70">{cat.number}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventCategoryBanners;
