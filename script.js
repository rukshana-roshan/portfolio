// Cert lightbox
function openCertModal(src, title, sub){
  document.getElementById('certModalImg').src = src;
  document.getElementById('certModalTitle').textContent = title;
  document.getElementById('certModalSub').textContent = sub;
  document.getElementById('certModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeCertModal(){
  document.getElementById('certModal').classList.remove('open');
  document.body.style.overflow='';
}

// Hamburger
const hamburger=document.getElementById('hamburger');
const navLinks=document.getElementById('navLinks');
function setMenu(open){
  navLinks.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}
hamburger.addEventListener('click',()=>setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown', e=>{if(e.key==='Escape')setMenu(false)});

// Match the device theme until a visitor chooses their own preference.
const themeToggle = document.getElementById('themeToggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let hasThemePreference = false;
try { hasThemePreference = ['light','dark'].includes(localStorage.getItem('portfolio-theme')); } catch(e) {}
function applyTheme(theme){
  document.documentElement.dataset.theme = theme;
  const dark = theme === 'dark';
  themeToggle.querySelector('.theme-icon').textContent = dark ? '☀' : '☾';
  themeToggle.querySelector('.theme-label').textContent = dark ? 'Light mode' : 'Dark mode';
  themeToggle.setAttribute('aria-label', 'Switch to ' + (dark ? 'light' : 'dark') + ' mode');
  themeToggle.setAttribute('aria-pressed', String(dark));
}
applyTheme(document.documentElement.dataset.theme);
themeToggle.addEventListener('click', ()=>{
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  hasThemePreference = true;
  try { localStorage.setItem('portfolio-theme', theme); } catch(e) {}
});
systemTheme.addEventListener('change', e=>{if(!hasThemePreference)applyTheme(e.matches ? 'dark' : 'light')});

// Fade in on scroll
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:.15});
document.querySelectorAll('.fade-in').forEach(el=>observer.observe(el));

// CV modal
function openCV(){document.getElementById('cvModal').classList.add('open');document.body.style.overflow='hidden'}
function closeCV(){document.getElementById('cvModal').classList.remove('open');document.body.style.overflow=''}
document.getElementById('cvModal').addEventListener('click',e=>{if(e.target===document.getElementById('cvModal'))closeCV()});

// Nav active state
const sections=document.querySelectorAll('section[id]');
const links=document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let current='';
  sections.forEach(s=>{if(window.scrollY>=s.offsetTop-100)current=s.id});
  links.forEach(l=>{l.style.color=l.getAttribute('href')==='#'+current?'var(--text)':'var(--muted)'});
});
