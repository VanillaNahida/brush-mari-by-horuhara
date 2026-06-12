const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("bestScore");
const timeDial = document.getElementById("timeDial");
const sneezeFill = document.getElementById("sneezeFill");
const startOverlay = document.getElementById("startOverlay");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const pauseButton = document.getElementById("pauseButton");
const volumeRange = document.getElementById("volumeRange");
const languageToggle = document.getElementById("languageToggle");
const twitterButton = document.getElementById("twitterButton");
const infiniteToggle = document.getElementById("infiniteToggle");
const achievementButton = document.getElementById("achievementButton");
const achievementPanel = document.getElementById("achievementPanel");
const achievementClose = document.getElementById("achievementClose");
const achievementList = document.getElementById("achievementList");
const achievementToast = document.getElementById("achievementToast");
const modeUnlockToast = document.getElementById("modeUnlockToast");
const modeLabel = document.getElementById("modeLabel");
const shareButton = document.getElementById("shareButton");

const W = canvas.width;
const H = canvas.height;
const CAT_BOX = { x: 140, y: 220, w: 560, h: 672 };
const BRUSH_ZONE = { x: 210, y: 440, w: 290, h: 290 };
const WARNING_ANGER = 62;
const GAME_OVER_ANGER = 100;
const FAST_BRUSH_SPEED = 980;
const NICE_BRUSH_SPEED_MIN = 90;
const NICE_BRUSH_SPEED_MAX = 860;
const IDLE_ANGER_RECOVERY = 0.026;
const ANGER_RECOVERY_DELAY = 1150;
const GAME_OVER_ZOOM_TIME = 620;
const WARNING_STROKE_GRACE_TIME = 500;
const SCORE_STROKE_LENGTH = CAT_BOX.h * 0.62;
const INFINITE_SCORE_STROKE_LENGTH = CAT_BOX.h * 0.48;
const GAME_DURATION = 30000;
const INFINITE_TARGET_TIME = 180000;
const CLEAR_SCORE = 20;
const IDLE_DANCE_DELAY = 15000;
const SNEEZE_LIMIT = 100;
const SNEEZE_DECAY = 0.12;
const SNEEZE_DECAY_DELAY = 0;
const MAX_FLOOR_FUR = 170;
const GOLDEN_FUR_CHANCE = 0.0005;
const GOLDEN_FUR_BONUS = 1;
const BEST_SCORE_KEY = "mari-brush-best-v2";
const INFINITE_BEST_SCORE_KEY = "mari-brush-infinite-best-v1";
const ACHIEVEMENT_KEY = "mari-brush-achievements-v2";
const INFINITE_ACHIEVEMENT_KEY = "mari-brush-infinite-achievements-v1";
const INFINITE_GAMEOVER_COUNT_KEY = "mari-brush-infinite-gameovers-v1";
const INFINITE_UNLOCK_KEY = "mari-brush-infinite-unlocked-v1";
const VOLUME_KEY = "mari-brush-volume-v1";

if (new URLSearchParams(window.location.search).has("fresh")) {
  localStorage.removeItem(BEST_SCORE_KEY);
  localStorage.removeItem(INFINITE_BEST_SCORE_KEY);
  localStorage.removeItem(ACHIEVEMENT_KEY);
  localStorage.removeItem(INFINITE_ACHIEVEMENT_KEY);
  localStorage.removeItem(INFINITE_GAMEOVER_COUNT_KEY);
  localStorage.removeItem(INFINITE_UNLOCK_KEY);
  localStorage.removeItem("mari-brush-best");
  localStorage.removeItem("mari-brush-achievements");
  window.history.replaceState(null, "", window.location.pathname);
}

const achievementDefs = [
  { id: "sneeze", title: { en: "Sneeze once", ko: "재채기하기" } },
  { id: "brush15", title: { en: "Brush 15 times without being noticed", ko: "마리에게 걸리지 않고 빗질 15번 하기" } },
  { id: "brush25", title: { en: "Brush 25 times in one run", ko: "한번에 25번 빗질하기" } },
];

const achievementDefsByMode = {
  normal: [
    { id: "sneeze", title: { en: "Sneeze once", ko: "\uc7ac\ucc44\uae30\ud558\uae30", ja: "\u304f\u3057\u3083\u307f\u3092\u3059\u308b" } },
    { id: "brush15", title: { en: "Brush 15 times without being noticed", ko: "\ub9c8\ub9ac\uc5d0\uac8c \uac78\ub9ac\uc9c0 \uc54a\uace0 \ube57\uc9c8 15\ubc88 \ud558\uae30", ja: "\u30de\u30ea\u30fc\u306b\u898b\u3064\u304b\u3089\u305a15\u56de\u30d6\u30e9\u30c3\u30b7\u30f3\u30b0" } },
    { id: "brush25", title: { en: "Brush 25 times in one run", ko: "\ud55c\ubc88\uc5d0 25\ubc88 \ube57\uc9c8\ud558\uae30", ja: "1\u56de\u306725\u56de\u30d6\u30e9\u30c3\u30b7\u30f3\u30b0" } },
  ],
  infinite: [
    { id: "share", title: { en: "Share Mari's brushing", ko: "\ub9c8\ub9ac \ube57\uc9c8\ud55c\uac70 \uc790\ub791\ud558\uae30", ja: "\u30de\u30ea\u30fc\u306e\u30d6\u30e9\u30c3\u30b7\u30f3\u30b0\u3092\u81ea\u6162\u3059\u308b" } },
    { id: "gameover5", title: { en: "Game over 5 times", ko: "\uac8c\uc784\uc624\ubc84 5\ubc88 \ub2f9\ud558\uae30", ja: "5\u56de\u30b2\u30fc\u30e0\u30aa\u30fc\u30d0\u30fc\u306b\u306a\u308b" } },
    { id: "goldenFur", hidden: true, title: { en: "Found golden fur!", ko: "\ud669\uae08\ud138 \ubc1c\uacac\ud558\uae30!", ja: "\u91d1\u8272\u306e\u6bdb\u3092\u898b\u3064\u3051\u308b\uff01" } },
  ],
};

const text = {
  en: {
    best: "BEST",
    retry: "RETRY",
    nextLang: "한국어",
    achievements: "ACHIEVEMENTS",
    startHelp: "Brush Mari in secret.",
    start: "START",
    achievementToast: "ACHIEVEMENT",
    unlocked: "UNLOCKED",
    caught: "CAUGHT!",
    notEnough: "NOT ENOUGH BRUSHING...",
    slowly: "SLOWLY!",
    gameClear: "GAME CLEAR",
    loadFail: "Failed to load resources.",
  },
  ko: {
    best: "최고",
    retry: "다시",
    nextLang: "English",
    achievements: "업적",
    startHelp: "마리 몰래 빗질해 주세요.",
    start: "시작",
    achievementToast: "업적 달성",
    unlocked: "달성",
    caught: "들켰습니다!",
    notEnough: "충분히 빗질해주지 못했습니다...",
    slowly: "천천히!",
    gameClear: "게임 클리어",
    loadFail: "리소스를 불러오지 못했습니다.",
  },
};

text.en.sneeze = "SNEEZE";
text.en.score = "SCORE";
text.en.newBest = "NEW BEST!";
text.en.pause = "PAUSE";
text.en.resume = "RESUME";
text.en.clearShine = "Mari's hair is glossy!";
text.ko.sneeze = "재채기";
text.ko.score = "점수";
text.ko.newBest = "최고점수 갱신!";
text.ko.pause = "멈춤";
text.ko.resume = "계속";
text.ko.clearShine = "마리의 머릿결이 윤기가 나요!";
text.en.nextLang = "한국어";
text.ko.nextLang = "日本語";
text.ja = {
  best: "ベスト",
  retry: "リトライ",
  nextLang: "\u65e5\u672c\u8a9e",
  achievements: "実績",
  startHelp: "マリーに気づかれないようにブラッシングしよう。",
  start: "スタート",
  achievementToast: "実績解除",
  unlocked: "解除",
  caught: "見つかった！",
  notEnough: "十分にブラッシングできませんでした...",
  slowly: "ゆっくり！",
  gameClear: "ゲームクリア",
  loadFail: "リソースを読み込めませんでした。",
  sneeze: "くしゃみ",
  score: "スコア",
  newBest: "ベスト更新！",
  pause: "一時停止",
  resume: "再開",
  clearShine: "マリーの髪がつやつや！",
};
achievementDefs[0].title.ja = "くしゃみをする";
achievementDefs[1].title.ja = "マリーに見つからず15回ブラッシング";
achievementDefs[2].title.ja = "1回で25回ブラッシング";

