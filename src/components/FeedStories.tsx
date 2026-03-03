import { Plus } from "lucide-react";
import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileWoman2 from "@/assets/profile-woman-2.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";
import matchWoman1 from "@/assets/match-woman-1.jpg";
import matchMan1 from "@/assets/match-man-1.jpg";
import crushWoman1 from "@/assets/crush-woman-1.jpg";
import crushMan1 from "@/assets/crush-man-1.jpg";

const stories = [
  { id: "you", name: "You", avatar: null, isOwn: true, hasNew: false },
  { id: "1", name: "Amara", avatar: profileWoman1, isOwn: false, hasNew: true },
  { id: "2", name: "Kwame", avatar: profileMan1, isOwn: false, hasNew: true },
  { id: "3", name: "Nia", avatar: matchWoman1, isOwn: false, hasNew: true },
  { id: "4", name: "Jamal", avatar: profileMan2, isOwn: false, hasNew: true },
  { id: "5", name: "Zara", avatar: crushWoman1, isOwn: false, hasNew: false },
  { id: "6", name: "Marcus", avatar: crushMan1, isOwn: false, hasNew: false },
  { id: "7", name: "Aisha", avatar: profileWoman2, isOwn: false, hasNew: true },
  { id: "8", name: "Dayo", avatar: matchMan1, isOwn: false, hasNew: false },
];

const FeedStories = () => {
  return (
    <div className="px-4 py-3 overflow-x-auto no-scrollbar">
      <div className="flex gap-3 w-max">
        {stories.map((story) => (
          <button key={story.id} className="flex flex-col items-center gap-1 w-16">
            <div className={`relative w-[60px] h-[60px] rounded-full ${
              story.hasNew 
                ? "p-[2.5px] bg-gradient-to-tr from-primary via-amber-400 to-primary" 
                : "p-[2.5px] bg-border"
            }`}>
              <div className="w-full h-full rounded-full bg-background p-[2px]">
                {story.isOwn ? (
                  <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center">
                    <Plus size={20} className="text-muted-foreground" />
                  </div>
                ) : (
                  <img
                    src={story.avatar!}
                    alt={story.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium truncate w-full text-center">
              {story.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeedStories;
