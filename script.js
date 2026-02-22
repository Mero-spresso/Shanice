const pages = [
  `Hi, Shanice.
I don’t even know if I have the right to write this to you anymore, but I can’t keep pretending I’m okay when I’m not.

Every day without you feels heavier than the last. It’s like something inside me is constantly reminding me that the person who used to make everything feel right… is gone.

I know I hurt you. I know I messed up in ways that apologies probably can’t fix. If I could take back the things I said, the moments I failed you, the times I made you feel like you weren’t enough --

I would do it without thinking. You were never the problem. I was. My pride, my fear, my stupidity… all of it cost me you.`


];

const page2Message = `What hurts the most is not the silence. It’s the memories. The way you laughed when you couldn’t breathe.

The way you’d look at me when you were pretending to be annoyed but weren’t.

The way you believed in me even when I didn’t deserve it.

I didn’t realize how much of my world was built around you until you weren’t there anymore.

Shanice, if you're reading this, I'm sorry.`;

const page3Message = `I’m not asking you to forget everything. I’m not asking you to pretend nothing happened.

I’m just asking… if there’s even the smallest part of your heart that still remembers us,
please give me a chance to make things right. 

I will wait.

I will prove myself.

I will do whatever it takes, because losing you is something I don’t think I’ll ever recover from.`;

const page4Message = `You once told me that love isn’t about being perfect.

it’s about choosing each other even when things are hard. 

I’m still choosing you, Shanice. I never stopped.

Please, come back.

- Cedrian`;

pages.push(page2Message, page3Message, page4Message);

const BGM_FILE = "bgm.mp3";
const BGM_SHOULD_PLAY_KEY = "letter_bgm_should_play";
const BGM_TIME_KEY = "letter_bgm_time";

const TYPE_SPEED = 70; // bigger = slower


let currentPage = 0;
let isTyping = false;

function getNextButtonLabel() {
  return currentPage >= pages.length - 1 ? "Back to page 1" : "Next page";
}

function ensureBgmElement() {
  let bgm = document.getElementById("bgm");
  if (bgm) return bgm;

  bgm = document.createElement("audio");
  bgm.id = "bgm";
  bgm.src = BGM_FILE;
  bgm.loop = true;
  bgm.preload = "auto";
  bgm.volume = 0.35;
  bgm.style.display = "none";
  document.body.appendChild(bgm);
  return bgm;
}

function tryPlayBgm() {
  const bgm = ensureBgmElement();
  const savedTime = parseFloat(sessionStorage.getItem(BGM_TIME_KEY) || "0");

  if (Number.isFinite(savedTime) && savedTime > 0) {
    try {
      bgm.currentTime = savedTime;
    } catch (_e) {
      // Ignore currentTime set errors if metadata is not ready yet.
    }
  }

  const promise = bgm.play();
  if (promise && typeof promise.catch === "function") {
    promise.catch(() => {});
  }
}

function setupBgm() {
  const bgm = ensureBgmElement();

  bgm.addEventListener("timeupdate", () => {
    sessionStorage.setItem(BGM_TIME_KEY, String(bgm.currentTime));
  });

  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem(BGM_TIME_KEY, String(bgm.currentTime));
  });

  if (sessionStorage.getItem(BGM_SHOULD_PLAY_KEY) === "1") {
    tryPlayBgm();
  }

  const resumeIfNeeded = () => {
    if (sessionStorage.getItem(BGM_SHOULD_PLAY_KEY) === "1" && bgm.paused) {
      tryPlayBgm();
    }
  };

  window.addEventListener("pointerdown", resumeIfNeeded, { once: true });
  window.addEventListener("keydown", resumeIfNeeded, { once: true });
}

function typeWriterToElement(element, text, speed, onComplete) {
  if (!element) return;

  let i = 0;
  element.textContent = "";

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
      return;
    }

    if (typeof onComplete === "function") onComplete();
  }

  type();
}

function typePage(text) {
  const typedText = document.getElementById("typedText");
  const nextBtn =
    document.getElementById("nextBtn") || document.querySelector(".next-btn");

  if (!typedText) return;

  if (nextBtn) nextBtn.style.display = "none";
  isTyping = true;

  typeWriterToElement(typedText, text, TYPE_SPEED, () => {
    isTyping = false;
    if (nextBtn) {
      nextBtn.textContent = getNextButtonLabel();
      nextBtn.style.display = "inline-block";
    }
  });
}

function showLetter() {
  const intro = document.getElementById("introText");
  const readBtn = document.querySelector("button.btn:not(#nextBtn)");
  const letterBox = document.getElementById("letterBox");

  if (!letterBox) return;
  if (intro) {
    intro.style.opacity = 0;
    setTimeout(() => {
      intro.style.display = "none";
    }, 1000);
  }
  if (readBtn) readBtn.style.display = "none";
  sessionStorage.setItem(BGM_SHOULD_PLAY_KEY, "1");
  tryPlayBgm();

  setTimeout(() => {
    letterBox.style.display = "block";
    currentPage = 0;
    typePage(pages[currentPage]);
  }, 600);
}

function nextPage() {
  if (isTyping) return;

  if (currentPage < pages.length - 1) {
    currentPage++;
  } else {
    currentPage = 0;
  }

  typePage(pages[currentPage]);
}

function goToPage(url) {
  if (isTyping) return;

  const normalized = String(url || "").toLowerCase();

  if (normalized.endsWith("page2.html")) {
    currentPage = 1;
  } else if (normalized.endsWith("page3.html")) {
    currentPage = 2;
  } else if (normalized.endsWith("page4.html")) {
    currentPage = 3;
  } else if (normalized.endsWith("index.html")) {
    currentPage = 0;
  } else {
    nextPage();
    return;
  }

  typePage(pages[currentPage]);
}

window.addEventListener("DOMContentLoaded", () => {
  setupBgm();

  const typedText = document.getElementById("typedText");
  if (!typedText) return;

  const pageKey = document.body?.dataset?.page;
  if (pageKey === "page2") {
    currentPage = 1;
    typePage(pages[currentPage]);
    return;
  }

  if (pageKey === "page3") {
    currentPage = 2;
    typePage(pages[currentPage]);
    return;
  }

  if (pageKey === "page4") {
    currentPage = 3;
    typePage(pages[currentPage]);
    return;
  }

  const path = window.location.pathname.toLowerCase();
  if (path.endsWith("/page2.html") || path.endsWith("page2.html")) {
    currentPage = 1;
    typePage(pages[currentPage]);
    return;
  }

  if (path.endsWith("/page3.html") || path.endsWith("page3.html")) {
    currentPage = 2;
    typePage(pages[currentPage]);
    return;
  }

  if (path.endsWith("/page4.html") || path.endsWith("page4.html")) {
    currentPage = 3;
    typePage(pages[currentPage]);
  }
});