Object.assign(text.en, {
  nextLang: "\ud55c\uad6d\uc5b4",
  share: "SHARE",
  shareAsk: "Save the game screen?",
  yes: "YES",
  basic: "BASIC",
  infinite: "INFINITE",
  infiniteTotal: "INFINITE SCORE",
  creator: "X",
});
Object.assign(text.ko, {
  best: "\ucd5c\uace0",
  retry: "\ub2e4\uc2dc",
  nextLang: "English",
  achievements: "\uc5c5\uc801",
  achievementToast: "\uc5c5\uc801 \ub2ec\uc131",
  caught: "\ub4e4켰\uc2b5\ub2c8\ub2e4!",
  notEnough: "\ucda9\ubd84\ud788 \ube57\uc9c8\ud574\uc8fc\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4...",
  slowly: "\ucc9c\ucc9c\ud788!",
  sneeze: "\uc7ac\ucc44\uae30",
  score: "\uc810\uc218",
  newBest: "\ucd5c\uace0\uc810\uc218 \uac31\uc2e0!",
  pause: "\uba48\ucda4",
  resume: "\uacc4\uc18d",
  clearShine: "\ub9c8\ub9ac\uc758 \uba38\ub9bf\uacb0\uc774 \uc724\uae30\uac00 \ub098\uc694!",
  share: "\uc790\ub791\ud558\uae30",
  shareAsk: "\uac8c\uc784 \ud654\uba74\uc744 \uc800\uc7a5\ud560\uae4c\uc694?",
  yes: "\ub124",
  basic: "\uae30\ubcf8",
  infinite: "\ubb34\ud55c",
  infiniteTotal: "\ubb34\ud55c\ubaa8\ub4dc \ucd1d \uc810\uc218",
  creator: "X",
});
Object.assign(text.ja, {
  best: "\u30d9\u30b9\u30c8",
  retry: "\u3082\u3046\u4e00\u5ea6",
  nextLang: "English",
  achievements: "\u5b9f\u7e3e",
  achievementToast: "\u5b9f\u7e3e\u89e3\u9664",
  caught: "\u898b\u3064\u304b\u3063\u305f\uff01",
  notEnough: "\u5341\u5206\u306b\u30d6\u30e9\u30c3\u30b7\u30f3\u30b0\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f...",
  slowly: "\u3086\u3063\u304f\u308a\uff01",
  gameClear: "GAME CLEAR",
  sneeze: "\u304f\u3057\u3083\u307f",
  score: "\u30b9\u30b3\u30a2",
  newBest: "\u30d9\u30b9\u30c8\u66f4\u65b0\uff01",
  pause: "\u4e00\u6642\u505c\u6b62",
  resume: "\u518d\u958b",
  clearShine: "\u30de\u30ea\u30fc\u306e\u9aea\u304c\u3064\u3084\u3064\u3084\uff01",
  share: "\u30b7\u30a7\u30a2",
  shareAsk: "\u30b2\u30fc\u30e0\u753b\u9762\u3092\u4fdd\u5b58\u3057\u307e\u3059\u304b\uff1f",
  yes: "\u306f\u3044",
  basic: "\u57fa\u672c",
  infinite: "\u7121\u9650",
  infiniteTotal: "\u7121\u9650\u30e2\u30fc\u30c9\u5408\u8a08\u30b9\u30b3\u30a2",
  creator: "X",
});

text.en.creator = "CREATOR";
text.ko.creator = "\uc81c\uc791\uc790";
text.ja.creator = "\u5236\u4f5c\u8005";
text.en.nextLang = "\ud55c\uad6d\uc5b4";
text.ko.nextLang = "\u65e5\u672c\u8a9e";
text.ja.nextLang = "English";
text.en.infiniteUnlocked = "INFINITE MODE UNLOCKED";
text.ko.infiniteUnlocked = "\ubb34\ud55c\ubaa8\ub4dc \ud574\uae08!";
text.ja.infiniteUnlocked = "\u7121\u9650\u30e2\u30fc\u30c9\u89e3\u653e\uff01";

const assetPaths = {
  background: "assets/root/background.png",
  black: "assets/root/black.png",
  gameover: "assets/root/gameover.png",
  comb: "assets/root/comb.png",
  calm: [
    "assets/calm/halo.png",
    "assets/calm/ear-back.png",
    "assets/calm/body.png",
    "assets/calm/ear-front.png",
  ],
  angry: [
    "assets/angry/halo.png",
    "assets/angry/body.png",
    "assets/angry/face-1.png",
    "assets/angry/face-2.png",
    "assets/angry/face-3.png",
    "assets/angry/scratch.png",
  ],
  effects: [
    "assets/effects/fur-1.png",
    "assets/effects/fur-2.png",
    "assets/effects/fur-3.png",
    "assets/effects/fur-4.png",
  ],
  achievements: {
    furball: "assets/achievements/furball-trim.png",
    tissue: "assets/achievements/tissue-trim.png",
  },
  achievementButton: [
    "assets/achievement-button/none.png",
    "assets/achievement-button/one.png",
    "assets/achievement-button/two.png",
    "assets/achievement-button/three.png",
  ],
  mode: {
    infiniteLogo: "assets/modes/infinite-logo.png",
  },
  masterReward: "assets/rewards/master.png",
  clear: {
    mari: "assets/new/clear-mari.png",
    halo: "assets/new/clear-halo.png",
    sparkle: "assets/new/clear-sparkle.png",
  },
  controls: {
    resume: "assets/new/resume.png",
  },
};

const soundPaths = {
  bgm: "assets/sounds/bgm.mp3",
  gameOverBgm: "assets/sounds/game-over-bgm.mp3",
  gameClearBgm: "assets/sounds/game-clear-bgm.mp3",
  gameOver: "assets/sounds/game-over.mp3",
  sneeze: "assets/sounds/sneeze.mp3",
  timeOver: "assets/sounds/time-over.mp3",
  caught: ["assets/sounds/caught-1.mp3", "assets/sounds/caught-2.mp3", "assets/sounds/caught-3.mp3"],
  warning: "assets/sounds/warning.mp3",
  panel: "assets/sounds/panel.mp3",
  language: "assets/sounds/language.mp3",
  achievement: ["assets/sounds/achievement-1.mp3", "assets/sounds/achievement-2.mp3"],
  brush: [
    "assets/sounds/brush-1.mp3",
    "assets/sounds/brush-2.mp3",
    "assets/sounds/brush-3.mp3",
    "assets/sounds/brush-4.mp3",
    "assets/sounds/brush-5.mp3",
    "assets/sounds/brush-6.mp3",
    "assets/sounds/brush-7.mp3",
  ],
};

const images = {};
const sounds = {};
const particles = [];
const floorFurs = [];

