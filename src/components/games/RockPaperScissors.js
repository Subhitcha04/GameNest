// Bridgerton Rock Paper Scissors Game
class BridgertonRPS {
    constructor() {
        this.choices = [
            { 
                name: "Elegant Fan", 
                beats: "Love Letter", 
                losesTo: "Gossip Scandal",
                image: "💨",
                description: "A lady's strategic weapon of subtle communication"
            },
            { 
                name: "Love Letter", 
                beats: "Gossip Scandal", 
                losesTo: "Elegant Fan",
                image: "💌",
                description: "A passionate missive that can change destinies"
            },
            { 
                name: "Gossip Scandal", 
                beats: "Elegant Fan", 
                losesTo: "Love Letter",
                image: "🗯️",
                description: "Whispers that can destroy reputations"
            }
        ];
        
        this.score = {
            player: 0,
            computer: 0,
            rounds: 0
        };
        
        this.initializeUI();
        this.attachEventListeners();
    }

    initializeUI() {
        document.body.innerHTML = `
            <div id="bridgerton-container" style="
                font-family: 'Georgia', serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
                background-color: #F4E1D2;
                color: #4A4238;
                border: 3px solid #8B4513;
            ">
                <h1 style="color: #8B4513; font-size: 2.5em;">
                    🎩 Bridgerton Society Games 🎀
                </h1>
                
                <div id="score-board" style="
                    display: flex; 
                    justify-content: space-between; 
                    margin-bottom: 20px;
                    font-weight: bold;
                ">
                    <span>Your Honor: <span id="player-score">0</span></span>
                    <span>Society's Favor: <span id="computer-score">0</span></span>
                </div>
                
                <div id="game-message" style="
                    margin-bottom: 20px;
                    font-style: italic;
                    min-height: 50px;
                "></div>
                
                <div id="choices-container" style="display: flex; justify-content: center; gap: 20px;">
                    ${this.choices.map((choice, index) => `
                        <button class="choice-btn" data-index="${index}" style="
                            background-color: #D2B48C;
                            border: 2px solid #8B4513;
                            font-size: 2em;
                            padding: 10px 20px;
                            cursor: pointer;
                            transition: transform 0.2s;
                        ">
                            ${choice.image} ${choice.name}
                        </button>
                    `).join('')}
                </div>
                
                <div id="result-container" style="margin-top: 20px;"></div>
            </div>
        `;
    }

    attachEventListeners() {
        // Add hover effects and click handlers to all choice buttons
        const buttons = document.querySelectorAll('.choice-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseover', () => {
                button.style.transform = 'scale(1.1)';
            });
            button.addEventListener('mouseout', () => {
                button.style.transform = 'scale(1)';
            });
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                this.playRound(index);
            });
        });
    }

    playRound(playerChoiceIndex) {
        const playerChoice = this.choices[playerChoiceIndex];
        const computerChoiceIndex = Math.floor(Math.random() * this.choices.length);
        const computerChoice = this.choices[computerChoiceIndex];
        
        this.score.rounds++;
        
        const messageElement = document.getElementById('game-message');
        const resultContainer = document.getElementById('result-container');
        
        // Determine winner
        let result = 'draw';
        if (playerChoice.beats === computerChoice.name) {
            result = 'win';
            this.score.player++;
        } else if (computerChoice.beats === playerChoice.name) {
            result = 'lose';
            this.score.computer++;
        }
        
        // Update score display
        document.getElementById('player-score').textContent = this.score.player;
        document.getElementById('computer-score').textContent = this.score.computer;
        
        // Dramatic result messages
        const resultMessages = {
            win: [
                "Your wit triumphs in the social arena!",
                "Society bows to your strategic brilliance!",
                "A most delightful victory, dear player!"
            ],
            lose: [
                "Oh, the scandal! You've been outmaneuvered!",
                "Your reputation takes a slight tumble...",
                "The ton whispers of your momentary defeat."
            ],
            draw: [
                "A diplomatic standoff! Neither side yields.",
                "Honor remains intact, neither party concedes.",
                "Perfectly balanced, as all social encounters should be."
            ]
        };
        
        // Detailed round result
        resultContainer.innerHTML = `
            <div style="
                background-color: rgba(139, 69, 19, 0.1);
                padding: 15px;
                border-radius: 10px;
            ">
                <h3>Round ${this.score.rounds} Result</h3>
                <p>You chose: ${playerChoice.image} ${playerChoice.name}</p>
                <p>Society chose: ${computerChoice.image} ${computerChoice.name}</p>
                <p style="font-weight: bold; color: ${
                    result === 'win' ? 'green' : 
                    result === 'lose' ? 'red' : 
                    'purple'
                }">
                    ${resultMessages[result][Math.floor(Math.random() * resultMessages[result].length)]}
                </p>
            </div>
        `;
        
        // Check for game conclusion
        if (this.score.rounds === 10) {
            this.concludeGame();
        }
    }
    
    concludeGame() {
        const resultContainer = document.getElementById('result-container');
        const finalVerdict = this.score.player > this.score.computer 
            ? "Congratulations! You've won the favor of society!" 
            : this.score.player < this.score.computer 
            ? "The ton has spoken - you must improve your social graces!" 
            : "A perfectly diplomatic engagement!";
        
        resultContainer.innerHTML += `
            <div style="
                margin-top: 20px;
                background-color: rgba(139, 69, 19, 0.2);
                padding: 20px;
                border-radius: 10px;
            ">
                <h2>Game Concluded</h2>
                <p style="font-size: 1.2em; font-weight: bold;">${finalVerdict}</p>
                <button onclick="location.reload()" style="
                    background-color: #8B4513;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    margin-top: 10px;
                    cursor: pointer;
                ">Restart Social Game</button>
            </div>
        `;
    }
}

// Initialize the game globally
window.game = new BridgertonRPS();
