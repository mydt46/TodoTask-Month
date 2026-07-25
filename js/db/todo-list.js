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

  async function insertTodo({ letter, title, isLeft, month }) {
    const { data, error } = await getTodoTable()
      .insert({
        letter,
        title,
        isLeft,
        month,
        isDone: false,
        isFollowing: false,
      })
      .select("id,month,letter,title,isDone,isLeft,isFollowing")
      .single();

    if (error) throw error;
    return data;
  }

  window.TodoListData = {
    loadByMonth,
    loadFollowing,
    updateIsDone,
    insertTodo,
  };
})();
