export type ColumnId = "backlog" | "in_progress" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  column: ColumnId;
  createdAt: string; // ISO
};

export type BoardState = {
  tasks: Task[];
};

export type BoardAction =
  | { type: "ADD_TASK"; payload: { title: string; description: string } }
  | { type: "DELETE_TASK"; payload: { id: string } }
  | { type: "EDIT_TASK"; payload: { id: string; title: string; description: string } }
  | { type: "MOVE_TASK"; payload: { id: string; to: ColumnId } }
  | { type: "SET_STATE"; payload: BoardState };