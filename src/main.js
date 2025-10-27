// {"name": "Athena develop environment", "author": "Wellinator", "version": "04072023", "icon": "render_icon.png", "file": "3dcollision.js"}

import { font as baseFont } from "./scripts/init/init-font.js";
import { SetupScreen } from "./scripts/init/init-screen.js";
import { SetupRender } from "./scripts/init/init-render.js";

// Prepare the display before we draw anything.
SetupScreen();
SetupRender();

Screen.setFrameCounter(false);
Screen.setVSync(true);

const backgroundColor = Color.new(20, 24, 36, 128);
const canvas = Screen.getMode();
const uiFont = new Font("./assets/font/NueMedium.ttf");
uiFont.scale = 0.7;
const crossIcon = new Image("./assets/pads/Cross.png");
let storyFont = baseFont;
const storyFontScale = storyFont.scale || 0.8;
const backgroundMusicPath = "./assets/sounds/gradual.wav";
const fontExtensions = [".ttf", ".otf"];
const defaultFontName = "fnaf.ttf";
const fallbackFontNames = [
  "fnaf.ttf",
  "calibril.ttf",
  "calibrilight.ttf",
  "Candara.ttf",
  "Candara_Bold.ttf",
  "Candara_Bold_Italic.ttf",
  "Candara_Italic.ttf",
  "CONSOLA.TTF",
  "CONSOLAB.TTF",
  "consolai.ttf",
  "Consolas.ttf",
  "consolaz.ttf",
  "courier-new-bold.ttf",
  "ID Grotesk.ttf",
  "LilGrotesk.ttf",
  "nimbusmonl-bold.ttf",
  "NudMotoyaMaruW55-W6.ttf",
  "NudMotoyaMaruW55.ttf",
  "NueMedium.ttf",
  "Segoe UI.ttf",
  "TAHOMABD.TTF",
  "TeraMedium.ttf",
  "XM TrafficBdIt.ttf"
];
const fontDirectoryCandidates = [
  "/assets/font",
  "./assets/font",
  "assets/font",
  "host:assets/font"
];

let resolvedFontListPath = null;
let directoryListing = [];

const normalizeSlashes = (value) =>
  typeof value === "string" ? value.replace(/\\/g, "/") : value;

const toListDirPath = (value) => {
  if (typeof value !== "string" || value.length === 0) return value;
  const normalized = normalizeSlashes(value).replace(/\/+$/, "");
  if (normalized.startsWith("host:")) {
    return normalized;
  }
  let trimmed = normalized.replace(/^(\.\/)+/, "");
  if (!trimmed.startsWith("/")) {
    trimmed = `/${trimmed}`;
  }
  return trimmed;
};

const toLoadPathPrefix = (listPath) => {
  if (typeof listPath !== "string" || listPath.length === 0) return "./assets/font";
  const normalized = normalizeSlashes(listPath).replace(/\/+$/, "");
  if (normalized.startsWith("host:")) {
    return normalized;
  }
  const trimmed = normalized.replace(/^\/+/, "");
  return `./${trimmed}`;
};

for (let i = 0; i < fontDirectoryCandidates.length; i++) {
  const listPath = toListDirPath(fontDirectoryCandidates[i]);
  let entries = [];

  try {
    const result = System.listDir(listPath);
    if (Array.isArray(result)) {
      entries = result;
    }
  } catch (error) {
    entries = [];
  }

  if (entries.length > 0) {
    resolvedFontListPath = listPath;
    directoryListing = entries;
    break;
  }
}

const fontPathPrefix = toLoadPathPrefix(resolvedFontListPath);

const normalizePath = (value) =>
  value
    .replace(/\\/g, "/")
    .replace(/^host:/, "")
    .replace(/^(\.\/)+/, "")
    .replace(/^\/+/, "")
    .toLowerCase();

