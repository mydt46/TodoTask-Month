(function () {
  "use strict";

  function getWeeklyTable() {
    const env = window.TODO_ENV;
    if (!env?.supabase) {
      throw new Error("Missing Supabase configuration.");
    }

    return env.supabase.schema(env.schema || "public").from("weekly");
  }

  async function loadByMonth(month) {
    const { data, error } = await getWeeklyTable()
      .select("id,week,isCurrWeek,dayOfWeek,title,isDone,month")
      .eq("month", month)
      .order("week", { ascending: true })
      .order("dayOfWeek", { ascending: true })
      .order("id", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async function loadCurrentWeek() {
    const { data, error } = await getWeeklyTable()
      .select("id,week,isCurrWeek,dayOfWeek,title,isDone,month")
      .eq("isCurrWeek", true)
      .order("dayOfWeek", { ascending: true })
      .order("id", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async function updateIsDone(id, isDone) {
    const { error } = await getWeeklyTable()
      .update({ isDone })
      .eq("id", id);

    if (error) throw error;
  }

  async function insertWeekly({ week, dayOfWeek, title, month }) {
    const { data, error } = await getWeeklyTable()
      .insert({ week, dayOfWeek, title, month, isDone: false })
      .select("id,week,isCurrWeek,dayOfWeek,title,isDone,month")
      .single();

    if (error) throw error;
    return data;
  }

  window.WeeklyData = {
    loadByMonth,
    loadCurrentWeek,
    updateIsDone,
    insertWeekly,
  };
})();
