// Nazwy klas wszystkich kropek na okręgach
const dots = [
	"top", "topRight", "right", "bottomRight",
	"bottom", "bottomLeft", "left", "topLeft"
];

const scenarios = [
    ["ringSmall", "ringContrast1", "#0000ff", "112px", "232px", 1],
    ["ringMedium", "ringContrast1", "#0000ff", "57px", "193px", 1],
    ["ringBig", "ringContrast1", "##0000ff", "2px", "154px", 1],
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
    ["ringBig", "ringContrast1", "##7b00ff", "2px", "154px", 4],
    ["ringSmall", "ringContrast2", "#ff0000", "112px", "232px", 4],
    ["ringMedium", "ringContrast2", "#ff0000", "57px", "193px", 4],
    ["ringBig", "ringContrast2", "#ff0000", "2px", "154px", 4],
    ["ringSmall", "ringContrast3", "#ffff00", "112px", "232px", 4],
    ["ringMedium", "ringContrast3", "#ffff00", "57px", "193px", 4],
    ["ringBig", "ringContrast3", "#ffff00", "2px", "154px", 4],
]

let scenario = 0;
let blinkingIntervalId;
let selected_dot;
//console.time('myTimer')
let selectedDot;
let highlightedDots = [];
let answeredQuestions = [];

document.getElementById('showCircleBtn').addEventListener('click', function() {
    // Znajdujemy kontener z okręgiem
    var container = document.getElementById('container');
    
    // Ustawiamy styl display na 'block', aby pokazać ukryty kontener
    container.style.display = 'block';
	
	// Usuwamy przycisk oraz instrukcje startowa po kliknięciu
	this.remove();
	document.getElementById('instruction').remove();

    // Wystartowanie z pierwszym scenariuszem
    nextScenario();
});

function showNextQuestion() {
    if (answeredQuestions.length >= 27) {
        alert("Quiz zakończony!");
        return;
    }

    const questionNumber = Math.floor(Math.random() * 128) + 1;
    document.getElementById('questionImage').src = `images/ciekawostka_${String(questionNumber).padStart(3, '0')}.png`;
    
    displayAnswers(questionNumber);
    // highlightedDots = [];

    // setTimeout(() => {
    //     displayAnswers(questionNumber);
    // }, 1000);
    //askAdditionalQuestion();
}

function displayAnswers(questionNumber) {
    document.getElementById('answers').style.display = 'flex';
    document.getElementById('answerA').src = `images/ciekawostka_${String(questionNumber).padStart(3, '0')}_A.png`;
    document.getElementById('answerB').src = `images/ciekawostka_${String(questionNumber).padStart(3, '0')}_B.png`;
    document.getElementById('answerC').src = `images/ciekawostka_${String(questionNumber).padStart(3, '0')}_C.png`;
    document.getElementById('answerD').src = `images/ciekawostka_${String(questionNumber).padStart(3, '0')}_D.png`;
}

function selectAnswer(answer) {
    answeredQuestions.push({ questionNumber: answeredQuestions.length + 1, answer });
    document.getElementById('answers').style.display = 'none';
    nextScenario();
}

function askAdditionalQuestion(questionNumber) {
    const userResponse = prompt("Ile kropek było podświetlonych?");
    const correctAnswer = highlightedDots.length;

    answeredQuestions.push({
        questionNumber,
        additionalQuestion: "Ile kropek było podświetlonych?",
        userResponse: userResponse,
        correctAnswer: correctAnswer
    });
}


// Podpięcie funkcji anonimowej, uruchamiajacej eksperyment i usuwajacej elemnty startowe
document.getElementById('showCircleBtn').addEventListener('click', function() {
    // Znajdujemy kontener z okręgiem
    var container = document.getElementById('container');
    
    // Ustawiamy styl display na 'block', aby pokazać ukryty kontener
    container.style.display = 'block';
	
	// Usuwamy przycisk oraz instrukcje startowa po kliknięciu
	this.remove();
	document.getElementById('instruction').remove();

    // Wystartowanie z pierwszym scenariuszem
    nextScenario();
	
});

// Funkcja przechodzaca do kolejnego scenariusza
function nextScenario() {
    //console.log(scenarios[scenario]);
    console.log("git");
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
	blinking(scenarios[scenario][5]);
    showNextQuestion()
    scenario += 1;

    if (scenario == scenarios.length) {
        // Znajdujemy kontener z okręgiem
        var container = document.getElementById('container');
        
        // Ustawiamy styl display na 'block', aby pokazać ukryty kontener
        container.style.display = 'none';
    }
}

// Funkcja mrygajaca losowym okregiem
function blinking(hz) {
	// zatrzymanie starego mrygania
    clearInterval(blinkingIntervalId);

	const randomDot = dots[Math.floor(Math.random() * dots.length)];
	const elements = document.getElementsByClassName(randomDot);
	selected_dot = elements[0];
    console.log(selected_dot);
    blinkingIntervalId = setInterval(() => {
        //console.timeEnd('myTimer');
        //console.time('myTimer');
        const originalOpacity = selected_dot.style.opacity;
        selected_dot.style.opacity = '100%';
        setTimeout(() => {
            selected_dot.style.opacity = originalOpacity;  // Przywracamy poprzednia przezroczystosc co jakis czas
        }, 200);
    }, 1000/hz);
}

// Znajdujemy przycisk "DALEJ" i zalaczamy metode do przechodzenia po kolejnych scenariuszach
const nextScenarioBtn = document.getElementById('nextScenarioBtn');
nextScenarioBtn.onclick = nextScenario;
