/**
 * @file app.js
 * @description File JavaScript utama untuk menginisialisasi aplikasi dan menangani event.
 */

// Event listener yang dijalankan setelah seluruh DOM selesai dimuat.
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();

    // Event Listeners untuk Otentikasi Pengguna
    loginButton.addEventListener('click', handleLogin);
    logoutButton.addEventListener('click', handleLogout);
    usernameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    });

    // Event Listeners untuk Operasi Catatan
    createNewNoteButton.addEventListener('click', handleCreateNewNote);
    saveNoteButton.addEventListener('click', handleSaveNote);
    deleteNoteButton.addEventListener('click', handleDeleteNote);
    editNoteButton.addEventListener('click', handleEditNote);
    cancelEditButton.addEventListener('click', handleCancelEdit);
    closeNoteViewButton.addEventListener('click', handleCloseNoteView);

    // Event Listeners for Import/Export
    exportNotesButton.addEventListener('click', handleExportNotes);
    importNotesButton.addEventListener('click', () => importNotesInput.click()); // Trigger hidden file input
    importNotesInput.addEventListener('change', handleImportNotes);

    // (Opsional) Event listener untuk pencarian, jika diimplementasikan
    // const searchInput = document.getElementById('search-input'); // Anda perlu menambahkan elemen ini di HTML
    // if (searchInput) {
    //     searchInput.addEventListener('input', (event) => {
    //         const query = event.target.value;
    //         const filteredNotes = searchNotes(query); // Dari noteManager.js
    //         renderNotesListWithData(filteredNotes); // Anda perlu membuat fungsi ini di ui.js atau memodifikasi renderNotesList
    //     });
    // }
});

/**
 * Menginisialisasi aplikasi.
 * Memeriksa apakah ada pengguna yang aktif, jika ya, tampilkan area aplikasi utama.
 * Jika tidak, tampilkan area login.
 */
function initializeApp() {
    const activeUser = getActiveUser(); // Dari auth.js
    if (activeUser) {
        showMainAppArea(activeUser); // Dari ui.js
        // renderNotesList(); // Dipanggil di dalam showMainAppArea
    } else {
        showLoginArea(); // Dari ui.js
    }
}

/**
 * Menangani proses login/lanjutkan pengguna.
 */
function handleLogin() {
    const username = usernameInput.value.trim();
    if (username) {
        setActiveUser(username); // Dari auth.js
        initializeApp(); // Re-inisialisasi untuk memuat UI yang benar
    } else {
        alert('Nama pengguna tidak boleh kosong!');
        usernameInput.focus();
    }
}

/**
 * Menangani proses logout/ganti pengguna.
 */
function handleLogout() {
    const confirmLogout = confirm("Apakah Anda yakin ingin mengganti pengguna? Catatan yang belum disimpan mungkin hilang jika tidak terkait pengguna ini.");
    if (confirmLogout) {
        clearActiveUser(); // Dari auth.js
        currentOpenNoteId = null; // Reset catatan yang terbuka dari ui.js (jika ui.js tidak mengeksposnya, kita reset di sini)
        initializeApp(); // Kembali ke layar login
    }
}

/**
 * Menangani pembuatan catatan baru.
 */
function handleCreateNewNote() {
    openNewNoteEditor(); // Dari ui.js
}

/**
 * Menangani penyimpanan catatan (baik baru maupun yang diedit).
 */
function handleSaveNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value;

    if (!title) {
        alert('Judul catatan tidak boleh kosong!');
        noteTitleInput.focus();
        return;
    }

    let savedNote;
    if (currentOpenNoteId) { // Jika ada currentOpenNoteId, berarti sedang mengedit
        savedNote = updateNote(currentOpenNoteId, title, content); // Dari noteManager.js
    } else { // Jika tidak, berarti membuat catatan baru
        savedNote = createNote(title, content); // Dari noteManager.js
    }

    if (savedNote) {
        renderNotesList(); // Perbarui daftar catatan di ui.js
        openNoteForView(savedNote.id); // Tampilkan catatan yang baru disimpan/diperbarui di ui.js
    } else {
        alert('Gagal menyimpan catatan.');
        // Mungkin karena tidak ada user aktif, atau error lain dari noteManager
    }
}

