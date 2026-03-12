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

const voiceToggle   = $("#voiceToggle");
const voiceSelect   = $("#voiceSelect");

/* ── State ───────────────────────────────────────── */
let selectedMood     = null;
let selectedMinutes  = null;
let sessionTimer     = null;
let breathTimer      = null;
let guideTimer       = null;
let remainingSeconds = 0;
let voiceEnabled     = false;
let chosenVoice      = null;
let selectedSound    = 'none';

/* ── Speech Synthesis ────────────────────────────── */
const synth = window.speechSynthesis;

function populateVoices() {
  const voices = synth.getVoices();
  if (!voices.length) return;

  voiceSelect.innerHTML = '';

  // Prefer calm / female / natural-sounding voices
  const preferred = ['aria', 'jenny', 'zira', 'samantha', 'karen', 'fiona', 'google uk english female'];

  const sorted = [...voices]
    .filter((v) => v.lang.startsWith('en'))
    .sort((a, b) => {
      const aScore = preferred.some((p) => a.name.toLowerCase().includes(p)) ? 0 : 1;
      const bScore = preferred.some((p) => b.name.toLowerCase().includes(p)) ? 0 : 1;
      return aScore - bScore;
    });

  sorted.forEach((voice, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = voice.name;
    opt.dataset.voiceName = voice.name;
    voiceSelect.appendChild(opt);
  });

  // Store sorted list for later lookup
  voiceSelect._sortedVoices = sorted;
  if (sorted.length) chosenVoice = sorted[0];
}

// Voices load async in some browsers
synth.addEventListener('voiceschanged', populateVoices);
populateVoices();

voiceToggle.addEventListener('change', () => {
  voiceEnabled = voiceToggle.checked;
  voiceSelect.disabled = !voiceEnabled;
});

voiceSelect.addEventListener('change', () => {
  const idx = parseInt(voiceSelect.value, 10);
  if (voiceSelect._sortedVoices && voiceSelect._sortedVoices[idx]) {
    chosenVoice = voiceSelect._sortedVoices[idx];
  }
});

function speak(text) {
  if (!voiceEnabled || !synth) return;
  synth.cancel(); // stop any in-progress speech
  const utter = new SpeechSynthesisUtterance(text);
  if (chosenVoice) utter.voice = chosenVoice;
  utter.rate  = 0.85;  // slow and calm
  utter.pitch = 0.9;   // slightly lower
  utter.volume = 1;
  synth.speak(utter);
}

function stopSpeaking() {
  if (synth) synth.cancel();
}

/* ── Ambient Soundscapes (Web Audio API) ─────────── */
let audioCtx     = null;
let ambientNodes = [];

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function createNoiseBuffer(ctx, seconds) {
  const sr  = ctx.sampleRate;
  const len = sr * seconds;
  const buf = ctx.createBuffer(1, len, sr);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

// Fade-in master gain
function makeMaster(ctx, volume) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 3);
  gain.connect(ctx.destination);
  return gain;
}

function startRain() {
  const ctx = getAudioCtx();
  const master = makeMaster(ctx, 0.35);

  // Steady rain base — bandpass-filtered noise
  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = createNoiseBuffer(ctx, 4);
  noiseSrc.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 8000;
  bp.Q.value = 0.4;
  noiseSrc.connect(bp);
  bp.connect(master);
  noiseSrc.start();

  // Softer low-end layer for body
  const lowSrc = ctx.createBufferSource();
  lowSrc.buffer = createNoiseBuffer(ctx, 4);
  lowSrc.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 400;
  const lowGain = ctx.createGain();
  lowGain.gain.value = 0.6;
  lowSrc.connect(lp);
  lp.connect(lowGain);
  lowGain.connect(master);
  lowSrc.start();

  ambientNodes.push(noiseSrc, lowSrc, bp, lp, lowGain, master);
}

