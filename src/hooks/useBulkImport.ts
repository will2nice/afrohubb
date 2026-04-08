import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useBulkImport = () => {
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bulkImport = async (cities: string[] = ["austin", "dallas", "houston", "sanantonio"]) => {
    setImporting(true);
    try {
      toast({ title: "🔍 Bulk import started", description: `Scraping Posh, Eventbrite & more for ${cities.join(", ")}...` });

      const { data, error } = await supabase.functions.invoke("bulk-import-events", {
        body: { cities },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      queryClient.invalidateQueries({ queryKey: ["events"] });

      toast({
        title: `✅ Import complete! ${data?.total_imported || 0} events added`,
        description: `${data?.total_skipped || 0} duplicates skipped across ${cities.length} cities`,
      });

      return data;
    } catch (err: any) {
      toast({ title: "Import failed", description: err.message, variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  return { bulkImport, importing };
};
