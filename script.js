'use strict';

// Progressive enhancements; the report and comparison table remain readable without JavaScript.
const outlineLinks = [...document.querySelectorAll('.outline a')];
const sections = outlineLinks.map(link => document.querySelector(link.getAttribute('href')));
function updateOutline() {
  const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= 160) || sections[0];
  outlineLinks.forEach(link => {
    if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
let scrollQueued = false;
window.addEventListener('scroll', () => {
  if (!scrollQueued) {
    requestAnimationFrame(() => { updateOutline(); scrollQueued = false; });
    scrollQueued = true;
  }
}, { passive: true });
updateOutline();

const dialog = document.querySelector('#figure-dialog');
const dialogImage = document.querySelector('#dialog-image');
document.querySelectorAll('[data-lightbox]').forEach(link => {
  link.addEventListener('click', event => {
    if (!dialog.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const image = link.querySelector('img');
    dialogImage.src = link.href;
    dialogImage.alt = image.alt;
    dialogImage.classList.remove('zoomed');
    document.querySelector('#dialog-caption').textContent = image.alt + ' Click the figure to zoom.';
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
document.querySelector('#close-figure').addEventListener('click', () => dialog.close());
dialogImage.addEventListener('click', () => dialogImage.classList.toggle('zoomed'));
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

const tableRows = [...document.querySelectorAll('#comparison-table tbody tr')];
let selectedGroup = 'all';
const search = document.querySelector('#method-search');
function filterTable() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  tableRows.forEach(row => {
    const groupMatches = selectedGroup === 'all' || row.dataset.group === selectedGroup || (selectedGroup === 'zero-shot' && row.dataset.group === 'astra');
    const matches = groupMatches && row.querySelector('th').textContent.toLowerCase().includes(query);
    row.hidden = !matches;
    if (matches) visible++;
  });
  document.querySelector('#filter-status').textContent = `${visible} of ${tableRows.length} reported configurations`;
  document.querySelector('#no-results').hidden = visible !== 0;
}
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    selectedGroup = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    filterTable();
  });
});
search.addEventListener('input', filterTable);
filterTable();

const frames = [
  {step:135, title:'Inspect a bedroom', action:'Turn left × 6, forward × 4', description:'After reaching a bedroom, the model checks whether the route matches the instructed sequence.', alt:'A bedroom with two beds and dark curtains.'},
  {step:207, title:'Return to the kitchen', action:'Turn right × 1, forward × 8', description:'The model returns to the kitchen and follows its inner aisle before continuing toward the small living area.', alt:'The kitchen, with a double sink in the foreground and an island aisle ahead.'},
  {step:260, title:'Cross the living area', action:'Forward × 5', description:'The route continues through the small living area toward the instructed bedroom on the left.', alt:'A small living area with pale seating and dark window frames.'},
  {step:287, title:'Enter the bedroom', action:'STOP', description:'After entering the bedroom, the model issues STOP. The final location is 0.7 m from the reference goal.', alt:'The bedroom entrance, with a bed visible to the right.'}
];
let currentFrame = 0;
function selectFrame(index) {
  currentFrame = Math.max(0, Math.min(frames.length - 1, index));
  const frame = frames[currentFrame];
  const image = document.querySelector('#case-frame');
  image.src = `assets/ep42-${currentFrame + 1}.webp`;
  image.alt = `EP42, primitive action ${frame.step}: ${frame.alt}`;
  document.querySelector('#case-frame-label').textContent = `t = ${frame.step}`;
  document.querySelector('#case-counter').textContent = `Observation ${currentFrame + 1} / ${frames.length}`;
  document.querySelector('#case-title').textContent = frame.title;
  document.querySelector('#case-description').textContent = frame.description;
  document.querySelector('#case-action').textContent = frame.action;
  document.querySelectorAll('[data-frame]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.frame) === currentFrame)));
  document.querySelector('#case-prev').disabled = currentFrame === 0;
  document.querySelector('#case-next').disabled = currentFrame === frames.length - 1;
}
document.querySelectorAll('[data-frame]').forEach(button => button.addEventListener('click', () => selectFrame(Number(button.dataset.frame))));
document.querySelector('#case-prev').addEventListener('click', () => selectFrame(currentFrame - 1));
document.querySelector('#case-next').addEventListener('click', () => selectFrame(currentFrame + 1));
document.querySelector('.case-steps').addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  const focusedFrame = Number(event.target.dataset.frame);
  selectFrame(focusedFrame + (event.key === 'ArrowLeft' ? -1 : 1));
  document.querySelector(`[data-frame="${currentFrame}"]`).focus();
});

document.querySelector('#copy-citation').addEventListener('click', async () => {
  const button = document.querySelector('#copy-citation');
  const text = document.querySelector('#bibtex').textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied ✓';
    document.querySelector('#copy-status').textContent = 'Citation copied to clipboard.';
    setTimeout(() => { button.textContent = 'Copy citation'; }, 2500);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('#bibtex'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    button.textContent = 'Text selected';
    document.querySelector('#copy-status').textContent = 'Copy the selected citation with your browser.';
  }
});
