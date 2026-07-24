// ============================================================
// content-08.js - Editable task content for TODO Th08.
// data-08.js keeps layout/colors/labels and reads task text from here.
// ============================================================

const SCHEDULE_CONTENT = {
  todo_key: "m8",
  title: "TODO Th08",
  // ============== tracking
  tracking: {
    items: [
      "Đọc sách",
      "Học từ vựng tiếng anh",
      "English Reading",
      "English Grammar",
    ],
  },
  daily: {
    left: [
      { letter: "D1", text: "Dọn dẹp chỗ ngủ" },
      { letter: "D1", text: "Quét dọn phòng ngủ" },
      { letter: "D1", text: "Lau bàn làm việc" },
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
    weeks: [
      {
        items: [
          [""],
          [""],
          ["[P.Ngủ] Dọn dẹp các vật dụng", ""],
          [
            "[Bếp] Dọn dẹp các vật dụng(sắp xếp + lau + bỏ)",
            "[Bếp] Lau khu vực",
            "[P.Ngủ] Giặt chăn ga",
            "",
          ],
          ["[Lầu 1] Quét + lau", "[Lầu 2] Quét + lau", "[X] Giặt khăn lau"],
          ["[X]Giặt Pad chuột", "[X]Giặt giày", ""],
          ["[x]Loại bớt giấy cũ", "[Lầu 2]VS hồ cá", "", ""],
        ],
      },
      {
        items: [
          [""],
          [""],
          ["[P.Ngủ] Dọn dẹp các vật dụng", ""],
          [
            "[Bếp] Dọn dẹp các vật dụng(sắp xếp + lau + bỏ)",
            "[Bếp] Lau khu vực",
            "[P.Ngủ] Giặt chăn ga",
            "",
          ],
          ["[Lầu 1] Quét + lau", "[Lầu 2] Quét + lau", "[X] Giặt khăn lau"],
          ["[X]Giặt Pad chuột", "[X]Giặt giày", ""],
          ["[x]Loại bớt giấy cũ", "[Lầu 2]VS hồ cá", "", ""],
        ],
      },
      {
        items: [
          [""],
          [""],
          ["[P.Ngủ] Dọn dẹp các vật dụng", ""],
          [
            "[Bếp] Dọn dẹp các vật dụng(sắp xếp + lau + bỏ)",
            "[Bếp] Lau khu vực",
            "[P.Ngủ] Giặt chăn ga",
            "",
          ],
          ["[Lầu 1] Quét + lau", "[Lầu 2] Quét + lau", "[X] Giặt khăn lau"],
          ["[X]Giặt Pad chuột", "[X]Giặt giày", ""],
          ["[x]Loại bớt giấy cũ", "[Lầu 2]VS hồ cá", "", ""],
        ],
      },
      {
        items: [
          [""],
          [""],
          ["[P.Ngủ] Dọn dẹp các vật dụng", ""],
          [
            "[Bếp] Dọn dẹp các vật dụng(sắp xếp + lau + bỏ)",
            "[Bếp] Lau khu vực",
            "[P.Ngủ] Giặt chăn ga",
            "",
          ],
          ["[Lầu 1] Quét + lau", "[Lầu 2] Quét + lau", "[X] Giặt khăn lau"],
          ["[X]Giặt Pad chuột", "[X]Giặt giày", ""],
          ["[x]Loại bớt giấy cũ", "[Lầu 2]VS hồ cá", "", ""],
        ],
      },
    ],
  },
  // ============== monthly
  monthly: {
    items: [
      "[BẾP] Tủ lạnh",
      "[GÁC] Quét Dọn (Sắp xếp + bỏ bớt đồ để lâu)",
      "[Lầu 2] Dọn hồ cá",
      "[Lầu 1] Giặt khăn lau",
    ],
  },
  quarterly: {
    items: ["Lau cửa kính", "Tổng VS Bếp", ""],
  },
  // ============== annual
  semiAnnual: {
    items: ["VS máy giặt", "", ""],
  },
  annual: {
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
