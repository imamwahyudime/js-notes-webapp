/**
 * @file ui.js
 * @description Mengelola semua interaksi dengan DOM dan pembaruan UI.
 */

// Referensi ke elemen-elemen DOM utama
const userLoginArea = document.getElementById('user-login-area');
const usernameInput = document.getElementById('username-input');
const loginButton = document.getElementById('login-button');
const greetingMessage = document.getElementById('greeting-message');
const logoutButton = document.getElementById('logout-button');

const mainAppArea = document.getElementById('main-app-area');
const activeUsernameDisplay = document.getElementById('active-username-display');
const createNewNoteButton = document.getElementById('create-new-note-button');
const importNotesButton = document.getElementById('import-notes-button');
const importNotesInput = document.getElementById('import-notes-input');
const exportNotesButton = document.getElementById('export-notes-button');


const notesListUl = document.getElementById('notes-list');

const noteDetailArea = document.querySelector('.note-detail-area'); // Parent untuk view, editor, welcome
const noteView = document.getElementById('note-view');
const noteViewTitle = document.getElementById('note-view-title');
const noteViewContent = document.getElementById('note-view-content'); // Konten akan diisi di sini
const editNoteButton = document.getElementById('edit-note-button');
const deleteNoteButton = document.getElementById('delete-note-button');
const closeNoteViewButton = document.getElementById('close-note-view-button');

const noteEditor = document.getElementById('note-editor');
const noteTitleInput = document.getElementById('note-title-input');
const noteContentInput = document.getElementById('note-content-input');
const saveNoteButton = document.getElementById('save-note-button');
const cancelEditButton = document.getElementById('cancel-edit-button');

const welcomeMessageArea = document.getElementById('welcome-message-area');

let currentOpenNoteId = null; // Menyimpan ID catatan yang sedang dilihat/diedit

/**
 * Menampilkan area login dan menyembunyikan area aplikasi utama.
 */
function showLoginArea() {
    userLoginArea.classList.remove('hidden');
    mainAppArea.classList.add('hidden');
    greetingMessage.classList.add('hidden');
    logoutButton.classList.add('hidden');
    usernameInput.value = ''; // Bersihkan input username
    usernameInput.focus();
}

/**
 * Menampilkan area aplikasi utama dan menyembunyikan area login.
 * @param {string} username - Nama pengguna yang akan ditampilkan.
 */
function showMainAppArea(username) {
    userLoginArea.classList.add('hidden');
    mainAppArea.classList.remove('hidden');
    activeUsernameDisplay.textContent = `(${username})`;
    greetingMessage.textContent = `Halo, ${username}! Catatan Anda telah dimuat.`;
    greetingMessage.classList.remove('hidden');
    logoutButton.classList.remove('hidden');
    showWelcomeMessage(); // Tampilkan pesan selamat datang di area detail
    renderNotesList(); // Muat dan tampilkan daftar catatan
}

/**
 * Merender daftar catatan ke sidebar.
 */
function renderNotesList() {
    const notes = getAllNotes(); // Dari noteManager.js
    notesListUl.innerHTML = ''; // Kosongkan daftar sebelum mengisi ulang

    if (notes.length === 0) {
        notesListUl.innerHTML = '<li>Belum ada catatan.</li>';
        return;
    }

    // Urutkan catatan berdasarkan tanggal diperbarui (terbaru dulu)
    notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    notes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note.title || 'Tanpa Judul';
        li.dataset.noteId = note.id;
        li.setAttribute('title', note.title); // Tooltip untuk judul panjang

        // Tandai catatan yang sedang aktif jika ada
        if (note.id === currentOpenNoteId) {
            li.classList.add('active');
        }

        // Event listener untuk membuka catatan saat diklik
        li.addEventListener('click', () => {
            openNoteForView(note.id);
            // Update kelas 'active' pada daftar
            document.querySelectorAll('#notes-list li').forEach(item => item.classList.remove('active'));
            li.classList.add('active');
        });
        notesListUl.appendChild(li);
    });
}

/**
 * Menampilkan pesan selamat datang di area detail catatan.
 */
function showWelcomeMessage() {
    noteView.classList.add('hidden');
    noteEditor.classList.add('hidden');
    welcomeMessageArea.classList.remove('hidden');
    currentOpenNoteId = null;
    // Hapus kelas 'active' dari semua item daftar
    document.querySelectorAll('#notes-list li').forEach(item => item.classList.remove('active'));
}

/**
 * Menampilkan catatan untuk dibaca.
 * @param {string} noteId - ID catatan yang akan ditampilkan.
 */
function openNoteForView(noteId) {
    const note = getNoteById(noteId); // Dari noteManager.js
    if (!note) {
        alert('Catatan tidak ditemukan!');
        showWelcomeMessage();
        return;
    }

    currentOpenNoteId = note.id;

    noteViewTitle.textContent = note.title;
    // Gunakan parseMarkdown (dari utils.js) jika ada, jika tidak tampilkan teks biasa
    // Pastikan parseMarkdown menghasilkan HTML yang aman atau disanitasi
    noteViewContent.innerHTML = parseMarkdown(note.content); // utils.js

    noteView.classList.remove('hidden');
    noteEditor.classList.add('hidden');
    welcomeMessageArea.classList.add('hidden');

    // Tandai item aktif di daftar catatan
    document.querySelectorAll('#notes-list li').forEach(item => {
        item.classList.toggle('active', item.dataset.noteId === noteId);
    });
}

/**
 * Menampilkan editor untuk membuat catatan baru.
 */
function openNewNoteEditor() {
    currentOpenNoteId = null; // Tidak ada ID untuk catatan baru sampai disimpan
    noteTitleInput.value = '';
    noteContentInput.value = '';

    noteEditor.classList.remove('hidden');
    noteView.classList.add('hidden');
    welcomeMessageArea.classList.add('hidden');

    noteTitleInput.focus();
    // Hapus kelas 'active' dari semua item daftar
    document.querySelectorAll('#notes-list li').forEach(item => item.classList.remove('active'));
}

/**
 * Menampilkan editor untuk mengedit catatan yang sudah ada.
 * @param {string} noteId - ID catatan yang akan diedit.
 */
function openNoteForEdit(noteId) {
    const note = getNoteById(noteId); // Dari noteManager.js
    if (!note) {
        alert('Catatan tidak ditemukan untuk diedit!');
        return;
    }

    currentOpenNoteId = note.id; // Tetap set ID untuk proses simpan

    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;

    noteEditor.classList.remove('hidden');
    noteView.classList.add('hidden');
    welcomeMessageArea.classList.add('hidden');

    noteTitleInput.focus();
}

/**
 * Membersihkan form editor catatan.
 */
function clearNoteEditorForm() {
    noteTitleInput.value = '';
    noteContentInput.value = '';
}

// Event listener akan ditambahkan di app.js untuk tombol-tombol UI
// seperti save, delete, edit, dll. untuk memisahkan concerns.

// Contoh:
// saveNoteButton.addEventListener('click', () => { /* handle save */ });
// deleteNoteButton.addEventListener('click', () => { /* handle delete */ });