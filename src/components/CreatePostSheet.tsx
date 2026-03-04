import { useState, useRef } from "react";
import { X, Image, Send, MapPin } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import profileMan1 from "@/assets/profile-man-1.jpg";

interface CreatePostSheetProps {
  cityId?: string;
  cityName?: string;
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePostSheet = ({ cityId, cityName, onClose, onPostCreated }: CreatePostSheetProps) => {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { createPost } = usePosts();
  const { profile } = useProfile();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 10MB", variant: "destructive" });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageFile) return;
    setLoading(true);
    try {
      await createPost(content, imageFile || undefined, cityId);
      toast({ title: "Posted! 🎉" });
      onPostCreated();
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary">
            <X size={20} className="text-foreground" />
          </button>
          <h2 className="font-display text-base font-bold text-foreground">New Post</h2>
          <button
            onClick={handleSubmit}
            disabled={loading || (!content.trim() && !imageFile)}
            className="px-4 py-2 rounded-full gradient-gold text-primary-foreground text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "..." : "Post"}
          </button>
        </div>

        <div className="flex gap-3">
          <img
            src={profile?.avatar_url || profileMan1}
            alt=""
            className="w-10 h-10 rounded-full object-cover ring-2 ring-border shrink-0"
          />
          <div className="flex-1">
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm resize-none outline-none min-h-[120px]"
              maxLength={500}
            />
            {imagePreview && (
              <div className="relative mt-2">
                <img src={imagePreview} alt="" className="w-full rounded-xl object-cover max-h-64" />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-sm text-foreground">
            <Image size={16} className="text-primary" /> Photo
          </button>
          {cityName && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={12} /> {cityName}
            </span>
          )}
          <span className="ml-auto text-xs text-muted-foreground">{content.length}/500</span>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
      </div>
    </div>
  );
};

export default CreatePostSheet;
