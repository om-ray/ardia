export const CLI_PILL_BOTTOM = 12;
export const CLI_PILL_HEIGHT = 32;
export const CLI_PILL_CLEARANCE = CLI_PILL_BOTTOM + CLI_PILL_HEIGHT + 10;

const STATUS_BUBBLE_INSET = 6;
const STATUS_BUBBLE_GAP = 8;
const STATUS_BUBBLE_MIN_WIDTH = 120;

export const statusBubbleWidth = (paneWidth: number) => Math.max(160, paneWidth / 2);

export function statusBubblePlacement(paneWidth: number, pillWidth: number): { maxWidth: number; bottom: number } {
  const maxWidth = statusBubbleWidth(paneWidth);
  if (pillWidth <= 0) return { maxWidth, bottom: STATUS_BUBBLE_INSET };
  const room = (paneWidth - pillWidth) / 2 - STATUS_BUBBLE_INSET - STATUS_BUBBLE_GAP;
  if (room >= STATUS_BUBBLE_MIN_WIDTH) return { maxWidth: Math.min(maxWidth, room), bottom: STATUS_BUBBLE_INSET };
  return { maxWidth, bottom: CLI_PILL_BOTTOM + CLI_PILL_HEIGHT + STATUS_BUBBLE_GAP };
}
