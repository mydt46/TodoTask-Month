(function () {
  const STORAGE_KEY = "TodoSchState";

  function normalizeStateForTodoKey(todoKey, state) {
    if (!state || typeof state !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(state).filter(([key, value]) => {
        return key.startsWith(`${todoKey}-`) && value === true;
      }),
    );
  }

  function readLocalStorageState(todoKey) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return normalizeStateForTodoKey(todoKey, parsed);
    } catch (error) {
      console.warn("Could not read local storage state for finalize.", error);
      return {};
    }
  }

  function getSupabaseContext() {
    const env = window.TODO_ENV;
    if (!env || !env.supabase) {
      throw new Error("Missing Supabase configuration.");
    }

    return env;
  }

  async function savePageState(todoKey, state) {
    const { supabase, schema, table } = getSupabaseContext();
    const payload = {
      todoKey,
      savedAt: new Date().toISOString(),
      state: normalizeStateForTodoKey(todoKey, state),
    };
    const query = supabase.schema(schema).from(table);

    const { error } = await query.upsert(payload, {
      onConflict: "todoKey",
    });

    if (error) {
      throw error;
    }

    return payload.savedAt;
  }

  async function loadPageState(todoKey) {
    try {
      const { supabase, schema, table } = getSupabaseContext();
      const { data, error } = await supabase
        .schema(schema)
        .from(table)
        .select("state")
        .eq("todoKey", todoKey)
        .order("savedAt", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return normalizeStateForTodoKey(todoKey, data && data.state);
    } catch (error) {
      console.warn("Could not load finalized state from Supabase.", error);
      return null;
    }
  }

  function attachFinalizeButton({ todoKey, getState }) {
    const button = document.getElementById("finalizeDataBtn");
    const status = document.getElementById("finalizeStatus");

    if (!button || !status) {
      return;
    }

    button.addEventListener("click", async () => {
      button.disabled = true;
      status.textContent = "Dang luu du lieu len Supabase...";

      try {
        const currentState =
          typeof getState === "function" ? getState() : readLocalStorageState(todoKey);
        const pageState = normalizeStateForTodoKey(todoKey, currentState);
        await savePageState(todoKey, pageState);
        status.textContent = "Da finalize data len Supabase.";
      } catch (error) {
        console.error("Could not finalize data.", error);
        status.textContent = "Khong the finalize du lieu len Supabase. Hay thu lai.";
      } finally {
        button.disabled = false;
      }
    });
  }

  window.FinalizeData = {
    attachFinalizeButton,
    loadPageState,
    readLocalStorageState,
  };
})();
