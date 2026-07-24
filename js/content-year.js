// ============================================================
// content.js - Editable task content for TODO Th07.
// data.js keeps layout/colors/labels and reads task text from here.
// ============================================================

const SCHEDULE_CONTENT = {
  todo_key: "y26",
  title: "Year 2026",
  month: 0,
  daily: {
    left: [],
    right: [],
  },
  // ============== monthly
  monthly: {
    trackingMonth: 0,
    items: [],
  },
  quarterly: {
    trackingMonth: -1,
    items: ["Lau cửa kính", "Tổng VS Bếp", ""],
  },
  // ============== annual
  semiAnnual: {
    trackingMonth: -2,
    items: ["VS máy giặt", "", ""],
  },
  annual: {
    todoMonth: -1,
    left: [
      { letter: "J", text: "" },
      { letter: "F", text: "" },
      { letter: "M", text: "" },
      { letter: "A", text: "" },
      { letter: "M", text: "" },
      { letter: "J", text: "" },
    ],
    right: [
      { letter: "J", text: "" },
      { letter: "A", text: "" },
      { letter: "S", text: "" },
      { letter: "O", text: "" },
      { letter: "N", text: "" },
      { letter: "D", text: "" },
    ],
  },
};
