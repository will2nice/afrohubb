import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useEventbriteImport = () => {
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const importEvents = async (cities?: string[]) => {
    setImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("import-eventbrite", {
        body: cities ? { cities, max_keywords: 3 } : { max_keywords: 3 },
      });
      if (error) throw error;

      toast({
        title: `Imported ${data.imported} events 🎉`,
        description: data.skipped
          ? `${data.skipped} already existed. ${data.errors?.length ? data.errors.length + " errors." : ""}`
          : "Fresh events added to your feed!",
      });
      return data;
    } catch (err: any) {
      toast({
        title: "Import failed",
        description: err.message || "Could not reach Eventbrite",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return { importEvents, importing };
};
