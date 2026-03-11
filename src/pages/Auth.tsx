import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackSignUp, trackLogin } from "@/lib/posthog";
import { trackUserSignup } from "@/lib/analytics";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Pre-fill admin code from URL or sessionStorage
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setAdminCode(code);
    } else {
      const saved = sessionStorage.getItem("admin_code");
      if (saved) setAdminCode(saved);
    }
  }, [searchParams]);

  // After Google OAuth redirect, if user is logged in and we have a saved admin code, activate admin
  useEffect(() => {
    if (!user || !session) return;

    const savedCode = sessionStorage.getItem("admin_code");
    if (savedCode) {
      sessionStorage.removeItem("admin_code");
      // Check if user already has admin role before calling edge function
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .then(({ data }) => {
          if (data && data.length > 0) {
            // Already admin, skip validation
            navigate("/app", { replace: true });
          } else {
            supabase.functions
              .invoke("validate-admin-code", { body: { code: savedCode } })
              .then(() => navigate("/app", { replace: true }))
              .catch(() => navigate("/app", { replace: true }));
          }
        });
    } else {
      navigate("/app", { replace: true });
    }
  }, [user, session, navigate]);

  const activateAdmin = async () => {
    if (!adminCode.trim()) return;

    const { data, error } = await supabase.functions.invoke("validate-admin-code", {
      body: { code: adminCode.trim() },
    });

    if (error || data?.error) {
      toast({
        title: "Invalid admin code",
        description: data?.error || "The code you entered is not valid.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;

        // If admin code provided, try to activate after signup
        if (adminCode.trim()) {
          // Need to sign in first to get a session
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (!signInError) {
            const success = await activateAdmin();
            if (success) {
              navigate("/app");
              return;
            }
          }
        }

        toast({
          title: "Check your email ✉️",
          description: "We sent you a verification link. Click it to activate your account.",
        });
        trackSignUp("email");
        trackUserSignup("email");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        trackLogin("email");

        // If admin code provided, activate admin role
        if (adminCode.trim()) {
          await activateAdmin();
        }

        navigate("/app");
      }
    } catch (err: any) {
      toast({
        title: "Oops",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    // Save admin code to sessionStorage so it survives the OAuth redirect
    if (adminCode.trim()) {
      sessionStorage.setItem("admin_code", adminCode.trim());
    }
    setLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth",
    });
    if (error) {
      toast({ title: "Google sign-in failed", description: String(error), variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo / Brand */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-4xl font-bold text-gradient-gold">AfroHub</h1>
          <p className="text-muted-foreground text-sm">
            {mode === "login" ? "Welcome back to the fam" : "Join the diaspora community"}
          </p>
        </div>

        {/* Admin Code */}
        <div className="relative">
          <ShieldCheck size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
          <input
            type="text"
            placeholder="Admin access code"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-primary/5 text-foreground placeholder:text-muted-foreground border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
          />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-card border border-border text-foreground font-medium hover:bg-secondary transition-colors disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {mode === "signup" && (
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
              />
            </div>
          )}
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
            />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-gold text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Hold on..." : mode === "login" ? "Sign In" : "Create Account"}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-primary font-semibold hover:underline"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
