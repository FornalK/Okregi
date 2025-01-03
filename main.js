// Nazwy klas wszystkich kropek na okręgach
const dots = [
    "top", "bottom", "left", "right",
	"topLeft", "topRight", "bottomLeft", "bottomRight"
];

const scenarios_template = [
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
    let new27ScenariosPerDot = structuredClone(scenarios_template);
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

let scenario;
let task_counter = 0;
let blinkingIntervalId;
let blinkingTimeoutId;
//console.time('myTimer')
let selectedDot;
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

// // Przykład ustawienia czasu rozpoczęcia
// experimentData.startTime = new Date().toISOString();

// // Po zakończeniu scenariuszy
// experimentData.endTime = new Date().toISOString();
// saveToFile('experiment_results.json', experimentData);

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
    let user = textField.value;

    // Zapis czasu rozpoczęcia eksperymentu
    experimentData.startTime = new Date();

    // zapis do wszytkich plików inforamcji o nr uzytkownika i czasie startu
    saveLine("results.txt", "\n" + user + "\n");
    saveLine("results.txt", "Czas startu: " + experimentData.startTime.toISOString());

    saveLine("dots.txt", "\n" + user + "\n");
    saveLine("dots.txt", "Czas startu: " + experimentData.startTime.toISOString());

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
    nextScenario();
});

// Podpięcie funkcji anonimowej, pod przycisk, że nic nie mrygało
document.getElementById('didntBlinkBtn').addEventListener('click', function() {
    answeredDots.push('none');
    
    document.getElementById('didntBlinkText').style.display = 'none';
    document.getElementById('didntBlinkBtn').style.display = 'none';
    document.getElementById('taskCounter').style.display = 'none';

    //zapis do pliku txt
    const line_elements = [scenario[0], scenario[1], scenario[5], dots[scenario[6]], 'none'];
    line = line_elements.join("\t");
    saveLine("dots.txt", line);

    //wystartowanie nastepnego scenraiusza
    task_counter += 1;
    nextScenario();

});

// Funkcja losowania pytania
function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const questionNumber = availableQuestions[randomIndex];
    availableQuestions.splice(randomIndex, 1); // Usuń użyte pytanie
    return questionNumber;
}

function showNextQuestion() {
    const questionNumber = Math.floor(Math.random() * 128) + 1;
    let questionImg = document.getElementById('questionImage');
    questionImg.style.display = 'inline';
    questionImg.src = `images/ciekawostka_${String(questionNumber).padStart(3, '0')}.png`;
    
    displayAnswers(questionNumber);
}

function displayAnswers(questionNumber) {
    document.getElementById('answers').style.display = 'flex';
    document.getElementById('answerA').src = `images/ciekawostka_${String(questionNumber).padStart(3, '0')}_A.png`;
    document.getElementById('answerB').src = `images/ciekawostka_${String(questionNumber).padStart(3, '0')}_B.png`;
    document.getElementById('answerC').src = `images/ciekawostka_${String(questionNumber).padStart(3, '0')}_C.png`;
    document.getElementById('answerD').src = `images/ciekawostka_${String(questionNumber).padStart(3, '0')}_D.png`;
}

function saveDotSelection(nr) {
    const selectedDotName = dots[nr];
    answeredDots.push(selectedDotName);

    experimentData.answeredDots = answeredDots;
    answeredDots.push(dots[nr]);

    document.getElementById('didntBlinkText').style.display = 'none';
    document.getElementById('didntBlinkBtn').style.display = 'none';
    document.getElementById('taskCounter').style.display = 'none';

    //zapis do pliku txt
    const line_elements = [scenario[0], scenario[1], scenario[5], dots[scenario[6]], selectedDotName];
    line = line_elements.join("\t");
    saveLine("dots.txt", line);

    // Jeśli użytkownik dobrze odpowiedział, trzeba sprawdzić czy nie ma wyższych kontrastów
    // które należy usunać z listy scenariuszy 
    if (dots[scenario[6]] == selectedDotName && scenario[1] != "ringContrast3") {
        for (let i = scenarios.length - 1; i > -1; i--) {
            if (scenarios[i][6] == scenario[6] && scenarios[i][0] == scenario[0] && scenarios[i][5] == scenario[5]){
                if (scenario[1] == "ringContrast2" && scenarios[i][1] == "ringContrast1")
                    continue;
                
                scenarios.splice(i, 1);
                console.log("Buu!");
            }
        }

    }

    //wystartowanie nastepnego scenraiusza
    task_counter += 1;
    nextScenario();
}

