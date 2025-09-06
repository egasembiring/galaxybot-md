const fs = require('fs');

// Mini Games Library
class MiniGames {
    constructor() {
        this.gamesFile = './database/games.json';
    }

    // Load games database
    loadGames() {
        try {
            if (fs.existsSync(this.gamesFile)) {
                return JSON.parse(fs.readFileSync(this.gamesFile));
            }
            return {};
        } catch (err) {
            return {};
        }
    }

    // Save games database
    saveGames(data) {
        try {
            fs.writeFileSync(this.gamesFile, JSON.stringify(data, null, 2));
            return true;
        } catch (err) {
            console.error('Error saving games database:', err);
            return false;
        }
    }

    // Get player game stats
    getPlayerStats(userId) {
        const gamesData = this.loadGames();
        if (!gamesData[userId]) {
            gamesData[userId] = {
                suitWins: 0,
                suitLosses: 0,
                suitDraws: 0,
                guessWordWins: 0,
                guessWordLosses: 0,
                casinoWins: 0,
                casinoLosses: 0,
                totalGamesPlayed: 0,
                lastGame: 0,
                achievements: []
            };
            this.saveGames(gamesData);
        }
        return gamesData[userId];
    }

    // Rock Paper Scissors Game
    playSuit(userId, playerChoice) {
        const choices = ['batu', 'gunting', 'kertas'];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        
        let result = '';
        let outcome = '';
        
        if (playerChoice === botChoice) {
            result = 'Seri!';
            outcome = 'draw';
        } else if (
            (playerChoice === 'batu' && botChoice === 'gunting') ||
            (playerChoice === 'gunting' && botChoice === 'kertas') ||
            (playerChoice === 'kertas' && botChoice === 'batu')
        ) {
            result = 'Kamu Menang!';
            outcome = 'win';
        } else {
            result = 'Bot Menang!';
            outcome = 'lose';
        }

        // Update stats
        const gamesData = this.loadGames();
        const stats = this.getPlayerStats(userId);
        
        if (outcome === 'win') stats.suitWins++;
        else if (outcome === 'lose') stats.suitLosses++;
        else stats.suitDraws++;
        
        stats.totalGamesPlayed++;
        stats.lastGame = Date.now();
        
        gamesData[userId] = stats;
        this.saveGames(gamesData);

        return {
            playerChoice,
            botChoice,
            result,
            outcome,
            stats: {
                wins: stats.suitWins,
                losses: stats.suitLosses,
                draws: stats.suitDraws
            }
        };
    }

    // Guess the Word Game
    generateWordGame() {
        const words = [
            { word: 'INDONESIA', hint: 'Negara kepulauan di Asia Tenggara' },
            { word: 'KOMPUTER', hint: 'Alat elektronik untuk menghitung dan memproses data' },
            { word: 'WHATSAPP', hint: 'Aplikasi pesan instan yang populer' },
            { word: 'PROGRAMMING', hint: 'Kegiatan membuat kode untuk komputer' },
            { word: 'JAVASCRIPT', hint: 'Bahasa pemrograman untuk web' },
            { word: 'ANDROID', hint: 'Sistem operasi mobile dari Google' },
            { word: 'YOUTUBE', hint: 'Platform berbagi video terbesar' },
            { word: 'FACEBOOK', hint: 'Media sosial biru' },
            { word: 'GOOGLE', hint: 'Mesin pencari terbesar di dunia' },
            { word: 'MINECRAFT', hint: 'Game membangun dengan balok-balok' }
        ];
        
        const selectedWord = words[Math.floor(Math.random() * words.length)];
        const hiddenWord = selectedWord.word.split('').map(char => 
            Math.random() < 0.3 ? char : '_'
        ).join(' ');
        
        return {
            word: selectedWord.word,
            hint: selectedWord.hint,
            hiddenWord: hiddenWord,
            guessesLeft: 3
        };
    }