/**
 * Menangani penghapusan catatan.
 */
function handleDeleteNote() {
    if (!currentOpenNoteId) {
        alert('Tidak ada catatan yang dipilih untuk dihapus.');
        return;
    }

    const noteToDelete = getNoteById(currentOpenNoteId); // Dari noteManager.js
    if (!noteToDelete) {
        alert('Catatan tidak ditemukan.');
        return;
    }

    const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus catatan "${noteToDelete.title}"?`);
    if (confirmDelete) {
        const success = deleteNote(currentOpenNoteId); // Dari noteManager.js
        if (success) {
            renderNotesList(); // Perbarui daftar catatan di ui.js
            showWelcomeMessage(); // Kembali ke pesan selamat datang di ui.js
        } else {
            alert('Gagal menghapus catatan.');
        }
    }
}

/**
 * Menangani permintaan untuk mengedit catatan yang sedang dilihat.
 */
function handleEditNote() {
    if (currentOpenNoteId) {
        openNoteForEdit(currentOpenNoteId); // Dari ui.js
    } else {
        alert('Tidak ada catatan yang dipilih untuk diedit.');
    }
}

/**
 * Menangani pembatalan proses edit.
 */
function handleCancelEdit() {
    // Jika ada currentOpenNoteId, berarti sedang mengedit catatan yang sudah ada, kembali ke view mode.
    // Jika tidak ada (misalnya, membatalkan pembuatan catatan baru), kembali ke welcome message.
    if (currentOpenNoteId) {
        openNoteForView(currentOpenNoteId); // Dari ui.js
    } else {
        showWelcomeMessage(); // Dari ui.js
    }
}

/**
 * Menangani penutupan tampilan catatan (kembali ke pesan selamat datang).
 */
function handleCloseNoteView() {
    showWelcomeMessage(); // Dari ui.js
}

/**
 * Menangani ekspor catatan pengguna aktif ke file JSON.
 */
function handleExportNotes() {
    const activeUser = getActiveUser(); // From auth.js
    if (!activeUser) {
        alert('Tidak ada pengguna aktif untuk diekspor catatannya.');
        return;
    }
    exportNotesAsJson(activeUser); // From noteManager.js
}

/**
 * Menangani impor catatan dari file JSON.
 * @param {Event} event - Event dari input file.
 */
function handleImportNotes(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedNotes = JSON.parse(e.target.result);
            if (Array.isArray(importedNotes) && importedNotes.every(note => note.id && note.title && note.content)) {
                if (confirm('Mengimpor catatan akan menimpa catatan yang ada dengan judul yang sama. Lanjutkan?')) {
                    importNotes(importedNotes); // From noteManager.js
                    renderNotesList(); // Update UI
                    showWelcomeMessage(); // Go back to welcome message
                    alert('Catatan berhasil diimpor!');
                }
            } else {
                alert('Format file JSON tidak valid. Pastikan berisi array catatan dengan properti id, title, dan content.');
            }
        } catch (error) {
            console.error('Error parsing imported file:', error);
            alert('Gagal memproses file. Pastikan itu adalah file JSON yang valid.');
        } finally {
            // Clear the file input so that the same file can be selected again
            event.target.value = '';
        }
    };
    reader.readAsText(file);
}

// Catatan: currentOpenNoteId adalah variabel global dari ui.js.
// Jika ingin lebih terkapsulasi, ui.js bisa mengekspos getter/setter atau
// fungsi yang menangani logika ini secara internal.
// Untuk kesederhanaan saat ini, kita akses langsung asumsi ia global dalam konteks halaman.