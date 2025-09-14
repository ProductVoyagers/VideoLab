import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ykolqwczyuqctmdkbwvf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrb2xxd2N6eXVxY3RtZGtid3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NjI2ODksImV4cCI6MjA3MzQzODY4OX0.p8W4DYLpHIKGCvyCe6FXlchZDuZMQckCoBoT-_gzlj0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
