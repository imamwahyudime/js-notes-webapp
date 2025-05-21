/**
 * @file auth.js
 * @description Mengelola otentikasi pengguna (nama pengguna) dan sesi di sisi klien menggunakan localStorage.
 */

const USERNAME_KEY = 'notesAppActiveUser'; // Kunci untuk menyimpan nama pengguna terakhir yang aktif
const ALL_USERS_KEY = 'notesAppAllUsers'; // Kunci untuk menyimpan daftar semua nama pengguna yang pernah login (opsional)

/**
 * Menyimpan nama pengguna yang sedang aktif ke localStorage.
 * @param {string} username - Nama pengguna yang akan disimpan.
 */
function setActiveUser(username) {
    if (!username || typeof username !== 'string' || username.trim() === '') {
        console.error('Nama pengguna tidak valid.');
        return;
    }
    const trimmedUsername = username.trim();
    localStorage.setItem(USERNAME_KEY, trimmedUsername);

    // (Opsional) Simpan nama pengguna ke daftar semua pengguna
    let users = getAllUsers();
    if (!users.includes(trimmedUsername)) {
        users.push(trimmedUsername);
        localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
    }
}

/**
 * Mengambil nama pengguna yang sedang aktif dari localStorage.
 * @returns {string | null} Nama pengguna aktif, atau null jika tidak ada.
 */
function getActiveUser() {
    return localStorage.getItem(USERNAME_KEY);
}

/**
 * Menghapus nama pengguna aktif dari localStorage (efek "logout").
 */
function clearActiveUser() {
    localStorage.removeItem(USERNAME_KEY);
}

/**
 * (Opsional) Mengambil daftar semua nama pengguna yang pernah login.
 * @returns {string[]} Array nama pengguna.
 */
function getAllUsers() {
    const users = localStorage.getItem(ALL_USERS_KEY);
    return users ? JSON.parse(users) : [];
}

/**
 * Memeriksa apakah ada pengguna yang sedang aktif/login.
 * @returns {boolean} True jika ada pengguna aktif, false jika tidak.
 */
function isLoggedIn() {
    return getActiveUser() !== null;
}

// Tidak ada ekspor modul eksplisit karena ini adalah JavaScript vanilla
// Fungsi-fungsi ini akan tersedia secara global setelah file ini dimuat,
// atau kita bisa membungkusnya dalam sebuah objek jika lebih disukai untuk namespacing:
// const Auth = { setActiveUser, getActiveUser, clearActiveUser, isLoggedIn, getAllUsers };
// Namun, untuk kesederhanaan awal, kita biarkan global dalam cakupan <script>.