const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));

const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('.carousel-dot')];
const hero = document.querySelector('#hero');
const pauseButton = document.querySelector('#hero-pause');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentSlide = 0;
let paused = reducedMotion.matches;
let timer;

if (hero && slides.length && dots.length && pauseButton) {
function clearTimer() {
  window.clearTimeout(timer);
}

function canAutoplay() {
  const focusIsOnPause = document.activeElement === pauseButton;
  return !paused && !document.hidden && !hero.matches(':hover') && (!hero.contains(document.activeElement) || focusIsOnPause);
}

function scheduleNext() {
  clearTimer();
  if (!canAutoplay()) return;
  timer = window.setTimeout(() => {
    showSlide(currentSlide + 1, false);
    scheduleNext();
  }, 6500);
}

function showSlide(index, fromControl = true) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, position) => {
    const active = position === currentSlide;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  dots.forEach((dot, position) => {
    const active = position === currentSlide;
    dot.classList.toggle('is-active', active);
    if (active) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
  if (fromControl) scheduleNext();
}

document.querySelector('#hero-previous').addEventListener('click', () => showSlide(currentSlide - 1));
document.querySelector('#hero-next').addEventListener('click', () => showSlide(currentSlide + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
pauseButton.addEventListener('click', () => {
  paused = !paused;
  pauseButton.textContent = paused ? 'Play' : 'Pause';
  pauseButton.setAttribute('aria-label', paused ? 'Play hero messages' : 'Pause hero messages');
  scheduleNext();
});
hero.addEventListener('pointerenter', clearTimer);
hero.addEventListener('pointerleave', scheduleNext);
hero.addEventListener('focusin', clearTimer);
hero.addEventListener('focusout', () => window.setTimeout(scheduleNext, 0));
document.addEventListener('visibilitychange', scheduleNext);
reducedMotion.addEventListener?.('change', (event) => {
  if (event.matches) {
    paused = true;
    pauseButton.textContent = 'Play';
    pauseButton.setAttribute('aria-label', 'Play hero messages');
    clearTimer();
  }
});
pauseButton.textContent = paused ? 'Play' : 'Pause';
pauseButton.setAttribute('aria-label', paused ? 'Play hero messages' : 'Pause hero messages');
scheduleNext();
}

const toolCopy = document.querySelector('#tool-copy');
const toolLink = document.querySelector('#tool-link');
document.querySelectorAll('.tool[type="button"]').forEach((tool) => tool.addEventListener('click', () => {
  document.querySelectorAll('.tool').forEach((item) => {
    item.classList.remove('selected');
    if (item.matches('button')) item.setAttribute('aria-pressed', 'false');
  });
  tool.classList.add('selected');
  tool.setAttribute('aria-pressed', 'true');
  toolCopy.textContent = tool.dataset.copy;
  const destination = tool.dataset.link;
  if (destination) {
    toolLink.href = destination;
    toolLink.textContent = `Explore ${tool.textContent.trim().replace('＋', '')} →`;
    toolLink.hidden = false;
  } else {
    toolLink.href = 'https://www.reddit.com/r/Peacewright/';
    toolLink.textContent = 'Discuss the tools →';
  }
}));
