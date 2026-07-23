// ============================================================
// data.js — All content for the Cleaning Schedule template.
// Edit the values below to change what appears on the page;
// app.js reads from this file to build the page and handles
// checkbox state; style.css handles all visuals.
// ============================================================

const SCHEDULE_DATA = {
  week_key: "m8",

  title: "TODO Th08",

  // ---------------- DAILY ----------------
  daily: {
    heading: "TODO",
    headerColor: "#b9b8ea",
    cellColor: "#d6d6ee",
    left: [
      { letter: "D1", text: "Dọn dẹp chỗ ngủ" },
      { letter: "D1", text: "Quét dọn phòng ngủ" },
      { letter: "D1", text: "Lau bàn làm việc" }
    ],
    right: [
      { letter: "!1", text: "Dọn dẹp bếp" },
      { letter: "!1", text: "Lau nhà" },
      { letter: "!2", text: "Giặt đồ lau" },
	  { letter: "!2", text: "Giặt chăn ga" },
	  { letter: "!2", text: "Loại bỏ bớt giấy cũ" },
	  { letter: "!2", text: "Giặt pad chuột" },
	  { letter: "!2", text: "Giặt giày" }
    ]
  },

  // ---------------- WEEKLY ----------------
  weekly: {
    heading: "WEEKLY",
    days: [
      {
        day: "MON",
        color: "#8fd3f4",
        category: "BATHROOMS",
        items: [
          ""
        ]
      },
      {
        day: "TUE",
        color: "#a9d18e",
        category: "BATHROOMS",
        items: [
          ""
        ]
      },
      {
        day: "WED",
        color: "#f2e29b",
        category: "BEDROOMS",
        items: [
          "[P.Ngủ] Dọn dẹp các vật dụng",
          ""
        ]
      },
      {
        day: "THUR",
        color: "#f0b27a",
        category: "KITCHEN",
        items: [
          "[Bếp] Dọn dẹp các vật dụng(sắp xếp + lau + bỏ)",
          "[Bếp] Lau khu vực",
		  "[P.Ngủ] Giặt chăn ga",
          ""
        ]
      },
      {
        day: "FRI",
        color: "#f4c2dc",
        category: "LIVING ROOM",
        items: [
		  "[Lầu 1] Quét + lau",
          "[Lầu 2] Quét + lau",
		  "[X] Giặt khăn lau"
        ]
      },
      {
        day: "SAT",
        color: "#c6a8ec",
        category: "LIVING ROOM",
        items: [
          "[X]Giặt Pad chuột",
          "[X]Giặt giày",
          ""
        ]
      },
      {
        day: "SUN",
        color: "#b9b8ea",
        category: "MISC",
        items: [
          "[x]Loại bớt giấy cũ",
          "[Lầu 2]VS hồ cá",
          "",
          ""
        ]
      }
    ]
  },

  // ---------------- TRACKING ----------------
  tracking: {
    heading: "TRACKING",
    items: [
      "Đọc sách",
      "Học từ vựng tiếng anh",
      "English Reading",
	  "English Grammar"
    ],
    columns: ["2", "3", "4", "5", "6", "7", "C"],
    headerColor: "#8fd3f4",
    cellColor: "#dceffb"
  },

  // ---------------- MONTHLY ----------------
  monthly: {
    heading: "MONTHLY",
    items: [
      "[BẾP] Tủ lạnh",
      "[GÁC] Quét Dọn (Sắp xếp + bỏ bớt đồ để lâu)",
      "[Lầu 2] Dọn hồ cá",
      "[Lầu 1] Giặt khăn lau"
    ],
    columns: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    headerColor: "#8fd3f4",
    cellColor: "#dceffb"
  },

  // ---------------- QUARTERLY ----------------
  quarterly: {
    heading: "QUARTERLY",
    items: [
      "Lau cửa kính",
      "Tổng VS Bếp",
      ""
    ],
    columns: ["1", "2", "3", "4"],
    headerColor: "#e9a8d6",
    cellColor: "#fbe3f3"
  },

  // ---------------- SEMI ANNUAL ----------------
  semiAnnual: {
    heading: "SEMI ANNUAL",
    items: [
      "VS máy giặt",
      "",
      ""
    ],
    columns: ["1", "2"],
    headerColor: "#e9a8d6",
    cellColor: "#fbe3f3"
  },

  // ---------------- ANNUAL ----------------
  annual: {
    heading: "ANNUAL",
    headerColor: "#8fd3f4",
    cellColor: "#dceffb",
    left: [
      { letter: "J", text: "" },
      { letter: "F", text: "" },
      { letter: "M", text: "" },
      { letter: "A", text: "" },
      { letter: "M", text: "" },
      { letter: "J", text: "" }
    ],
    right: [
      { letter: "J", text: "" },
      { letter: "A", text: "" },
      { letter: "S", text: "" },
      { letter: "O", text: "" },
      { letter: "N", text: "" },
      { letter: "D", text: "" }
    ]
  }
};
