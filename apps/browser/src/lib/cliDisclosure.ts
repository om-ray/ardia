export const CLI_DISCLOSURE_HOLD_MS = 3000;

export type CliDisclosureInput = { on: boolean; controlled: boolean };

export type CliDisclosure = {
  update(input: CliDisclosureInput): void;
  dispose(): void;
  readonly shown: boolean;
};

export function createCliDisclosure(onChange: (shown: boolean) => void, holdMs = CLI_DISCLOSURE_HOLD_MS): CliDisclosure {
  let shown = false;
  let hideTimer: ReturnType<typeof setTimeout> | null = null;
  const cancelHide = () => {
    if (hideTimer === null) return;
    clearTimeout(hideTimer);
    hideTimer = null;
  };
  const set = (next: boolean) => {
    if (next === shown) return;
    shown = next;
    onChange(next);
  };
  return {
    update({ on, controlled }) {
      if (!on) {
        cancelHide();
        set(false);
        return;
      }
      if (controlled) {
        cancelHide();
        set(true);
        return;
      }
      if (!shown || hideTimer !== null) return;
      hideTimer = setTimeout(() => {
        hideTimer = null;
        set(false);
      }, holdMs);
    },
    dispose: cancelHide,
    get shown() {
      return shown;
    },
  };
}
