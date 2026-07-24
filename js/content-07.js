// ============================================================
// content.js - Editable task content for TODO Th07.
// data.js keeps layout/colors/labels and reads task text from here.
// ============================================================

const SCHEDULE_CONTENT = {
  todo_key: "m7",
  title: "TODO Th07",
  daily: {
    left: [
      { letter: "G1", text: "Hoàn thành todo web" },
      { letter: "G2", text: "Duy trì dọn dẹp" },
      { letter: "G3", text: "" },
    ],
    right: [
      { letter: "!1", text: "Dọn dẹp bếp" },
      { letter: "!2", text: "Lau nhà" },
      { letter: "!3", text: "Giặt đồ lau" },
      { letter: "!4", text: "Giặt chăn ga" },
      { letter: "!5", text: "Loại bỏ bớt giấy cũ" },
      { letter: "!6", text: "Giặt pad chuột" },
      { letter: "!7", text: "Giặt giày" },
    ],
  },
  // ============== tracking
  tracking_month: {},
  // ============== weekly
  weekly: {
    weeks: [],
  },
};
