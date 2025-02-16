// Nazwy klas wszystkich kropek na okręgach
const dots = [
    "top", "bottom", "left", "right",
	"topLeft", "topRight", "bottomLeft", "bottomRight"
];

const scenariosTemplate = [
    ["ringSmall", "ringContrast1", "#7b00ff", "112px", "232px", 1],
    ["ringMedium", "ringContrast1", "#7b00ff", "57px", "193px", 1],
    ["ringBig", "ringContrast1", "#7b00ff", "2px", "154px", 1],
    ["ringSmall", "ringContrast2", "#ff0000", "112px", "232px", 1],
    ["ringMedium", "ringContrast2", "#ff0000", "57px", "193px", 1],
    ["ringBig", "ringContrast2", "#ff0000", "2px", "154px",  1],
    ["ringSmall", "ringContrast3", "#ffff00", "112px", "232px",  1],
    ["ringMedium", "ringContrast3", "#ffff00", "57px", "193px",  1],
    ["ringBig", "ringContrast3", "#ffff00", "2px", "154px",  1],
    
    ["ringSmall", "ringContrast1", "#7b00ff", "112px", "232px", 2],
    ["ringMedium", "ringContrast1", "#7b00ff", "57px", "193px", 2],
    ["ringBig", "ringContrast1", "#7b00ff", "2px", "154px", 2],
    ["ringSmall", "ringContrast2", "#ff0000", "112px", "232px", 2],
    ["ringMedium", "ringContrast2", "#ff0000", "57px", "193px", 2],
    ["ringBig", "ringContrast2", "#ff0000", "2px", "154px", 2],
    ["ringSmall", "ringContrast3", "#ffff00", "112px", "232px", 2],
    ["ringMedium", "ringContrast3", "#ffff00", "57px", "193px", 2],
    ["ringBig", "ringContrast3", "#ffff00", "2px", "154px", 2],

    ["ringSmall", "ringContrast1", "#7b00ff", "112px", "232px", 4],
    ["ringMedium", "ringContrast1", "#7b00ff", "57px", "193px", 4],
    ["ringBig", "ringContrast1", "#7b00ff", "2px", "154px", 4],
    ["ringSmall", "ringContrast2", "#ff0000", "112px", "232px", 4],
    ["ringMedium", "ringContrast2", "#ff0000", "57px", "193px", 4],
    ["ringBig", "ringContrast2", "#ff0000", "2px", "154px", 4],
    ["ringSmall", "ringContrast3", "#ffff00", "112px", "232px", 4],
    ["ringMedium", "ringContrast3", "#ffff00", "57px", "193px", 4],
    ["ringBig", "ringContrast3", "#ffff00", "2px", "154px", 4],
]

let scenarios = [];
// Dodanie dla każdego scenariusza numeru kropki, czyli zrobienie 27 * 8 scenariuszy
for (let i = 0; i < dots.length; i++) {
    // kopia tablicy scenarios
    let new27ScenariosPerDot = structuredClone(scenariosTemplate);
    // Dodanie w kopii numeru kropki
    for (let lista of new27ScenariosPerDot) {
        lista.push(i);
    }

    // Polaczenie wszystkich scenairuszy
    scenarios = scenarios.concat(new27ScenariosPerDot);
}

// algorytm Fisher-Yates Shuffle do losowego mieszania elementow tablicy
function shuffleTab(tab) {
    for (let i = tab.length - 1; i > 0; i--) {
        // Wylosuj indeks z zakresu [0, i]
        const j = Math.floor(Math.random() * (i + 1));
        // Zamień elementy miejscami
        [tab[i], tab[j]] = [tab[j], tab[i]];
    }
    return tab;
}

// Wymieszanie tablicy scenarios
shuffleTab(scenarios);

let user;
let scenario;
let blinkingIntervalId;
let blinkingTimeoutId;
let timeSpentOnTask;
let selectedDot;
let currentQuestionNumber;
let currentUserAnswer;
let startTimestampSelectDot;
let taskCounter = 0;
let rightEyeGaze = 2;
let leftEyeGaze = 2;
let numberOfTasks = 216;
let highlightedDots = [];
let answeredQuestions = [];
let answeredDots = [];
let availableQuestions = Array.from({ length: 128 }, (_, i) => i + 1);

let experimentData = {
    startTime: null,
    endTime: null,
    answeredQuestions: [],
    answeredDots: []
};

