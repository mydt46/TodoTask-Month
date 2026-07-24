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
      month: content.month,
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
        const item = day.items[itemIndex] || "";
        const isDatabaseItem =
          item && typeof item === "object" && item.id !== undefined;
        const text = isDatabaseItem ? item.title || "" : item;

        if (text) {
          const { lineElement, rowGroup } = createTaskLine(text);
          let checkbox;

          if (isDatabaseItem) {
            const stateId = `weekly-${item.id}`;
            state[stateId] = Boolean(item.isDone);
            rowGroup.ids.push(stateId);
            checkbox = createElement("input", "chk");
            checkbox.type = "checkbox";
            checkbox.checked = Boolean(item.isDone);
            checkbox.dataset.id = item.id;
            checkbox.addEventListener("change", async () => {
              const previousValue = Boolean(item.isDone);
              item.isDone = checkbox.checked;
              state[stateId] = checkbox.checked;
              updateRow(rowGroup);
              checkbox.disabled = true;

              try {
                await window.WeeklyData.updateIsDone(item.id, checkbox.checked);
              } catch (error) {
                item.isDone = previousValue;
                checkbox.checked = previousValue;
                state[stateId] = previousValue;
                updateRow(rowGroup);
                console.error(`Could not update weekly row ${item.id}.`, error);
              } finally {
                checkbox.disabled = false;
              }
            });
          } else {
            const weekIdPart = weekCount > 1 ? `w-${weekIndex}` : "w";
            checkbox = createCheckbox({
              id: `${currentTodoKey}-${weekIdPart}-${dayIndex}-${itemIndex}`,
              className: "chk",
              rowGroup,
            });
          }
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

  function groupWeeklyRows(rows) {
    const weekNumbers = [...new Set(rows.map((row) => Number(row.week)))]
      .filter((week) => Number.isInteger(week))
      .sort((left, right) => left - right);

    return weekNumbers.map((week) => ({
      days: Array.from({ length: 7 }, (unused, dayOfWeek) => ({
        ...SCHEDULE_DATA.weekly.days[dayOfWeek],
        items: rows.filter(
          (row) =>
            Number(row.week) === week &&
            Number(row.dayOfWeek) === dayOfWeek,
        ),
      })),
    }));
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

  function renderTrackingGrid(
    data,
    rows,
    headingId,
    gridId,
    cellSize,
    statePrefix,
  ) {
    const heading = getElement(headingId);
    const grid = getElement(gridId);
    if (!heading || !grid) return;

    heading.textContent = data.heading;
    grid.replaceChildren();

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
        const stateId = `${statePrefix}-${trackingRow.id}-${columnIndex}`;
        rowGroup.ids.push(stateId);
        state[stateId] = tracking[columnIndex];

        checkbox.addEventListener("change", async () => {
          const previousValue = tracking[columnIndex];
          tracking[columnIndex] = checkbox.checked;
          state[stateId] = checkbox.checked;
          updateRow(rowGroup);
          checkbox.disabled = true;

          try {
            await window.TrackingData.updateTracking(trackingRow.id, tracking);
          } catch (error) {
            tracking[columnIndex] = previousValue;
            checkbox.checked = previousValue;
            state[stateId] = previousValue;
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

  function renderTrackingMonth(data, rows) {
    renderTrackingGrid(
      data,
      rows,
      "trackingMonthHeading",
      "trackingMonthGrid",
      24,
      "tracking-month",
    );
  }

  function renderFollowingTracking(data, rows) {
    const heading = getElement("trackingHeading");
    const grid = getElement("trackingGrid");
    if (!heading || !grid) return;

    heading.textContent = data.heading;
    grid.replaceChildren();

    const columns = `minmax(180px, 1fr) repeat(${data.columns.length}, 28px)`;
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
      const start = Math.max(0, Number(trackingRow.startFollowing) || 0);
      const quantity = Math.min(
        data.columns.length,
        Math.max(0, Number(trackingRow.qtyFollowing) || 0),
      );
      let rawTracking = trackingRow.tracking;
      if (typeof rawTracking === "string") {
        try {
          rawTracking = JSON.parse(rawTracking);
        } catch (error) {
          rawTracking = [];
        }
      }
      const sourceTracking = Array.isArray(rawTracking)
        ? rawTracking.map(Boolean)
        : [];
      while (sourceTracking.length < start + quantity) {
        sourceTracking.push(false);
      }
      const leadingDisabled =
        quantity < data.columns.length && start < 10
          ? data.columns.length - quantity
          : 0;

      const row = createElement("div", "grid-row data-row");
      row.style.gridTemplateColumns = columns;
      const labelCell = createElement("div", "task-row-label");
      const { lineElement, rowGroup } = createTaskLine(trackingRow.title || "");
      labelCell.appendChild(lineElement);
      row.appendChild(labelCell);

      data.columns.forEach((unused, columnIndex) => {
        const relativeIndex = columnIndex - leadingDisabled;
        const isMissing =
          relativeIndex < 0 ||
          relativeIndex >= quantity ||
          (quantity < data.columns.length &&
            start > 20 &&
            columnIndex >= quantity);
        const checkbox = createElement("input", "cell-box");
        checkbox.type = "checkbox";
        checkbox.style.background = data.cellColor;

        if (isMissing) {
          checkbox.disabled = true;
          checkbox.style.opacity = "0.5";
          row.appendChild(checkbox);
          return;
        }

        const trackingIndex = start + relativeIndex;
        const stateId = `following-${trackingRow.id}-${trackingIndex}`;
        checkbox.checked = Boolean(sourceTracking[trackingIndex]);
        checkbox.dataset.id = trackingRow.id;
        checkbox.dataset.trackingIndex = trackingIndex;
        rowGroup.ids.push(stateId);
        state[stateId] = checkbox.checked;

        checkbox.addEventListener("change", async () => {
          const previousValue = sourceTracking[trackingIndex];
          sourceTracking[trackingIndex] = checkbox.checked;
          state[stateId] = checkbox.checked;
          updateRow(rowGroup);
          checkbox.disabled = true;

          try {
            await window.TrackingData.updateTracking(
              trackingRow.id,
              sourceTracking,
            );
          } catch (error) {
            sourceTracking[trackingIndex] = previousValue;
            checkbox.checked = previousValue;
            state[stateId] = previousValue;
            updateRow(rowGroup);
            console.error(
              `Could not update following tracking row ${trackingRow.id}.`,
              error,
            );
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

  function renderTodoRows(
    data,
    rows,
    {
      headingId = "dailyHeading",
      leftId = "dailyLeft",
      rightId = "dailyRight",
      rowClass = "daily-row",
      statePrefix = "todo",
    } = {},
  ) {
    const heading = getElement(headingId);
    if (!heading) return;
    heading.textContent = data.heading;

    const columns = [
      [leftId, rows.filter((row) => row.isLeft === true)],
      [rightId, rows.filter((row) => row.isLeft !== true)],
    ];

    columns.forEach(([containerId, entries]) => {
      const container = getElement(containerId);
      if (!container) return;
      container.replaceChildren();

      entries.forEach((todo) => {
        const row = createElement("div", rowClass);
        const badge = createElement("div", "letter-badge", todo.letter || "");
        badge.style.background = data.headerColor;

        const { lineElement, rowGroup } = createTaskLine(todo.title || "");
        const stateId = `${statePrefix}-${todo.id}`;
        const checkbox = createElement("input", "cell-box");
        checkbox.type = "checkbox";
        checkbox.style.background = data.cellColor;
        checkbox.checked = Boolean(todo.isDone);
        checkbox.dataset.id = todo.id;
        lineElement.style.flex = "1";
        rowGroup.ids.push(stateId);
        state[stateId] = checkbox.checked;

        checkbox.addEventListener("change", async () => {
          const previousValue = Boolean(todo.isDone);
          todo.isDone = checkbox.checked;
          state[stateId] = checkbox.checked;
          updateRow(rowGroup);
          checkbox.disabled = true;

          try {
            await window.TodoListData.updateIsDone(todo.id, checkbox.checked);
          } catch (error) {
            todo.isDone = previousValue;
            checkbox.checked = previousValue;
            state[stateId] = previousValue;
            updateRow(rowGroup);
            console.error(`Could not update todo row ${todo.id}.`, error);
          } finally {
            checkbox.disabled = false;
          }
        });

        row.appendChild(badge);
        row.appendChild(lineElement);
        row.appendChild(checkbox);
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
      try {
        if (!window.TodoListData) {
          throw new Error("Todo list data service is not loaded.");
        }
        const todoRows = data.daily.followingOnly
          ? await window.TodoListData.loadFollowing()
          : await window.TodoListData.loadByMonth(data.month || 0);
        renderTodoRows(data.daily, todoRows);
      } catch (error) {
        console.error("Could not load todo data from Supabase.", error);
        renderTodoRows(data.daily, []);
      }
    }

    if (data.weekly) {
      try {
        if (!window.WeeklyData) {
          throw new Error("Weekly data service is not loaded.");
        }
        const weeklyRows = data.weekly.currentWeekOnly
          ? await window.WeeklyData.loadCurrentWeek()
          : await window.WeeklyData.loadByMonth(data.month || 0);
        data.weekly.weeks = groupWeeklyRows(weeklyRows);
        renderWeekly(data.weekly);
      } catch (error) {
        console.error("Could not load weekly data from Supabase.", error);
        data.weekly.weeks = [];
        renderWeekly(data.weekly);
      }
    }

    GRID_SECTIONS.forEach(
      ([sectionName, prefix, headingId, gridId, cellSize]) => {
        if (
          data[sectionName] &&
          sectionName !== "tracking_month" &&
          data[sectionName].trackingMonth === undefined &&
          !(sectionName === "tracking" && data.tracking.followingOnly)
        ) {
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

    if (data.tracking?.followingOnly) {
      try {
        if (!window.TrackingData) {
          throw new Error("Tracking data service is not loaded.");
        }
        const followingRows = await window.TrackingData.loadFollowing();
        renderFollowingTracking(data.tracking, followingRows);
      } catch (error) {
        console.error("Could not load following tracking data.", error);
        renderFollowingTracking(data.tracking, []);
      }
    }

    if (data.tracking_month) {
      try {
        if (!window.TrackingData) {
          throw new Error("Tracking data service is not loaded.");
        }
        const trackingRows = await window.TrackingData.loadByMonth(data.month);
        renderTrackingMonth(data.tracking_month, trackingRows);
      } catch (error) {
        console.error("Could not load tracking data from Supabase.", error);
        renderTrackingMonth(data.tracking_month, []);
      }
    }

    const trackingGridSections = [
      ["monthly", "monthlyHeading", "monthlyGrid", 28],
      ["quarterly", "quarterlyHeading", "quarterlyGrid", 28],
      ["semiAnnual", "semiHeading", "semiGrid", 32],
    ];

    for (const [
      sectionName,
      headingId,
      gridId,
      cellSize,
    ] of trackingGridSections) {
      const sectionData = data[sectionName];
      if (sectionData?.trackingMonth === undefined) continue;

      try {
        if (!window.TrackingData) {
          throw new Error("Tracking data service is not loaded.");
        }
        const rows = await window.TrackingData.loadByMonth(
          sectionData.trackingMonth,
        );
        renderTrackingGrid(
          sectionData,
          rows,
          headingId,
          gridId,
          cellSize,
          sectionName,
        );
      } catch (error) {
        console.error(`Could not load ${sectionName} data from Supabase.`, error);
        renderTrackingGrid(
          sectionData,
          [],
          headingId,
          gridId,
          cellSize,
          sectionName,
        );
      }
    }

    if (data.annual?.todoMonth !== undefined) {
      const annualOptions = {
        headingId: "annualHeading",
        leftId: "annualLeft",
        rightId: "annualRight",
        rowClass: "annual-row",
        statePrefix: "annual-todo",
      };

      try {
        if (!window.TodoListData) {
          throw new Error("Todo list data service is not loaded.");
        }
        const annualRows = await window.TodoListData.loadByMonth(
          data.annual.todoMonth,
        );
        renderTodoRows(data.annual, annualRows, annualOptions);
      } catch (error) {
        console.error("Could not load annual data from Supabase.", error);
        renderTodoRows(data.annual, [], annualOptions);
      }
    } else if (data.annual) {
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
