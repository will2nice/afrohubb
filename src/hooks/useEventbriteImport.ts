import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useEventbriteImport = () => {
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importEvents = async (cities: string[], keyword = "afrobeats") => {
    setImporting(true);
    let totalImported = 0;
    let totalErrors = 0;

    try {
      // Import one city at a time to avoid timeouts
      for (const city of cities) {
        toast({ title: `Importing ${city}...`, description: `Searching Eventbrite for ${keyword} events` });

        const { data, error } = await supabase.functions.invoke("import-eventbrite", {
          body: { city, keyword },
        });

        if (error) {
          totalErrors++;
          console.error(`Import error for ${city}:`, error);
          continue;
        }

        totalImported += data?.imported || 0;
      }

      // Refresh events list
      queryClient.invalidateQueries({ queryKey: ["events"] });

      toast({
        title: `Done! ${totalImported} events imported 🎉`,
        description: totalErrors ? `${totalErrors} cities had errors` : "Check the events list!",
      });
    } catch (err: any) {
      toast({ title: "Import failed", description: err.message, variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  return { importEvents, importing };
};