let pointer = { x: W * 0.7, y: H * 0.45, down: false, lastX: 0, lastY: 0, speed: 0, lastTime: 0 };
let activePointerId = null;
let score = 0;
let anger = 0;
let calm = 30;
let sneeze = 0;
let started = false;
let gameOver = false;
let gameClear = false;
let paused = false;
let gameOverReason = "caught";
let lastTime = performance.now();
let pauseStartedAt = 0;
let pausedVisualNow = 0;
let lastIrritatedAt = 0;
let lastBrushAt = performance.now();
let lastFurAt = 0;
let gameOverStartedAt = 0;
let gameClearStartedAt = 0;
let gameStartedAt = 0;
let frozenTimeRatio = 1;
let strokeStartedBelowWarning = false;
let warningStrokeGraceStartedAt = 0;
let wasWarning = false;
let warningReachCount = 0;
let slowlyMessageUntil = 0;
let scoreStrokeDistance = 0;
let backEarWiggleAt = 0;
let frontEarWiggleAt = 0;
let nextBackEarWiggleAt = performance.now() + 2400 + Math.random() * 4200;
let nextFrontEarWiggleAt = performance.now() + 3200 + Math.random() * 5200;
let brushPress = 0;
let toastUntil = 0;
let modeUnlockToastUntil = 0;
let enteredWarningThisRun = false;
let bestUpdatedThisRun = false;
let audioReady = false;
let currentMusic = null;
let brushSoundIndex = 0;
let achievementSoundIndex = 0;
let lastBrushSoundAt = 0;
const rewardObjects = {
  furball: { x: 142, y: 610, w: 110, h: 110, vx: 0, vy: 0, rot: -0.08, vr: 0, lastHitAt: 0, behind: true },
  tissue: { x: 670, y: 890, w: 112, h: 103, vx: 0, vy: 0, rot: 0.1, vr: 0, lastHitAt: 0 },
};
localStorage.removeItem("mari-brush-best");
let best = Number(localStorage.getItem(BEST_SCORE_KEY) || 0);
let infiniteBest = Number(localStorage.getItem(INFINITE_BEST_SCORE_KEY) || 0);
let mode = "normal";
let achievementsByMode = loadAllAchievements();
let achievements = achievementsByMode.normal;
let language = "en";
let masterRewardObject = { x: 658, y: 238, w: 154, h: 222, alpha: 0.8 };
let infiniteGameOverCount = Number(localStorage.getItem(INFINITE_GAMEOVER_COUNT_KEY) || 0);
let infiniteUnlocked = localStorage.getItem(INFINITE_UNLOCK_KEY) === "true";
let soundVolume = Math.max(0, Math.min(1, Number(localStorage.getItem(VOLUME_KEY) || 0.8)));

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function loadAssets() {
  const flat = [
    ["background", assetPaths.background],
    ["black", assetPaths.black],
    ["gameover", assetPaths.gameover],
    ["comb", assetPaths.comb],
    ...assetPaths.calm.map((src, i) => [`calm${i}`, src]),
    ...assetPaths.angry.map((src, i) => [`angry${i}`, src]),
    ...assetPaths.effects.map((src, i) => [`effect${i}`, src]),
    ["achievementFurball", assetPaths.achievements.furball],
    ["achievementTissue", assetPaths.achievements.tissue],
    ["clearMari", assetPaths.clear.mari],
    ["clearHalo", assetPaths.clear.halo],
    ["clearSparkle", assetPaths.clear.sparkle],
    ["infiniteLogo", assetPaths.mode.infiniteLogo],
    ["masterReward", assetPaths.masterReward],
    ["controlResume", assetPaths.controls.resume],
    ...assetPaths.achievementButton.map((src, i) => [`achievementButton${i}`, src]),
  ];

  await Promise.all(
    flat.map(async ([key, src]) => {
      images[key] = await loadImage(src);
    })
  );
}

function createAudio(src, volume = 0.5, loop = false) {
  const audio = new Audio(src);
  audio.preload = "auto";
  audio.baseVolume = volume;
  audio.volume = volume * soundVolume;
  audio.loop = loop;
  return audio;
}

function applySoundVolume() {
  const apply = (audio) => {
    if (!audio) return;
    audio.volume = (audio.baseVolume ?? audio.volume ?? 0.5) * soundVolume;
  };
  Object.values(sounds).forEach((entry) => {
    if (Array.isArray(entry)) entry.forEach(apply);
    else apply(entry);
  });
}

function loadSounds() {
  sounds.bgm = createAudio(soundPaths.bgm, 0.1, true);
  sounds.gameOverBgm = createAudio(soundPaths.gameOverBgm, 0.12, true);
  sounds.gameClearBgm = createAudio(soundPaths.gameClearBgm, 0.08, true);
  sounds.gameOver = createAudio(soundPaths.gameOver, 0.58);
  sounds.sneeze = createAudio(soundPaths.sneeze, 0.62);
  sounds.timeOver = createAudio(soundPaths.timeOver, 0.58);
  sounds.caught = soundPaths.caught.map((src) => createAudio(src, 0.48));
  sounds.warning = createAudio(soundPaths.warning, 0.2);
  sounds.panel = createAudio(soundPaths.panel, 0.42);
  sounds.language = createAudio(soundPaths.language, 0.26);
  sounds.achievement = soundPaths.achievement.map((src) => createAudio(src, 0.58));
  sounds.brush = soundPaths.brush.map((src) => createAudio(src, 0.2));
}

function unlockAudio() {
  audioReady = true;
  if (started && !paused && !gameOver && !gameClear) playMusic("bgm");
}

function playAudio(audio, volume = audio?.volume ?? 0.5) {
  if (!audioReady || !audio) return;
  const instance = audio.cloneNode();
  instance.volume = volume * soundVolume;
  instance.play().catch(() => {});
}

function playSound(key) {
  playAudio(sounds[key]);
}

function playAchievementSound() {
  const list = sounds.achievement || [];
  if (!list.length) return;
  playAudio(list[achievementSoundIndex % list.length]);
  achievementSoundIndex += 1;
}

function playBrushSound() {
  const now = performance.now();
  if (now - lastBrushSoundAt < 78) return;
  const list = sounds.brush || [];
  if (!list.length) return;
  playAudio(list[brushSoundIndex % list.length]);
  brushSoundIndex += 1;
  lastBrushSoundAt = now;
}

function playCaughtSound() {
  const list = sounds.caught || [];
  if (!list.length) return;
  playAudio(list[Math.floor(Math.random() * list.length)]);
}

function playRewardHitSound() {
  if (!audioReady || !sounds.panel) return;
  const instance = sounds.panel.cloneNode();
  instance.volume = 0.24 * soundVolume;
  instance.playbackRate = 0.72;
  instance.play().catch(() => {});
}

function stopMusic() {
  if (!currentMusic) return;
  currentMusic.pause();
  currentMusic.currentTime = 0;
  currentMusic = null;
}

function pauseMusic() {
  if (!currentMusic) return;
  currentMusic.pause();
}

function playMusic(key) {
  if (!audioReady) return;
  const next = sounds[key];
  if (!next) return;
  if (currentMusic === next) {
    if (next.paused) next.play().catch(() => {});
    return;
  }
  stopMusic();
  next.currentTime = 0;
  next.play().catch(() => {});
  currentMusic = next;
}

function visualNow() {
  return paused && pausedVisualNow ? pausedVisualNow : performance.now();
}

function loadAchievements() {
  try {
    return { ...JSON.parse(localStorage.getItem(ACHIEVEMENT_KEY) || "{}") };
  } catch {
    return {};
  }
}

function loadInfiniteAchievements() {
  try {
    return { ...JSON.parse(localStorage.getItem(INFINITE_ACHIEVEMENT_KEY) || "{}") };
  } catch {
    return {};
  }
}

function loadAllAchievements() {
  return {
    normal: loadAchievements(),
    infinite: loadInfiniteAchievements(),
  };
}

function saveAchievements() {
  localStorage.setItem(mode === "infinite" ? INFINITE_ACHIEVEMENT_KEY : ACHIEVEMENT_KEY, JSON.stringify(achievements));
}

function currentAchievementDefs() {
  return achievementDefsByMode[mode];
}

function allAchievementsComplete() {
  return Object.entries(achievementDefsByMode).every(([key, defs]) => defs.every((achievement) => achievementsByMode[key][achievement.id]));
}

function normalAchievementCount() {
  return achievementDefsByMode.normal.filter((achievement) => achievementsByMode.normal[achievement.id]).length;
}

function showToast(title, detail = "") {
  achievementToast.innerHTML = detail ? `<strong>${title}</strong><span>${detail}</span>` : `<strong>${title}</strong>`;
  achievementToast.hidden = false;
  toastUntil = performance.now() + 2400;
}

function showModeUnlockToast() {
  modeUnlockToast.innerHTML = `<strong>${t("infiniteUnlocked")}</strong>`;
  modeUnlockToast.hidden = false;
  modeUnlockToastUntil = performance.now() + 2800;
}

function unlockInfiniteMode() {
  if (infiniteUnlocked || normalAchievementCount() < 1) return;
  infiniteUnlocked = true;
  localStorage.setItem(INFINITE_UNLOCK_KEY, "true");
  updateModeUi();
  showModeUnlockToast();
  playAchievementSound();
}

function t(key) {
  return text[language][key];
}

function uiFont(weight, size) {
  const family = language === "ja" ? '"Yu Gothic", "Meiryo", "Hiragino Sans", sans-serif' : "GyeonggiTitle, sans-serif";
  return `${weight} ${size}px ${family}`;
}

function applyLanguage() {
  document.documentElement.lang = language;
  languageToggle.textContent = t("nextLang");
  restartButton.textContent = t("retry");
  pauseButton.textContent = t(paused ? "resume" : "pause");
  pauseButton.classList.toggle("paused", paused);
  document.querySelector(".best-score span").textContent = t("best");
  document.querySelector(".sneeze-meter span").textContent = t("sneeze");
  modeLabel.textContent = t(mode === "infinite" ? "infinite" : "basic");
  shareButton.textContent = t("share");
  twitterButton.textContent = t("creator");
  achievementPanel.querySelector(".achievement-head strong").textContent = t("achievements");
  startOverlay.querySelector("p").textContent = t("startHelp");
  startButton.textContent = t("start");
  updateModeUi();
  renderAchievements();
}

