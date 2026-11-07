(() => {
  const track = document.getElementById('certificateTrack');
  const toolbar = document.querySelector('[data-carousel="certificateTrack"]');
  if (!track || !toolbar) return;
  const cards = [...track.children];
  const actions = toolbar.querySelector('.carousel-actions');
  const status = toolbar.querySelector('.carousel-count');
  const dots = document.createElement('div');
  dots.className = 'certificate-dots';
  dots.setAttribute('aria-label', 'Choose certificate');
  actions.insertBefore(dots, toolbar.querySelector('.carousel-next'));
  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'certificate-pause';
  actions.appendChild(pause);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0, playing = !motion.matches, timer, hovering = false, focusing = false, visible = false;
  const buttons = cards.map((card, index) => {
    card.classList.remove('fade-in');
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', (index + 1) + ' of ' + cards.length);
    card.tabIndex = 0;
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {e.preventDefault(); card.click()}
    });
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Show certificate ' + (index + 1));
    dot.addEventListener('click', () => show(index));
    dots.appendChild(dot);
    return dot;
  });
  function render() {
    cards.forEach((card, i) => card.classList.toggle('is-current', i === active));
    buttons.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === active)));
    status.textContent = (active + 1) + ' / ' + cards.length;
  }
  function schedule() {
    clearTimeout(timer);
    if (playing && !hovering && !focusing && visible && !document.hidden && !document.querySelector('.cert-modal.open')) {
      timer = setTimeout(() => show(active + 1), 5500);
    }
  }
  function show(index) {
    active = (index + cards.length) % cards.length;
    const card = cards[active];
    track.scrollTo({left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2, behavior: motion.matches ? 'instant' : 'smooth'});
    render(); schedule();
  }
  toolbar.querySelector('.carousel-prev').addEventListener('click', () => show(active - 1));
  toolbar.querySelector('.carousel-next').addEventListener('click', () => show(active + 1));
  function pauseLabel() {
    pause.textContent = playing ? '\u2161' : '\u25B6';
    pause.setAttribute('aria-label', playing ? 'Pause certificate autoplay' : 'Play certificate autoplay');
    pause.setAttribute('aria-pressed', String(playing));
  }
  pause.addEventListener('click', () => {playing = !playing; pauseLabel(); schedule()});
  const section = document.getElementById('certifications');
  section.addEventListener('mouseenter', () => {hovering = true; schedule()});
  section.addEventListener('mouseleave', () => {hovering = false; schedule()});
  section.addEventListener('focusin', () => {focusing = true; schedule()});
  section.addEventListener('focusout', e => {focusing = section.contains(e.relatedTarget); schedule()});
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {e.preventDefault(); show(active + (e.key === 'ArrowRight' ? 1 : -1))}
  });
  let frame;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const centre = track.getBoundingClientRect().left + track.clientWidth / 2;
      let nearest = 0, distance = Infinity;
      cards.forEach((card, i) => {const r = card.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - centre); if (d < distance) {distance = d; nearest = i}});
      active = nearest; render(); schedule();
    });
  }, {passive:true});
  new IntersectionObserver(entries => {visible = entries[0].isIntersecting; schedule()}, {threshold:.2}).observe(section);
  document.addEventListener('visibilitychange', schedule);
  document.getElementById('certModal').addEventListener('click', schedule);
  motion.addEventListener('change', () => {if (motion.matches) {playing = false; pauseLabel(); schedule()}});
  window.addEventListener('resize', () => show(active));
  pauseLabel(); render();
})();
