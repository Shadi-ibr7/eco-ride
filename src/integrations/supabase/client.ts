// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jjkqstovmeudbwisqhmo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqa3FzdG92bWV1ZGJ3aXNxaG1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4OTYxOTcsImV4cCI6MjA1MDQ3MjE5N30.pFgj9bNpGGqbebv3L6-BkbpQjc1W8dhDGZZRP_jfd28";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);