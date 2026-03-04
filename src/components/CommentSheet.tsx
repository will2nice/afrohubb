import { useState } from "react";
import { X, Send } from "lucide-react";
import { type PostComment } from "@/hooks/usePosts";

interface CommentSheetProps {
  postId: string;
  comments: PostComment[];
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
}

const CommentSheet = ({ postId, comments, onClose, onSubmit }: CommentSheetProps) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await onSubmit(text);
      setText("");
    } catch (e) {}
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mt-auto max-h-[70vh] bg-card rounded-t-3xl border-t border-border overflow-hidden flex flex-col animate-slide-up">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-display font-bold text-foreground text-base">Comments</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {comments.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No comments yet. Be the first!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary shrink-0" />
                <div>
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">{c.profile?.display_name || "User"}</span>{" "}
                    <span className="text-foreground/80">{c.content}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-3 border-t border-border flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2.5 rounded-full bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={sending || !text.trim()}
            className="p-2.5 rounded-full gradient-gold text-primary-foreground disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSheet;
