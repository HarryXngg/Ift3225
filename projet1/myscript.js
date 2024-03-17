//Yuxiang Lin_20172116

function toggleDiv(divId, btnId) {
    var div = document.getElementById(divId);
    var btn = document.getElementById(btnId);
    if (div.style.display === "block") {
        div.style.display = "none";
        btn.style.backgroundColor = ""; 
        btn.style.color = ""; 
    } else {
        div.style.display = "block";
        btn.style.backgroundColor = "black"; 
        btn.style.color = "white"; 
    }
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


const questions = [
    { question: "Quelles sont les tonalités dont l’armature à la clé possède <span class='highlight'>1</span> bémol?", answers: [" do majeur , la mineur ", " sol majeur , mi mineur ", " fa majeur , ré mineur ", " si♭ majeur , sol mineur "] },
    { question: "Quelles sont les tonalités dont l’armature à la clé possède <span class='highlight'>2</span> bémols?", answers: [" mi♭ majeur , do mineur ", " la♭ majeur , fa mineur ", " si♭ majeur , sol mineur ", " ré♭ majeur , si♭ mineur "] },
    { question: "Quelles sont les tonalités dont l’armature à la clé possède <span class='highlight'>3</span> bémols?", answers: [" sol♭ majeur , mi♭ mineur ", " do♭ majeur , la♭ mineur ", " mi♭ majeur , do mineur ", " sol♭ majeur , mi♭ mineur "] },
    { question: "Quelles sont les tonalités dont l’armature à la clé possède <span class='highlight'>4</span> bémols?", answers: [" fa♭ majeur , ré♭ mineur ", " mi♭ majeur , do mineur ", " la♭ majeur , fa mineur ", " fa majeur , ré mineur "] },
    { question: "Quelles sont les tonalités dont l’armature à la clé possède <span class='highlight'>5</span> bémols?",  answers: [" sol majeur , mi mineur ", " do♭ majeur , la♭ mineur ", " ré♭ majeur , si♭ mineur ", " sol♭ majeur , mi♭ mineur "] },
    { question: "Quelles sont les tonalités dont l’armature à la clé possède <span class='highlight'>6</span> bémols?", answers: [" do majeur , la mineur ", " mi♭ majeur, do mineur ", " sol♭ majeur , mi♭ mineur ", " mi♭ majeur , do mineur"] },
    { question: "Quelles sont les tonalités dont l’armature à la clé possède <span class='highlight'>7</span> bémols?", answers: [" si♭ majeur , sol mineur ", " la♭ majeur , fa mineur ", " do♭ majeur , la♭ mineur ", " sol♭ majeur , mi♭ mineur "] },

];


const questions2 = [
    { question: "Quelle est la médiante de l'échelle de <span class='highlight'> do mineur </span> naturel?", answers: ["mi♭", "sol", "la", "do"]},
    { question: "Quelle est la médiante de l'échelle de <span class='highlight'> ré mineur </span> naturel?", answers: ["fa", "mi", "sol", "do"]},
    { question: "Quelle est la médiante de l'échelle de <span class='highlight'> mi mineur </span> naturel?", answers: ["sol", "ré", "si", "la"]},
    { question: "Quelle est la médiante de l'échelle de <span class='highlight'> fa mineur </span> naturel?", answers: ["la♭", "fa", "mi", "sol"]},
    { question: "Quelle est la médiante de l'échelle de <span class='highlight'> sol mineur </span> naturel?", answers: ["si♭", "si", "sol", "do"]},
    { question: "Quelle est la médiante de l'échelle de <span class='highlight'> la mineur </span>naturel?", answers: ["do", "sol", "ré", "fa"]},
    { question: "Quelle est la médiante de l'échelle de <span class='highlight'> si mineur </span> naturel?", answers: ["ré", "mi", "la", "fa"]},

];

let currentRound = 0;
let score = 0;
let answerTimeout;
let gameQuestions = [];
let gameType = '';
let correctIds = [];

function displayQuestion() {
    clearTimeout(answerTimeout);                            // Clear any previous timeouts
    document.getElementById("result").textContent = "";     // Clear previous result message


    if (currentRound < gameQuestions.length) {
        const q = gameQuestions[currentRound];
        document.getElementById("questionText").innerHTML = `<h3>${gameQuestions[currentRound].question}</h3>`;

        const form = document.getElementById("answerForm");
        form.innerHTML = "";       // Clear previous answers

        q.answers.forEach(answer => {
            const label = document.createElement("label");
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "answer";
            radio.value = answer;
            label.appendChild(radio);
            label.append(answer);
            form.appendChild(label);
            form.appendChild(document.createElement("br"));
        });

        let timeLeft = 10;              // Initialize and display the countdown
        document.getElementById("countdown").textContent = timeLeft;
        const countdownElement = document.getElementById("countdown");
        answerTimeout = setInterval(() => {
            timeLeft--;
            countdownElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(answerTimeout);
                showResult(false);     // Consider time-out as incorrect answer
            }
        }, 1000);
    } else {
        endGame();
    }
}


function submitAnswer() {
    
    clearInterval(answerTimeout); // Stop the countdown 

    const selectedAnswer = document.querySelector('input[name="answer"]:checked')?.value;
    
    const questionElement = document.getElementById("questionText");
    if(gameType === 'game1'){
        const numberOfFlats = parseInt(questionElement.querySelector(".highlight").textContent, 10);
        const isCorrect = validateAnswer(numberOfFlats, selectedAnswer);
        showResult(isCorrect);
    }else if (gameType === 'game2'){
        const scale = questionElement.querySelector(".highlight").textContent;
        const isCorrect = validateAnswer2(scale, selectedAnswer);
        showResult(isCorrect);
    }
    
}


