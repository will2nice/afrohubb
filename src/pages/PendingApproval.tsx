import { useAuth } from "@/contexts/AuthContext";
import { Clock, LogOut } from "lucide-react";

const PendingApproval = () => {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Clock size={32} className="text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground">Pending Approval</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your account <span className="font-medium text-foreground">{user?.email}</span> has been created but is awaiting admin approval before you can access AfroHub.
          </p>
          <p className="text-muted-foreground text-xs">
            You'll get access once an admin approves your account.
          </p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;
