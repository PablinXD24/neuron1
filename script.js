const noteContainer = document.getElementById('note-container');
const noteList = document.getElementById('note-list');
let selectedNote = null;
let notes = [];
let connectors = [];

noteContainer.addEventListener('dblclick', (e) => {
    const note = createNoteAtPosition(e.clientX, e.clientY);
    notes.push(note);
    updateNoteList();
    checkAndConnectNotes();
});

function createNoteAtPosition(x, y) {
    const note = document.createElement('div');
    note.classList.add('note');
    note.style.top = `${y - noteContainer.offsetTop - 10}px`;
    note.style.left = `${x - noteContainer.offsetLeft - 10}px`;

    const textarea = document.createElement('textarea');
    note.appendChild(textarea);

    note.addEventListener('click', (e) => {
        e.stopPropagation();
        selectNote(note);
    });

    textarea.addEventListener('blur', () => {
        deselectNote();
        updateNoteContent(note, textarea.value);
        updateNoteList();
        checkAndConnectNotes();
    });

    textarea.addEventListener('input', () => {
        updateNoteContent(note, textarea.value);
    });

    noteContainer.appendChild(note);
    selectNote(note);

    return { element: note, content: textarea.value };
}

function selectNote(note) {
    deselectNote();
    selectedNote = note;
    note.classList.add('active');
    const textarea = note.querySelector('textarea');
    textarea.focus();
}

function deselectNote() {
    if (selectedNote) {
        selectedNote.classList.remove('active');
        selectedNote = null;
    }
}

function updateNoteContent(note, content) {
    note.setAttribute('data-content', content.substring(0, 10) + (content.length > 10 ? '...' : ''));
}

function updateNoteList() {
    noteList.innerHTML = '';
    notes.forEach(note => {
        const listItem = document.createElement('li');
        listItem.textContent = note.content.substring(0, 10) + (note.content.length > 10 ? '...' : '');
        noteList.appendChild(listItem);
    });
}

function checkAndConnectNotes() {
    // Limpa todas as linhas de conexão existentes
    connectors.forEach(connector => connector.parentNode.removeChild(connector));
    connectors = [];

    const notesWithEpa = notes.filter(note => note.content.includes('epa'));
    
    if (notesWithEpa.length >= 2) {
        const firstNote = notesWithEpa[0].element;
        const secondNote = notesWithEpa[1].element;
        
        const line = document.createElement('div');
        line.classList.add('connector');
        
        const offsetX1 = firstNote.offsetLeft + firstNote.offsetWidth / 2;
        const offsetY1 = firstNote.offsetTop + firstNote.offsetHeight / 2;
        const offsetX2 = secondNote.offsetLeft + secondNote.offsetWidth / 2;
        const offsetY2 = secondNote.offsetTop + secondNote.offsetHeight / 2;
        
        const angle = Math.atan2(offsetY2 - offsetY1, offsetX2 - offsetX1) * 180 / Math.PI;
        const length = Math.sqrt((offsetX2 - offsetX1) ** 2 + (offsetY2 - offsetY1) ** 2);
        
        line.style.left = `${offsetX1}px`;
        line.style.top = `${offsetY1}px`;
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        
        noteContainer.appendChild(line);
        connectors.push(line);
    }
}
