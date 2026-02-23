import { useMemo, useState } from "react";
import type { ColumnId, Task } from "../types/board";

type Props = {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, description: string) => void;
  onMove: (id: string, to: ColumnId) => void;
};

// Column order is used for the left/right buttons (Backlog → In Progress → Done)
const ORDER: ColumnId[] = ["backlog", "in_progress", "done"];

// Helpers to figure out which column is immediately left/right of the current one
function leftOf(col: ColumnId) {
  const i = ORDER.indexOf(col);
  return i > 0 ? ORDER[i - 1] : null;
}
function rightOf(col: ColumnId) {
  const i = ORDER.indexOf(col);
  return i < ORDER.length - 1 ? ORDER[i + 1] : null;
}

export function TaskCard({ task, onDelete, onEdit, onMove }: Props) {
  // When editing is true, we show inputs instead of the normal card UI
  const [editing, setEditing] = useState(false);

  // Local draft values while editing (so we don’t update the board until Save)
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description);

  // Format createdAt once (memo) so it doesn’t recalc on every render
  const createdLabel = useMemo(() => {
    const d = new Date(task.createdAt);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }, [task.createdAt]);

  // Used to enable/disable the left/right move buttons
  const canLeft = leftOf(task.column);
  const canRight = rightOf(task.column);

  function save() {
    // Push edits up to parent state (single source of truth)
    onEdit(task.id, title, desc);
    setEditing(false);
  }

  function onDragStart(e: React.DragEvent) {
    // Store the task id in the drag payload so the column can read it on drop
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <div
      // Small UX: only show "draggable" styling when not editing
      className={`card ${editing ? "" : "draggable"}`}
      // Disable dragging while editing so the user doesn’t accidentally move it
      draggable={!editing}
      onDragStart={onDragStart}
    >
      {!editing ? (
        <>
          {/* Title + created date */}
          <div className="cardTitleRow">
            <div className="cardTitle">{task.title}</div>
            <div className="tiny">{createdLabel}</div>
          </div>

          {/* Description (fallback text if empty) */}
          {task.description.trim() ? (
            <div className="cardDesc">{task.description}</div>
          ) : (
            <div className="cardDesc muted">No description</div>
          )}
        </>
      ) : (
        // Edit mode: controlled inputs using local draft state
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
        {/* Move left/right shortcuts (disabled at edges or while editing) */}
        <button
          className="btn"
          disabled={!canLeft || editing}
          onClick={() => canLeft && onMove(task.id, canLeft)}
          title="Move left"
        >
          ←
        </button>

        <button
          className="btn"
          disabled={!canRight || editing}
          onClick={() => canRight && onMove(task.id, canRight)}
          title="Move right"
        >
          →
        </button>

        {/* Edit / Save / Cancel */}
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
                // Reset draft values back to the saved task values
                setTitle(task.title);
                setDesc(task.description);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        )}

        {/* Delete always available (parent decides confirmation if needed) */}
        <button className="btnDanger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}