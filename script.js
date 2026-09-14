'use strict';
const header = document.querySelector('.site-header');
const syncHeader = () => header.classList.toggle('scrolled', window.scrollY > 12);
window.addEventListener('scroll', syncHeader, { passive: true });
syncHeader();
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}));
// Native buttons and panels with roving focus and WAI-ARIA keyboard controls.
document.querySelectorAll('[data-tabs]').forEach(group => {
  const list = group.querySelector('[role="tablist"]');
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = (tab, focus = false) => {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      const vertical = list.getAttribute('aria-orientation') === 'vertical';
      let next;
      if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % tabs.length;
      if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(tabs[next], true); }
    });
  });
});
const mobileQuery = window.matchMedia('(max-width: 600px)');
const industryList = document.querySelector('.industry-tabs');
const syncOrientation = () => industryList?.setAttribute('aria-orientation', mobileQuery.matches ? 'horizontal' : 'vertical');
syncOrientation();
mobileQuery.addEventListener('change', syncOrientation);
const dialog = document.querySelector('#video-modal');
const video = document.querySelector('#demo-video');
let videoOpener;
if (dialog && typeof dialog.showModal === 'function') {
  document.querySelectorAll('.video-trigger').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      videoOpener = trigger;
      const file = trigger.dataset.video;
      const title = trigger.dataset.title;
      document.querySelector('#video-title').textContent = title;
      document.querySelector('#video-description').textContent = trigger.dataset.modalDescription || document.getElementById(trigger.dataset.summary).textContent;
      document.querySelector('#video-error').hidden = true;
      document.querySelector('#video-fallback').href = trigger.href;
      video.setAttribute('aria-label', title + ' demonstration');
      video.poster = 'assets/images/' + file + '-poster.webp';
      video.preload = 'metadata';
      video.src = trigger.href;
      dialog.showModal();
      document.body.classList.add('modal-open');
    });
  });
  dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());
  // Keep keyboard focus within the dialog, including at native media boundaries.
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const first = dialog.querySelector('.modal-close');
    const last = dialog.querySelector('#video-fallback');
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  let backdropStart = false;
  dialog.addEventListener('pointerdown', event => { backdropStart = event.target === dialog; });
  dialog.addEventListener('click', event => {
    if (backdropStart && event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
    backdropStart = false;
  });
  dialog.addEventListener('close', () => {
    video.pause();
    video.removeAttribute('src');
    video.load();
    document.body.classList.remove('modal-open');
    videoOpener?.focus({ preventScroll: true });
  });
  video.addEventListener('error', () => {
    if (video.hasAttribute('src')) document.querySelector('#video-error').hidden = false;
  });
}
// Details remain fully usable without JavaScript; enhancement keeps one FAQ open.
const faqItems = [...document.querySelectorAll('.faq-item')];
faqItems.forEach(item => item.addEventListener('toggle', () => {
  if (item.open) faqItems.forEach(other => { if (other !== item) other.open = false; });
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    menu.focus();
  }
});
// Content is always visible, even without IntersectionObserver or JavaScript.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
