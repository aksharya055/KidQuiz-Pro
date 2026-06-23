let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

// DOM Elements
const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const answerInput = document.getElementById('answer-input');
const quizCard = document.querySelector('.card');

// 1. START QUIZ LOGIC
if (startBtn) {
    startBtn.addEventListener('click', startQuiz);
}

async function startQuiz() {
    try {
        const response = await fetch('/api/questions');
        if (!response.ok) throw new Error("Could not fetch questions");
        
        questions = await response.json();

        if (questions.length === 0) {
            alert("No questions found in questions.json!");
            return;
        }

        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        showQuestion();
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to load quiz. Make sure app.py is running!");
    }
}

// 2. DISPLAY QUESTION LOGIC
function showQuestion() {
    if (currentIndex >= questions.length) {
        return showResults();
    }
    
    // Reset Timer and UI
    timeLeft = 15;
    document.getElementById('timer').innerText = timeLeft;
    document.getElementById('question-text').innerText = questions[currentIndex].question;
    
    // Update Progress Bar
    const progress = (currentIndex / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
    
    answerInput.value = '';
    answerInput.focus();

    // Start Countdown
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            currentIndex++;
            showQuestion();
        }
    }, 1000);
}

// 3. CHECK ANSWER LOGIC
function checkAnswer() {
    // Prevent multiple clicks during the 500ms feedback window
    clearInterval(timer); 

    const userAns = answerInput.value.trim().toLowerCase();
    const correctAns = questions[currentIndex].answer.toLowerCase();

    // Visual Feedback
    if (userAns === correctAns) {
        score++;
        document.getElementById('score-track').innerText = `Score: ${score}`;
        quizCard.style.border = "4px solid #48BB78"; // Green Border
    } else {
        quizCard.style.border = "4px solid #F56565"; // Red Border
    }

    // Wait 0.5 seconds so the user sees the color, then move on
    setTimeout(() => {
        quizCard.style.border = "none"; 
        currentIndex++;
        showQuestion();
    }, 500);
}

// Event Listeners for Submission
submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

// 4. FINAL RESULTS LOGIC
function showResults() {
    clearInterval(timer);
    document.getElementById('quiz-screen').classList.add('hidden');
    const resultScreen = document.getElementById('result-screen');
    resultScreen.classList.remove('hidden');

    // High Score Handling (LocalStorage)
    let high_score = localStorage.getItem('kidquiz_high_score') || 0;
    let message = `You got ${score} out of ${questions.length} correct!`;

    if (score > high_score) {
        localStorage.setItem('kidquiz_high_score', score);
        message += `<br><span style="color: #48BB78;">🏆 New Personal Best!</span>`;
    } else {
        message += `<br>Current High Score: ${high_score}`;
    }

    document.getElementById('final-score').innerHTML = message;
    
    // Badge Calculation
    let badge = "📚 Keep Practicing!";
    const percentage = (score / questions.length) * 100;

    if (percentage === 100) badge = "🥇 Quiz Master!";
    else if (percentage >= 80) badge = "🥈 Expert Explorer!";
    else if (percentage >= 60) badge = "🥉 Brainy Learner!";
    
    document.getElementById('badge').innerText = badge;
}