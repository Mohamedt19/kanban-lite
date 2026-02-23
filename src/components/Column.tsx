import { useState } from "react";
import type { ColumnId, Task } from "../types/board";
import { TaskCard } from "./TaskCard";

type Props = {
  id: ColumnId;
  title: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, description: string) => void;
  onMove: (id: string, to: ColumnId) => void;
};

export function Column({ id, title, tasks, onDelete, onEdit, onMove }: Props) {
  // UI-only state: just used to highlight the column when a card is dragged over it
  const [isOver, setIsOver] = useState(false);

  function onDragOver(e: React.DragEvent) {
    // Required: without preventDefault(), the browser won’t allow dropping here
    e.preventDefault();

    // Nice UX: shows a “move” cursor (instead of copy)
    e.dataTransfer.dropEffect = "move";

    setIsOver(true);
  }

  function onDragLeave() {
    // When the dragged card leaves this column, remove the highlight
    setIsOver(false);
  }

  function onDrop(e: React.DragEvent) {
    // Stop default browser behavior (like opening a dragged file)
    e.preventDefault();

    // Drop happened → remove highlight
    setIsOver(false);

    // We store the dragged task id in TaskCard via dataTransfer.setData("text/plain", taskId)
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    // Move the task into THIS column id
    onMove(taskId, id);
  }

  return (
    <section
      // Add a CSS class when the column is being hovered by a dragged card
      className={`col ${isOver ? "colOver" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="colHeader">
        <div className="colTitle">{title}</div>

        {/* Small counter pill (how many tasks in this column) */}
        <div className="pill">{tasks.length}</div>
      </div>

      {/* Empty state: makes the column not feel “broken” when it’s empty */}
      {tasks.length === 0 ? (
        <div className="emptySmall emptyPop">
          <div className="emptyIcon" />
          <div className="emptyTitle">No tasks</div>
          <div className="emptyText">Drag a card here or add one above.</div>
        </div>
      ) : (
        <div className="colList">
          {/* Render each task card inside this column */}
          {tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onDelete={onDelete}
              onEdit={onEdit}
              onMove={onMove}
            />
          ))}
        </div>
      )}

      {/* Tiny hint for first-time users */}
      <div className="colHint">Drag cards between columns.</div>
    </section>
  );
}