function setLanguage(nextLanguage) {
  language = nextLanguage;
  applyLanguage();
}

function activeBest() {
  return mode === "infinite" ? infiniteBest : best;
}

function saveBest(value) {
  if (mode === "infinite") {
    infiniteBest = value;
    localStorage.setItem(INFINITE_BEST_SCORE_KEY, String(infiniteBest));
  } else {
    best = value;
    localStorage.setItem(BEST_SCORE_KEY, String(best));
  }
}

function setMode(nextMode) {
  if (mode === nextMode) return;
  if (nextMode === "infinite" && !infiniteUnlocked) {
    showToast("???", t("infinite"));
    playSound("panel");
    return;
  }
  mode = nextMode;
  achievements = achievementsByMode[mode];
  bestScoreEl.textContent = String(Math.floor(activeBest()));
  started = false;
  gameOver = false;
  gameClear = false;
  startOverlay.hidden = false;
  updateModeUi();
  applyLanguage();
}

function updateModeUi() {
  const infinite = mode === "infinite";
  document.body.classList.toggle("infinite-mode", infinite);
  timeDial.classList.toggle("hidden", infinite);
  infiniteToggle.classList.toggle("active", infinite);
  infiniteToggle.classList.toggle("locked", !infiniteUnlocked);
  infiniteToggle.setAttribute("aria-disabled", String(!infiniteUnlocked));
  document.querySelector(".sneeze-meter").hidden = infinite;
  modeLabel.textContent = t(infinite ? "infinite" : "basic");
}

function setPaused(nextPaused) {
  if (!started || gameOver || gameClear || paused === nextPaused) return;
  const now = performance.now();
  paused = nextPaused;
  pauseButton.textContent = t(paused ? "resume" : "pause");
  pauseButton.classList.toggle("paused", paused);
  pointer.down = false;

  if (paused) {
    pauseStartedAt = now;
    pausedVisualNow = now;
    pauseMusic();
    return;
  }

  const pausedFor = now - pauseStartedAt;
  gameStartedAt += pausedFor;
  lastBrushAt += pausedFor;
  lastIrritatedAt += pausedFor;
  lastFurAt += pausedFor;
  nextBackEarWiggleAt += pausedFor;
  nextFrontEarWiggleAt += pausedFor;
  if (warningStrokeGraceStartedAt) warningStrokeGraceStartedAt += pausedFor;
  if (slowlyMessageUntil) slowlyMessageUntil += pausedFor;
  if (toastUntil) toastUntil += pausedFor;
  if (modeUnlockToastUntil) modeUnlockToastUntil += pausedFor;
  pauseStartedAt = 0;
  pausedVisualNow = 0;
  lastTime = now;
  if (anger < WARNING_ANGER) playMusic("bgm");
}

function renderAchievements() {
  achievementList.innerHTML = "";
  const defs = currentAchievementDefs();
  const unlockedCount = defs.filter((achievement) => achievements[achievement.id]).length;
  achievementButton.style.backgroundImage = `url("${assetPaths.achievementButton[Math.min(unlockedCount, 3)]}")`;
  achievementButton.classList.toggle("sparkle", unlockedCount >= 2);
  achievementButton.classList.toggle("all-clear", unlockedCount >= 3);
  for (const achievement of defs) {
    const unlocked = Boolean(achievements[achievement.id]);
    const item = document.createElement("li");
    item.className = unlocked ? "unlocked" : "locked";
    const mark = document.createElement("span");
    mark.className = "achievement-mark";
    mark.textContent = unlocked ? "✓" : "";
    const title = document.createElement("span");
    title.textContent = achievement.hidden && !unlocked ? "???" : achievement.title[language];
    item.append(mark, title);
    achievementList.append(item);
  }
}

function unlockAchievement(id) {
  if (achievements[id]) return;
  achievements[id] = true;
  achievementsByMode[mode] = achievements;
  saveAchievements();
  renderAchievements();
  const achievement = currentAchievementDefs().find((item) => item.id === id);
  showToast(t("achievementToast"), achievement ? achievement.title[language] : t("unlocked"));
  playAchievementSound();
  if (mode === "normal") unlockInfiniteMode();
}

function resetRewardObjects() {
  Object.assign(rewardObjects.furball, { x: 142, y: 610, vx: 0, vy: 0, rot: -0.08, vr: 0, lastHitAt: 0 });
  Object.assign(rewardObjects.tissue, { x: 670, y: 890, vx: 0, vy: 0, rot: 0.1, vr: 0, lastHitAt: 0 });
}

function reset() {
  score = 0;
  anger = 0;
  calm = 30;
  sneeze = 0;
  gameOver = false;
  gameClear = false;
  paused = false;
  gameOverReason = "caught";
  lastIrritatedAt = 0;
  pauseStartedAt = 0;
  pausedVisualNow = 0;
  lastBrushAt = performance.now();
  lastFurAt = 0;
  gameOverStartedAt = 0;
  gameClearStartedAt = 0;
  gameStartedAt = performance.now();
  frozenTimeRatio = 1;
  enteredWarningThisRun = false;
  strokeStartedBelowWarning = false;
  warningStrokeGraceStartedAt = 0;
  wasWarning = false;
  warningReachCount = 0;
  slowlyMessageUntil = 0;
  scoreStrokeDistance = 0;
  backEarWiggleAt = 0;
  frontEarWiggleAt = 0;
  nextBackEarWiggleAt = performance.now() + 2400 + Math.random() * 4200;
  nextFrontEarWiggleAt = performance.now() + 3200 + Math.random() * 5200;
  brushPress = 0;
  bestUpdatedThisRun = false;
  resetRewardObjects();
  particles.length = 0;
  floorFurs.length = 0;
  scoreEl.textContent = "0";
  bestScoreEl.textContent = String(Math.floor(activeBest()));
  timeDial.style.setProperty("--time-left", "100%");
  sneezeFill.style.width = "0%";
  updateModeUi();
  shareButton.hidden = true;
  startOverlay.hidden = true;
  pauseButton.textContent = t("pause");
  pauseButton.classList.remove("paused");
  if (started) playMusic("bgm");
}

function start() {
  started = true;
  unlockAudio();
  reset();
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const source = event.touches ? event.touches[0] : event;
  return {
    x: ((source.clientX - rect.left) / rect.width) * W,
    y: ((source.clientY - rect.top) / rect.height) * H,
  };
}

function inBrushZone(x, y) {
  return (
    x >= BRUSH_ZONE.x &&
    x <= BRUSH_ZONE.x + BRUSH_ZONE.w &&
    y >= BRUSH_ZONE.y &&
    y <= BRUSH_ZONE.y + BRUSH_ZONE.h
  );
}

function isOnOrangeHair(x, y) {
  const nx = (x - CAT_BOX.x) / CAT_BOX.w;
  const ny = (y - CAT_BOX.y) / CAT_BOX.h;
  const headDome = ((nx - 0.45) / 0.32) ** 2 + ((ny - 0.28) / 0.32) ** 2 < 1;
  const backHair = nx > 0.16 && nx < 0.52 && ny > 0.18 && ny < 0.84;
  const sideHair = nx > 0.48 && nx < 0.72 && ny > 0.28 && ny < 0.72;
  const lowerHair = nx > 0.24 && nx < 0.60 && ny > 0.58 && ny < 0.88;
  const faceOrBodyGap = nx > 0.56 && nx < 0.86 && ny > 0.52 && ny < 0.92;

  return (headDome || backHair || sideHair || lowerHair) && !faceOrBodyGap;
}

