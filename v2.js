'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu(restoreFocus = false) {
  if (!menu || !nav) return;
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
  if (restoreFocus) menu.focus();
}
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
window.matchMedia('(min-width:901px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
// One source of truth keeps the hero, source diagram and schedule in sync.
// These are synthetic records, not extracted customer data.
const records = {
  'P-01': { size: 'DN80', length: '8.40 m', connection: 'J-01 → J-02', status: 'Confirmed',
    description: 'P-01 · DN80 · J-01 → J-02. Size and centreline length recorded; linked to Sample-A.' },
  'P-02': { size: 'DN50', length: '6.60 m', connection: 'J-02 → J-03', status: 'Confirmed',
    description: 'P-02 · DN50 · J-02 → J-03. Size and centreline length recorded; linked to Sample-A.' },
  'P-03': { size: 'Size to confirm', length: 'Length to confirm', connection: 'J-02 → J-04', status: 'Review',
    description: 'P-03 · J-02 → J-04. Confirm the size annotation and route at J-04 to complete this record.' }
};
const runControls = [...document.querySelectorAll('[data-run]')];
function selectRun(id) {
  const record = records[id];
  if (!record) return;
  runControls.forEach(el => el.setAttribute('aria-pressed', String(el.dataset.run === id)));
  document.querySelectorAll('[data-record]').forEach(row => { row.dataset.selected = String(row.dataset.record === id); });
  document.querySelectorAll('[data-node]').forEach(node => {
    node.classList.toggle('is-linked', record.connection.includes(node.dataset.node));
  });
  document.querySelector('.detail-label').textContent = 'SELECTED / ' + id;
  document.querySelector('#record-description').textContent = record.description;
  document.querySelector('[data-selected-id]').textContent = id;
  const measurement = record.status === 'Review' ? 'Centreline length to confirm' : `${record.length} centreline`;
  document.querySelector('[data-selected-detail]').textContent =
    `${record.size} · ${measurement} · ${record.connection} · Sample-A`;
  const status = document.querySelector('[data-selected-status]');
  status.textContent = record.status;
  status.className = 'state ' + (record.status === 'Review' ? 'pending' : 'confirmed');
}
runControls.forEach(el => {
  el.addEventListener('click', () => selectRun(el.dataset.run));
  if (el.tagName.toLowerCase() === 'g') el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectRun(el.dataset.run); }
  });
});
document.querySelectorAll('[data-record]').forEach(row => {
  row.addEventListener('click', () => selectRun(row.dataset.record));
});
if (runControls.length) selectRun('P-01');

// Each tab group is independent, including the nested output-format switcher.
document.querySelectorAll('[role="tablist"]').forEach(group => {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  function selectTab(tab, focus = false) {
    tabs.forEach(t => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i + tabs.length - 1) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { e.preventDefault(); selectTab(tabs[next], true); }
    });
  });
});

document.querySelector('#copy-email')?.addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('eric@eguolabs.com');
    status.textContent = 'Email address copied.';
  } catch {
    status.textContent = 'Please select and copy eric@eguolabs.com, or use the email link.';
  }
});
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('.solution, .split-heading, .about-grid').forEach(el => {
    el.classList.add('reveal'); observer.observe(el);
  });
}
