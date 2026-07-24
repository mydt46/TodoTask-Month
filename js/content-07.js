// ============================================================
// content.js - Editable task content for TODO Th07.
// data.js keeps layout/colors/labels and reads task text from here.
// ============================================================

const SCHEDULE_CONTENT = {
  todo_key: "m7",
  title: "TODO Th07",
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
};
