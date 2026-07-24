(function () {
  "use strict";

  function getTodoTable() {
    const env = window.TODO_ENV;
    if (!env?.supabase) {
      throw new Error("Missing Supabase configuration.");
    }

    return env.supabase.schema(env.schema || "public").from("todo_list");
  }

  function selectTodoRows() {
    return getTodoTable()
      .select("id,month,letter,title,isDone,isLeft,isFollowing")
  }

  async function executeTodoQuery(query) {
    const { data, error } = await query.order("id", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async function loadByMonth(month) {
    return executeTodoQuery(
      selectTodoRows().eq("month", month),
    );
  }

  async function loadFollowing() {
    return executeTodoQuery(
      selectTodoRows().eq("isFollowing", true),
    );
  }

  async function updateIsDone(id, isDone) {
    const { error } = await getTodoTable()
      .update({ isDone })
      .eq("id", id);

    if (error) throw error;
  }

  window.TodoListData = { loadByMonth, loadFollowing, updateIsDone };
})();