async function saveLine(filename, line) {
    try {
        const response = await fetch('/save-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, line }), // Przesyłamy nazwę pliku i treść
        });

        if (response.ok) {
            console.log(`Linia zapisana w pliku ${filename}.`);
        } else {
            console.error("Błąd podczas zapisu linii.");
        }
    } catch (error) {
        console.error("Błąd połączenia z serwerem:", error);
    }
}

// Podpięcie funkcji anonimowej, uruchamiajacej eksperyment i usuwajacej elemnty startowe
document.getElementById('showCircleBtn').addEventListener('click', function() {
    // Dobranie sie do pola tekstowego z ekranu startowego
    let textField = document.getElementById("user");
    
    // Pobranie wartości wpisanej przez użytkownika
    user = textField.value;

    // Zapis czasu rozpoczęcia eksperymentu
    experimentData.startTime = new Date();

    // zapis do pliku inforamcji o uzytkowniku i czasie startu
    // saveLine("dots.xlsx", "===");
    // saveLine("dots.xlsx", user + " " + experimentData.startTime.toISOString() + " " + Date.now());

    // Znajdujemy kontener z okręgiem
    var container = document.getElementById('container');
    
    // Ustawiamy styl display na 'block', aby pokazać ukryty kontener
    container.style.display = 'block';
	
	// Usuwamy przycisk oraz instrukcje startowa i pole tekstowe po kliknięciu
	this.remove();
	document.getElementById('instruction').remove();
    textField.remove();

    // Przypisanie do kółek nasluchiwania na kliknięcie
    var circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
        circle.addEventListener("click", function() {
            saveDotSelection(index);
        })
    });
    
    // Wystartowanie z pierwszym scenariuszem
    gazeToCenter();
});

// Podpięcie funkcji anonimowej, pod przycisk, że nic nie mrygało
document.getElementById('didntBlinkBtn').addEventListener('click', function() {
    answeredDots.push('none');
    
    document.getElementById('didntBlinkText').style.display = 'none';
    document.getElementById('didntBlinkBtn').style.display = 'none';
    document.getElementById('taskCounter').style.display = 'none';

    //Pobranie aktualnego czasu
    let timestamp = Date.now()

    //zapis do pliku xlsx
    const lineElements = [user, scenario[0], scenario[1], scenario[5], dots[scenario[6]], 'none', startTimestampSelectDot, timestamp, currentQuestionNumber, currentUserAnswer];
    line = lineElements.join(" ");
    //saveLine("dots.xlsx", line);
    saveLine("results.xlsx", line)

    //wystartowanie nastepnego scenraiusza
    taskCounter += 1;
    progressBarUpdate()
    gazeToCenter();

});

// Akutalizacja progress baru
function progressBarUpdate() {
    const progressBar = document.getElementById("progress-bar");
    // Aktualizuj szerokość paska postępu
    const progressPercentage = ((numberOfTasks - scenarios.length) / numberOfTasks) * 100;
    progressBar.style.width = `${progressPercentage}%`;
};

// Funkcja losowania pytania
function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const questionNumber = availableQuestions[randomIndex];
    currentQuestionNumber = questionNumber;
    availableQuestions.splice(randomIndex, 1); // Usuń użyte pytanie
    return questionNumber + 1 // + 1 bo indeksujemy od zera a numery pytań w plikach są od 1;
}

function showNextQuestion() {
    const questionNumber = getRandomQuestion();
    let questionImg = document.getElementById('questionImage');
    questionImg.style.display = 'inline';
    questionImg.src = `images_proper/ciekawostka_${String(questionNumber).padStart(3, '0')}.png`;
    displayAnswers(questionNumber);
}

function displayAnswers(questionNumber) {
    document.getElementById('answers').style.display = 'flex';
    document.getElementById('answerA').src = `images_proper/ciekawostka_${String(questionNumber).padStart(3, '0')}_A.png`;
    document.getElementById('answerB').src = `images_proper/ciekawostka_${String(questionNumber).padStart(3, '0')}_B.png`;
    document.getElementById('answerC').src = `images_proper/ciekawostka_${String(questionNumber).padStart(3, '0')}_C.png`;
    document.getElementById('answerD').src = `images_proper/ciekawostka_${String(questionNumber).padStart(3, '0')}_D.png`;
}

