// ============================================================
// content.js - Editable task content for TODO Th07.
// data.js keeps layout/colors/labels and reads task text from here.
// ============================================================

const SCHEDULE_CONTENT = {
  todo_key: "y26",
  title: "Year 2026",
  month: 0,
  daily: {
    todoMonth: 0,
    left: [],
    right: [],
  },
  // ============== monthly
  monthly: {
    trackingMonth: 0,
    qtyTracking: 12,
    items: [],
  },
  quarterly: {
    trackingMonth: -1,
    qtyTracking: 4,
    items: [],
  },
  // ============== annual
  semiAnnual: {
    trackingMonth: -2,
    qtyTracking: 2,
    items: [],
  },
  annual: {
    todoMonth: -1,
    left: [],
    right: [],
  },
};
