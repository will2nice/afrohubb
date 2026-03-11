import { useState } from "react";
import { X, Flag, ShieldBan, AlertTriangle } from "lucide-react";

const REPORT_REASONS = [
  "Harassment or bullying",
  "Spam or scam",
  "Fake profile",
  "Inappropriate content",
  "Hate speech",
  "Other",
];

interface ReportBlockSheetProps {
  userName: string;
  userId: string;
  onClose: () => void;
  onReport: (reason: string, description: string) => Promise<boolean | undefined>;
  onBlock: () => Promise<boolean | undefined>;
}

const ReportBlockSheet = ({ userName, userId, onClose, onReport, onBlock }: ReportBlockSheetProps) => {
  const [mode, setMode] = useState<"menu" | "report">("menu");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReport = async () => {
    if (!reason) return;
    setSubmitting(true);
    const ok = await onReport(reason, description);
    setSubmitting(false);
    if (ok) onClose();
  };

  const handleBlock = async () => {
    setSubmitting(true);
    const ok = await onBlock();
    setSubmitting(false);
    if (ok) onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="max-w-lg mx-auto">
          <div className="bg-card border border-border rounded-t-2xl shadow-elevated overflow-hidden mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-display font-bold text-foreground text-base">
                {mode === "menu" ? userName : "Report User"}
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            {mode === "menu" ? (
              <div className="p-2">
                <button
                  onClick={() => setMode("report")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <Flag size={18} className="text-destructive" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Report</p>
                    <p className="text-xs text-muted-foreground">Flag inappropriate behavior</p>
                  </div>
                </button>
                <button
                  onClick={handleBlock}
                  disabled={submitting}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <ShieldBan size={18} className="text-destructive" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-destructive">Block</p>
                    <p className="text-xs text-muted-foreground">Hide this person from your feed</p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/10">
                  <AlertTriangle size={16} className="text-destructive shrink-0" />
                  <p className="text-xs text-muted-foreground">Reports are reviewed by our team within 24 hours.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Why are you reporting?</p>
                  {REPORT_REASONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setReason(r)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                        reason === r
                          ? "bg-primary/10 border border-primary/30 text-foreground font-medium"
                          : "bg-secondary border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {reason && (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details (optional)..."
                    rows={3}
                    className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
                  />
                )}
                <button
                  onClick={handleReport}
                  disabled={!reason || submitting}
                  className="w-full py-3 rounded-xl bg-destructive text-destructive-foreground font-bold text-sm disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportBlockSheet;
