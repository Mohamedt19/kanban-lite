/*
  Column identifiers for the Kanban board.

  We use a union type instead of strings everywhere
  to prevent typos and enforce valid column values.
*/
export type ColumnId = "backlog" | "in_progress" | "done";

/*
  Represents a single task card on the board.
*/
export type Task = {
  id: string;            // unique id (generated when task is created)
  title: string;         // short task title
  description: string;   // optional details
  column: ColumnId;      // which column the task belongs to
  createdAt: string;     // ISO date string (used for sorting/display)
};

/*
  Entire board state stored in memory & localStorage.

  Keeping this structured makes it easier to expand later
  (e.g., add users, labels, priorities).
*/
export type BoardState = {
  tasks: Task[];
};

/*
  All actions supported by the board reducer.

  Using discriminated unions gives:
  ✔ type safety
  ✔ autocomplete
  ✔ predictable state transitions
*/
export type BoardAction =
  | {
      type: "ADD_TASK";
      payload: { title: string; description: string };
    }
  | {
      type: "DELETE_TASK";
      payload: { id: string };
    }
  | {
      type: "EDIT_TASK";
      payload: { id: string; title: string; description: string };
    }
  | {
      type: "MOVE_TASK";
      payload: { id: string; to: ColumnId };
    }
  | {
      type: "SET_STATE";
      payload: BoardState;
    };