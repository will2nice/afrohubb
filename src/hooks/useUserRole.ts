import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type UserStatus = "loading" | "admin" | "pending";

export const useUserRole = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<UserStatus>("loading");

  useEffect(() => {
    if (!user) {
      setStatus("loading");
      return;
    }

    const check = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isAdmin = data?.some((r) => r.role === "admin");
      setStatus(isAdmin ? "admin" : "pending");
    };

    check();
  }, [user]);

  return status;
};
