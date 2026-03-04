import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { useStories } from "@/hooks/useStories";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileWoman2 from "@/assets/profile-woman-2.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";
import matchWoman1 from "@/assets/match-woman-1.jpg";
import matchMan1 from "@/assets/match-man-1.jpg";
import crushWoman1 from "@/assets/crush-woman-1.jpg";
import crushMan1 from "@/assets/crush-man-1.jpg";

// Mock stories as fallback when no real ones exist
const mockStories = [
  { id: "1", name: "Amara", avatar: profileWoman1, hasNew: true },
  { id: "2", name: "Kwame", avatar: profileMan1, hasNew: true },
  { id: "3", name: "Nia", avatar: matchWoman1, hasNew: true },
  { id: "4", name: "Jamal", avatar: profileMan2, hasNew: true },
  { id: "5", name: "Zara", avatar: crushWoman1, hasNew: false },
  { id: "6", name: "Marcus", avatar: crushMan1, hasNew: false },
  { id: "7", name: "Aisha", avatar: profileWoman2, hasNew: true },
  { id: "8", name: "Dayo", avatar: matchMan1, hasNew: false },
];

const FeedStories = () => {
  const { stories, createStory, hasUserStory } = useStories();
  const { profile } = useProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewingStory, setViewingStory] = useState<{ imageUrl: string; name: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 10MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      await createStory(file);
      toast({ title: "Story posted! ✨" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  // Merge real stories with mock for demo richness
  const realStoryItems = stories
    .filter((s) => s.user_id !== user?.id)
    .map((s) => ({
      id: s.id,
      name: s.profile?.display_name?.split(" ")[0] || "User",
      avatar: s.profile?.avatar_url || profileMan1,
      hasNew: true,
      imageUrl: s.image_url,
    }));

  const allStories = realStoryItems.length > 0
    ? realStoryItems
    : mockStories.map((s) => ({ ...s, imageUrl: s.avatar }));

  return (
    <>
      <div className="px-4 py-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 w-max">
          {/* Your story */}
          <button
            className="flex flex-col items-center gap-1 w-16"
            onClick={() => {
              if (hasUserStory) {
                const myStory = stories.find((s) => s.user_id === user?.id);
                if (myStory) setViewingStory({ imageUrl: myStory.image_url, name: "Your Story" });
              } else {
                fileInputRef.current?.click();
              }
            }}
          >
            <div className={`relative w-[60px] h-[60px] rounded-full ${hasUserStory ? "p-[2.5px] bg-gradient-to-tr from-primary via-amber-400 to-primary" : "p-[2.5px] bg-border"}`}>
              <div className="w-full h-full rounded-full bg-background p-[2px]">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="You" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center">
                    <Plus size={20} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              {!hasUserStory && (
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full gradient-gold flex items-center justify-center ring-2 ring-background">
                  <Plus size={10} className="text-primary-foreground" />
                </div>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground font-medium truncate w-full text-center">
              {uploading ? "..." : "You"}
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

          {allStories.map((story) => (
            <button
              key={story.id}
              className="flex flex-col items-center gap-1 w-16"
              onClick={() => setViewingStory({ imageUrl: story.imageUrl || story.avatar, name: story.name })}
            >
              <div className={`relative w-[60px] h-[60px] rounded-full ${story.hasNew ? "p-[2.5px] bg-gradient-to-tr from-primary via-amber-400 to-primary" : "p-[2.5px] bg-border"}`}>
                <div className="w-full h-full rounded-full bg-background p-[2px]">
                  <img src={story.avatar} alt={story.name} className="w-full h-full rounded-full object-cover" />
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium truncate w-full text-center">
                {story.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Story viewer */}
      {viewingStory && (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center" onClick={() => setViewingStory(null)}>
          <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50" onClick={() => setViewingStory(null)}>
            <X size={24} className="text-white" />
          </button>
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20" />
            <span className="text-white text-sm font-medium">{viewingStory.name}</span>
          </div>
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-10">
            <div className="h-full bg-white animate-[progress_5s_linear_forwards]" />
          </div>
          <img src={viewingStory.imageUrl} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </>
  );
};

export default FeedStories;
