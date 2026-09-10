const SUPABASE_URL = "https://agakowokmmxdcuuohbds.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ksiaTdu4oits7sd7s0fZcQ_BP76I1pQ";

var supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

window.supabaseClient = supabaseClient;