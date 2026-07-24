// ============================================================
// content.js - Editable task content for TODO Th07.
// data.js keeps layout/colors/labels and reads task text from here.
// ============================================================

const SCHEDULE_CONTENT = {
  todo_key: "f37",
  title: "Following Task",
  // ============== tracking
  tracking: {
    followingOnly: true,
    items: [],
  },
  daily: {
    followingOnly: true,
    left: [],
    right: [],
  },
  // ============== weekly
  weekly: {
    currentWeekOnly: true,
    weeks: []
  }
};
