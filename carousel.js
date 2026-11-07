// Native scrolling supports touch gestures, trackpads, and keyboard controls.
document.querySelectorAll('[data-carousel]').forEach(toolbar => {
  const track = document.getElementById(toolbar.dataset.carousel);
  if (track.id === 'experienceTrack' || track.id === 'certificateTrack') return;
  const previous = toolbar.querySelector('.carousel-prev');
  const next = toolbar.querySelector('.carousel-next');
  const count = toolbar.querySelector('.carousel-count');
  const cards = Array.from(track.children);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function step() {
    return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
  }
  function update() {
    const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 3;
    previous.disabled = track.scrollLeft < 3;
    next.disabled = atEnd;
    const current = Math.min(cards.length, Math.round(track.scrollLeft / step()) + 1);
    count.textContent = String(current).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0');
  }
  function move(direction) {
    track.scrollBy({left: direction * step(), behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if(event.target !== track) return;
    if(event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  track.addEventListener('scroll', update, {passive: true});
  window.addEventListener('resize', update);
  cards.forEach((card, index) => {
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', (index + 1) + ' of ' + cards.length);
  });
  update();
});
