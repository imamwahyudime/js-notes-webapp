/**
 * @file utils.js
 * @description Berisi fungsi-fungsi utilitas umum untuk aplikasi.
 */

/**
 * Menghasilkan ID unik sederhana berbasis timestamp dan angka acak.
 * Cukup untuk aplikasi sisi klien tanpa kebutuhan ID yang benar-benar universal.
 * @returns {string} ID unik.
 */
function generateUniqueId() {
    return 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * (Opsional) Fungsi untuk membersihkan input HTML untuk mencegah XSS sederhana.
 * Ini adalah sanitasi yang sangat dasar. Untuk aplikasi produksi yang lebih serius,
 * pertimbangkan pustaka sanitasi yang lebih kuat jika konten HTML kompleks diizinkan.
 * Untuk aplikasi ini, kita akan lebih fokus pada konversi Markdown ke HTML yang aman
 * jika fitur tersebut diimplementasikan.
 * @param {string} str - String input yang mungkin mengandung HTML.
 * @returns {string} String yang telah disanitasi.
 */
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}


/**
 * (Opsional) Fungsi untuk mem-parse teks Markdown menjadi HTML.
 * Membutuhkan pustaka eksternal seperti marked.js.
 * Pastikan pustaka tersebut sudah dimuat sebelum fungsi ini dipanggil.
 * @param {string} markdownText - Teks dalam format Markdown.
 * @returns {string} HTML yang dihasilkan dari Markdown, atau teks asli jika marked.js tidak tersedia.
 */
function parseMarkdown(markdownText) {
    if (typeof marked === 'function') {
        // Menggunakan opsi marked.js untuk sanitasi dasar (jika pustaka mendukung)
        // atau pastikan outputnya aman. Marked.js versi terbaru memiliki opsi `sanitize: true` (deprecated)
        // atau `sanitizer` (lebih baru), atau bisa dikombinasikan dengan DOMPurify.
        // Untuk kesederhanaan di sini, kita asumsikan marked.js akan menghasilkan HTML yang aman
        // atau outputnya akan disanitasi sebelum dimasukkan ke DOM jika perlu.
        // Opsi `breaks: true` akan mengubah baris baru tunggal menjadi <br>.
        // Opsi `gfm: true` mengaktifkan GitHub Flavored Markdown.
        return marked(markdownText, { breaks: true, gfm: true });
    }
    console.warn('Pustaka marked.js tidak ditemukan. Menampilkan teks mentah.');
    // Jika marked.js tidak ada, kembalikan teks asli.
    // Kita bisa melakukan sanitasi dasar di sini jika tidak ada parsing markdown.
    return sanitizeHTML(markdownText); // Atau langsung return markdownText jika tidak ingin sanitasi di sini
}

// Contoh penggunaan (bisa dihapus atau dikomentari nanti):
// console.log(generateUniqueId());
// console.log(sanitizeHTML("<script>alert('xss')</script> <p>Halo</p>"));
// console.log(parseMarkdown("# Judul\n* Item 1\n* Item 2"));