function saveDotSelection(nr) {
    const selectedDotName = dots[nr];
    answeredDots.push(selectedDotName);

    experimentData.answeredDots = answeredDots;
    answeredDots.push(dots[nr]);

    document.getElementById('didntBlinkText').style.display = 'none';
    document.getElementById('didntBlinkBtn').style.display = 'none';
    document.getElementById('taskCounter').style.display = 'none';

    //Pobranie aktualnego czasu
    let timestamp = Date.now()

    //zapis do pliku xlsx
    const lineElements = [user, scenario[0], scenario[1], scenario[5], dots[scenario[6]], selectedDotName, startTimestampSelectDot,  timestamp, currentQuestionNumber, currentUserAnswer];
    line = lineElements.join(" ");
    //saveLine("dots.xlsx", line);
    saveLine("results.xlsx", line)

    // Jeśli użytkownik dobrze odpowiedział, trzeba sprawdzić czy nie ma wyższych kontrastów
    // które należy usunać z listy scenariuszy 
    if (dots[scenario[6]] == selectedDotName && scenario[1] != "ringContrast3") {
        for (let i = scenarios.length - 1; i > -1; i--) {
            if (scenarios[i][6] == scenario[6] && scenarios[i][0] == scenario[0] && scenarios[i][5] == scenario[5]){
                if (scenario[1] == "ringContrast2" && scenarios[i][1] == "ringContrast1")
                    continue;
                
                scenarios.splice(i, 1);
            }
        }
    }

    //wystartowanie nastepnego scenraiusza
    taskCounter += 1;
    progressBarUpdate()
    gazeToCenter();
}

function selectAnswer(answer) {
    // zapisanie wybranej odpowiedzi
    currentUserAnswer = answer;
    // ukrycie odpowiedzi
    document.getElementById('answers').style.display = 'none';

    // musimy tez ukryc obecne zdjecie z pytaniem
    document.getElementById('questionImage').style.display = 'none';

    // sprawdzamy ile czasu ktoś poświęcił na zadanie od jego pojawienia się
    timeSpentOnTask = (Date.now() - timeSpentOnTask) / 1000;
    // jeśli ktoś poświęcił zbyt mało czasu na zadanie
    // poniżej 4 sekundy traktujemy, że przeklikał od niechcenia
    if (timeSpentOnTask < 4) {
        // zatrzymanie mrygania
        clearInterval(blinkingIntervalId); 
        clearTimeout(blinkingTimeoutId);

        // informujemy, że użytkownik działa za szybko
        document.getElementById('tooFast').style.display = 'block';

        // wtedy dajemy kolejne zadanie bez możliwości wyboru co mrygało
        setTimeout(() => {
            // zresetowanie ustawien elementow html
            document.getElementById('tooFast').style.display = 'none';
            // Ustawia wyglad kropek oraz nasluchiwanie na klikniecie
            var circles = document.querySelectorAll('.circle');
            circles.forEach(circle => {
                circle.style.backgroundColor = "#FFFFFF";
                circle.style.opacity = "100%";
                circle.style.cursor = 'pointer';
            });

            // nastepny scenariusz
            gazeToCenter();
        }, 4000);
        return;
    } 

    // zapisanie w zmiennej czasu pojawienia się ekranu z wyborem kropek
    startTimestampSelectDot = Date.now()
        
    // Po odpowiedzi wyświetlamy przycisk, że nic nie mrygało lub możliwość zaznaczenia kropki
    document.getElementById('didntBlinkText').style.display = 'block';
    document.getElementById('didntBlinkBtn').style.display = 'block';
    
    // Wyswietlamy tez informacje ile na ile scenariuszy zrealizowano
    document.getElementById('taskCounter').style.display = 'block';

    // zatrzymanie starego mrygania gdyby jeszcze trwalo
    clearInterval(blinkingIntervalId); 
    clearTimeout(blinkingTimeoutId);

    // Ustawia wyglad kropek oraz nasluchiwanie na klikniecie
    var circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
        circle.style.backgroundColor = "#FFFFFF";
        circle.style.opacity = "100%";
        circle.style.cursor = 'pointer';
    });
}

// Funkcja wymuszająca na użytkowniku skierowanie wzroku do centrum okręgu
function gazeToCenter() {
    // Pokazanie napisu z polecenim i centralnym kwadratem
    document.getElementById('centering').style.display = 'block';

    // Uruchomienie funkcji anonimowej, która sprawdza co 100 ms czy wzrok jest w obszarze kwadratu
    // jeśli tak to mozemy wyświetlić następny scenariusz i zakończyć sprawdzanie
    let intervalId = setInterval(() => {
        if (leftEyeGaze > 1 && rightEyeGaze > 1) {
            document.getElementById('centering').style.display = 'none';
            nextScenario();
            clearInterval(intervalId); // Zatrzymanie interwału
        }
    }, 2000);
}