function spawnFur(x, y, amount = 1) {
  if (mode !== "infinite") sneeze = Math.min(SNEEZE_LIMIT, sneeze + amount * 0.72);
  lastFurAt = performance.now();
  for (let i = 0; i < amount; i += 1) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
    const speed = 2.2 + Math.random() * 3.4;
    const img = images[`effect${Math.floor(Math.random() * assetPaths.effects.length)}`];
    const golden = Math.random() < GOLDEN_FUR_CHANCE;
    if (golden) {
      score += GOLDEN_FUR_BONUS;
      particles.push({
        type: "text",
        text: `+${GOLDEN_FUR_BONUS}`,
        x,
        y: y - 34,
        vx: (Math.random() - 0.5) * 1.1,
        vy: -2.2,
        life: 82,
        rot: 0,
        scale: 1,
      });
      if (mode === "normal") {
        if (score >= 15 && !enteredWarningThisRun) unlockAchievement("brush15");
        if (score >= 25) unlockAchievement("brush25");
      } else {
        unlockAchievement("goldenFur");
      }
    }
    particles.push({
      x: x + (Math.random() - 0.5) * 72,
      y: y + (Math.random() - 0.5) * 56,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 1.8,
      vy: Math.sin(angle) * speed - Math.random() * 1.4,
      life: 68 + Math.random() * 42,
      img,
      scale: golden ? 0.2 + Math.random() * 0.14 : 0.12 + Math.random() * 0.16,
      rot: (Math.random() - 0.5) * 1.2,
      golden,
    });

    floorFurs.push({
      x: Math.max(54, Math.min(W - 54, x + (Math.random() - 0.5) * 430)),
      y: 830 + Math.random() * 130,
      img,
      scale: golden ? 0.11 + Math.random() * 0.08 : 0.07 + Math.random() * 0.085,
      rot: (Math.random() - 0.5) * Math.PI,
      alpha: golden ? 0.72 : 0.42 + Math.random() * 0.28,
      golden,
    });
  }
  if (floorFurs.length > MAX_FLOOR_FUR) {
    floorFurs.splice(0, floorFurs.length - MAX_FLOOR_FUR);
  }
}

function beep(type) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const audio = new AudioContext();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type === "bad" ? "sawtooth" : "sine";
  osc.frequency.value = type === "bad" ? 120 : 520;
  gain.gain.setValueAtTime(0.055, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.12);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + 0.13);
}

function sneezeSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const audio = new AudioContext();

  for (let i = 0; i < 2; i += 1) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(180 + i * 90, audio.currentTime + i * 0.09);
    gain.gain.setValueAtTime(0.07, audio.currentTime + i * 0.09);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + i * 0.17);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(audio.currentTime + i * 0.09);
    osc.stop(audio.currentTime + i * 0.18);
  }
}

function difficultyLevel(now = performance.now()) {
  if (!started || !gameStartedAt) return 0;
  if (mode === "infinite") {
    const progress = Math.min(1.18, (now - gameStartedAt) / INFINITE_TARGET_TIME);
    return Math.min(1.65, progress ** 2.2 * 1.65);
  }
  return Math.min(1, (now - gameStartedAt) / 90000);
}

function syncWarningState(now = performance.now()) {
  const inWarning = anger >= WARNING_ANGER;
  if (inWarning && !wasWarning) {
    pauseMusic();
    playSound("warning");
    enteredWarningThisRun = true;
    warningReachCount += 1;
    if (warningReachCount >= 3) slowlyMessageUntil = now + 1800;
  } else if (!inWarning && wasWarning && started && !gameOver && !gameClear) {
    playMusic("bgm");
  }
  wasWarning = inWarning;
}

function handleStroke(x, y, dx, dy) {
  if (!started || paused || gameOver || gameClear || !pointer.down) return;

  const now = performance.now();
  const speed = pointer.speed;
  const goodDirection = dy > Math.abs(dx) * 0.7;
  const validHair = isOnOrangeHair(x, y);

  if (!validHair) return;
  lastBrushAt = now;
  if (goodDirection && speed > NICE_BRUSH_SPEED_MIN) playBrushSound();

  const difficulty = difficultyLevel(now);
  const fastBrushSpeed = mode === "infinite" ? FAST_BRUSH_SPEED + 190 - difficulty * 470 : FAST_BRUSH_SPEED + 150 - difficulty * 170;
  const niceBrushSpeedMax = mode === "infinite" ? NICE_BRUSH_SPEED_MAX + 120 - difficulty * 300 : NICE_BRUSH_SPEED_MAX + 110 - difficulty * 110;
  const angerGainScale = mode === "infinite" ? 0.34 + difficulty * 1.18 : 0.62 + difficulty * 0.46;
  const strokeLength = mode === "infinite" ? INFINITE_SCORE_STROKE_LENGTH : SCORE_STROKE_LENGTH;

  if (goodDirection && dy > 0) {
    scoreStrokeDistance += dy;
    while (scoreStrokeDistance >= strokeLength) {
      score += 1;
      scoreStrokeDistance -= strokeLength;
      if (mode === "normal") {
        if (score >= 15 && !enteredWarningThisRun) unlockAchievement("brush15");
        if (score >= 25) unlockAchievement("brush25");
      }
    }
  }

  if (anger >= WARNING_ANGER) {
    if (strokeStartedBelowWarning) {
      if (!warningStrokeGraceStartedAt) warningStrokeGraceStartedAt = now;
      if (now - warningStrokeGraceStartedAt <= WARNING_STROKE_GRACE_TIME) return;
    }
    endGame("caught");
    return;
  }

  if (speed > fastBrushSpeed) {
    anger += Math.min(6.4, (1.25 + (speed - fastBrushSpeed) / 390) * angerGainScale);
    calm = Math.max(0, calm - 0.9);
    brushPress = Math.min(1, brushPress + 0.35);
    lastIrritatedAt = now;
    if (Math.random() < 0.3) spawnFur(x, y, 2);
  } else if (goodDirection && speed > NICE_BRUSH_SPEED_MIN && speed < niceBrushSpeedMax) {
    calm = Math.min(100, calm + 0.45);
    anger = Math.max(0, anger - (mode === "infinite" ? 0.35 : 0.72));
    brushPress = Math.min(1, brushPress + 0.28);
    if (Math.random() < 0.48) spawnFur(x, y, 2);
  }

  syncWarningState(now);

  if (anger >= WARNING_ANGER && strokeStartedBelowWarning && !warningStrokeGraceStartedAt) {
    warningStrokeGraceStartedAt = now;
  }

  if (anger >= GAME_OVER_ANGER && (!strokeStartedBelowWarning || now - warningStrokeGraceStartedAt > WARNING_STROKE_GRACE_TIME)) {
    endGame("caught");
  }
}

function endGame(reason = "caught") {
  if (gameOver || gameClear) return;
  gameOver = true;
  gameOverReason = reason;
  gameOverStartedAt = performance.now();
  frozenTimeRatio =
    mode === "infinite"
      ? 0
      : reason === "time"
      ? 0
      : Math.max(0, (GAME_DURATION - (gameOverStartedAt - gameStartedAt)) / GAME_DURATION);
  bestUpdatedThisRun = score > activeBest();
  saveBest(Math.max(activeBest(), score));
  bestScoreEl.textContent = String(Math.floor(activeBest()));
  if (reason === "sneeze") {
    unlockAchievement("sneeze");
    playSound("sneeze");
  }
  if (reason === "caught") playCaughtSound();
  if (mode === "infinite") {
    infiniteGameOverCount += 1;
    localStorage.setItem(INFINITE_GAMEOVER_COUNT_KEY, String(infiniteGameOverCount));
    if (infiniteGameOverCount >= 5) unlockAchievement("gameover5");
  }
  stopMusic();
  if (reason === "time") playSound("timeOver");
  playSound("gameOver");
  playMusic("gameOverBgm");
  shareButton.hidden = mode !== "infinite";
}

function clearGame() {
  if (gameOver || gameClear) return;
  gameClear = true;
  gameClearStartedAt = performance.now();
  frozenTimeRatio = 0;
  bestUpdatedThisRun = score > activeBest();
  saveBest(Math.max(activeBest(), score));
  bestScoreEl.textContent = String(Math.floor(activeBest()));
  stopMusic();
  playMusic("gameClearBgm");
  shareButton.hidden = mode !== "normal";
}