let availableFonts = directoryListing
  .filter((entry) => !entry.directory)
  .filter((entry) => {
    const lower = entry.name.toLowerCase();
    for (let i = 0; i < fontExtensions.length; i++) {
      if (lower.endsWith(fontExtensions[i])) {
        return true;
      }
    }
    return false;
  })
  .map((entry) => ({
    name: entry.name,
    path: `${fontPathPrefix}/${entry.name}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

if (availableFonts.length === 0) {
  availableFonts = fallbackFontNames.map((name) => ({
    name,
    path: `${fontPathPrefix}/${name}`,
  }));
} else {
  const normalizedExisting = new Set(
    availableFonts.map((entry) => normalizePath(entry.name))
  );

  for (let i = 0; i < fallbackFontNames.length; i++) {
    const fallbackName = fallbackFontNames[i];
    if (!normalizedExisting.has(fallbackName.toLowerCase())) {
      availableFonts.push({
        name: fallbackName,
        path: `${fontPathPrefix}/${fallbackName}`,
      });
    }
  }

  availableFonts = availableFonts.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
}

const defaultFontPath = `${fontPathPrefix}/${defaultFontName}`;
let currentFontPath = defaultFontPath;
let currentFontIndex = availableFonts.findIndex(
  (entry) => normalizePath(entry.path) === normalizePath(defaultFontPath)
);

function setCurrentFontIndex(index) {
  if (availableFonts.length === 0) {
    currentFontIndex = -1;
    return;
  }

  const boundedIndex = ((index % availableFonts.length) + availableFonts.length) % availableFonts.length;
  currentFontIndex = boundedIndex;
  const selectedFont = availableFonts[currentFontIndex];
  const selectedPath = selectedFont.path;

  if (normalizePath(selectedPath) !== normalizePath(currentFontPath)) {
    let nextFont = storyFont;
    try {
      nextFont = new Font(selectedPath);
      nextFont.scale = storyFontScale;
    } catch (error) {
      nextFont = storyFont;
    }

    storyFont = nextFont;
    currentFontPath = selectedPath;
  }
}

if (availableFonts.length > 0) {
  if (currentFontIndex === -1) {
    setCurrentFontIndex(0);
  } else {
    setCurrentFontIndex(currentFontIndex);
  }
} else {
  currentFontIndex = -1;
}

const debugMenuColor = Color.new(0, 128, 0, 192);
const debugMenuX = 16;
const debugMenuY = 16;
const debugMenuPadding = 8;
const frogSquishImage = new Image("./assets/frog-squish2.png");
const frogBottomMargin = 48;
const frogSquishAnimationDuration = 90;
let frogSquishAnimationProgress = 0;
let isFrogSquishAnimating = false;
let frogSquishAnimationCompleted = false;

let backgroundTrack = null;

try {
  backgroundTrack = Sound.load(backgroundMusicPath);
  Sound.repeat(true);
  Sound.play(backgroundTrack);
} catch (error) {
  console.log(`Failed to load background music: ${error}`);
}

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
  ],
  [
    "He got mad and decided",
    "to cast a spell that took us",
    "to another land.",
    "I started to chase him,",
    "but he started to hop.",
    "I chased him in circles",
    "and then I decided to hide",
    "around the next corner."
  ],
  [
    "When he came around that corner",
    "I squished him.",
    "When I did the spell was broken",
    "and I was back in my room.",
    "Boy, oh boy, was I glad",
    "the whole thing was over."
  ],
  [
    "After the frog came back",
    "he was a spirit and he was mad.",
    "He decided to hop after me."
  ],
  [
    "So I squished him",
    "and fried him like a pancake.",
    "He dove off the stove",
    "with his butt on fire.",
    "He rolled across the room",
    "and out the door.",
    "",
    "My dog tried to eat him",
    "so he decided to cast a spell",
    "and he turned my dog",
    "into Bloody Mary.",
    "",
    "Bloody Mary came and ate my parents,",
    "so I dove into the refrigerator,",
    "but he ate the refrigerator.",
    "",
    "The end"
  ]
];

const frogSquishPageIndex = storyPages.length - 3;

const lineHeight = 18;
const topMargin = 64;
const horizontalPadding = 40;
const legendBottomMargin = 32;
const legendRightMargin = 40;
const indicatorLeftMargin = 40;
const indicatorBottomMargin = 32;
const iconTextSpacing = 12;
const legendText = "NEXT";
let debugMenuVisible = false;

const pad = Pads.get();
let currentPage = 0;

const frogImage = new Image("./assets/frog.png");
const meImage = new Image("./assets/me.png");
const frogChaseImage = new Image("./assets/frog-chase.png");
let isFrogAnimating = false;
let isFrogChaseAnimating = false;
let frogAnimationProgress = 0;
let frogChaseAnimationProgress = 0;
const frogAnimationDuration = 60;
const frogChaseAnimationDuration = 30;
let frogStartY, frogEndY, frogX, meX;
let frogChaseStartY, frogChaseEndY, frogChaseX;
let frogDimensionsInitialized = false;
let frogChaseDimensionsInitialized = false;

function easeOutBounce(x) {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

while (true) {
  pad.update();

  if (pad.pressed(Pads.SELECT) && pad.justPressed(Pads.DOWN)) {
    debugMenuVisible = !debugMenuVisible;
  }

  if (debugMenuVisible && availableFonts.length > 0) {
    if (pad.justPressed(Pads.L2)) {
      setCurrentFontIndex(currentFontIndex - 1);
    }

    if (pad.justPressed(Pads.R2)) {
      setCurrentFontIndex(currentFontIndex + 1);
    }
  }

  if (pad.justPressed(Pads.CROSS)) {
    currentPage = (currentPage + 1) % storyPages.length;
    if (currentPage === 1) {
      isFrogAnimating = true;
      frogAnimationProgress = 0;
      frogDimensionsInitialized = false;
    } else {
      isFrogAnimating = false;
      frogAnimationProgress = 0;
      frogDimensionsInitialized = false;
    }
    if (currentPage === 3) {
      isFrogChaseAnimating = true;
      frogChaseAnimationProgress = 0;
      frogChaseDimensionsInitialized = false;
    } else {
      isFrogChaseAnimating = false;
      frogChaseAnimationProgress = 0;
      frogChaseDimensionsInitialized = false;
    }
    if (currentPage === frogSquishPageIndex) {
      isFrogSquishAnimating = true;
      frogSquishAnimationCompleted = false;
      frogSquishAnimationProgress = 0;
      frogSquishImage.angle = 0;
    } else {
      isFrogSquishAnimating = false;
      frogSquishAnimationCompleted = false;
      frogSquishAnimationProgress = 0;
      frogSquishImage.angle = 0;
    }
  }

  if (isFrogSquishAnimating) {
    if (frogSquishAnimationProgress < frogSquishAnimationDuration) {
      frogSquishAnimationProgress++;
    }
    if (frogSquishAnimationProgress >= frogSquishAnimationDuration) {
      isFrogSquishAnimating = false;
      frogSquishAnimationCompleted = true;
      frogSquishImage.angle = 0;
    }
  }

  const lines = storyPages[currentPage];
  const pageIndicator = `${currentPage + 1}/${storyPages.length}`;
  let maxWidth = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineWidth = storyFont.getTextSize(lines[i]).width;
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
    storyFont.print(leftMargin, topMargin + index * lineHeight, lines[index]);
  }

  if (currentPage === 2 && frogSquishImage.ready) {
    const staticX = Math.floor((canvas.width - frogSquishImage.width) / 2);
    const staticY = canvas.height - frogSquishImage.height - frogBottomMargin;
    frogSquishImage.angle = 0;
    frogSquishImage.draw(staticX, staticY);
  }

  if (debugMenuVisible) {
    const fontLabel =
      availableFonts.length > 0 && currentFontIndex !== -1
        ? availableFonts[currentFontIndex].name
        : "None";
    const debugText = `FONT: ${fontLabel}`;
    const debugTextSize = uiFont.getTextSize(debugText);
    const debugWidth = debugTextSize.width + debugMenuPadding * 2;
    const debugHeight = debugTextSize.height + debugMenuPadding * 2;
    Draw.rect(debugMenuX, debugMenuY, debugWidth, debugHeight, debugMenuColor);
    uiFont.print(debugMenuX + debugMenuPadding, debugMenuY + debugMenuPadding, debugText);
  }

  crossIcon.draw(legendX, iconY);
  uiFont.print(legendX + crossIcon.width + iconTextSpacing, textY, legendText);
  uiFont.print(pageIndicatorX, pageIndicatorY, pageIndicator);

  if (isFrogAnimating && frogImage.ready && meImage.ready) {
    if (!frogDimensionsInitialized) {
      frogStartY = -frogImage.height;
      frogEndY = canvas.height - frogImage.height;
      const totalWidth = frogImage.width + meImage.width;
      frogX = Math.floor((canvas.width - totalWidth) / 2);
      meX = frogX + frogImage.width;
      frogDimensionsInitialized = true;
    }

    if (frogAnimationProgress < frogAnimationDuration) {
      frogAnimationProgress++;
    }

    const t = frogAnimationProgress / frogAnimationDuration;
    const easedT = easeOutBounce(t);
    const frogY = frogStartY + (frogEndY - frogStartY) * easedT;

    const alpha = Math.min(255, Math.floor(255 * t));
    const drawColor = Color.new(255, 255, 255, alpha);
    frogImage.draw(frogX, frogY, frogImage.width, frogImage.height, drawColor);
    meImage.draw(meX, frogY, meImage.width, meImage.height, drawColor);
  }

  if (isFrogChaseAnimating && frogChaseImage.ready) {
    if (!frogChaseDimensionsInitialized) {
      frogChaseStartY = -frogChaseImage.height;
      frogChaseEndY = Math.floor((canvas.height - frogChaseImage.height) / 2);
      frogChaseX = Math.floor((canvas.width - frogChaseImage.width) / 2);
      frogChaseDimensionsInitialized = true;
    }

    if (frogChaseAnimationProgress < frogChaseAnimationDuration) {
      frogChaseAnimationProgress++;
    }

    const t = frogChaseAnimationProgress / frogChaseAnimationDuration;
    const frogChaseY = frogChaseStartY + (frogChaseEndY - frogChaseStartY) * t;
    const alpha = Math.min(255, Math.floor(255 * t));
    const drawColor = Color.new(255, 255, 255, alpha);
    frogChaseImage.draw(frogChaseX, frogChaseY, frogChaseImage.width, frogChaseImage.height, drawColor);
  }

  if ((isFrogSquishAnimating || frogSquishAnimationCompleted) && currentPage === frogSquishPageIndex && frogSquishImage.ready) {
    const rawProgress = isFrogSquishAnimating
      ? frogSquishAnimationProgress / frogSquishAnimationDuration
      : 1;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));
    const eased = clampedProgress * clampedProgress * (3 - 2 * clampedProgress);
    const startX = canvas.width + frogSquishImage.width;
    const startY = canvas.height + frogSquishImage.height;
    const finalX = Math.floor((canvas.width - frogSquishImage.width) / 2);
    const finalY = canvas.height - frogSquishImage.height - frogBottomMargin;
    const sway = Math.sin(clampedProgress * Math.PI) * 36 * (1 - eased);
    const currentX = startX + (finalX - startX) * eased;
    const currentY = startY + (finalY - startY) * eased - sway;
    const alpha = Math.min(255, Math.floor(255 * clampedProgress));
    const drawColor = Color.new(255, 255, 255, alpha);
    frogSquishImage.angle = (1 - eased) * 20 * Math.sin(clampedProgress * Math.PI * 2);
    frogSquishImage.draw(
      Math.floor(currentX),
      Math.floor(currentY),
      frogSquishImage.width,
      frogSquishImage.height,
      drawColor
    );
    if (!isFrogSquishAnimating) {
      frogSquishImage.angle = 0;
    }
  }

  Screen.flip();
}
