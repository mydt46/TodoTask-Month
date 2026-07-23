// ============================================================
// app.js — Rendering + checkbox/state logic for the
// Cleaning Schedule. Reads content from SCHEDULE_DATA (data.js).
// ============================================================

(function () {
  const STORAGE_KEY = "TodoSchState";

  // { [checkboxId]: true|false }
  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn("Could not read saved state, starting fresh.", e);
      return {};
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Could not save state.", e);
    }
  }

  function isChecked(id) {
    return !!state[id];
  }

  function setChecked(id, value) {
    state[id] = value;
    saveState();
  }

  /**
   * Creates a checkbox <input> wired to the state object, plus
   * registers it against a "row group" so that when every
   * checkbox belonging to the same task is checked, the row's
   * text element gets the "done" (greyed-out) treatment.
   */
  function makeCheckbox({ id, className, rowGroup }) {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = className;
    input.checked = isChecked(id);
    input.dataset.id = id;
    input.addEventListener("change", () => {
      setChecked(id, input.checked);
      updateRowGroup(rowGroup);
    });
    rowGroup.ids.push(id);
    rowGroup.inputs.push(input);
    return input;
  }

  /** Recomputes whether every checkbox in a row group is checked,
   *  and toggles the greyed-out class on the associated text/line element. */
  function updateRowGroup(rowGroup) {
    if (!rowGroup.ids.length) return;
    const allChecked = rowGroup.ids.every((id) => isChecked(id));
    rowGroup.lineEl.classList.toggle("done", allChecked);
  }

  function makeRowGroup(lineEl) {
    return { ids: [], inputs: [], lineEl };
  }

  // ---------------------------------------------------------
  // WEEKLY
  // ---------------------------------------------------------
  function renderWeekly(data) {
    document.getElementById("weeklyHeading").textContent = data.heading;

    const headRow = document.getElementById("weeklyHeaderRow");
    data.days.forEach((day) => {
      const th = document.createElement("th");
      th.textContent = day.day;
      th.style.background = day.color;
      headRow.appendChild(th);
    });

    const body = document.getElementById("weeklyCategoryRow");

    // category header row
    const catTr = document.createElement("tr");
    data.days.forEach((day) => {
      const td = document.createElement("td");
      td.className = "category";
      td.textContent = day.category;
      catTr.appendChild(td);
    });
    body.appendChild(catTr);

    const maxItems = Math.max(...data.days.map((d) => d.items.length));

    for (let i = 0; i < maxItems; i++) {
      const tr = document.createElement("tr");
      data.days.forEach((day, dayIndex) => {
        const td = document.createElement("td");
        td.className = "item";
        const text = day.items[i] || "";

        if (text) {
          const line = document.createElement("div");
          line.className = "task-line";

          const rowGroup = makeRowGroup(line);
          const id = `${SCHEDULE_DATA.week_key}-w-${dayIndex}-${i}`;
          const cb = makeCheckbox({ id, className: "chk", rowGroup });

          const span = document.createElement("span");
          span.className = "task-text";
          span.textContent = text;

          line.appendChild(cb);
          line.appendChild(span);
          td.appendChild(line);

          updateRowGroup(rowGroup);
        }
        tr.appendChild(td);
      });
      body.appendChild(tr);
    }
  }

  // ---------------------------------------------------------
  // Generic grid section (Tracking/ Monthly / Quarterly / Semi Annual):
  // each task's label AND its period checkboxes sit together
  // on one row. A task's text greys out once every checkbox
  // in that same row is checked.
  // ---------------------------------------------------------
  function renderGridSection({
    data,
    idPrefix,
    headingElId,
    gridElId,
    cellSize,
  }) {
    document.getElementById(headingElId).textContent = data.heading;

    const gridEl = document.getElementById(gridElId);
    const size = cellSize || 30;
    const columnsTemplate = `minmax(180px, 1fr) repeat(${data.columns.length}, ${size}px)`;

    // ---- header row: blank label cell + period labels ----
    const headerRow = document.createElement("div");
    headerRow.className = "grid-row header-row";
    headerRow.style.gridTemplateColumns = columnsTemplate;

    const spacer = document.createElement("div");
    headerRow.appendChild(spacer);

    data.columns.forEach((label) => {
      const h = document.createElement("div");
      h.className = "hcell";
      h.textContent = label;
      h.style.background = data.headerColor;
      headerRow.appendChild(h);
    });

    gridEl.appendChild(headerRow);

    // ---- data rows: task label + its own checkboxes, same row ----
    data.items.forEach((text, itemIndex) => {
      const row = document.createElement("div");
      row.className = "grid-row data-row";
      row.style.gridTemplateColumns = columnsTemplate;

      const labelCell = document.createElement("div");
      labelCell.className = "task-row-label";

      const line = document.createElement("div");
      line.className = "task-line";
      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = text;
      line.appendChild(span);
      labelCell.appendChild(line);
      row.appendChild(labelCell);

      const rowGroup = makeRowGroup(line);

      data.columns.forEach((_, colIndex) => {
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "cell-box";
        cb.style.background = data.cellColor;

        if (!text) {
          cb.disabled = true;
          cb.style.opacity = "0.5";
          row.appendChild(cb);
          return;
        }

        const id = `${SCHEDULE_DATA.week_key}-${idPrefix}-${itemIndex}-${colIndex}`;
        cb.checked = isChecked(id);
        cb.dataset.id = id;

        rowGroup.ids.push(id);
        rowGroup.inputs.push(cb);

        cb.addEventListener("change", () => {
          setChecked(id, cb.checked);
          updateRowGroup(rowGroup);
        });

        row.appendChild(cb);
      });

      gridEl.appendChild(row);
      updateRowGroup(rowGroup);
    });
  }

  // ---------------------------------------------------------
  // ANNUAL (single checkbox per task row)
  // ---------------------------------------------------------
  function renderAnnual(data) {
    document.getElementById("annualHeading").textContent = data.heading;

    function buildBlock(containerId, entries, side) {
      const container = document.getElementById(containerId);
      entries.forEach((entry, index) => {
        const row = document.createElement("div");
        row.className = "annual-row";

        const badge = document.createElement("div");
        badge.className = "letter-badge";
        badge.textContent = entry.letter;
        badge.style.background = data.headerColor;

        const line = document.createElement("div");
        line.className = "task-line";
        line.style.flex = "1";

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = entry.text;
        line.appendChild(span);

        const box = document.createElement("input");
        box.type = "checkbox";
        box.className = "cell-box";
        box.style.background = data.cellColor;

        row.appendChild(badge);
        row.appendChild(line);

        if (entry.text) {
          const rowGroup = makeRowGroup(line);
          const id = `${SCHEDULE_DATA.week_key}-${side}-${index}`;
          box.checked = isChecked(id);
          box.dataset.id = id;
          rowGroup.ids.push(id);
          rowGroup.inputs.push(box);
          box.addEventListener("change", () => {
            setChecked(id, box.checked);
            updateRowGroup(rowGroup);
          });
          updateRowGroup(rowGroup);
        } else {
          box.disabled = true;
          box.style.opacity = "0.5";
        }

        row.appendChild(box);
        container.appendChild(row);
      });
    }

    buildBlock("annualLeft", data.left, "al");
    buildBlock("annualRight", data.right, "ar");
  }

  // ---------------------------------------------------------
  // DAILY (single checkbox per task row)
  // ---------------------------------------------------------
  function renderDaily(data) {
    document.getElementById("dailyHeading").textContent = data.heading;

    function buildBlock(containerId, entries, side) {
      const container = document.getElementById(containerId);
      entries.forEach((entry, index) => {
        const row = document.createElement("div");
        row.className = "daily-row";

        const badge = document.createElement("div");
        badge.className = "letter-badge";
        badge.textContent = entry.letter;
        badge.style.background = data.headerColor;

        const line = document.createElement("div");
        line.className = "task-line";
        line.style.flex = "1";

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = entry.text;
        line.appendChild(span);

        const box = document.createElement("input");
        box.type = "checkbox";
        box.className = "cell-box";
        box.style.background = data.cellColor;

        row.appendChild(badge);
        row.appendChild(line);

        if (entry.text) {
          const rowGroup = makeRowGroup(line);
          const id = `${SCHEDULE_DATA.week_key}-${side}-${index}`;
          box.checked = isChecked(id);
          box.dataset.id = id;
          rowGroup.ids.push(id);
          rowGroup.inputs.push(box);
          box.addEventListener("change", () => {
            setChecked(id, box.checked);
            updateRowGroup(rowGroup);
          });
          updateRowGroup(rowGroup);
        } else {
          box.disabled = true;
          box.style.opacity = "0.5";
        }

        row.appendChild(box);
        container.appendChild(row);
      });
    }

    buildBlock("dailyLeft", data.left, "dl");
    buildBlock("dailyRight", data.right, "dr");
  }

  // ---------------------------------------------------------
  // Reset
  // ---------------------------------------------------------
  function wireResetButton() {
    const btn = document.getElementById("resetBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (!confirm("Xóa toàn bộ trạng thái đã tick và bắt đầu lại?")) return;
      state = {};
      saveState();
      location.reload();
    });
  }

  // ---------------------------------------------------------
  // Init
  // ---------------------------------------------------------
  function init() {
    const D = SCHEDULE_DATA;
    document.getElementById("mainTitle").textContent = D.title;

    renderDaily(D.daily);

    renderWeekly(D.weekly);

    renderGridSection({
      data: D.tracking,
      idPrefix: "t",
      headingElId: "trackingHeading",
      gridElId: "trackingGrid",
      cellSize: 28,
    });

    renderGridSection({
      data: D.monthly,
      idPrefix: "m",
      headingElId: "monthlyHeading",
      gridElId: "monthlyGrid",
      cellSize: 28,
    });

    renderGridSection({
      data: D.quarterly,
      idPrefix: "q",
      headingElId: "quarterlyHeading",
      gridElId: "quarterlyGrid",
      cellSize: 28,
    });

    renderGridSection({
      data: D.semiAnnual,
      idPrefix: "s",
      headingElId: "semiHeading",
      gridElId: "semiGrid",
      cellSize: 32,
    });

    renderAnnual(D.annual);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