// Funkcja przechodzaca do kolejnego scenariusza
function nextScenario() {
    if (scenarios.length == 0) {

        // Zapis czasu rozpoczęcia i zakończenia eksperymentu
        experimentData.endTime = new Date()
        duration = ((experimentData.endTime - experimentData.startTime) / 1000).toString();
        // zapis do pliku inforamcji o czasie zakonczenia i dlugosci eksp

        // saveLine("dots.xlsx", user + " " + experimentData.endTime.toISOString() + " " + Date.now());
        // saveLine("dots.xlsx", "Czas trwania: " + duration);
        // saveLine("dots.xlsx", "===");

        // Znajdujemy kontener z okręgiem
        var container = document.getElementById('container');
        
        // Ustawiamy styl display na 'block', aby pokazać ukryty kontener
        container.style.display = 'none';

        return
    }

    // przypadek gdy ktoś za szybko odpowiada na pytania (nierzetelnie)
    if (timeSpentOnTask < 4) {
        // musimy wrzucić poprzednio ściągnięty scenariusz spowrotem na listę i ją przetasować
        scenarios.push(scenario);
        shuffleTab(scenarios);

        // przeklikane pytanie też spowrotem wrzucamy na listę możliwych pytań
        availableQuestions.push(currentQuestionNumber);
    }

    // Kolejnym scenariuszem jest zawsze ostatni element z tablicy scenariuszy
    prevScenario = scenario;
    scenario = scenarios.pop()

    // Ustawia klas dla okręgu
    var ring = document.getElementById('ring');
    if (taskCounter > 0) {
        ring.classList.remove(prevScenario[0]);
        ring.classList.remove(prevScenario[1]);
    }

    ring.classList.add(scenario[0]);
    ring.classList.add(scenario[1]);

    // Ustawia klasy dla kółek
    var circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
        circle.style.backgroundColor = scenario[2];
        circle.style.opacity = "100%";
        circle.style.cursor = 'auto';
    });

    circles[0].style.top = scenario[3];
    circles[1].style.bottom = scenario[3];
    circles[2].style.left = scenario[3];
    circles[3].style.right = scenario[3];

    circles[4].style.top = scenario[4];
    circles[4].style.left = scenario[4];
    circles[5].style.top = scenario[4];
    circles[5].style.right = scenario[4];
    circles[6].style.bottom = scenario[4];
    circles[6].style.left = scenario[4];
    circles[7].style.bottom = scenario[4];
    circles[7].style.right = scenario[4];
    
    // Uruchomienie funkcji która ma mrygać
    delay = Math.random() * 1500 + 1500; // opoznienie od 1.5 do 3 sekund
    interval = 1000 / scenario[5]; // ile razy na sekunde mryganie
    reps = 4 * scenario[5];
    dotNr = scenario[6];
    runBlinking(delay, interval, reps, dotNr);

    showNextQuestion();
    timeSpentOnTask = Date.now();
}

// Funkcja mrygajaca losowym kolkiem
function runBlinking(opoznienie, interwal, liczbaWywolan, dotNr) {
    // zatrzymanie starego mrygania
    clearInterval(blinkingIntervalId);
    clearTimeout(blinkingTimeoutId);
    const dot = dots[dotNr];
    const elements = document.getElementsByClassName(dot);
    selectedDot = elements[0];
    blinkingTimeoutId = setTimeout(() => {
        let licznik = 0;
        blinkingIntervalId = setInterval(() => {
            if (selectedDot.style.opacity == 1.0) {
                selectedDot.style.opacity = '0%';
            } else {
                selectedDot.style.opacity = '100%';
            }
            
            licznik++;
            if (licznik >= liczbaWywolan) {
                clearInterval(blinkingIntervalId);
            }
        }, interwal);
    }, opoznienie);
}

// Znajdujemy przycisk "DALEJ" i zalaczamy metode do przechodzenia po kolejnych scenariuszach
const nextScenarioBtn = document.getElementById('nextScenarioBtn');

// obsługa danych ze skryptu pythona
const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
    console.log('Połączono z serwerem WebSocket');
};

socket.onmessage = (event) => {
    let message = JSON.parse(event.data).split(" ");
    leftEyeGaze = parseInt(message[0]);
    rightEyeGaze = parseInt(message[1]);
};

socket.onerror = (error) => {
    console.error('Błąd WebSocket:', error);
};

socket.onclose = () => {
    console.log('Połączenie WebSocket zamknięte');
};