// Nazwy klas wszystkich kropek na okręgach
const dots = [
	"top", "topRight", "right", "bottomRight",
	"bottom", "bottomLeft", "left", "topLeft"
];

const scenarios = [
    ["ringSmall", "ringContrast1", "#2B00FF", "112px", "232px", 1],
    ["ringMedium", "ringContrast1", "#2B00FF", "57px", "193px", 1],
    ["ringBig", "ringContrast1", "#2B00FF", "2px", "154px", 1],
    ["ringSmall", "ringContrast2", "#9C9C9C", "112px", "232px", 1],
    ["ringMedium", "ringContrast2", "#9C9C9C", "57px", "193px", 1],
    ["ringBig", "ringContrast2", "#9C9C9C", "2px", "154px",  1],
    ["ringSmall", "ringContrast3", "#FFFC99", "112px", "232px",  1],
    ["ringMedium", "ringContrast3", "#FFFC99", "57px", "193px",  1],
    ["ringBig", "ringContrast3", "#FFFC99", "2px", "154px",  1],
    
    ["ringSmall", "ringContrast1", "#2B00FF", "112px", "232px", 2],
    ["ringMedium", "ringContrast1", "#2B00FF", "57px", "193px", 2],
    ["ringBig", "ringContrast1", "#2B00FF", "2px", "154px", 2],
    ["ringSmall", "ringContrast2", "#9C9C9C", "112px", "232px", 2],
    ["ringMedium", "ringContrast2", "#9C9C9C", "57px", "193px", 2],
    ["ringBig", "ringContrast2", "#9C9C9C", "2px", "154px", 2],
    ["ringSmall", "ringContrast3", "#FFFC99", "112px", "232px", 2],
    ["ringMedium", "ringContrast3", "#FFFC99", "57px", "193px", 2],
    ["ringBig", "ringContrast3", "#FFFC99", "2px", "154px", 2],

    ["ringSmall", "ringContrast1", "#2B00FF", "112px", "232px", 4],
    ["ringMedium", "ringContrast1", "#2B00FF", "57px", "193px", 4],
    ["ringBig", "ringContrast1", "#2B00FF", "2px", "154px", 4],
    ["ringSmall", "ringContrast2", "#9C9C9C", "112px", "232px", 4],
    ["ringMedium", "ringContrast2", "#9C9C9C", "57px", "193px", 4],
    ["ringBig", "ringContrast2", "#9C9C9C", "2px", "154px", 4],
    ["ringSmall", "ringContrast3", "#FFFC99", "112px", "232px", 4],
    ["ringMedium", "ringContrast3", "#FFFC99", "57px", "193px", 4],
    ["ringBig", "ringContrast3", "#FFFC99", "2px", "154px", 4],
]

let scenario = 0;
let blinkingIntervalId;
let selected_dot;
//console.time('myTimer')

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
        circle.style.opacity = "50%";
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