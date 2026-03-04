import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useEventPromoters = (eventId?: string) => {
  const { user } = useAuth();
  const [isPromoter, setIsPromoter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !eventId) {
      setIsPromoter(false);
      setLoading(false);
      return;
    }

    const check = async () => {
      const { data } = await supabase
        .from("event_promoters" as any)
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();
      setIsPromoter(!!data);
      setLoading(false);
    };

    check();
  }, [user, eventId]);

  return { isPromoter, loading };
};
