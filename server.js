const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware do parsowania JSON
app.use(express.json());

// Serwowanie plików statycznych (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Endpoint do zapisywania danych do pliku
app.post('/save-data', (req, res) => {
    const { filename, line } = req.body; // Oczekujemy { "filename": "plik.txt", "line": "Treść do zapisania" }

    if (!filename || !line) {
        return res.status(400).json({ error: 'Brak nazwy pliku lub treści do zapisania.' });
    }

    const filePath = path.join(__dirname, filename);

    // Dopisanie nowej linii do wskazanego pliku
    fs.appendFile(filePath, line + '\n', 'utf8', (err) => {
        if (err) {
            console.error("Błąd zapisu do pliku:", err);
            return res.status(500).json({ error: 'Nie udało się zapisać pliku.' });
        }

        res.json({ message: `Linia została zapisana w pliku ${filename}.` });
    });
});

// Uruchom serwer
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});