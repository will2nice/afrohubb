import { X, Heart, MessageCircle, MapPin, Sparkles, Check, Clock } from "lucide-react";
import { type Attendee } from "@/data/eventAttendees";
import { type SoundclashAttendee } from "@/data/soundclashAttendees";

interface ProfileViewModalProps {
  person: Attendee | SoundclashAttendee;
  onClose: () => void;
  onLike: () => void;
  onMessage: () => void;
  liked: boolean;
  likeStatus?: "none" | "sent" | "received" | "matched";
}

const ProfileViewModal = ({ person, onClose, onLike, onMessage, liked, likeStatus = "none" }: ProfileViewModalProps) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-sm mx-4 bg-card rounded-3xl border border-border shadow-2xl overflow-hidden animate-slide-up">
        {/* Photo */}
        <div className="relative">
          <img
            src={person.photo}
            alt={person.name}
            className="w-full aspect-[3/4] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
          >
            <X size={18} className="text-foreground" />
          </button>

          {/* Name overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="font-display font-bold text-foreground text-2xl">
              {person.name}, {person.age}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1">
                <Sparkles size={12} /> {person.vibe}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <p className="text-sm text-foreground leading-relaxed">{person.bio}</p>

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-primary" />
              {person.distance}
            </span>
            {person.mutualFriends > 0 && (
              <span className="flex items-center gap-1 text-primary font-medium">
                👥 {person.mutualFriends} mutual friends
              </span>
            )}
          </div>

          {/* Like status badge */}
          {likeStatus === "sent" && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20">
              <Clock size={14} className="text-primary" />
              <span className="text-xs text-primary font-medium">Like request sent — waiting for response</span>
            </div>
          )}
          {likeStatus === "received" && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20">
              <Heart size={14} className="text-primary fill-primary" />
              <span className="text-xs text-primary font-medium">This person likes you! Like back to match 💛</span>
            </div>
          )}
          {likeStatus === "matched" && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <Check size={14} className="text-green-500" />
              <span className="text-xs text-green-500 font-medium">You're matched! Send a message 🎉</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={onLike}
              disabled={likeStatus === "sent" || likeStatus === "matched"}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all ${
                liked || likeStatus === "matched"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : likeStatus === "sent"
                  ? "bg-muted text-muted-foreground border border-border"
                  : "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
              }`}
            >
              <Heart size={18} className={liked || likeStatus === "matched" ? "fill-red-500" : ""} />
              {likeStatus === "matched" ? "Matched" : likeStatus === "sent" ? "Sent" : "Like"}
            </button>
            <button
              onClick={onMessage}
              disabled={likeStatus !== "matched"}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all ${
                likeStatus === "matched"
                  ? "gradient-gold text-primary-foreground shadow-gold hover:scale-105 active:scale-95"
                  : "bg-muted text-muted-foreground border border-border cursor-not-allowed"
              }`}
            >
              <MessageCircle size={18} />
              Message
            </button>
          </div>
          {likeStatus !== "matched" && (
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Match with each other to unlock messaging
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileViewModal;
