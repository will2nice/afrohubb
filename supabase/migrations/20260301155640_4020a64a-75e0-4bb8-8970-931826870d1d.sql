ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS source text DEFAULT 'user',
ADD COLUMN IF NOT EXISTS external_id text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS external_url text DEFAULT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS events_external_id_source_idx ON public.events (external_id, source) WHERE external_id IS NOT NULL;