function update(dt) {
  if (paused) {
    if (!achievementToast.hidden && performance.now() > toastUntil) achievementToast.hidden = true;
    if (!modeUnlockToast.hidden && performance.now() > modeUnlockToastUntil) modeUnlockToast.hidden = true;
    return;
  }

  if (started && !gameOver && !gameClear) {
    const now = performance.now();
    const difficulty = difficultyLevel(now);
    const elapsed = now - gameStartedAt;
    const remaining = Math.max(0, GAME_DURATION - elapsed);
    const canRecover = now - lastIrritatedAt > ANGER_RECOVERY_DELAY + difficulty * (mode === "infinite" ? 360 : 650);
    if (!pointer.down && canRecover) {
      anger = Math.max(0, anger - dt * IDLE_ANGER_RECOVERY * (mode === "infinite" ? Math.max(0.52, 1.12 - difficulty * 0.28) : Math.max(0.55, 1 - difficulty * 0.28)));
      calm = Math.min(100, calm + dt * 0.006);
    } else {
      calm = Math.max(0, calm - dt * 0.001);
    }
    syncWarningState(now);

    if (warningStrokeGraceStartedAt && now - warningStrokeGraceStartedAt > WARNING_STROKE_GRACE_TIME) {
      endGame("caught");
    } else if (anger >= GAME_OVER_ANGER && !warningStrokeGraceStartedAt) {
      endGame("caught");
    }

    if (mode !== "infinite" && sneeze >= SNEEZE_LIMIT) endGame("sneeze");
    if (mode !== "infinite" && remaining <= 0) {
      if (score >= CLEAR_SCORE) clearGame();
      else endGame("time");
    }
  }

  if (mode !== "infinite" && started && !gameOver && !gameClear && !pointer.down && performance.now() - lastFurAt >= SNEEZE_DECAY_DELAY) {
    sneeze = Math.max(0, sneeze - dt * SNEEZE_DECAY);
  }

  brushPress = Math.max(0, brushPress - dt * 0.006);

  const nowForEar = performance.now();
  if (started && !gameOver && !gameClear && anger < WARNING_ANGER && !backEarWiggleAt && nowForEar >= nextBackEarWiggleAt) {
    backEarWiggleAt = nowForEar;
  }
  if (started && !gameOver && !gameClear && anger < WARNING_ANGER && !frontEarWiggleAt && nowForEar >= nextFrontEarWiggleAt) {
    frontEarWiggleAt = nowForEar;
  }
  if (backEarWiggleAt && nowForEar - backEarWiggleAt > 560) {
    backEarWiggleAt = 0;
    nextBackEarWiggleAt = nowForEar + 3000 + Math.random() * 5200;
  }
  if (frontEarWiggleAt && nowForEar - frontEarWiggleAt > 560) {
    frontEarWiggleAt = 0;
    nextFrontEarWiggleAt = nowForEar + 3600 + Math.random() * 6200;
  }

  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const p = particles[i];
    p.x += p.vx * dt * 0.09;
    p.y += p.vy * dt * 0.09;
    p.vy += dt * 0.004;
    p.life -= dt * 0.045;
    p.rot += 0.018;
    if (p.life <= 0) particles.splice(i, 1);
  }

  updateRewardObject(rewardObjects.furball, (mode === "normal" && achievementsByMode.normal.brush15 && achievementsByMode.normal.brush25) || (mode === "infinite" && achievementsByMode.infinite.goldenFur), dt);
  updateRewardObject(rewardObjects.tissue, (mode === "normal" && achievementsByMode.normal.sneeze) || (mode === "infinite" && achievementsByMode.infinite.gameover5), dt);

  scoreEl.textContent = String(Math.floor(score));
  bestScoreEl.textContent = String(Math.floor(activeBest()));
  const remainingRatio =
    gameOver || gameClear
      ? frozenTimeRatio
      : started && gameStartedAt
      ? Math.max(0, (GAME_DURATION - (performance.now() - gameStartedAt)) / GAME_DURATION)
      : 1;
  timeDial.style.setProperty("--time-left", `${remainingRatio * 100}%`);
  const timerWarning = started && !gameOver && !gameClear && remainingRatio <= 0.18;
  timeDial.style.setProperty("--timer-active", timerWarning ? "rgba(229, 68, 62, 0.94)" : "rgba(62, 189, 225, 0.92)");
  timeDial.style.setProperty("--timer-rest", timerWarning ? "rgba(229, 68, 62, 0.18)" : "rgba(62, 189, 225, 0.14)");
  sneezeFill.style.width = `${Math.round(Math.min(100, sneeze))}%`;
  updateModeUi();
  if (!achievementToast.hidden && performance.now() > toastUntil) achievementToast.hidden = true;
  if (!modeUnlockToast.hidden && performance.now() > modeUnlockToastUntil) modeUnlockToast.hidden = true;
}

function updateRewardObject(object, active, dt) {
  if (!active) return;
  if (pointer.down && started && !gameOver && !gameClear) {
    const combX = pointer.x;
    const combY = pointer.y;
    const dx = object.x - combX;
    const dy = object.y - combY;
    const touchRadius = Math.max(object.w, object.h) * 0.68;
    const dist = Math.hypot(dx, dy) || 1;
    if (dist < touchRadius) {
      const push = (1 - dist / touchRadius) * 0.82;
      const direction = dx >= 0 ? 1 : -1;
      object.vx += direction * push * dt;
      object.vr += direction * push * 0.03 * dt;
      const now = performance.now();
      if (now - object.lastHitAt > 180) {
        playRewardHitSound();
        object.lastHitAt = now;
      }
    }
  }

  object.x += object.vx * dt * 0.03;
  object.y += object.vy * dt * 0.012;
  object.rot += object.vr * dt * 0.02;
  object.vx *= 0.88;
  object.vy *= 0.82;
  object.vr *= 0.86;
  object.x = Math.max(object.w * 0.45, Math.min(W - object.w * 0.45, object.x));
  object.y = Math.max(object.behind ? 560 : 820, Math.min(object.behind ? 740 : 950, object.y));
}

function drawImageCover(img, x, y, w, h) {
  const srcRatio = img.width / img.height;
  const dstRatio = w / h;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;

  if (srcRatio > dstRatio) {
    sw = img.height * dstRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / dstRatio;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawLayer(img, box, rotation = 0, pivotX = 0.5, pivotY = 0.5) {
  ctx.save();
  ctx.translate(box.x + box.w * pivotX, box.y + box.h * pivotY);
  ctx.rotate(rotation);
  ctx.drawImage(img, -box.w * pivotX, -box.h * pivotY, box.w, box.h);
  ctx.restore();
}

function wiggleRotation(startedAt, amount = 0.09, now = visualNow()) {
  if (!startedAt) return 0;
  const elapsed = now - startedAt;
  if (elapsed > 560) return 0;
  return Math.sin((elapsed / 560) * Math.PI * 4) * (1 - elapsed / 560) * amount;
}

function isDancing(now = visualNow()) {
  return started && !gameOver && !gameClear && anger < WARNING_ANGER && now - lastBrushAt > IDLE_DANCE_DELAY;
}

function drawCat(options = {}) {
  const now = visualNow();
  const forceCalm = Boolean(options.forceCalm);
  const warningLayers = [images.angry1, images.angry3, images.angry2];
  const gameOverLayers = [images.angry1, images.angry4, images.angry5];
  const showGameOver = gameOver && !forceCalm;
  const showWarning = anger >= WARNING_ANGER && !forceCalm;
  const shake = showGameOver ? Math.sin(now * 0.16) * 8 : 0;
  const press = showGameOver ? 0 : brushPress;
  const pressedH = CAT_BOX.h * (1 - press * 0.018);
  const pressedW = CAT_BOX.w * (1 + press * 0.006);
  const box = {
    x: CAT_BOX.x + shake - (pressedW - CAT_BOX.w) * 0.5,
    y: CAT_BOX.y + (CAT_BOX.h - pressedH) + (showGameOver ? Math.sin(now * 0.11) * 5 : 0),
    w: pressedW,
    h: pressedH,
  };
  const layers = showGameOver ? gameOverLayers : showWarning ? warningLayers : null;
  const halo = showGameOver || showWarning ? images.angry0 : images.calm0;
  const haloBox = { ...box, y: box.y + Math.sin(now * 0.003) * 9 };
  const dancing = isDancing(now);
  let haloDanceBounce = 0;

  if (dancing) {
    const t = now * 0.008;
    const bounce = Math.abs(Math.sin(t)) ** 1.8;
    haloDanceBounce = Math.abs(Math.sin(t - 0.72)) ** 1.8;
    const pivotX = CAT_BOX.x + CAT_BOX.w * 0.5;
    const pivotY = CAT_BOX.y + CAT_BOX.h;
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.scale(1 + bounce * 0.005, 1 - bounce * 0.015);
    ctx.translate(-pivotX, -pivotY);
  }

  if (layers) {
    for (const img of layers) drawLayer(img, box);
    if (!showGameOver && showWarning) {
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = 0.22;
      drawLayer(images.angry5, box);
      ctx.restore();
    }
  } else {
    drawLayer(images.calm1, box, wiggleRotation(backEarWiggleAt, 0.1, now), 0.35, 0.25);
    drawLayer(images.calm2, box);
    drawLayer(images.calm3, box, wiggleRotation(frontEarWiggleAt, -0.09, now), 0.48, 0.28);
  }

  if (dancing) {
    const haloPivotX = haloBox.x + haloBox.w * 0.5;
    const haloPivotY = haloBox.y + haloBox.h * 0.13;
    ctx.save();
    ctx.translate(haloPivotX, haloPivotY);
    ctx.scale(1 + haloDanceBounce * 0.004, 1 - haloDanceBounce * 0.012);
    ctx.translate(-haloPivotX, -haloPivotY);
    drawLayer(halo, haloBox);
    ctx.restore();
  } else {
    drawLayer(halo, haloBox);
  }

  if (!showGameOver && !forceCalm && now < slowlyMessageUntil) {
    if (dancing) ctx.restore();
    ctx.save();
    ctx.fillStyle = "rgba(255, 181, 104, 0.72)";
    ctx.textAlign = "center";
    ctx.font = uiFont(900, 42);
    ctx.fillText(t("slowly"), CAT_BOX.x + CAT_BOX.w * 0.5, CAT_BOX.y - 28);
    ctx.restore();
    if (dancing) ctx.save();
  }

  ctx.globalAlpha = 1;
  if (dancing) ctx.restore();
}

function drawFloorFur() {
  for (const f of floorFurs) {
    ctx.save();
    ctx.globalAlpha = f.alpha;
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rot);
    if (f.golden) {
      ctx.shadowColor = "rgba(255, 219, 84, 0.9)";
      ctx.shadowBlur = 12;
      ctx.filter = "sepia(1) saturate(4.4) hue-rotate(350deg) brightness(1.35)";
    }
    ctx.drawImage(f.img, -f.img.width * f.scale * 0.5, -f.img.height * f.scale * 0.5, f.img.width * f.scale, f.img.height * f.scale);
    ctx.restore();
  }
}

function drawParticles() {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 45));
    ctx.translate(p.x, p.y);
    if (p.type === "text") {
      ctx.textAlign = "center";
      ctx.font = uiFont(900, 34);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "rgba(96, 58, 24, 0.78)";
      ctx.fillStyle = "#ffe985";
      ctx.strokeText(p.text, 0, 0);
      ctx.fillText(p.text, 0, 0);
      ctx.restore();
      continue;
    }
    ctx.rotate(p.rot);
    if (p.golden) {
      ctx.shadowColor = "rgba(255, 224, 92, 0.95)";
      ctx.shadowBlur = 16;
      ctx.filter = "sepia(1) saturate(4.8) hue-rotate(350deg) brightness(1.45)";
    }
    ctx.drawImage(p.img, -p.img.width * p.scale * 0.5, -p.img.height * p.scale * 0.5, p.img.width * p.scale, p.img.height * p.scale);
    ctx.restore();
  }
}

