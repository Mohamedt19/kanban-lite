import { useMemo, useState } from "react";
import type { ColumnId, Task } from "../types/board";

type Props = {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, description: string) => void;
  onMove: (id: string, to: ColumnId) => void;
};

const ORDER: ColumnId[] = ["backlog", "in_progress", "done"];

function leftOf(col: ColumnId) {
  const i = ORDER.indexOf(col);
  return i > 0 ? ORDER[i - 1] : null;
}
function rightOf(col: ColumnId) {
  const i = ORDER.indexOf(col);
  return i < ORDER.length - 1 ? ORDER[i + 1] : null;
}

export function TaskCard({ task, onDelete, onEdit, onMove }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description);

  const createdLabel = useMemo(() => {
    const d = new Date(task.createdAt);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }, [task.createdAt]);

  const canLeft = leftOf(task.column);
  const canRight = rightOf(task.column);

  function save() {
    onEdit(task.id, title, desc);
    setEditing(false);
  }

  function onDragStart(e: React.DragEvent) {
    // Store the task id in the drag payload
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <div
      className={`card ${editing ? "" : "draggable"}`}
      draggable={!editing}
      onDragStart={onDragStart}
    >
      {!editing ? (
        <>
          <div className="cardTitleRow">
            <div className="cardTitle">{task.title}</div>
            <div className="tiny">{createdLabel}</div>
          </div>

          {task.description.trim() ? (
            <div className="cardDesc">{task.description}</div>
          ) : (
            <div className="cardDesc muted">No description</div>
          )}
        </>
      ) : (
        <div className="editStack">
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="textarea"
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
      )}

      <div className="cardActions">
        <button
          className="btn"
          disabled={!canLeft || editing}
          onClick={() => canLeft && onMove(task.id, canLeft)}
        >
          ←
        </button>

        <button
          className="btn"
          disabled={!canRight || editing}
          onClick={() => canRight && onMove(task.id, canRight)}
        >
          →
        </button>

        {!editing ? (
          <button className="btn" onClick={() => setEditing(true)}>
            Edit
          </button>
        ) : (
          <>
            <button className="btnPrimary" onClick={save}>
              Save
            </button>
            <button
              className="btn"
              onClick={() => {
                setTitle(task.title);
                setDesc(task.description);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        )}

        <button className="btnDanger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}