// Layered, looping experience carousel with one accessible active slide.
(() => {
  const track = document.getElementById('experienceTrack');
  const toolbar = document.querySelector('[data-carousel="experienceTrack"]');
  if (!track || !toolbar) return;
  const cards = Array.from(track.children);
  const dots = document.createElement('div');
  dots.className = 'experience-dots';
  dots.setAttribute('role', 'group');
  dots.setAttribute('aria-label', 'Choose experience');
  const actions = toolbar.querySelector('.carousel-actions');
  actions.insertBefore(dots, toolbar.querySelector('.carousel-next'));
  const status = toolbar.querySelector('.carousel-count');
  let active = Math.min(3, cards.length - 1);
  const icons = ['\u{1F4BB}', '\u{1F3DB}', '\u{1F3DB}', '\u{1F6D2}', '\u{1F3E6}', '\u2708', '\u{1F3C6}'];
  const buttons = cards.map((card, index) => {
    card.querySelector('.experience-number').textContent = icons[index];
    card.id = 'experience-slide-' + index;
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', (index + 1) + ' of ' + cards.length);
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Show ' + card.querySelector('h3').textContent);
    dot.setAttribute('aria-controls', card.id);
    dot.addEventListener('click', () => show(index));
    dots.appendChild(dot);
    return dot;
  });
  function show(index) {
    active = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      let offset = (i - active + cards.length) % cards.length;
      if (offset > cards.length / 2) offset -= cards.length;
      card.style.setProperty('--offset', offset);
      card.style.setProperty('--distance', Math.abs(offset));
      card.style.zIndex = String(cards.length - Math.abs(offset));
      card.classList.toggle('is-active', i === active);
      card.setAttribute('aria-hidden', String(i !== active));
      card.inert = i !== active;
      buttons[i].setAttribute('aria-pressed', String(i === active));
    });
    status.textContent = (active + 1) + ' / ' + cards.length;
  }
  toolbar.querySelector('.carousel-prev').addEventListener('click', () => show(active - 1));
  toolbar.querySelector('.carousel-next').addEventListener('click', () => show(active + 1));
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let touchX;
  track.addEventListener('touchstart', event => {touchX = event.changedTouches[0].clientX}, {passive: true});
  track.addEventListener('touchend', event => {
    const distance = event.changedTouches[0].clientX - touchX;
    if (Math.abs(distance) > 40) show(active + (distance < 0 ? 1 : -1));
  }, {passive: true});
  show(active);
})();
