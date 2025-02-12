class SquidGameQuiz {
    constructor() {
        this.questions = [
            {
                question: "What is the main character's name?",
                options: ["Seong Gi-hun", "Sang-woo", "Il-nam", "Sae-byeok"],
                correctAnswer: 0,
                pointValue: 100
            },
            {
                question: "Which game was NOT played in the first game?",
                options: ["Red Light, Green Light", "Honeycomb/Ppopgi", "Tug of War", "Glass Bridge"],
                correctAnswer: 2,
                pointValue: 200
            },
            {
                question: "What number was Seong Gi-hun?",
                options: ["001", "199", "456", "067"],
                correctAnswer: 2,
                pointValue: 300
            },
            {
                question: "What is the prize money for winning the game?",
                options: ["₩45.6 billion", "₩38.5 billion", "₩33.4 billion", "₩55.7 billion"],
                correctAnswer: 0,
                pointValue: 400
            },
            {
                question: "Who was the mastermind behind the games?",
                options: ["The Front Man", "Sang-woo", "Oh Il-nam", "The VIP"],
                correctAnswer: 2,
                pointValue: 500
            }
        ];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;

        this.initializeUI();
    }

    initializeUI() {
        document.body.innerHTML = `
            <div id="squid-game-container">
                <h1>🦑 Squid Game Quiz 🦑</h1>
                <div id="stats">
                    <span id="lives">❤️ Lives: 3</span>
                    <span id="score">Score: 0</span>
                </div>
                <div id="question-container"></div>
                <div id="options-container"></div>
                <div id="game-result"></div>
            </div>
        `;
        this.renderQuestion();
    }

    renderQuestion() {
        if (this.currentQuestionIndex >= this.questions.length || this.lives <= 0) {
            this.endGame();
            return;
        }

        const currentQuestion = this.questions[this.currentQuestionIndex];
        const questionContainer = document.getElementById('question-container');
        const optionsContainer = document.getElementById('options-container');

        questionContainer.innerHTML = `
            <h2>${currentQuestion.question}</h2>
            <p>Points: ${currentQuestion.pointValue}</p>
        `;

        optionsContainer.innerHTML = currentQuestion.options.map((option, index) => `
            <button onclick="game.checkAnswer(${index})">${option}</button>
        `).join('');
    }

    checkAnswer(selectedIndex) {
        const currentQuestion = this.questions[this.currentQuestionIndex];

        if (selectedIndex === currentQuestion.correctAnswer) {
            this.score += currentQuestion.pointValue;
            this.updateScoreDisplay();
            this.currentQuestionIndex++;
            this.renderQuestion();
        } else {
            this.lives--;
            this.updateLivesDisplay();

            if (this.lives <= 0) {
                this.endGame('eliminated');
            } else {
                this.shakeScreen();
            }
        }
    }

    shakeScreen() {
        const container = document.getElementById('squid-game-container');
        container.style.animation = 'shake 0.5s';
        setTimeout(() => {
            container.style.animation = 'none';
        }, 500);
    }

    updateScoreDisplay() {
        document.getElementById('score').textContent = `Score: ${this.score}`;
    }

    updateLivesDisplay() {
        document.getElementById('lives').textContent = `❤️ Lives: ${this.lives}`;
    }

    endGame(status = 'completed') {
        const resultContainer = document.getElementById('game-result');

        if (status === 'eliminated') {
            resultContainer.innerHTML = `
                <h2>You Were Eliminated!</h2>
                <p>Final Score: ${this.score}</p>
                <button onclick="game.restartGame()">Play Again</button>
            `;
        } else {
            resultContainer.innerHTML = `
                <h2>Congratulations! You Survived!</h2>
                <p>Total Score: ${this.score}</p>
                <button onclick="game.restartGame()">Play Again</button>
            `;
        }
    }

    restartGame() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.lives = 3;
        this.initializeUI();
    }
}

// Initialize the game
const game = new SquidGameQuiz();
