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
    left: [
      { letter: "G1", text: "" },
      { letter: "G1", text: "" },
      { letter: "G1", text: "" },
    ],
    right: [
      { letter: "!1", text: "Dọn dẹp bếp" },
      { letter: "!1", text: "Lau nhà" },
      { letter: "!2", text: "Giặt đồ lau" },
      { letter: "!2", text: "Giặt chăn ga" },
      { letter: "!2", text: "Loại bỏ bớt giấy cũ" },
      { letter: "!2", text: "Giặt pad chuột" },
      { letter: "!2", text: "Giặt giày" },
    ],
  },
  // ============== weekly
  weekly: {
    currentWeekOnly: true,
    weeks: []
  }
};
