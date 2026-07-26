(function () {

  const SUPABASE_URL = "https://owmgddevecstmixbbzma.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93bWdkZGV2ZWNzdG1peGJiem1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjUzNjMsImV4cCI6MjEwMDQwMTM2M30.pmGnUuyZUp5_tSr7dqY3b8SPKvS36T0z3T84mSt0cfw";

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
