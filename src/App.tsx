import { useMemo, useState } from "react";
import "./styles.css";

import { useBoard } from "./hooks/useBoard";
import { TaskForm } from "./components/TaskForm";
import { Column } from "./components/Column";
import type { ColumnId } from "./types/board";

type Tab = "all" | ColumnId;

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "backlog", label: "Backlog" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export default function App() {
  const {
    tasks,
    addTask,
    deleteTask,
    editTask,
    moveTask,
    query,
    setQuery,
    clearAll, // optional (if you added it in useBoard)
  } = useBoard();

  const [tab, setTab] = useState<Tab>("all");

  const visibleTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;

    return tasks.filter((t) => {
      const text = (t.title + " " + (t.description ?? "")).toLowerCase();
      return text.includes(q);
    });
  }, [tasks, query]);

  const backlog = useMemo(
    () => visibleTasks.filter((t) => t.column === "backlog"),
    [visibleTasks]
  );
  const inProgress = useMemo(
    () => visibleTasks.filter((t) => t.column === "in_progress"),
    [visibleTasks]
  );
  const done = useMemo(
    () => visibleTasks.filter((t) => t.column === "done"),
    [visibleTasks]
  );

  const showBacklog = tab === "all" || tab === "backlog";
  const showInProgress = tab === "all" || tab === "in_progress";
  const showDone = tab === "all" || tab === "done";

  const counts: Record<Tab, number> = {
    all: visibleTasks.length,
    backlog: backlog.length,
    in_progress: inProgress.length,
    done: done.length,
  };

  return (
    <div className="app">
      <header>
        <h1 className="heroTitle">Kanban Lite</h1>
        <p className="heroSub">React + TypeScript • localStorage • clean UI</p>
      </header>

      <div className="panel">
        <TaskForm onAdd={addTask} />
      </div>

      <div className="panel">
        <div className="rowBetween">
          <div className="field grow">
            <label className="label">Search</label>
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title or description…"
            />
          </div>

          <div className="pill">{visibleTasks.length} tasks</div>

          {/* Optional: Clear all */}
          {typeof clearAll === "function" && tasks.length > 0 && (
            <button className="btnDanger" type="button" onClick={clearAll}>
              Clear all
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="tabs" role="tablist" aria-label="Filter board">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={tab === t.key ? "tab tabActive" : "tab"}
              onClick={() => setTab(t.key)}
              role="tab"
              aria-selected={tab === t.key}
            >
              {t.label}
              <span className="tabCount">{counts[t.key]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="board">
        {showBacklog && (
          <Column
            id="backlog"
            title="Backlog"
            tasks={backlog}
            onDelete={deleteTask}
            onEdit={editTask}
            onMove={moveTask}
          />
        )}

        {showInProgress && (
          <Column
            id="in_progress"
            title="In Progress"
            tasks={inProgress}
            onDelete={deleteTask}
            onEdit={editTask}
            onMove={moveTask}
          />
        )}

        {showDone && (
          <Column
            id="done"
            title="Done"
            tasks={done}
            onDelete={deleteTask}
            onEdit={editTask}
            onMove={moveTask}
          />
        )}
      </div>
    </div>
  );
}