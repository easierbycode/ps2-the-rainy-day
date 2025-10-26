// {"name": "Athena develop environment", "author": "Wellinator", "version": "04072023", "icon": "render_icon.png", "file": "3dcollision.js"}

import { font } from "./scripts/init/init-font.js";
import { SetupScreen } from "./scripts/init/init-screen.js";
import { SetupRender } from "./scripts/init/init-render.js";

// Prepare the display before we draw anything.
SetupScreen();
SetupRender();

Screen.setFrameCounter(false);
Screen.setVSync(true);

const backgroundColor = Color.new(20, 24, 36, 128);
const canvas = Screen.getMode();
const uiFont = new Font("./assets/font/Segoe UI.ttf");
uiFont.scale = 0.7;
const crossIcon = new Image("./assets/pads/Cross.png");
const storyPages = [
  [
    "One day I went outside",
    "and it was rainy.",
    "I took out my umbrella",
    "and opened it.",
    "All of a sudden a magical frog",
    "jumped out.",
    "",
    "He told me to hold on",
    "to his hand, so I grabbed on",
    "and we started to fly.",
    "We flew for miles and miles."
  ],
  [
    "Finally we landed.",
    "I asked where we were,",
    "but they talked a different language.",
    "I asked the frog where we were.",
    "He said \"we're in munchkin land\".",
    "I started to run but the frog",
    "grabbed me and said",
    "\"don't be afraid, they're friendly\".",
    "But I didn't know they were tricking me.",
    "",
    "At night they came in with a gun.",
    "I ran out of there as fast as I could.",
    "I tried and tried to find my way home.",
    "Finally I did.",
    "Boy, oh boy, was I glad I did."
  ],
  [
    "After I got home I decided",
    "to go to bed.",
    "But I didn't know the frog",
    "was under the covers.",
    "After I pulled up the covers",
    "and started to lay down",
    "I felt something gooey.",
    "I pulled up the covers as far as I could",
    "and saw the frog squished."
  ]
];

const lineHeight = 18;
const topMargin = 64;
const horizontalPadding = 40;
const legendBottomMargin = 32;
const legendRightMargin = 40;
const indicatorLeftMargin = 40;
const indicatorBottomMargin = 32;
const iconTextSpacing = 12;
const legendText = "NEXT";

const pad = Pads.get();
let currentPage = 0;

while (true) {
  pad.update();

  if (pad.justPressed(Pads.CROSS)) {
    currentPage = (currentPage + 1) % storyPages.length;
  }

  const lines = storyPages[currentPage];
  const pageIndicator = `${currentPage + 1}/${storyPages.length}`;
  let maxWidth = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineWidth = font.getTextSize(lines[i]).width;
    if (lineWidth > maxWidth) {
      maxWidth = lineWidth;
    }
  }

  const leftMargin = Math.max(horizontalPadding, Math.floor((canvas.width - maxWidth) / 2));
  const legendTextSize = uiFont.getTextSize(legendText);
  const legendHeight = Math.max(crossIcon.height, legendTextSize.height);
  const legendTop = canvas.height - legendHeight - legendBottomMargin;
  const legendWidth = crossIcon.width + iconTextSpacing + legendTextSize.width;
  const legendX = canvas.width - legendWidth - legendRightMargin;
  const legendMidY = legendTop + Math.floor(legendHeight / 2);
  const iconY = legendMidY - Math.floor(crossIcon.height / 2);
  const textY = legendMidY - Math.floor(legendTextSize.height / 2);
  const pageIndicatorSize = uiFont.getTextSize(pageIndicator);
  const pageIndicatorX = indicatorLeftMargin;
  const pageIndicatorY = canvas.height - pageIndicatorSize.height - indicatorBottomMargin;

  Screen.clear(backgroundColor);

  for (let index = 0; index < lines.length; index++) {
    font.print(leftMargin, topMargin + index * lineHeight, lines[index]);
  }

  crossIcon.draw(legendX, iconY);
  uiFont.print(legendX + crossIcon.width + iconTextSpacing, textY, legendText);
  uiFont.print(pageIndicatorX, pageIndicatorY, pageIndicator);

  Screen.flip();
}
