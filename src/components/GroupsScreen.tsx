import { useState } from "react";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Calendar,
  Crown,
  Send,
  UserPlus,
  UserMinus,
  Search,
  X,
} from "lucide-react";
import {
  useGroups,
  useFeaturedGroups,
  useGroupDetail,
  useGroupMembers,
  useGroupPosts,
  useMyGroupIds,
  useJoinGroup,
  useLeaveGroup,
  useCreateGroupPost,
  type Group,
} from "@/hooks/useGroups";
import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import VerifiedBadge from "@/components/VerifiedBadge";
import { formatDistanceToNow } from "date-fns";

const GROUP_CATEGORIES = ["all", "tech", "business", "music", "education", "wellness", "travel", "food", "fashion"];

// ─── Group Card ───
const GroupCard = ({
  group,
  isMember,
  onJoin,
  onLeave,
  onOpen,
}: {
  group: Group;
  isMember: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onOpen: () => void;
}) => (
  <button
    onClick={onOpen}
    className="w-full bg-card border border-border rounded-2xl p-4 text-left hover:bg-secondary/30 transition-colors"
  >
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl shrink-0">
        {group.icon_emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-foreground truncate">{group.name}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              isMember ? onLeave() : onJoin();
            }}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              isMember
                ? "bg-secondary text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                : "gradient-gold text-primary-foreground"
            }`}
          >
            {isMember ? "Joined" : "Join"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{group.description}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Users className="w-3 h-3" /> {group.member_count} members
          </span>
          {group.is_featured && (
            <span className="text-[10px] text-primary font-semibold">⭐ Featured</span>
          )}
        </div>
      </div>
    </div>
  </button>
);

// ─── Group Detail ───
const GroupDetailScreen = ({
  groupId,
  onBack,
}: {
  groupId: string;
  onBack: () => void;
}) => {
  const { data: group } = useGroupDetail(groupId);
  const { data: members } = useGroupMembers(groupId);
  const { data: posts } = useGroupPosts(groupId);
  const { data: myGroupIds } = useMyGroupIds();
  const joinGroup = useJoinGroup();
  const leaveGroup = useLeaveGroup();
  const createPost = useCreateGroupPost();
  const { events } = useEvents();

  const [activeTab, setActiveTab] = useState<"discussion" | "events" | "members">("discussion");
  const [newPost, setNewPost] = useState("");

  const isMember = myGroupIds?.includes(groupId) || false;
  const moderators = (members || []).filter((m: any) => m.role === "moderator" || m.role === "admin");

  // Filter events related to group category
  const relatedEvents = events.filter(
    (e) => group && e.category.toLowerCase().includes(group.category)
  ).slice(0, 10);

  const handlePost = () => {
    if (!newPost.trim()) return;
    createPost.mutate({ groupId, content: newPost.trim() });
    setNewPost("");
  };

  if (!group) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const tabs = [
    { id: "discussion" as const, label: "Discussion", icon: MessageSquare },
    { id: "events" as const, label: "Events", icon: Calendar },
    { id: "members" as const, label: "Members", icon: Users },
  ];

  return (
    <div className="min-h-screen pb-32 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={onBack} className="p-1.5 hover:bg-secondary rounded-full">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl">{group.icon_emoji}</span>
            <h1 className="font-display text-lg font-bold text-foreground truncate">{group.name}</h1>
          </div>
          <button
            onClick={() => isMember ? leaveGroup.mutate(groupId) : joinGroup.mutate(groupId)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
              isMember
                ? "bg-secondary text-muted-foreground"
                : "gradient-gold text-primary-foreground"
            }`}
          >
            {isMember ? "Leave" : "Join"}
          </button>
        </div>
      </header>

      {/* Group info */}
      <div className="px-4 py-4 max-w-lg mx-auto">
        <p className="text-sm text-muted-foreground">{group.description}</p>
        <div className="flex items-center gap-4 mt-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" /> {group.member_count} members
          </span>
          {moderators.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Crown className="w-3.5 h-3.5 text-primary" /> {moderators.length} moderator{moderators.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border max-w-lg mx-auto">
        <div className="flex">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Discussion tab */}
        {activeTab === "discussion" && (
          <div>
            {/* Compose */}
            {isMember && (
              <div className="px-4 py-3 border-b border-border">
                <div className="flex gap-2">
                  <input
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share something with the group…"
                    className="flex-1 bg-secondary rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handlePost()}
                  />
                  <button
                    onClick={handlePost}
                    disabled={!newPost.trim() || createPost.isPending}
                    className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
              </div>
            )}

            {!posts || posts.length === 0 ? (
              <div className="flex flex-col items-center py-16 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-3">
                  <MessageSquare className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No discussions yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isMember ? "Start a conversation!" : "Join to start discussing."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {posts.map((post: any) => (
                  <div key={post.id} className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={post.profiles?.avatar_url || "/placeholder.svg"}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-foreground">
                            {post.profiles?.display_name || "Member"}
                          </span>
                          {post.profiles?.is_verified && <VerifiedBadge size={14} />}
                          <span className="text-[10px] text-muted-foreground">
                            · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 mt-1 whitespace-pre-wrap">{post.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Events tab */}
        {activeTab === "events" && (
          <div>
            {relatedEvents.length === 0 ? (
              <div className="flex flex-col items-center py-16 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No related events</p>
                <p className="text-xs text-muted-foreground mt-1">Events in this category will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {relatedEvents.map((event) => (
                  <div key={event.id} className="px-4 py-3 flex items-center gap-3">
                    {event.image_url && (
                      <img src={event.image_url} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.city} · {event.date ? new Date(event.date).toLocaleDateString() : ""}</p>
                    </div>
                    <span className="text-xs font-semibold text-primary">{event.price || "Free"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Members tab */}
        {activeTab === "members" && (
          <div className="divide-y divide-border">
            {(members || []).map((m: any) => (
              <div key={m.id} className="flex items-center gap-3 px-4 py-3">
                <img
                  src={m.profiles?.avatar_url || "/placeholder.svg"}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {m.profiles?.display_name || "Member"}
                    </p>
                    {m.profiles?.is_verified && <VerifiedBadge size={14} />}
                  </div>
                  <p className="text-xs text-muted-foreground">{m.profiles?.city || ""}</p>
                </div>
                {(m.role === "moderator" || m.role === "admin") && (
                  <span className="flex items-center gap-1 text-[10px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
                    <Crown className="w-3 h-3" />
                    {m.role === "admin" ? "Admin" : "Mod"}
                  </span>
                )}
              </div>
            ))}
            {(!members || members.length === 0) && (
              <div className="py-12 text-center text-sm text-muted-foreground">No members yet</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Groups Screen (listing) ───
const GroupsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const { data: groups, isLoading } = useGroups(selectedCategory !== "all" ? selectedCategory : undefined);
  const { data: myGroupIds } = useMyGroupIds();
  const joinGroup = useJoinGroup();
  const leaveGroup = useLeaveGroup();

  const filteredGroups = (groups || []).filter(
    (g) =>
      !searchQuery ||
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedGroupId) {
    return <GroupDetailScreen groupId={selectedGroupId} onBack={() => setSelectedGroupId(null)} />;
  }

  return (
    <div className="pb-32 min-h-screen">
      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups…"
            className="w-full bg-secondary rounded-xl pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div className="px-4 pb-3 overflow-x-auto scrollbar-none">
        <div className="flex gap-2">
          {GROUP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${
                selectedCategory === cat
                  ? "gradient-gold text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Groups list */}
      <div className="px-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))
        ) : filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No groups found</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different category or search term.</p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              isMember={myGroupIds?.includes(group.id) || false}
              onJoin={() => joinGroup.mutate(group.id)}
              onLeave={() => leaveGroup.mutate(group.id)}
              onOpen={() => setSelectedGroupId(group.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GroupsScreen;