function drawPlacedRewards(layer = "front") {
  const drawBack = layer === "back";
  const normalAchievements = achievementsByMode.normal;
  const infiniteAchievements = achievementsByMode.infinite;

  if (!drawBack && ((mode === "normal" && normalAchievements.sneeze) || (mode === "infinite" && infiniteAchievements.gameover5))) {
    drawRewardImage(images.achievementTissue, rewardObjects.tissue);
  }

  if (drawBack && ((mode === "normal" && normalAchievements.brush15 && normalAchievements.brush25) || (mode === "infinite" && infiniteAchievements.goldenFur))) {
    drawRewardImage(images.achievementFurball, rewardObjects.furball);
  }

  if (drawBack && allAchievementsComplete()) {
    drawRewardImage(images.masterReward, masterRewardObject);
  }
}

function drawRewardImage(img, object) {
  ctx.save();
  ctx.globalAlpha = object.alpha ?? 1;
  ctx.translate(object.x, object.y);
  ctx.rotate(object.rot);
  ctx.drawImage(img, -object.w * 0.5, -object.h * 0.5, object.w, object.h);
  ctx.restore();
}

function drawComb() {
  const speedTilt = Math.min(0.18, pointer.speed * 0.00008);
  const pressTilt = pointer.down ? -brushPress * 0.14 : 0;
  const angle = -Math.PI / 6 + pressTilt + speedTilt;
  const w = 102;
  const h = 212;
  ctx.save();
  ctx.translate(pointer.x, pointer.y);
  ctx.rotate(angle);
  ctx.drawImage(images.comb, -w * 0.5, -h * 0.5, w, h);
  ctx.restore();
}

function createShareBlob() {
  const shareCanvas = document.createElement("canvas");
  shareCanvas.width = W;
  shareCanvas.height = H;
  const shareCtx = shareCanvas.getContext("2d");
  shareCtx.drawImage(canvas, 0, 0);

  const unlockedCount = currentAchievementDefs().filter((achievement) => achievements[achievement.id]).length;
  const trophy = images[`achievementButton${Math.min(unlockedCount, 3)}`];
  if (trophy) {
    const size = 88;
    const x = W - 14 - size;
    const y = 14;
    shareCtx.save();
    if (unlockedCount >= 3) {
      shareCtx.shadowColor = "rgba(180, 120, 255, 0.72)";
      shareCtx.shadowBlur = 18;
    }
    shareCtx.drawImage(trophy, x, y, size, size);
    shareCtx.restore();
  }

  return new Promise((resolve) => shareCanvas.toBlob(resolve, "image/png"));
}

function drawWorld(options = {}) {
  drawImageCover(images.background, 0, 0, W, H);
  drawFloorFur();
  drawPlacedRewards("back");
  drawCat(options);
  drawPlacedRewards("front");
  drawParticles();
  if (!options.hideComb) drawComb();
}

function drawPauseOverlay() {
  if (!paused || gameOver || gameClear) return;
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.36)";
  ctx.fillRect(0, 0, W, H);
  const size = 82;
  ctx.globalAlpha = 0.92;
  ctx.drawImage(images.controlResume, W / 2 - size / 2, H / 2 - size / 2, size, size);
  ctx.restore();
}

function drawGameOver() {
  if (!gameOver) return;
  if (gameOverReason === "time") {
    drawWorld({ hideComb: true, forceCalm: true });
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.68)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.9;
    ctx.drawImage(images.gameover, 96, 246, 608, 76);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#fff8f6";
    ctx.textAlign = "center";
    ctx.font = uiFont(900, 44);
    ctx.fillText(t("notEnough"), W / 2, 398);
    ctx.font = uiFont(800, 36);
    ctx.fillText(`${t("score")} ${Math.floor(score)}`, W / 2, 470);
    ctx.fillText(`${t("best")} ${Math.floor(activeBest())}`, W / 2, 512);
    if (bestUpdatedThisRun) {
      ctx.fillStyle = "#ffe88a";
      ctx.font = uiFont(900, 30);
      ctx.fillText(t("newBest"), W / 2, 560);
    }
    ctx.restore();
    return;
  }
  ctx.save();
  const elapsed = performance.now() - gameOverStartedAt;
  const zoomProgress = Math.min(1, elapsed / GAME_OVER_ZOOM_TIME);
  const eased = 1 - (1 - zoomProgress) ** 3;
  const faceCenterX = CAT_BOX.x + CAT_BOX.w * 0.66;
  const faceCenterY = CAT_BOX.y + CAT_BOX.h * 0.43;
  const zoomScale = 1 + eased * 3.25;
  const shakeX = Math.sin(performance.now() * 0.22) * eased * 9;
  const shakeY = Math.sin(performance.now() * 0.17) * eased * 7;

  ctx.translate(W * 0.5 + shakeX, H * 0.5 + shakeY);
  ctx.scale(zoomScale, zoomScale);
  ctx.translate(-faceCenterX, -faceCenterY);
  drawWorld({ hideComb: true });

  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.38 * eased;
  drawLayer(images.angry5, CAT_BOX);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;

  if (zoomProgress < 1) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = `rgba(0, 0, 0, ${eased * 0.5})`;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    return;
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 0.86;
  drawImageCover(images.black, 0, 0, W, H);
  ctx.globalAlpha = 1;
  ctx.drawImage(images.gameover, 80, 230, 640, 80);
  ctx.fillStyle = "#fff8f6";
  ctx.textAlign = "center";
  ctx.font = uiFont(900, 56);
  ctx.fillText(t(gameOverReason === "time" ? "notEnough" : "caught"), W / 2, 395);
  ctx.font = uiFont(800, 36);
  ctx.fillText(`${mode === "infinite" ? t("infiniteTotal") : t("score")} ${Math.floor(score)}`, W / 2, 462);
  ctx.fillText(`${t("best")} ${Math.floor(activeBest())}`, W / 2, 504);
  if (bestUpdatedThisRun) {
    ctx.fillStyle = "#ffe88a";
    ctx.font = uiFont(900, 30);
    ctx.fillText(t("newBest"), W / 2, 552);
  }
  ctx.restore();
}

