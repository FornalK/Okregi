const user= "user1";
// Nazwy klas wszystkich kropek na okręgach
const dots = [
    "top", "bottom", "left", "right",
	"topLeft", "topRight", "bottomLeft", "bottomRight"
];

const scenarios = [
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

let scenario = 0;
let randomNr = 0;
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
	
	// Usuwamy przycisk oraz instrukcje startowa po kliknięciu
	this.remove();
	document.getElementById('instruction').remove();

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

    //zapis do pliku txt
    const line_elements = [scenarios[scenario][0], scenarios[scenario][1], scenarios[scenario][5], dots[randomNr], 'none'];
    line = line_elements.join("\t");
    saveLine("dots.txt", line);

    //wystartowanie nastepnego scenraiusza
    scenario += 1;
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

    //zapis do pliku txt
    const line_elements = [scenarios[scenario][0], scenarios[scenario][1], scenarios[scenario][5], dots[randomNr], selectedDotName];
    line = line_elements.join("\t");
    saveLine("dots.txt", line);

    //wystartowanie nastepnego scenraiusza
    scenario += 1;
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
        circle.style.opacity = "75%";
        circle.style.cursor = 'pointer';
    });
    
    //nextScenario();
}


// Funkcja przechodzaca do kolejnego scenariusza
function nextScenario() {
    //console.log(scenarios[scenario]);
    //console.log(answeredDots);
    if (scenario == scenarios.length) {

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

    // Ustawia klas dla okręgu
    var ring = document.getElementById('ring');
    if (scenario > 0) {
        ring.classList.remove(scenarios[scenario-1][0]);
        ring.classList.remove(scenarios[scenario-1][1]);
    }

    ring.classList.add(scenarios[scenario][0]);
    ring.classList.add(scenarios[scenario][1]);

    // Ustawia klasy dla kółek
    var circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
        circle.style.backgroundColor = scenarios[scenario][2];
        circle.style.opacity = "0%";
        circle.style.cursor = 'auto';
    });

    circles[0].style.top = scenarios[scenario][3];
    circles[1].style.bottom = scenarios[scenario][3];
    circles[2].style.left = scenarios[scenario][3];
    circles[3].style.right = scenarios[scenario][3];

    circles[4].style.top = scenarios[scenario][4];
    circles[4].style.left = scenarios[scenario][4];
    circles[5].style.top = scenarios[scenario][4];
    circles[5].style.right = scenarios[scenario][4];
    circles[6].style.bottom = scenarios[scenario][4];
    circles[6].style.left = scenarios[scenario][4];
    circles[7].style.bottom = scenarios[scenario][4];
    circles[7].style.right = scenarios[scenario][4];
    
    // Uruchomienie funkcji która ma mrygać
	//blinking(scenarios[scenario][5]);
    delay = Math.random() * 1500 + 1500; // opoznienie od 1.5 do 3 sekund
    interval = 1000 / scenarios[scenario][5]; // ile razy na sekunde mryganie
    reps = 4 * scenarios[scenario][5];
    runBlinking(delay, interval, reps);

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
function runBlinking(opoznienie, interwal, liczbaWywolan) {
    // zatrzymanie starego mrygania
    clearInterval(blinkingIntervalId);
    clearTimeout(blinkingTimeoutId);
    randomNr = Math.floor(Math.random() * dots.length);
    const randomDot = dots[randomNr];
    const elements = document.getElementsByClassName(randomDot);
    selectedDot = elements[0];
    blinkingTimeoutId = setTimeout(() => {
        let licznik = 0;
        blinkingIntervalId = setInterval(() => {
            if (selectedDot.style.opacity == 0) {
                selectedDot.style.opacity = '100%';
            } else {
                selectedDot.style.opacity = '0%';
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