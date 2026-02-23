import { useState } from "react";

type Props = {
  // Parent callback: we pass the new task fields up, parent creates the Task object + id
  onAdd: (title: string, description: string) => void;
};

export function TaskForm({ onAdd }: Props) {
  // Local form state (controlled inputs)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();

    // Basic validation: title is required (ignore whitespace-only titles)
    if (!title.trim()) return;

    // Send the data up to the parent
    onAdd(title.trim(), description.trim());

    // Reset the form after submitting
    setTitle("");
    setDescription("");
  }

  return (
    <form className="panel form" onSubmit={submit}>
      {/* Simple panel heading */}
      <div className="panelTitle">Add task</div>

      {/* Title input */}
      <div className="formRow">
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title (required)"
          aria-label="Task title"
        />
      </div>

      {/* Optional description */}
      <div className="formRow">
        <textarea
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={3}
          aria-label="Task description"
        />
      </div>

      {/* Actions row */}
      <div className="formActions">
        <button className="btnPrimary" type="submit">
          Add
        </button>

        {/* Tiny UX hint so users understand where new tasks go */}
        <div className="hint">Tasks start in Backlog.</div>
      </div>
    </form>
  );
}