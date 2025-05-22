/**
 * @file noteManager.js
 * @description Mengelola operasi CRUD (Create, Read, Update, Delete) untuk catatan.
 * Catatan disimpan di localStorage di bawah kunci yang spesifik untuk pengguna.
 */

/**
 * Mendapatkan kunci localStorage yang digunakan untuk menyimpan catatan pengguna tertentu.
 * @param {string} username - Nama pengguna.
 * @returns {string} Kunci localStorage untuk catatan pengguna tersebut.
 */
function getNotesKeyForUser(username) {
    if (!username) {
        console.error("Nama pengguna tidak boleh kosong untuk mendapatkan kunci catatan.");
        return null; // Atau throw error
    }
    return `notesApp_${username}_notes`;
}

/**
 * Mengambil semua catatan untuk pengguna yang sedang aktif.
 * @returns {Array<Object>} Array objek catatan, atau array kosong jika tidak ada catatan atau tidak ada pengguna aktif.
 */
function getAllNotes() {
    const activeUser = getActiveUser(); // Dari auth.js
    if (!activeUser) {
        // console.warn("Tidak ada pengguna aktif untuk mengambil catatan.");
        return [];
    }
    const notesKey = getNotesKeyForUser(activeUser);
    const notesJSON = localStorage.getItem(notesKey);
    return notesJSON ? JSON.parse(notesJSON) : [];
}

/**
 * Menyimpan array catatan ke localStorage untuk pengguna yang sedang aktif.
 * @param {Array<Object>} notes - Array objek catatan yang akan disimpan.
 * @returns {boolean} True jika berhasil disimpan, false jika tidak ada pengguna aktif.
 */
function saveNotes(notes) {
    const activeUser = getActiveUser(); // Dari auth.js
    if (!activeUser) {
        console.error("Tidak ada pengguna aktif untuk menyimpan catatan.");
        return false;
    }
    const notesKey = getNotesKeyForUser(activeUser);
    localStorage.setItem(notesKey, JSON.stringify(notes));
    return true;
}

/**
 * Menambahkan catatan baru untuk pengguna yang sedang aktif.
 * @param {string} title - Judul catatan.
 * @param {string} content - Isi catatan.
 * @returns {Object | null} Objek catatan yang baru dibuat, atau null jika gagal.
 */
function createNote(title, content) {
    const activeUser = getActiveUser();
    if (!activeUser) {
        alert("Tidak ada pengguna aktif. Silakan masuk terlebih dahulu.");
        return null;
    }

    if (!title || title.trim() === '') {
        alert("Judul catatan tidak boleh kosong.");
        return null;
    }

    const notes = getAllNotes();
    const newNote = {
        id: generateUniqueId(), // Dari utils.js
        title: title.trim(),
        content: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    notes.push(newNote);
    saveNotes(notes);
    return newNote;
}

/**
 * Mengambil satu catatan berdasarkan ID-nya untuk pengguna yang sedang aktif.
 * @param {string} noteId - ID catatan yang akan diambil.
 * @returns {Object | undefined} Objek catatan jika ditemukan, atau undefined jika tidak.
 */
function getNoteById(noteId) {
    const notes = getAllNotes();
    return notes.find(note => note.id === noteId);
}

/**
 * Memperbarui catatan yang sudah ada untuk pengguna yang sedang aktif.
 * @param {string} noteId - ID catatan yang akan diperbarui.
 * @param {string} title - Judul baru catatan.
 * @param {string} content - Isi baru catatan.
 * @returns {Object | null} Objek catatan yang telah diperbarui, atau null jika catatan tidak ditemukan atau gagal.
 */
function updateNote(noteId, title, content) {
    const activeUser = getActiveUser();
    if (!activeUser) {
        alert("Sesi pengguna tidak ditemukan. Tidak dapat memperbarui catatan.");
        return null;
    }

    if (!title || title.trim() === '') {
        alert("Judul catatan tidak boleh kosong.");
        return null;
    }

    let notes = getAllNotes();
    const noteIndex = notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
        console.error(`Catatan dengan ID ${noteId} tidak ditemukan.`);
        return null;
    }

    notes[noteIndex] = {
        ...notes[noteIndex], // Pertahankan properti lama seperti id dan createdAt
        title: title.trim(),
        content: content,
        updatedAt: new Date().toISOString()
    };

    saveNotes(notes);
    return notes[noteIndex];
}

/**
 * Menghapus catatan berdasarkan ID-nya untuk pengguna yang sedang aktif.
 * @param {string} noteId - ID catatan yang akan dihapus.
 * @returns {boolean} True jika berhasil dihapus, false jika tidak.
 */
function deleteNote(noteId) {
    const activeUser = getActiveUser();
    if (!activeUser) {
        alert("Sesi pengguna tidak ditemukan. Tidak dapat menghapus catatan.");
        return false;
    }

    let notes = getAllNotes();
    const updatedNotes = notes.filter(note => note.id !== noteId);

    if (notes.length === updatedNotes.length) {
        console.warn(`Catatan dengan ID ${noteId} tidak ditemukan untuk dihapus.`);
        return false; // Catatan tidak ditemukan
    }

    saveNotes(updatedNotes);
    return true;
}

/**
 * Mengekspor semua catatan pengguna aktif ke file JSON.
 * @param {string} username - Nama pengguna aktif.
 */
function exportNotesAsJson(username) {
    const notes = getAllNotes(); // Dapatkan catatan pengguna aktif
    if (notes.length === 0) {
        alert('Tidak ada catatan untuk diekspor.');
        return;
    }

    const dataStr = JSON.stringify(notes, null, 2); // Pretty print JSON
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${username}_notes.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up
    alert('Catatan berhasil diekspor sebagai ' + a.download);
}

/**
 * Mengimpor catatan dari array dan menyimpannya untuk pengguna aktif.
 * Catatan yang diimpor akan menimpa catatan yang ada dengan ID yang sama.
 * @param {Array<Object>} importedNotes - Array catatan yang diimpor.
 * @returns {boolean} True jika impor berhasil, false jika tidak ada pengguna aktif.
 */
function importNotes(importedNotes) {
    const activeUser = getActiveUser();
    if (!activeUser) {
        alert("Tidak ada pengguna aktif. Silakan masuk terlebih dahulu.");
        return false;
    }

    let existingNotes = getAllNotes();
    const importedIds = new Set(importedNotes.map(note => note.id));

    // Filter out existing notes that have IDs present in the imported notes
    const notesToKeep = existingNotes.filter(note => !importedIds.has(note.id));

    // Combine notes to keep with the imported notes
    const finalNotes = [...notesToKeep, ...importedNotes];

    saveNotes(finalNotes);
    return true;
}


/**
 * (Opsional) Mencari catatan berdasarkan query di judul atau isi.
 * @param {string} query - String pencarian.
 * @returns {Array<Object>} Array catatan yang cocok.
 */
function searchNotes(query) {
    const notes = getAllNotes();
    if (!query || query.trim() === '') {
        return notes; // Kembalikan semua catatan jika query kosong
    }
    const lowerCaseQuery = query.toLowerCase();
    return notes.filter(note =>
        note.title.toLowerCase().includes(lowerCaseQuery) ||
        note.content.toLowerCase().includes(lowerCaseQuery)
    );
}

// Sama seperti auth.js, fungsi-fungsi ini akan global atau bisa dibungkus objek.
// const NoteManager = { getAllNotes, createNote, getNoteById, updateNote, deleteNote, searchNotes };