function startOcean() {
  const ctx = getAudioCtx();
  const master = makeMaster(ctx, 0.3);

  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = createNoiseBuffer(ctx, 6);
  noiseSrc.loop = true;

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 600;

  // Slow volume modulation (wave-like)
  const waveGain = ctx.createGain();
  waveGain.gain.value = 0.5;
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.1; // one wave every ~10s
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.4;
  lfo.connect(lfoGain);
  lfoGain.connect(waveGain.gain);
  lfo.start();

  noiseSrc.connect(lp);
  lp.connect(waveGain);
  waveGain.connect(master);
  noiseSrc.start();

  // Higher-frequency surf hiss
  const hissSrc = ctx.createBufferSource();
  hissSrc.buffer = createNoiseBuffer(ctx, 4);
  hissSrc.loop = true;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 3000;
  const hissGain = ctx.createGain();
  hissGain.gain.value = 0.08;
  const lfo2 = ctx.createOscillator();
  lfo2.type = 'sine';
  lfo2.frequency.value = 0.1;
  const lfo2Gain = ctx.createGain();
  lfo2Gain.gain.value = 0.07;
  lfo2.connect(lfo2Gain);
  lfo2Gain.connect(hissGain.gain);
  lfo2.start();
  hissSrc.connect(hp);
  hp.connect(hissGain);
  hissGain.connect(master);
  hissSrc.start();

  ambientNodes.push(noiseSrc, hissSrc, lp, hp, waveGain, hissGain, lfo, lfo2, lfoGain, lfo2Gain, master);
}

function startWind() {
  const ctx = getAudioCtx();
  const master = makeMaster(ctx, 0.28);

  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = createNoiseBuffer(ctx, 5);
  noiseSrc.loop = true;

  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 800;
  bp.Q.value = 1.2;

  // Slowly sweep the bandpass frequency
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.06;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 500;
  lfo.connect(lfoGain);
  lfoGain.connect(bp.frequency);
  lfo.start();

  noiseSrc.connect(bp);
  bp.connect(master);
  noiseSrc.start();

  ambientNodes.push(noiseSrc, bp, lfo, lfoGain, master);
}

function startBowl() {
  const ctx = getAudioCtx();
  const master = makeMaster(ctx, 0.18);

  // Layered detuned sine waves for a shimmering bowl tone
  const freqs = [261.6, 392, 523.2, 659.3]; // C4, G4, C5, E5
  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    // Gentle vibrato
    const vib = ctx.createOscillator();
    vib.type = 'sine';
    vib.frequency.value = 0.3 + Math.random() * 0.4;
    const vibGain = ctx.createGain();
    vibGain.gain.value = 1.5;
    vib.connect(vibGain);
    vibGain.connect(osc.frequency);
    vib.start();

    const g = ctx.createGain();
    g.gain.value = 0.25;
    osc.connect(g);
    g.connect(master);
    osc.start();

    ambientNodes.push(osc, vib, vibGain, g);
  });

  ambientNodes.push(master);
}

function startAmbient(sound) {
  stopAmbient();
  if (sound === 'none') return;
  if (sound === 'rain')  startRain();
  if (sound === 'ocean') startOcean();
  if (sound === 'wind')  startWind();
  if (sound === 'bowl')  startBowl();
}

function stopAmbient() {
  ambientNodes.forEach((node) => {
    try {
      if (node.stop) node.stop();
      else if (node.disconnect) node.disconnect();
    } catch (_) { /* already stopped */ }
  });
  ambientNodes = [];
}

// Sound picker buttons
const sndBtns = $$('.snd-btn');
sndBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    sndBtns.forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedSound = btn.dataset.sound;
  });
});

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
    speak(data.intro);
  }, 300);

  let index = 0;
  guideTimer = setInterval(() => {
    if (index < steps.length) {
      guideText.style.opacity = 0;
      setTimeout(() => {
        guideText.textContent = steps[index];
        guideText.style.opacity = 1;
        speak(steps[index]);
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
  startAmbient(selectedSound);
  showScreen(screenSession);
}

function endSession(completed) {
  clearInterval(sessionTimer);
  clearInterval(guideTimer);
  stopBreathing();
  stopSpeaking();
  stopAmbient();

  const data = MEDITATIONS[selectedMood];
  const msg = completed
    ? data.closing
    : "Even a short pause makes a difference. Be proud of showing up.";
  doneMsg.textContent = msg;
  speak(msg);

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
