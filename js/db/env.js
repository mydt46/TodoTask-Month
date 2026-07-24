(function () {

  const SUPABASE_URL = "https://xxxxx.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJh-xxxxx";

  const SUPABASE_SCHEMA = "public";

  function createSupabaseClient() {
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      throw new Error("Supabase client library is not loaded.");
    }

    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  window.TODO_ENV = {
    supabase: createSupabaseClient(),
    schema: SUPABASE_SCHEMA,
  };
})();
