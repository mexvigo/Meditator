/* ── Meditation Guidance Data ─────────────────────── */
const MEDITATIONS = {
  anxious: {
    intro: "Let's calm that restless energy. You're safe here.",
    steps: [
      "Close your eyes gently. Feel your feet on the ground.",
      "Place one hand on your chest. Notice your heartbeat.",
      "With each breath out, silently say \"I am safe.\"",
      "Imagine warm light flowing down from the crown of your head…",
      "Let it dissolve every knot of tension it touches.",
      "There is nothing to fix right now. Just breathe.",
      "Feel the stillness growing inside you.",
      "You are doing beautifully. Stay here a little longer.",
    ],
    closing: "You showed real courage by pausing. Carry this calm with you.",
  },
  stressed: {
    intro: "You've been carrying a lot. Let's set it down for a moment.",
    steps: [
      "Unclench your jaw. Drop your shoulders away from your ears.",
      "Take a slow breath in through your nose… and out through your mouth.",
      "Picture a calm lake at dawn — perfectly still.",
      "With each exhale, let one worry drift away across the water.",
      "Your only job right now is to breathe.",
      "Feel the space opening up inside your chest.",
      "You are more than your to-do list.",
      "Rest here. Everything else can wait.",
    ],
    closing: "You gave yourself permission to rest. That takes strength.",
  },
  sad: {
    intro: "It's okay to feel this way. Let's sit with it gently.",
    steps: [
      "Place both hands over your heart. Feel its steady rhythm.",
      "Breathe in kindness… breathe out heaviness.",
      "You don't need to push this feeling away.",
      "Imagine someone who loves you sitting beside you right now.",
      "Let their warmth wrap around you like a soft blanket.",
      "Sadness is a visitor. It will pass in its own time.",
      "You are worthy of comfort and care.",
      "Breathe gently. You are held.",
    ],
    closing: "Thank you for being gentle with yourself today.",
  },
  restless: {
    intro: "All that buzzing energy — let's give it somewhere to land.",
    steps: [
      "Feel the weight of your body pressing into the seat beneath you.",
      "Wiggle your fingers… now let them go still.",
      "Follow your breath like a wave — rising, falling, rising.",
      "Each exhale anchors you a little more.",
      "Notice five things you can physically feel right now.",
      "Let the world outside this moment fade to a whisper.",
      "Stillness isn't emptiness — it's fullness without noise.",
      "You're settling. Feel it happening.",
    ],
    closing: "You found your stillness. It's always there when you need it.",
  },
  tired: {
    intro: "You deserve this rest. Let's recharge together.",
    steps: [
      "Let your eyes close. Let your body feel heavy and supported.",
      "Breathe in slowly… you don't need to rush.",
      "Imagine you're lying on soft grass under a warm sky.",
      "Every breath fills you with gentle, golden energy.",
      "Let each muscle soften — your face, your neck, your hands.",
      "There's nowhere to be. Nothing to do.",
      "Feel rest flowing into every tired corner of your body.",
      "Stay here. You're recharging.",
    ],
    closing: "You honored your need for rest. That's a beautiful thing.",
  },
  neutral: {
    intro: "A calm mind is the perfect canvas. Let's deepen the stillness.",
    steps: [
      "Settle into a comfortable position. Close your eyes.",
      "Take three deep breaths at your own pace.",
      "Notice the natural rhythm of your breathing — no need to change it.",
      "Let your awareness expand like ripples on still water.",
      "Observe thoughts passing without following them.",
      "You are the sky. Thoughts are just clouds drifting through.",
      "Rest in this spacious awareness.",
      "Enjoy the simplicity of just being.",
    ],
    closing: "You deepened your peace. Carry this clarity forward.",
  },
  happy: {
    intro: "What a wonderful place to start. Let's amplify this joy.",
    steps: [
      "Smile softly. Let that warmth spread through your whole body.",
      "Breathe in gratitude… breathe out even more gratitude.",
      "Think of one thing that brought you joy today.",
      "Let that memory glow brighter with each breath.",
      "Feel happiness radiating from your chest outward.",
      "Send a silent thank you to someone who matters to you.",
      "Joy is your natural state. You're remembering that now.",
      "Sit in this glow. Let it fill every cell.",
    ],
    closing: "You chose to savor happiness. The world is brighter for it.",
  },
  grateful: {
    intro: "Gratitude is the highest vibration. Let's tune into it.",
    steps: [
      "Place your hand on your heart. Feel its gentle beating.",
      "Think of someone you're grateful for. See their face.",
      "Breathe in their kindness. Let it warm you.",
      "Now think of something simple you're thankful for today.",
      "Let appreciation fill your chest like sunlight filling a room.",
      "Gratitude turns what we have into enough.",
      "Silently say: \"Thank you for this moment.\"",
      "Rest in this abundant, thankful feeling.",
    ],
    closing: "You honored the good in your life. That's a powerful practice.",
  },
};

