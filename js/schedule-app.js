// Shared renderer and checkbox state for every schedule page.
(function () {
  "use strict";

  const STORAGE_KEY = "TodoSchState";
  const GRID_SECTIONS = [
    ["tracking", "t", "trackingHeading", "trackingGrid", 28],
    ["tracking_month", "tm", "trackingMonthHeading", "trackingMonthGrid", 24],
    ["monthly", "m", "monthlyHeading", "monthlyGrid", 28],
    ["quarterly", "q", "quarterlyHeading", "quarterlyGrid", 28],
    ["semiAnnual", "s", "semiHeading", "semiGrid", 32],
  ];

  let state = {};
  let currentTodoKey = "";

  function getElement(id) {
    return document.getElementById(id);
  }

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function loadLocalState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      console.warn("Could not read saved state, starting fresh.", error);
      return {};
    }
  }

  function saveLocalState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Could not save state.", error);
    }
  }

  function updateRow(rowGroup) {
    if (!rowGroup.ids.length) return;
    const isDone = rowGroup.ids.every((id) => Boolean(state[id]));
    rowGroup.lineElement.classList.toggle("done", isDone);
  }

  function createCheckbox({
    id,
    className,
    rowGroup,
    color,
    disabled = false,
  }) {
    const checkbox = createElement("input", className);
    checkbox.type = "checkbox";
    if (color) checkbox.style.background = color;

    if (disabled) {
      checkbox.disabled = true;
      checkbox.style.opacity = "0.5";
      return checkbox;
    }

    checkbox.checked = Boolean(state[id]);
    checkbox.dataset.id = id;
    rowGroup.ids.push(id);
    checkbox.addEventListener("change", () => {
      state[id] = checkbox.checked;
      saveLocalState();
      updateRow(rowGroup);
    });
    return checkbox;
  }

  function createTaskLine(text) {
    const lineElement = createElement("div", "task-line");
    lineElement.appendChild(createElement("span", "task-text", text));
    return {
      lineElement,
      rowGroup: { ids: [], lineElement },
    };
  }

  function getScheduleContent() {
    if (typeof SCHEDULE_CONTENT === "undefined") {
      throw new Error("Missing schedule content file.");
    }
    return SCHEDULE_CONTENT;
  }

  function combineScheduleData(config, content) {
    const combined = {
      todo_key: content.todo_key,
      title: content.title,
    };

    Object.keys(config).forEach((sectionName) => {
      if (!content[sectionName]) return;
      combined[sectionName] = {
        ...config[sectionName],
        ...content[sectionName],
      };
    });

    if (combined.weekly) {
      combined.weekly.weeks = content.weekly.weeks.map((week) => ({
        days: config.weekly.days.map((day, dayIndex) => ({
          ...day,
          items: week.items[dayIndex] || [],
        })),
      }));
    }

    return combined;
  }

  function renderWeeklyTable(data, headerRow, body, weekIndex, weekCount) {
    data.days.forEach((day) => {
      const header = createElement("th", "", day.day);
      header.style.background = day.color;
      headerRow.appendChild(header);
    });

    const maxItems = Math.max(0, ...data.days.map((day) => day.items.length));
    for (let itemIndex = 0; itemIndex < maxItems; itemIndex += 1) {
      const row = createElement("tr");
      data.days.forEach((day, dayIndex) => {
        const cell = createElement("td", "item");
        const text = day.items[itemIndex] || "";

        if (text) {
          const { lineElement, rowGroup } = createTaskLine(text);
          const weekIdPart = weekCount > 1 ? `w-${weekIndex}` : "w";
          const checkbox = createCheckbox({
            id: `${currentTodoKey}-${weekIdPart}-${dayIndex}-${itemIndex}`,
            className: "chk",
            rowGroup,
          });
          lineElement.prepend(checkbox);
          cell.appendChild(lineElement);
          updateRow(rowGroup);
        }
        row.appendChild(cell);
      });
      body.appendChild(row);
    }
  }

  function createWeeklyTable() {
    const table = createElement("table", "weekly");
    const tableHead = createElement("thead");
    const headerRow = createElement("tr");
    const body = createElement("tbody");
    tableHead.appendChild(headerRow);
    table.appendChild(tableHead);
    table.appendChild(body);
    return { table, headerRow, body };
  }

  function renderWeekly(data) {
    const section = getElement("weeklySection");
    const heading = getElement("weeklyHeading");
    if (!section || !heading) return;

    heading.textContent = data.heading;
    const weekCount = data.weeks.length;

    if (weekCount === 1) {
      const headerRow = getElement("weeklyHeaderRow");
      const body = getElement("weeklyCategoryRow");
      if (headerRow && body) {
        renderWeeklyTable(data.weeks[0], headerRow, body, 1, weekCount);
      }
      return;
    }

    section.querySelector("table.weekly")?.remove();
    const weeklyList = createElement("div", "weekly-list");
    for (let weekIndex = 1; weekIndex <= weekCount; weekIndex += 1) {
      const weekBlock = createElement("div", "weekly-block");
      const { table, headerRow, body } = createWeeklyTable();
      weekBlock.appendChild(table);
      weeklyList.appendChild(weekBlock);
      renderWeeklyTable(
        data.weeks[weekIndex - 1],
        headerRow,
        body,
        weekIndex,
        weekCount,
      );
    }
    section.appendChild(weeklyList);
  }

  function renderGridSection(data, idPrefix, headingId, gridId, cellSize) {
    const heading = getElement(headingId);
    const grid = getElement(gridId);
    if (!heading || !grid) return;

    heading.textContent = data.heading;
    const columns = `minmax(180px, 1fr) repeat(${data.columns.length}, ${cellSize}px)`;
    const headerRow = createElement("div", "grid-row header-row");
    headerRow.style.gridTemplateColumns = columns;
    headerRow.appendChild(createElement("div"));

    data.columns.forEach((label) => {
      const header = createElement("div", "hcell", label);
      header.style.background = data.headerColor;
      headerRow.appendChild(header);
    });
    grid.appendChild(headerRow);

    data.items.forEach((text, itemIndex) => {
      const row = createElement("div", "grid-row data-row");
      row.style.gridTemplateColumns = columns;

      const labelCell = createElement("div", "task-row-label");
      const { lineElement, rowGroup } = createTaskLine(text);
      labelCell.appendChild(lineElement);
      row.appendChild(labelCell);

      data.columns.forEach((unused, columnIndex) => {
        row.appendChild(
          createCheckbox({
            id: `${currentTodoKey}-${idPrefix}-${itemIndex}-${columnIndex}`,
            className: "cell-box",
            rowGroup,
            color: data.cellColor,
            disabled: !text,
          }),
        );
      });
      grid.appendChild(row);
      updateRow(rowGroup);
    });
  }

  function normalizeTracking(value, columnCount) {
    let tracking = value;
    if (typeof tracking === "string") {
      try {
        tracking = JSON.parse(tracking);
      } catch (error) {
        tracking = [];
      }
    }

    return Array.from(
      { length: columnCount },
      (unused, index) => Boolean(Array.isArray(tracking) && tracking[index]),
    );
  }

  function renderTrackingMonth(data, rows) {
    const heading = getElement("trackingMonthHeading");
    const grid = getElement("trackingMonthGrid");
    if (!heading || !grid) return;

    heading.textContent = data.heading;
    grid.replaceChildren();

    const columns = `minmax(180px, 1fr) repeat(${data.columns.length}, 24px)`;
    const headerRow = createElement("div", "grid-row header-row");
    headerRow.style.gridTemplateColumns = columns;
    headerRow.appendChild(createElement("div"));
    data.columns.forEach((label) => {
      const header = createElement("div", "hcell", label);
      header.style.background = data.headerColor;
      headerRow.appendChild(header);
    });
    grid.appendChild(headerRow);

    rows.forEach((trackingRow) => {
      const tracking = normalizeTracking(
        trackingRow.tracking,
        data.columns.length,
      );
      const row = createElement("div", "grid-row data-row");
      row.style.gridTemplateColumns = columns;

      const labelCell = createElement("div", "task-row-label");
      const { lineElement, rowGroup } = createTaskLine(trackingRow.title || "");
      labelCell.appendChild(lineElement);
      row.appendChild(labelCell);

      data.columns.forEach((unused, columnIndex) => {
        const checkbox = createElement("input", "cell-box");
        checkbox.type = "checkbox";
        checkbox.checked = tracking[columnIndex];
        checkbox.style.background = data.cellColor;
        rowGroup.ids.push(`${trackingRow.id}-${columnIndex}`);
        state[`${trackingRow.id}-${columnIndex}`] = tracking[columnIndex];

        checkbox.addEventListener("change", async () => {
          const previousValue = tracking[columnIndex];
          tracking[columnIndex] = checkbox.checked;
          state[`${trackingRow.id}-${columnIndex}`] = checkbox.checked;
          updateRow(rowGroup);
          checkbox.disabled = true;

          try {
            await window.TrackingData.updateTracking(trackingRow.id, tracking);
          } catch (error) {
            tracking[columnIndex] = previousValue;
            checkbox.checked = previousValue;
            state[`${trackingRow.id}-${columnIndex}`] = previousValue;
            updateRow(rowGroup);
            console.error(`Could not update tracking row ${trackingRow.id}.`, error);
          } finally {
            checkbox.disabled = false;
          }
        });
        row.appendChild(checkbox);
      });

      grid.appendChild(row);
      updateRow(rowGroup);
    });
  }

  function renderTwoColumnSection(data, options) {
    const heading = getElement(options.headingId);
    if (!heading) return;
    heading.textContent = data.heading;

    [
      [options.leftId, data.left, options.leftPrefix],
      [options.rightId, data.right, options.rightPrefix],
    ].forEach(([containerId, entries, idPrefix]) => {
      const container = getElement(containerId);
      if (!container) return;

      entries.forEach((entry, index) => {
        const row = createElement("div", options.rowClass);
        const badge = createElement("div", "letter-badge", entry.letter);
        badge.style.background = data.headerColor;

        const { lineElement, rowGroup } = createTaskLine(entry.text);
        lineElement.style.flex = "1";
        row.appendChild(badge);
        row.appendChild(lineElement);
        row.appendChild(
          createCheckbox({
            id: `${currentTodoKey}-${idPrefix}-${index}`,
            className: "cell-box",
            rowGroup,
            color: data.cellColor,
            disabled: !entry.text,
          }),
        );
        container.appendChild(row);
        updateRow(rowGroup);
      });
    });
  }

  async function mergeFinalizedState() {
    if (!getElement("finalizeDataBtn") || !window.FinalizeData?.loadPageState) {
      return;
    }
    try {
      const finalizedState = await window.FinalizeData.loadPageState(currentTodoKey);
      if (finalizedState && typeof finalizedState === "object") {
        state = { ...state, ...finalizedState };
      }
    } catch (error) {
      console.warn("Could not load finalized state.", error);
    }
  }

  async function init() {
    const data = combineScheduleData(SCHEDULE_DATA, getScheduleContent());
    currentTodoKey = data.todo_key;
    state = loadLocalState();
    await mergeFinalizedState();

    getElement("mainTitle").textContent = data.title;

    if (data.daily) {
      renderTwoColumnSection(data.daily, {
        headingId: "dailyHeading",
        leftId: "dailyLeft",
        rightId: "dailyRight",
        leftPrefix: "dl",
        rightPrefix: "dr",
        rowClass: "daily-row",
      });
    }

    if (data.weekly) renderWeekly(data.weekly);

    GRID_SECTIONS.forEach(
      ([sectionName, prefix, headingId, gridId, cellSize]) => {
        if (data[sectionName] && sectionName !== "tracking_month") {
          renderGridSection(
            data[sectionName],
            prefix,
            headingId,
            gridId,
            cellSize,
          );
        }
      },
    );

    if (data.tracking_month) {
      try {
        if (!window.TrackingData) {
          throw new Error("Tracking data service is not loaded.");
        }
        const month = Number(currentTodoKey.replace(/\D/g, ""));
        const trackingRows = await window.TrackingData.loadByMonth(month);
        renderTrackingMonth(data.tracking_month, trackingRows);
      } catch (error) {
        console.error("Could not load tracking data from Supabase.", error);
        renderTrackingMonth(data.tracking_month, []);
      }
    }

    if (data.annual) {
      renderTwoColumnSection(data.annual, {
        headingId: "annualHeading",
        leftId: "annualLeft",
        rightId: "annualRight",
        leftPrefix: "al",
        rightPrefix: "ar",
        rowClass: "annual-row",
      });
    }

    window.FinalizeData?.attachFinalizeButton?.({
      todoKey: currentTodoKey,
      getState: () => state,
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