function validateAnswer(numberOfFlats, selectedAnswer) {
    const detailsDivs = document.querySelectorAll('.details');
    correctIds = []; 

    detailsDivs.forEach(div => {
        if (div.getAttribute('data-flats') === String(numberOfFlats)) {
            correctIds.push(div.id); 
        }
    });

    const answerParts = selectedAnswer.split(',').map(part => part); // Split the selectedAnswer by comma 

    const isCorrect = answerParts.every(part => correctIds.includes(part)); // The answer is included in the list of correct IDs?

    return isCorrect;
}

function validateAnswer2(scale, selectedAnswer) {
    // Locate the Scale details div

    correctIds = [];
    let scaleDiv = null;
    const detailsDivs = document.querySelectorAll('.details');
    const normalizedScale = scale.replace(/\s+/g, '').toLowerCase();
    for (const div of detailsDivs) {
        if (div.id.replace(/\s+/g, '').toLowerCase() === normalizedScale) {
        scaleDiv = div;
        break; 
        }
    }

    if (scaleDiv) {
        correctIds.push(scaleDiv.getAttribute('data-median'))   
        return scaleDiv.getAttribute('data-median') === selectedAnswer; // Check if the data-median attribute matches the selected answer
    }

    return false;
}



function showResult(isCorrect) {
    clearInterval(answerTimeout);  // Stop the 10-second countdown 

    if (isCorrect) {
        score++;                   // Score incremented 
        document.getElementById("result").textContent = "Correct!";
        
        setTimeout(() => {
            prepareNextStep();
        }, 1000);                  // 1 second before the next question if got hte right answer
    } else {

        // Hide the 10-second countdown and show the correct answer
        document.getElementById("countdownContainer").style.display = "none";

        document.getElementById("result").textContent = `Incorrect. La bonne réponse était: ${correctIds}.`;

        // When got the wrong answer, the right answer will show for 3 seconds
        let correctAnswerTimeLeft = 3;
        document.getElementById("correctAnswerCountdown").textContent = correctAnswerTimeLeft;
        document.getElementById("correctAnswerCountdownContainer").style.display = "block";
        
        const correctAnswerCountdown = setInterval(() => {
            correctAnswerTimeLeft--;
            document.getElementById("correctAnswerCountdown").textContent = correctAnswerTimeLeft;

            if (correctAnswerTimeLeft <= 0) {
                clearInterval(correctAnswerCountdown);
                document.getElementById("correctAnswerCountdownContainer").style.display = "none";
                prepareNextStep();
            }
        }, 1000);
    }
}


function prepareNextStep() {
    currentRound++;
    if (currentRound < gameQuestions.length) {
        correctIds = [];
        displayQuestion();
        document.getElementById("countdownContainer").style.display = "block";
        document.getElementById("countdown").textContent = "10";   // Reset the countdown 
    } else {
        endGame();
    }
}

function startGame() {

    const questionsToUse = gameType === 'game1' ? questions : questions2;
    shuffleArray(questionsToUse);

    const gameImage = document.getElementById('questionImage');
    if (gameType === 'game1') {
        gameImage.src = 'images/Bémol.png'; 
        gameImage.alt = 'bémol';
        
    } else if (gameType === 'game2') {
        gameImage.src = 'images/mediante.png'; 
        gameImage.alt = 'médiante';
        
    }


    currentRound = 0;
    score = 0;
    document.getElementById("countdownContainer").style.display = "block"; 
    document.getElementById("questionImage").style.display = "block";
    document.getElementById("answerForm").style.display = "block";
    document.getElementById("submitAnswer").style.display = "inline";
    document.getElementById("restartGame").style.display = "none"; 
    document.getElementById("quitGame").style.display = "none"; 

    gameQuestions = questionsToUse.slice(0, 5);
    
    displayQuestion();

}



function endGame() {
    clearInterval(answerTimeout); // Clear the countdown 
    document.getElementById("countdownContainer").style.display = "none"; // Hide the 10-second countdown
    document.getElementById("correctAnswerCountdownContainer").style.display = "none"; // Hide the 3-second countdown

    document.getElementById("questionText").innerHTML = `<p>Votre score final est : ${score} sur ${gameQuestions.length}</p>`;
    
    document.getElementById("questionImage").style.display = "none";
    document.getElementById("answerForm").style.display = "none";
    document.getElementById("submitAnswer").style.display = "none";
    
    document.getElementById("result").textContent = "";
    
    document.getElementById("restartGame").style.display = "block";
    document.getElementById('quitGame').style.display = 'block';
    
}


document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.details').forEach(function(div) {
        div.style.display = 'none';
    });
    
    document.getElementById('testType1Btn').addEventListener('click', function() {
        gameType = 'game1';
        document.getElementById('gameContainer1').style.display = 'block'; 
        document.getElementById('testTypeSelection').style.display = 'none';
        startGame(); 
    });
    
    
    document.getElementById('testType2Btn').addEventListener('click', function() {
        gameType = 'game2';
        document.getElementById('gameContainer1').style.display = 'block'; 
        document.getElementById('testTypeSelection').style.display = 'none';
        startGame(); 
    });
});


function quitGame() {
    document.getElementById('gameContainer1').style.display = 'none';          // Hide game content
    document.getElementById('testTypeSelection').style.display = 'block';      // Show test type buttons again
    document.getElementById('restartGame').style.display = 'none';
    document.getElementById('quitGame').style.display = 'none';
    gameType = '';
    correctIds = [];
}

