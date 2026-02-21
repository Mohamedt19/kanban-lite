import { useState } from "react";

type Props = {
  onAdd: (title: string, description: string) => void;
};

export function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, description);
    setTitle("");
    setDescription("");
  }

  return (
    <form className="panel form" onSubmit={submit}>
      <div className="panelTitle">Add task</div>

      <div className="formRow">
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title (required)"
        />
      </div>

      <div className="formRow">
        <textarea
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={3}
        />
      </div>

      <div className="formActions">
        <button className="btnPrimary" type="submit">
          Add
        </button>
        <div className="hint">Tasks start in Backlog.</div>
      </div>
    </form>
  );
}