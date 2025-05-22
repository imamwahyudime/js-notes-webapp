# Local Notes App

A simple, client-side note-taking application that stores your notes directly in your browser's local storage. This application allows users to create, read, update, and delete their personal notes.

## Features:

* **User-Specific Notes:** All notes are stored and managed based on the logged-in username, ensuring privacy and organization for multiple users on the same device.
* **Create New Notes:** Easily create new notes with a title and content.
* **View Notes:** Select a note from the sidebar to view its content in detail.
* **Edit Existing Notes:** Modify the title and content of your saved notes.
* **Delete Notes:** Remove unwanted notes from your collection.
* **Markdown Support (Basic):** The note viewer supports basic Markdown formatting, converting your Markdown text into HTML for better readability.
* **Persistent Storage:** Notes are saved in `localStorage`, meaning they persist even after closing the browser.
* **Responsive Design:** The application is designed to be usable on various screen sizes.

## Usage:

1.  **Open `index.html`:** Simply open the `index.html` file in your web browser.
2.  **Enter Username:** At the welcome screen, type in your desired username and click "Masuk / Lanjutkan" (Login / Continue). This will load any existing notes associated with that username or create a new profile if it's your first time.
3.  **Create a New Note:** Click the "Buat Catatan Baru" (Create New Note) button in the header.
4.  **Write Your Note:** Enter a title and content in the editor. Markdown is supported.
5.  **Save Your Note:** Click "Simpan" (Save) to save your new or edited note.
6.  **View Your Notes:** Your notes will appear in the "Daftar Catatan" (Notes List) sidebar. Click on a note's title to view its full content.
7.  **Edit/Delete Notes:** While viewing a note, you can click "Edit" to modify it or "Hapus" (Delete) to remove it.
8.  **Switch Users:** Click "Ganti Pengguna" (Change User) to log out and switch to a different username.

## Project Structure:

* `index.html`: The main HTML file that provides the structure of the application.
* `css/style.css`: Contains all the styling rules for the application's appearance.
* `js/app.js`: The main application logic, handling event listeners and initializing the app.
* `js/auth.js`: Manages user authentication (username handling) and session storage in `localStorage`.
* `js/noteManager.js`: Handles all CRUD (Create, Read, Update, Delete) operations for notes, storing them in `localStorage` specific to each user.
* `js/ui.js`: Manages all DOM interactions and UI updates, including showing/hiding elements and rendering note lists.
* `js/utils.js`: Provides general utility functions like generating unique IDs and (optionally) parsing Markdown.

## Technologies Used:

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* `localStorage` for data persistence
* [marked.js](https://marked.js.org/) (intended for Markdown parsing, but needs external inclusion)

## Future Enhancements (Ideas):

* **Search Functionality:** Add a search bar to filter notes by title or content.
* **Sorting Options:** Allow users to sort notes by creation date, last modified date, or title.
* **Rich Text Editor:** Integrate a more advanced text editor for formatting beyond basic Markdown.
* **Export/Import Notes:** Enable users to export their notes (e.g., as JSON or text files) and import them.
* **Cloud Sync:** Implement integration with a backend service for cloud synchronization of notes.