import { useState } from "react";
import { Globe, ExternalLink, Clock, Tag, ChevronRight, Flame, AlertTriangle, TrendingUp } from "lucide-react";
import { newsArticles, newsCategories, type NewsArticle } from "@/data/newsData";

const categoryIcons: Record<string, { icon: typeof Flame; color: string }> = {
  "Conflict & Crisis": { icon: AlertTriangle, color: "text-red-500" },
  "Youth & Education": { icon: TrendingUp, color: "text-emerald-500" },
  "Diaspora": { icon: Globe, color: "text-blue-500" },
  "Business & Tech": { icon: TrendingUp, color: "text-violet-500" },
  "Culture & Arts": { icon: Flame, color: "text-amber-500" },
  "Politics": { icon: AlertTriangle, color: "text-orange-500" },
  "Health": { icon: Flame, color: "text-teal-500" },
  "Climate": { icon: AlertTriangle, color: "text-green-600" },
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const NewsScreen = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = activeCategory === "All"
    ? newsArticles
    : newsArticles.filter((a) => a.category === activeCategory);

  // Sort by date descending
  const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Urgent/crisis stories pinned at top
  const urgent = sorted.filter((a) => a.category === "Conflict & Crisis");
  const rest = sorted.filter((a) => a.category !== "Conflict & Crisis");
  const display = activeCategory === "All" ? [...urgent, ...rest] : sorted;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center">
              <Globe size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground">News & Awareness</h1>
              <p className="text-[11px] text-muted-foreground">Africa · Diaspora · Our Communities</p>
            </div>
          </div>
        </div>
      </header>

      {/* Breaking banner for crisis */}
      {activeCategory === "All" && urgent.length > 0 && (
        <div className="mx-4 mt-3 max-w-lg mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Crisis Alert</p>
              <p className="text-sm text-foreground leading-relaxed">
                Active conflicts in Sudan, DRC, South Sudan, and Cameroon are displacing millions. The diaspora is mobilizing — stay informed and take action.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category chips */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide max-w-lg mx-auto">
        <div className="flex gap-2 w-max">
          {newsCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "gradient-gold text-primary-foreground shadow-gold"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="px-4 space-y-3 max-w-lg mx-auto">
        {display.map((article) => {
          const catInfo = categoryIcons[article.category] || { icon: Globe, color: "text-muted-foreground" };
          const CatIcon = catInfo.icon;
          const isExpanded = expandedId === article.id;

          return (
            <article
              key={article.id}
              className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up"
            >
              <div
                className="px-4 py-3 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : article.id)}
              >
                {/* Category & Region */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${catInfo.color}`}>
                    <CatIcon size={12} />
                    {article.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <span className="text-[10px] text-muted-foreground">{article.region}</span>
                  <div className="flex-1" />
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock size={10} />
                    {formatDate(article.date)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-foreground text-[15px] leading-snug mb-1.5">
                  {article.title}
                </h3>

                {/* Summary preview */}
                <p className={`text-sm text-muted-foreground leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
                  {article.summary}
                </p>

                {/* Expand indicator */}
                {!isExpanded && (
                  <button className="flex items-center gap-1 mt-2 text-xs text-primary font-semibold">
                    Read more <ChevronRight size={12} />
                  </button>
                )}
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-[10px] text-secondary-foreground">
                        <Tag size={8} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Source & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-[11px] text-muted-foreground">
                      Source: <span className="font-semibold text-foreground">{article.source}</span>
                    </span>
                    {article.externalUrl && (
                      <a
                        href={article.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full gradient-gold text-primary-foreground text-xs font-semibold"
                      >
                        Read Full Article <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {display.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No stories in this category yet</p>
            <button onClick={() => setActiveCategory("All")} className="mt-3 text-sm text-primary font-semibold">
              Show all stories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsScreen;
