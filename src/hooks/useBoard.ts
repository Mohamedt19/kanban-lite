import { useEffect, useMemo, useReducer, useState } from "react";
import type { BoardAction, BoardState, ColumnId, Task } from "../types/board";
import { makeId } from "../utils/ids";

const STORAGE_KEY = "kanban_lite_v1";

const initial: BoardState = { tasks: [] };

function reducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "SET_STATE":
      return action.payload;

    case "ADD_TASK": {
      const title = action.payload.title.trim();
      const description = action.payload.description?.trim() ?? "";
      if (!title) return state;

      const task: Task = {
        id: makeId("task"),
        title,
        description,
        column: "backlog",
        createdAt: new Date().toISOString(),
      };

      return { tasks: [task, ...state.tasks] };
    }

    case "DELETE_TASK":
      return { tasks: state.tasks.filter((t) => t.id !== action.payload.id) };

    case "EDIT_TASK":
      return {
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id
            ? {
                ...t,
                title: action.payload.title.trim() || t.title,
                description: action.payload.description?.trim() ?? "",
              }
            : t
        ),
      };

    case "MOVE_TASK":
      return {
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, column: action.payload.to } : t
        ),
      };

    default:
      return state;
  }
}

function safeLoad(): BoardState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BoardState;
    if (!parsed || !Array.isArray(parsed.tasks)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function useBoard() {
  // ✅ query lives in the hook (so App can destructure query/setQuery)
  const [query, setQuery] = useState(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEY}:query`) ?? "";
    } catch {
      return "";
    }
  });

  // ✅ load tasks once
  const [state, dispatch] = useReducer(reducer, initial, () => {
    const loaded = typeof window !== "undefined" ? safeLoad() : null;
    return loaded ?? initial;
  });

  // ✅ persist tasks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  // ✅ persist query
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}:query`, query);
    } catch {}
  }, [query]);

  const api = useMemo(() => {
    function setState(next: BoardState) {
      dispatch({ type: "SET_STATE", payload: next });
    }

    function addTask(title: string, description: string) {
      dispatch({ type: "ADD_TASK", payload: { title, description } });
    }

    function deleteTask(id: string) {
      dispatch({ type: "DELETE_TASK", payload: { id } });
    }

    function editTask(id: string, title: string, description: string) {
      dispatch({ type: "EDIT_TASK", payload: { id, title, description } });
    }

    function moveTask(id: string, to: ColumnId) {
      dispatch({ type: "MOVE_TASK", payload: { id, to } });
    }

    function clearAll() {
      const next: BoardState = { tasks: [] };
      dispatch({ type: "SET_STATE", payload: next });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
    }

    return { setState, addTask, deleteTask, editTask, moveTask, clearAll };
  }, []);

  // ✅ expose tasks directly
  return { tasks: state.tasks, state, query, setQuery, ...api };
}