/* ── DOM References ──────────────────────────────── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const screenInput   = $("#screen-input");
const screenSession = $("#screen-session");
const screenDone    = $("#screen-done");

const moodBtns      = $$(".mood-btn");
const durBtns       = $$(".dur-btn");
const btnStart      = $("#btn-start");
const btnEnd        = $("#btn-end");
const btnRestart    = $("#btn-restart");

const breathCircle  = $("#breathCircle");
const breathLabel   = $("#breathLabel");
const guideText     = $("#guideText");
const timerEl       = $("#timer");
const doneMsg       = $("#doneMsg");

/* ── State ───────────────────────────────────────── */
let selectedMood     = null;
let selectedMinutes  = null;
let sessionTimer     = null;
let breathTimer      = null;
let guideTimer       = null;
let remainingSeconds = 0;

/* ── Helpers ─────────────────────────────────────── */
function showScreen(screen) {
  [screenInput, screenSession, screenDone].forEach((s) => s.classList.remove("active"));
  screen.classList.add("active");
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function updateStartButton() {
  btnStart.disabled = !(selectedMood && selectedMinutes);
}

/* ── Input Handlers ──────────────────────────────── */
moodBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    moodBtns.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedMood = btn.dataset.mood;
    updateStartButton();
  });
});

durBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    durBtns.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedMinutes = parseInt(btn.dataset.minutes, 10);
    updateStartButton();
  });
});

/* ── Breathing Cycle ─────────────────────────────── */
function startBreathing() {
  let inhaling = true;

  function cycle() {
    if (inhaling) {
      breathCircle.classList.remove("exhale");
      breathCircle.classList.add("inhale");
      breathLabel.textContent = "Breathe in…";
    } else {
      breathCircle.classList.remove("inhale");
      breathCircle.classList.add("exhale");
      breathLabel.textContent = "Breathe out…";
    }
    inhaling = !inhaling;
  }

  cycle(); // start immediately
  breathTimer = setInterval(cycle, 4500); // 4.5 s per phase
}

function stopBreathing() {
  clearInterval(breathTimer);
  breathCircle.classList.remove("inhale", "exhale");
}

/* ── Guided Text Rotation ────────────────────────── */
function startGuide(mood, totalSeconds) {
  const data  = MEDITATIONS[mood];
  const steps = data.steps;
  const interval = Math.max(Math.floor((totalSeconds * 1000) / (steps.length + 1)), 6000);

  // Show intro immediately
  guideText.style.opacity = 0;
  setTimeout(() => {
    guideText.textContent = data.intro;
    guideText.style.opacity = 1;
  }, 300);

  let index = 0;
  guideTimer = setInterval(() => {
    if (index < steps.length) {
      guideText.style.opacity = 0;
      setTimeout(() => {
        guideText.textContent = steps[index];
        guideText.style.opacity = 1;
        index++;
      }, 500);
    } else {
      clearInterval(guideTimer);
    }
  }, interval);
}

/* ── Session Timer ───────────────────────────────── */
function startSession() {
  remainingSeconds = selectedMinutes * 60;
  timerEl.textContent = formatTime(remainingSeconds);

  sessionTimer = setInterval(() => {
    remainingSeconds--;
    timerEl.textContent = formatTime(remainingSeconds);

    if (remainingSeconds <= 0) {
      endSession(true);
    }
  }, 1000);

  startBreathing();
  startGuide(selectedMood, remainingSeconds);
  showScreen(screenSession);
}

function endSession(completed) {
  clearInterval(sessionTimer);
  clearInterval(guideTimer);
  stopBreathing();

  const data = MEDITATIONS[selectedMood];
  doneMsg.textContent = completed
    ? data.closing
    : "Even a short pause makes a difference. Be proud of showing up.";

  showScreen(screenDone);
}

/* ── Button Wiring ───────────────────────────────── */
btnStart.addEventListener("click", () => {
  if (selectedMood && selectedMinutes) startSession();
});

btnEnd.addEventListener("click", () => endSession(false));

btnRestart.addEventListener("click", () => {
  // Reset selections
  moodBtns.forEach((b) => b.classList.remove("selected"));
  durBtns.forEach((b) => b.classList.remove("selected"));
  selectedMood = null;
  selectedMinutes = null;
  updateStartButton();
  showScreen(screenInput);
});