function selectAnswer(answer) {
    // const isCorrect = checkAnswer(answer); // Funkcja do sprawdzania poprawności odpowiedzi
    const isCorrect = true;
    answeredQuestions.push({ 
        questionNumber: answeredQuestions.length + 1, 
        answer, 
        isCorrect 
    });
    answeredQuestions.push({ questionNumber: answeredQuestions.length + 1, answer });
    document.getElementById('answers').style.display = 'none';

    // Po odpowiedzi wyświetlamy przycisk, że nic nie mrygało lub możliwość zaznaczenia kropki
    document.getElementById('didntBlinkText').style.display = 'block';
    document.getElementById('didntBlinkBtn').style.display = 'block';
    // Wyswietlamy tez informacje ile na ile scenariuszy zrealizowano
    let ile = 216 - scenarios.length;
    document.getElementById('taskCounter').textContent = "Pytania: " + ile + "/216";
    document.getElementById('taskCounter').style.display = 'block';

    // musimy tez ukryc obecne zdjecie z pytaniem
    document.getElementById('questionImage').style.display = 'none';

    // oraz wlaczyc wszystkie kropki zeby uzytkownik mogl w nie kliknac
    // zaznaczajac ktora mrygała

    // zatrzymanie starego mrygania gdyby jeszcze trwalo
    clearInterval(blinkingIntervalId); 
    clearTimeout(blinkingTimeoutId);

    // Ustawia wyglad kolek oraz nasluchiwanie na klikniecie
    var circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
        circle.style.backgroundColor = "#FFFFFF";
        circle.style.opacity = "33%";
        circle.style.cursor = 'pointer';
    });
}


// Funkcja przechodzaca do kolejnego scenariusza
function nextScenario() {
    if (scenarios.length == 0) {

        // Zapis czasu rozpoczęcia i zakończenia eksperymentu
        experimentData.endTime = new Date()
        czas_trwania = ((experimentData.endTime - experimentData.startTime) / 1000).toString();
        // zapis do wszytkich plików inforamcji o czasie zakonczenia i dlugosci eksp
        saveLine("results.txt", "Czas zakonczenia: " + experimentData.endTime.toISOString());
        saveLine("results.txt", "Czas trwania: " + czas_trwania);

        saveLine("dots.txt", "Czas zakonczenia: " + experimentData.endTime.toISOString());
        saveLine("dots.txt", "Czas trwania: " + czas_trwania);

        // Znajdujemy kontener z okręgiem
        var container = document.getElementById('container');
        
        // Ustawiamy styl display na 'block', aby pokazać ukryty kontener
        container.style.display = 'none';

        return
    }

    // Kolejnym scenariuszem jest zawsze ostatni element z tablicy scenariuszy
    prev_scenario = scenario;
    scenario = scenarios.pop()

    // Ustawia klas dla okręgu
    var ring = document.getElementById('ring');
    if (task_counter > 0) {
        ring.classList.remove(prev_scenario[0]);
        ring.classList.remove(prev_scenario[1]);
    }

    ring.classList.add(scenario[0]);
    ring.classList.add(scenario[1]);

    // Ustawia klasy dla kółek
    var circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
        circle.style.backgroundColor = scenario[2];
        circle.style.opacity = "33%";
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
	//blinking(scenarios[scenario][5]);
    delay = Math.random() * 1500 + 1500; // opoznienie od 1.5 do 3 sekund
    interval = 1000 / scenario[5]; // ile razy na sekunde mryganie
    reps = 4 * scenario[5];
    dotNr = scenario[6];
    runBlinking(delay, interval, reps, dotNr);

    showNextQuestion()
}

// Funkcja mrygajaca losowym kolkiem
// function blinking(hz) {
// 	// zatrzymanie starego mrygania
//     clearInterval(blinkingIntervalId);

// 	const randomDot = dots[Math.floor(Math.random() * dots.length)];
// 	const elements = document.getElementsByClassName(randomDot);
// 	selected_dot = elements[0];
//     console.log(selected_dot);
//     blinkingIntervalId = setInterval(() => {
//         //console.timeEnd('myTimer');
//         //console.time('myTimer');
//         const originalOpacity = selected_dot.style.opacity;
//         selected_dot.style.opacity = '100%';
//         setTimeout(() => {
//             selected_dot.style.opacity = originalOpacity;  // Przywracamy poprzednia przezroczystosc co jakis czas
//         }, 200);
//     }, 1000/hz);
// }

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
            if (selectedDot.style.opacity == 0.33) {
                selectedDot.style.opacity = '100%';
            } else {
                selectedDot.style.opacity = '33%';
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
// nextScenarioBtn.onclick = nextScenario;