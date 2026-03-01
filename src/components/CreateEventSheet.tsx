import { useState } from "react";
import { X, Upload, Calendar, MapPin, DollarSign, Users, Tag } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";

interface CreateEventSheetProps {
  open: boolean;
  onClose: () => void;
  defaultCity?: string;
}

const categories = ["Concert", "Festival", "Brunch", "Sports", "Networking", "Art", "Party", "Other"];

const CreateEventSheet = ({ open, onClose, defaultCity = "" }: CreateEventSheetProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Concert");
  const [city, setCity] = useState(defaultCity);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("Free");
  const [capacity, setCapacity] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { createEvent, uploadEventImage } = useEvents();
  const { toast } = useToast();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await createEvent.mutateAsync({
        title,
        description,
        category,
        city,
        location,
        date: new Date(date).toISOString(),
        end_date: null,
        image_url: null,
        price,
        capacity: capacity ? parseInt(capacity) : null,
        updated_at: new Date().toISOString(),
      });
      if (imageFile && result?.id) {
        const url = await uploadEventImage(imageFile, result.id);
        // Update event with image URL
        await import("@/integrations/supabase/client").then(({ supabase }) =>
          supabase.from("events").update({ image_url: url }).eq("id", result.id)
        );
      }
      toast({
        title: "Event submitted! 🎉",
        description: "Your event is pending approval. You'll be notified when it's live.",
      });
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-gradient-gold">Create Event</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-secondary">
            <X size={20} className="text-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Event Name</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Afrobeats Night" className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Tell people what to expect..." className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Tag size={12} /> Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm focus:outline-none">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Calendar size={12} /> Date & Time</label>
              <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MapPin size={12} /> City</label>
              <input value={city} onChange={e => setCity(e.target.value)} required placeholder="Austin" className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MapPin size={12} /> Venue</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="The Venue" className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><DollarSign size={12} /> Price</label>
              <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Free or $25" className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Users size={12} /> Capacity</label>
              <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="Unlimited" className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Upload size={12} /> Cover Image</label>
            <label className="w-full py-6 rounded-xl bg-secondary border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-colors">
              <Upload size={24} className="text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">{imageFile ? imageFile.name : "Tap to upload"}</span>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" />
            </label>
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl gradient-gold text-primary-foreground font-bold text-sm disabled:opacity-50">
            {submitting ? "Submitting..." : "Submit Event for Approval"}
          </button>

          <p className="text-xs text-center text-muted-foreground">Events are reviewed before going live to keep the community safe ✨</p>
        </form>
      </div>
    </div>
  );
};

export default CreateEventSheet;
