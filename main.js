// Nazwy klas wszystkich kropek na okręgach
const dots = [
    "top", "bottom", "left", "right",
	"topLeft", "topRight", "bottomLeft", "bottomRight"
];

const scenariosTemplate = [
    ["ringSmall", "ringContrast1", "#7b00ff", "571px", "716px", 1],
    ["ringMedium", "ringContrast1", "#7b00ff", "287px", "515px", 1],
    ["ringBig", "ringContrast1", "#7b00ff", "3px", "315px", 1],
    ["ringSmall", "ringContrast2", "#ff0000", "571px", "716px", 1],
    ["ringMedium", "ringContrast2", "#ff0000", "287px", "515px", 1],
    ["ringBig", "ringContrast2", "#ff0000", "3px", "315px", 1],
    ["ringSmall", "ringContrast3", "#ffff00", "571px", "716px", 1],
    ["ringMedium", "ringContrast3", "#ffff00", "287px", "515px", 1],
    ["ringBig", "ringContrast3", "#ffff00", "3px", "315px", 1],
    
    ["ringSmall", "ringContrast1", "#7b00ff", "571px", "716px", 2],
    ["ringMedium", "ringContrast1", "#7b00ff", "287px", "515px", 2],
    ["ringBig", "ringContrast1", "#7b00ff", "3px", "315px", 2],
    ["ringSmall", "ringContrast2", "#ff0000", "571px", "716px", 2],
    ["ringMedium", "ringContrast2", "#ff0000", "287px", "515px", 2],
    ["ringBig", "ringContrast2", "#ff0000", "3px", "315px", 2],
    ["ringSmall", "ringContrast3", "#ffff00", "571px", "716px", 2],
    ["ringMedium", "ringContrast3", "#ffff00", "287px", "515px", 2],
    ["ringBig", "ringContrast3", "#ffff00", "3px", "315px", 2],

    ["ringSmall", "ringContrast1", "#7b00ff", "571px", "716px", 2],
    ["ringMedium", "ringContrast1", "#7b00ff", "287px", "515px", 2],
    ["ringBig", "ringContrast1", "#7b00ff", "3px", "315px", 2],
    ["ringSmall", "ringContrast2", "#ff0000", "571px", "716px", 2],
    ["ringMedium", "ringContrast2", "#ff0000", "287px", "515px", 2],
    ["ringBig", "ringContrast2", "#ff0000", "3px", "315px", 2],
    ["ringSmall", "ringContrast3", "#ffff00", "571px", "716px", 2],
    ["ringMedium", "ringContrast3", "#ffff00", "287px", "515px", 2],
    ["ringBig", "ringContrast3", "#ffff00", "3px", "315px", 2],
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
let intervalId1;
let intervalId2;
let state = 0; // 0 - ekran startowy, 1 - zadanie, 2 - wybor kropki, 3 - centrowanie
let outsideCenter = 0;
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
    gazeToCenter(true);
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

    //wystartowanie nastepnego scenariusza
    taskCounter += 1;
    progressBarUpdate()
    gazeToCenter(true);

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

    // zmiana stanu aplikacji na zadanie
    state = 1;
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

    //wystartowanie nastepnego scenariusza
    taskCounter += 1;
    progressBarUpdate()
    gazeToCenter(true);
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
            gazeToCenter(false);
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

    // ustawienie stanu aplikacji na odpowiedź urzytkownika
    state = 2;
}

// Funkcja wymuszająca na użytkowniku skierowanie wzroku do centrum okręgu
function gazeToCenter(isAnswerProper) {
    // ukrycie odpowiedzi (jesli bylaby widoczna)
    document.getElementById('answers').style.display = 'none';

    // musimy tez ukryc obecne zdjecie z pytaniem (jesli widoczne)
    document.getElementById('questionImage').style.display = 'none';

    // Pokazanie napisu z polecenim i centralnym kwadratem
    document.getElementById('centering').style.display = 'block';

    // zmiana stanu aplikacji na centrowanie
    state = 3;

    // Uruchomienie funkcji anonimowej, która sprawdza co 500 ms czy wzrok jest w obszarze kwadratu
    // jeśli tak to mozemy wyświetlić następny scenariusz i zakończyć sprawdzanie
    intervalId1 = setInterval(() => {
        //proper_gaze = leftEyeGaze[0] > 0.45 && rightEyeGaze[0] > 0.45 && leftEyeGaze[0] < 0.55 && rightEyeGaze[0] < 0.55 && leftEyeGaze[1] > 0.42 && leftEyeGaze[1] < 0.50;
        if (proper_gaze == 1) {
            // zatrzymanie mrugania
            clearInterval(blinkingIntervalId); 
            clearTimeout(blinkingTimeoutId);
            document.getElementById('centering').style.display = 'none';
            nextScenario(isAnswerProper);
            clearInterval(intervalId1); // Zatrzymanie interwału
        }
    }, 500);
}

// Funkcja przechodzaca do kolejnego scenariusza
function nextScenario(isProper) {
    // Uruchomienie nadzoru
    // Sprawdzanie co 500ms czy użytkownik nie opuścił centrum okręgu
    // Jeśli tak to wyświetlamy ekran z centrowaniem
    intervalId2 = setInterval(etSupervision, 500);  
    
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
    // lub zbłądził wzrokiem od centrum
    if (isProper == false) {
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
    let message = JSON.parse(event.data).split(",");
    leftEyeGaze = [parseFloat(message[0]), parseFloat(message[1])];
    rightEyeGaze = [parseFloat(message[2]), parseFloat(message[3])];
};

socket.onerror = (error) => {
    console.error('Błąd WebSocket:', error);
};

socket.onclose = () => {
    console.log('Połączenie WebSocket zamknięte');
};

document.addEventListener("keydown", function(event) {
    if (event.key === ",") {
        proper_gaze = 2;
    } else if (event.key === ".") {
        proper_gaze = 1;
    } else if (event.key === "/") {
        proper_gaze = 0;
    }
});

function etSupervision() {
    // nonproper_gaze = (leftEyeGaze[0] < 0.37 || rightEyeGaze[0] < 0.37) || (leftEyeGaze[0] > 0.63 || rightEyeGaze[0] > 0.63) ||
    //                  (leftEyeGaze[1] > 0.68 && rightEyeGaze[1] > 0.68) || (leftEyeGaze[1] < 0.35 && rightEyeGaze[1] < 0.35) ||
    //                  (isNaN(leftEyeGaze[0]) && isNaN(rightEyeGaze[0])) || (isNaN(leftEyeGaze[1]) && isNaN(rightEyeGaze[1]));
    // if (state == 1 && nonproper_gaze) {
        if (state == 1 && proper_gaze == 2) {
        outsideCenter += 1;
        if (outsideCenter >= 3) {
            // zatrzymanie mrugania
            clearInterval(blinkingIntervalId); 
            clearTimeout(blinkingTimeoutId);
            
            clearInterval(intervalId2);
            outsideCenter = 0;
            gazeToCenter(false);
            //console.log("Opuszczono");
        } else {
            return;
        }
        outsideCenter = 0;
    }

}
