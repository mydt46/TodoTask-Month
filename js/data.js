// ============================================================
// data.js - Schedule config for the Cleaning Schedule template.
// Task content lives in content.js; app.js combines both files.
// ============================================================

const SCHEDULE_DATA = {
  // ---------------- DAILY ----------------
  daily: {
    heading: "TODO",
    headerColor: "#b9b8ea",
    cellColor: "#d6d6ee",
  },

  // ---------------- WEEKLY ----------------
  weekly: {
    heading: "WEEKLY",
    days: [
      {
        day: "MON",
        color: "#8fd3f4",
      },
      {
        day: "TUE",
        color: "#a9d18e",
      },
      {
        day: "WED",
        color: "#f2e29b",
      },
      {
        day: "THUR",
        color: "#f0b27a",
      },
      {
        day: "FRI",
        color: "#f4c2dc",
      },
      {
        day: "SAT",
        color: "#c6a8ec",
      },
      {
        day: "SUN",
        color: "#b9b8ea",
      },
    ],
  },

  // ---------------- TRACKING ----------------
  tracking: {
    heading: "TRACKING",
    columns: ["2", "3", "4", "5", "6", "7", "C"],
    headerColor: "#8fd3f4",
    cellColor: "#dceffb",
  },

    // ---------------- TRACKING-MONTH ----------------
  tracking_month: {
    heading: "TRACKING MONTH",
    columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
    headerColor: "#8fd3f4",
    cellColor: "#dceffb",
  },

  // ---------------- MONTHLY ----------------
  monthly: {
    heading: "MONTHLY",
    columns: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    headerColor: "#8fd3f4",
    cellColor: "#dceffb",
  },

  // ---------------- QUARTERLY ----------------
  quarterly: {
    heading: "QUARTERLY",
    columns: ["1", "2", "3", "4"],
    headerColor: "#e9a8d6",
    cellColor: "#fbe3f3",
  },

  // ---------------- SEMI ANNUAL ----------------
  semiAnnual: {
    heading: "SEMI ANNUAL",
    columns: ["1", "2"],
    headerColor: "#e9a8d6",
    cellColor: "#fbe3f3",
  },

  // ---------------- ANNUAL ----------------
  annual: {
    heading: "ANNUAL",
    headerColor: "#8fd3f4",
    cellColor: "#dceffb",
  },
};
