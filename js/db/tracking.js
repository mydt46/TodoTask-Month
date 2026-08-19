(function () {
  "use strict";

  function getTrackingTable() {
    const env = window.TODO_ENV;
    if (!env?.supabase) {
      throw new Error("Missing Supabase configuration.");
    }

    return env.supabase.schema(env.schema || "public").from("tracking");
  }

  async function loadByMonth(month) {
    const { data, error } = await getTrackingTable()
      .select("id,title,month,tracking")
      .eq("month", month)
      .order("id", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async function loadFollowing() {
    const { data, error } = await getTrackingTable()
      .select("id,title,month,tracking,startFollowing,qtyFollowing")
      .gt("qtyFollowing", 0)
      .order("id", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async function updateTracking(id, tracking) {
    const { error } = await getTrackingTable()
      .update({ tracking })
      .eq("id", id);

    if (error) throw error;
  }

  async function stopFollowing(id) {
    const { error } = await getTrackingTable()
      .update({ startFollowing: 0, qtyFollowing: 0 })
      .eq("id", id);

    if (error) throw error;
  }

  async function setFollowingPeriodByMonth(month, startFollowing, qtyFollowing) {
    const { error: resetError } = await getTrackingTable()
      .update({ qtyFollowing: 0 })
      .eq("month", month);

    if (resetError) throw resetError;

    const { error: updateError } = await getTrackingTable()
      .update({ startFollowing, qtyFollowing })
      .eq("month", month);

    if (updateError) throw updateError;
  }

  async function insertTracking({ title, month, tracking }) {
    const { data, error } = await getTrackingTable()
      .insert({ title, month, tracking })
      .select("id,title,month,tracking")
      .single();

    if (error) throw error;
    return data;
  }

  window.TrackingData = {
    loadByMonth,
    loadFollowing,
    updateTracking,
    stopFollowing,
    setFollowingPeriodByMonth,
    insertTracking,
  };
})();
