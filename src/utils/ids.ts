/*
  Generates a lightweight unique ID.

  Format:
  prefix_randomHex_timestamp

  Example:
  task_a3f9c1_1708573920

  Why this approach:
  - fast (no external libraries)
  - good enough uniqueness for client apps
  - readable when debugging
*/
export function makeId(prefix = "t") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}