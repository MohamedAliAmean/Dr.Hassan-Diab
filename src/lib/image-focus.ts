export function focusObjectPosition(
  focusX?: number | null,
  focusY?: number | null
): string {
  return `${focusX ?? 50}% ${focusY ?? 50}%`;
}
