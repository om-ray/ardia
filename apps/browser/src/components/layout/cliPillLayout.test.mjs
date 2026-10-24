import assert from "node:assert/strict";
import { test } from "node:test";

const { CLI_PILL_BOTTOM, CLI_PILL_HEIGHT, statusBubblePlacement, statusBubbleWidth } = await import("./cliPillLayout.ts");

const pillLeft = (paneWidth, pillWidth) => (paneWidth - pillWidth) / 2;

test("with no pill the status bubble keeps Chrome's place and width", () => {
  assert.deepEqual(statusBubblePlacement(1200, 0), { maxWidth: 600, bottom: 6 });
  assert.deepEqual(statusBubblePlacement(240, 0), { maxWidth: 160, bottom: 6 });
});

test("a wide pane narrows the bubble so it ends before the pill", () => {
  for (const paneWidth of [600, 900, 1200, 1800]) {
    const { maxWidth, bottom } = statusBubblePlacement(paneWidth, 230);
    assert.equal(bottom, 6);
    assert.ok(6 + maxWidth <= pillLeft(paneWidth, 230) - 8, `pane ${paneWidth}`);
    assert.ok(maxWidth <= statusBubbleWidth(paneWidth));
  }
});

test("a narrow pane lifts the bubble above the pill instead", () => {
  for (const paneWidth of [300, 400, 480]) {
    const { maxWidth, bottom } = statusBubblePlacement(paneWidth, 230);
    assert.ok(bottom >= CLI_PILL_BOTTOM + CLI_PILL_HEIGHT + 6, `pane ${paneWidth}`);
    assert.equal(maxWidth, statusBubbleWidth(paneWidth));
  }
});