function drawGameClear() {
  if (!gameClear) return;
  drawWorld();
  ctx.save();
  const elapsed = performance.now() - gameClearStartedAt;
  const progress = Math.min(1, elapsed / 620);
  const pop = progress < 0.72 ? 1.12 * Math.sin((progress / 0.72) * Math.PI * 0.5) : 1 + Math.sin((1 - progress) * Math.PI * 3) * 0.08 * (1 - progress);
  ctx.fillStyle = "rgba(0, 0, 0, 0.52)";
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center";
  const imageScale = 0.2 + pop * 0.018;
  const imgW = images.clearMari.width * imageScale;
  const imgH = images.clearMari.height * imageScale;
  const imgX = W / 2 - imgW / 2 - 34;
  const imgY = H * 0.105;
  const haloY = imgY + Math.sin(performance.now() * 0.004) * 8;
  ctx.save();
  ctx.globalAlpha = Math.min(1, progress * 1.8);
  const glow = ctx.createRadialGradient(W / 2 - 28, imgY + imgH * 0.48, 12, W / 2 - 28, imgY + imgH * 0.48, imgW * 0.72);
  glow.addColorStop(0, "rgba(255, 235, 128, 0.5)");
  glow.addColorStop(0.58, "rgba(255, 213, 92, 0.22)");
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(imgX - 90, imgY - 80, imgW + 180, imgH + 170);
  const sparklePulse = 0.45 + Math.abs(Math.sin(performance.now() * 0.008)) * 0.55;
  const sparkleScale = 1 + sparklePulse * 0.025;
  const sparkleW = imgW * sparkleScale;
  const sparkleH = imgH * sparkleScale;
  const sparkleX = imgX - (sparkleW - imgW) / 2;
  const sparkleY = imgY - (sparkleH - imgH) / 2;
  ctx.drawImage(images.clearHalo, imgX, haloY, imgW, imgH);
  ctx.drawImage(images.clearMari, imgX, imgY, imgW, imgH);
  ctx.globalAlpha = Math.min(1, progress * 1.8) * 0.72;
  ctx.drawImage(images.clearSparkle, sparkleX, sparkleY, sparkleW, sparkleH);
  ctx.restore();
  ctx.shadowColor = "rgba(255, 255, 255, 0.85)";
  ctx.shadowBlur = 12;
  ctx.translate(W / 2, H * 0.5);
  ctx.scale(pop, pop);
  ctx.fillStyle = "rgba(91, 208, 238, 0.92)";
  ctx.font = uiFont(900, 72);
  ctx.lineWidth = 7;
  ctx.strokeStyle = "rgba(70, 45, 58, 0.82)";
  ctx.strokeText(t("gameClear"), 0, 0);
  ctx.fillText(t("gameClear"), 0, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(255, 255, 255, 0.55)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "rgba(225, 249, 255, 0.95)";
  ctx.font = uiFont(800, 36);
  ctx.fillText(t("clearShine"), W / 2, H * 0.57);
  ctx.fillText(`${t("score")} ${Math.floor(score)}`, W / 2, H * 0.63);
  ctx.fillText(`${t("best")} ${Math.floor(activeBest())}`, W / 2, H * 0.68);
  if (bestUpdatedThisRun) {
    ctx.fillStyle = "#ffe88a";
    ctx.font = uiFont(900, 30);
    ctx.fillText(t("newBest"), W / 2, H * 0.74);
  }
  ctx.restore();
}

function render(now) {
  const dt = Math.min(40, now - lastTime);
  lastTime = now;
  update(dt);

  ctx.clearRect(0, 0, W, H);
  if (gameOver) {
    drawGameOver();
    drawComb();
  } else if (gameClear) {
    drawGameClear();
  } else {
    drawWorld();
  }
  drawPauseOverlay();
  requestAnimationFrame(render);
}

function movePointer(event) {
  event.preventDefault();
  if (activePointerId !== null && event.pointerId !== activePointerId) return;
  const p = canvasPoint(event);
  const eventTime = event.timeStamp || performance.now();
  const elapsed = Math.max(16, eventTime - (pointer.lastTime || eventTime - 16));
  const dx = p.x - pointer.x;
  const dy = p.y - pointer.y;
  pointer.speed = (Math.hypot(dx, dy) / elapsed) * 1000;
  pointer.lastTime = eventTime;
  pointer.lastX = pointer.x;
  pointer.lastY = pointer.y;
  pointer.x = p.x;
  pointer.y = p.y;
  handleStroke(p.x, p.y, dx, dy);
}

canvas.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  if (event.isPrimary === false || (pointer.down && activePointerId !== event.pointerId)) return;
  unlockAudio();
  if (gameOver || gameClear) {
    reset();
    return;
  }
  if (paused) {
    playSound("panel");
    setPaused(false);
    return;
  }
  activePointerId = event.pointerId;
  canvas.setPointerCapture?.(event.pointerId);
  pointer.down = true;
  const p = canvasPoint(event);
  pointer.x = p.x;
  pointer.y = p.y;
  pointer.lastX = p.x;
  pointer.lastY = p.y;
  pointer.speed = 0;
  pointer.lastTime = event.timeStamp || performance.now();
  strokeStartedBelowWarning = anger < WARNING_ANGER;
  warningStrokeGraceStartedAt = 0;

  if (started && !strokeStartedBelowWarning && isOnOrangeHair(p.x, p.y)) {
    endGame("caught");
  }
});

canvas.addEventListener("pointermove", movePointer);
function endPointer(event) {
  if (activePointerId !== null && event.pointerId !== activePointerId) return;
  if (activePointerId !== null) {
    try {
      canvas.releasePointerCapture?.(activePointerId);
    } catch {}
  }
  pointer.down = false;
  activePointerId = null;
  strokeStartedBelowWarning = false;
  warningStrokeGraceStartedAt = 0;
}

window.addEventListener("pointerup", endPointer);
window.addEventListener("pointercancel", endPointer);
canvas.addEventListener("lostpointercapture", endPointer);
window.addEventListener("gesturestart", (event) => event.preventDefault(), { passive: false });
window.addEventListener("gesturechange", (event) => event.preventDefault(), { passive: false });

startButton.addEventListener("click", start);
restartButton.addEventListener("click", () => {
  unlockAudio();
  playAchievementSound();
  started = true;
  reset();
});
pauseButton.addEventListener("click", () => {
  unlockAudio();
  playSound("panel");
  setPaused(!paused);
});
languageToggle.addEventListener("click", () => {
  unlockAudio();
  playSound("language");
  setLanguage(language === "en" ? "ko" : language === "ko" ? "ja" : "en");
});
volumeRange.value = String(Math.round(soundVolume * 100));
volumeRange.addEventListener("input", () => {
  soundVolume = Number(volumeRange.value) / 100;
  localStorage.setItem(VOLUME_KEY, String(soundVolume));
  applySoundVolume();
});
volumeRange.addEventListener("change", () => {
  unlockAudio();
  playAchievementSound();
});
twitterButton.addEventListener("click", () => {
  unlockAudio();
  playAchievementSound();
  window.open("https://x.com/horuhara", "_blank", "noopener");
});
infiniteToggle.addEventListener("click", () => {
  unlockAudio();
  playSound("language");
  stopMusic();
  setMode(mode === "infinite" ? "normal" : "infinite");
});
shareButton.addEventListener("click", async () => {
  unlockAudio();
  playSound("language");
  const fileName = mode === "infinite" ? "mari-infinite-score.png" : "mari-clear.png";
  const blob = await createShareBlob();
  if (!blob) return;
  const link = document.createElement("a");
  link.download = fileName;
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
  if (mode === "infinite") unlockAchievement("share");
});
achievementButton.addEventListener("click", () => {
  unlockAudio();
  playSound("panel");
  renderAchievements();
  achievementPanel.hidden = false;
});
achievementClose.addEventListener("click", () => {
  playSound("panel");
  achievementPanel.hidden = true;
});
achievementPanel.addEventListener("click", (event) => {
  if (event.target === achievementPanel) {
    playSound("panel");
    achievementPanel.hidden = true;
  }
});

loadSounds();
loadAssets()
  .then(async () => {
    if (document.fonts) await document.fonts.ready;
    infiniteUnlocked = infiniteUnlocked || normalAchievementCount() >= 1;
    if (infiniteUnlocked) localStorage.setItem(INFINITE_UNLOCK_KEY, "true");
    applyLanguage();
    requestAnimationFrame(render);
  })
  .catch((error) => {
    console.error(error);
    startOverlay.querySelector("p").textContent = t("loadFail");
  });
