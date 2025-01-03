const express = require('express');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const app = express();
const PORT = 3000;

// Middleware do parsowania JSON
app.use(express.json());

// Serwowanie plików statycznych (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Funkcja do zapisu danych do pliku Excel
function saveToExcel(filePath, rowData) {
    let workbook;
    let worksheet;

    // Jeśli plik istnieje, otwórz go, w przeciwnym razie utwórz nowy
    if (fs.existsSync(filePath)) {
        workbook = xlsx.readFile(filePath);
        worksheet = workbook.Sheets['Sheet1'];
    } else {
        workbook = xlsx.utils.book_new();
        worksheet = xlsx.utils.aoa_to_sheet([]); // Tworzenie pustego arkusza
        workbook.SheetNames.push('Sheet1');
        workbook.Sheets['Sheet1'] = worksheet;
    }

    // Pobierz istniejące dane z arkusza (jeśli są)
    const existingData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Rozdziel tekst w "line" na tablicę i dodaj jako nowy wiersz
    const newRow = rowData.split(' ');  // Rozdzielanie tekstu według spacji na tablicę

    // Dodaj nowy wiersz danych
    existingData.push(newRow);

    // Zaktualizuj arkusz w workbook
    const updatedWorksheet = xlsx.utils.aoa_to_sheet(existingData);
    workbook.Sheets['Sheet1'] = updatedWorksheet;

    // Zapisz workbook do pliku
    xlsx.writeFile(workbook, filePath);
}

// Endpoint do zapisywania danych do pliku Excel
app.post('/save-data', (req, res) => {
    const { filename, line } = req.body; // Oczekujemy { "filename": "plik.xlsx", "line": "Treść do zapisania" }

    if (!filename || !line) {
        return res.status(400).json({ error: 'Brak nazwy pliku lub treści do zapisania.' });
    }

    const filePath = path.join(__dirname, filename);

    try {
        saveToExcel(filePath, line); // Przekaż wiersz jako tekst (line)
        res.json({ message: `Linia została zapisana w pliku ${filename}.` });
    } catch (err) {
        console.error("Błąd zapisu do pliku Excel:", err);
        res.status(500).json({ error: 'Nie udało się zapisać pliku Excel.' });
    }
});

// Uruchom serwer
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});