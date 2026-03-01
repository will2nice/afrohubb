import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const usePoshImport = () => {
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importEvents = async (cities: string[], keyword = "afrobeats") => {
    setImporting(true);
    let totalImported = 0;
    let totalErrors = 0;

    try {
      for (const city of cities) {
        toast({ title: `Importing ${city} from Posh...`, description: `Searching for ${keyword} events` });

        const { data, error } = await supabase.functions.invoke("import-posh", {
          body: { city, keyword },
        });

        if (error) {
          totalErrors++;
          console.error(`Posh import error for ${city}:`, error);
          continue;
        }

        totalImported += data?.imported || 0;
      }

      queryClient.invalidateQueries({ queryKey: ["events"] });

      toast({
        title: `Done! ${totalImported} Posh events imported 🎉`,
        description: totalErrors ? `${totalErrors} cities had errors` : "Check the events list!",
      });
    } catch (err: any) {
      toast({ title: "Posh import failed", description: err.message, variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  return { importEvents, importing };
};