    // Casino Slot Machine
    playCasino(userId, bet) {
        const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎'];
        const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
        const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
        const slot3 = symbols[Math.floor(Math.random() * symbols.length)];
        
        let multiplier = 0;
        let winType = '';
        
        if (slot1 === slot2 && slot2 === slot3) {
            // Triple match
            if (slot1 === '💎') {
                multiplier = 10;
                winType = 'JACKPOT! Triple Diamond!';
            } else if (slot1 === '⭐') {
                multiplier = 5;
                winType = 'Triple Star!';
            } else {
                multiplier = 3;
                winType = 'Triple Match!';
            }
        } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
            // Double match
            multiplier = 1.5;
            winType = 'Double Match!';
        } else {
            // No match
            multiplier = 0;
            winType = 'No Match';
        }
        
        const winAmount = Math.floor(bet * multiplier);
        const profit = winAmount - bet;
        
        // Update stats
        const gamesData = this.loadGames();
        const stats = this.getPlayerStats(userId);
        
        if (profit > 0) {
            stats.casinoWins++;
        } else {
            stats.casinoLosses++;
        }
        
        stats.totalGamesPlayed++;
        stats.lastGame = Date.now();
        
        gamesData[userId] = stats;
        this.saveGames(gamesData);
        
        return {
            slots: [slot1, slot2, slot3],
            winType,
            multiplier,
            bet,
            winAmount,
            profit,
            stats: {
                wins: stats.casinoWins,
                losses: stats.casinoLosses
            }
        };
    }

    // Number Guessing Game
    generateNumberGame() {
        const targetNumber = Math.floor(Math.random() * 100) + 1;
        return {
            targetNumber,
            guessesLeft: 5,
            min: 1,
            max: 100
        };
    }

    // Math Quiz Game
    generateMathQuiz() {
        const operations = ['+', '-', '*'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, answer;
        
        switch(operation) {
            case '+':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 50) + 20;
                num2 = Math.floor(Math.random() * 20) + 1;
                answer = num1 - num2;
                break;
            case '*':
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                answer = num1 * num2;
                break;
        }
        
        return {
            question: `${num1} ${operation} ${num2} = ?`,
            answer,
            timeLimit: 30000 // 30 seconds
        };
    }

    // Trivia Quiz Game
    generateTrivia() {
        const questions = [
            {
                question: "Ibu kota Indonesia adalah?",
                options: ["Jakarta", "Surabaya", "Bandung", "Medan"],
                answer: 0
            },
            {
                question: "Planet terdekat dengan matahari adalah?",
                options: ["Venus", "Mars", "Merkurius", "Bumi"],
                answer: 2
            },
            {
                question: "Bahasa pemrograman yang dibuat oleh Brendan Eich adalah?",
                options: ["Python", "JavaScript", "Java", "C++"],
                answer: 1
            },
            {
                question: "Siapa pendiri Facebook?",
                options: ["Bill Gates", "Steve Jobs", "Mark Zuckerberg", "Elon Musk"],
                answer: 2
            },
            {
                question: "1 + 1 dalam biner adalah?",
                options: ["10", "11", "01", "00"],
                answer: 0
            }
        ];
        
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        return randomQuestion;
    }

    // Daily Challenge
    generateDailyChallenge() {
        const challenges = [
            {
                type: 'streak',
                name: 'Game Streak',
                description: 'Menangkan 3 game berturut-turut',
                reward: 500,
                target: 3
            },
            {
                type: 'casino',
                name: 'Lucky Day',
                description: 'Menangkan 1000 gold dari casino',
                reward: 200,
                target: 1000
            },
            {
                type: 'trivia',
                name: 'Brain Power',
                description: 'Jawab 5 trivia dengan benar',
                reward: 300,
                target: 5
            }
        ];
        
        return challenges[Math.floor(Math.random() * challenges.length)];
    }
}

module.exports = { MiniGames };