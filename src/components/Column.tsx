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
  const [isOver, setIsOver] = useState(false);

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsOver(true);
  }

  function onDragLeave() {
    setIsOver(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsOver(false);

    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    onMove(taskId, id);
  }

  return (
    <section
      className={`col ${isOver ? "colOver" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="colHeader">
        <div className="colTitle">{title}</div>
        <div className="pill">{tasks.length}</div>
      </div>

      {tasks.length === 0 ? (
        <div className="emptySmall emptyPop">
          <div className="emptyIcon" />
          <div className="emptyTitle">No tasks</div>
          <div className="emptyText">Drag a card here or add one above.</div>
        </div>
      ) : (
        <div className="colList">
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

      <div className="colHint">Drag cards between columns.</div>
    </section>
  );
}