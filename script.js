const STORAGE_KEYS = {
  deadlines: 'studyflow:deadlines',
  notes: 'studyflow:notes'
};

const deadlineForm = document.getElementById('deadline-form');
const deadlineTitleInput = document.getElementById('deadline-title');
const deadlineDateInput = document.getElementById('deadline-date');
const deadlineList = document.getElementById('deadline-list');
const deadlineEmpty = document.getElementById('deadline-empty');

const noteForm = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const noteList = document.getElementById('note-list');
const noteEmpty = document.getElementById('note-empty');

function loadItems(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveItems(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    /* ignore storage errors */
  }
}

function createId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value + 'T00:00:00');
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function isOverdue(value) {
  if (!value) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(value + 'T00:00:00');
  return date < today;
}

let deadlines = loadItems(STORAGE_KEYS.deadlines);
let notes = loadItems(STORAGE_KEYS.notes);

function renderDeadlines() {
  deadlineList.innerHTML = '';
  if (deadlines.length === 0) {
    deadlineEmpty.classList.remove('hidden');
    return;
  }
  deadlineEmpty.classList.add('hidden');

  const sorted = [...deadlines].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  for (const item of sorted) {
    const li = document.createElement('li');

    if (isOverdue(item.date)) {
      li.classList.add('overdue');
    }

    const content = document.createElement('div');
    content.className = 'content';

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = item.title;

    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = formatDate(item.date) + (isOverdue(item.date) ? '  - overdue' : '');

    content.append(title, meta);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'btn danger';
    del.textContent = 'Delete';
    del.setAttribute('aria-label', 'Delete deadline: ' + item.title);
    del.addEventListener('click', () => {
      deadlines = deadlines.filter((d) => d.id !== item.id);
      saveItems(STORAGE_KEYS.deadlines, deadlines);
      renderDeadlines();
    });

    actions.append(del);
    li.append(content, actions);
    deadlineList.append(li);
  }
}

function renderNotes() {
  noteList.innerHTML = '';
  if (notes.length === 0) {
    noteEmpty.classList.remove('hidden');
    return;
  }
  noteEmpty.classList.add('hidden');

  for (const item of notes) {
    const li = document.createElement('li');
    li.className = 'note-item';

    const content = document.createElement('div');
    content.className = 'content';

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = item.text;

    content.append(title);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'btn danger';
    del.textContent = 'Delete';
    del.setAttribute('aria-label', 'Delete note: ' + item.text);
    del.addEventListener('click', () => {
      notes = notes.filter((n) => n.id !== item.id);
      saveItems(STORAGE_KEYS.notes, notes);
      renderNotes();
    });

    actions.append(del);
    li.append(content, actions);
    noteList.append(li);
  }
}

deadlineForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = deadlineTitleInput.value.trim();
  const date = deadlineDateInput.value;
  if (!title || !date) return;

  deadlines.push({ id: createId(), title, date });
  saveItems(STORAGE_KEYS.deadlines, deadlines);
  renderDeadlines();

  deadlineForm.reset();
  deadlineTitleInput.focus();
});

noteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = noteInput.value.trim();
  if (!text) return;

  notes.unshift({ id: createId(), text });
  saveItems(STORAGE_KEYS.notes, notes);
  renderNotes();

  noteForm.reset();
  noteInput.focus();
});

renderDeadlines();
renderNotes();
