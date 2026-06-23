const allEmojis = [
    "🍎","🍌","🍇","🍉","🍒","🍍","🥝","🍓",
    "🍋","🥥","🍑","🥭","🍐","🍊","🍈","🫐",
    "🍏","🌽","🥕","🍅","🥑","🍆","🥔","🥜",
    "🍔","🍕","🌭","🍟","🥪","🌮","🍣","🍩",
    "⚽","🏀","🏈","🎾","🎲","🎯","🎸","🎹",
    "🚗","🚕","🚙","🚌","🚓","🚑","🚒","✈️",
    "🚀","🛸","🚲","🏍️","⛵","🦁","🐶","🐱",
    "🐼","🐸","🐵","🦊","🐯","🐨","🐰","🐻"
    ];
    
    let cards = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    
    let moves = 0;
    let attempts = 0;
    let matches = 0;
    
    let seconds = 0;
    let timerInterval = null;
    let gameStarted = false;
    
    const board = document.getElementById("board");
    const movesDisplay = document.getElementById("moves");
    const attemptsDisplay = document.getElementById("attempts");
    const timerDisplay = document.getElementById("timer");
    const bestScoreDisplay = document.getElementById("bestScore");
    const message = document.getElementById("message");
    
    const difficultySelect =
    document.getElementById("difficulty");
    
    document
    .getElementById("restartBtn")
    .addEventListener("click", restartGame);
    
    difficultySelect.addEventListener(
    "change",
    restartGame
    );
    
    function shuffle(array){
    
        for(let i=array.length-1;i>0;i--){
    
            const j=Math.floor(
                Math.random()*(i+1)
            );
    
            [array[i],array[j]] =
            [array[j],array[i]];
        }
    }
    
    function startTimer(){
    
        if(gameStarted) return;
    
        gameStarted = true;
    
        timerInterval = setInterval(()=>{
    
            seconds++;
    
            const min =
            String(Math.floor(seconds/60))
            .padStart(2,"0");
    
            const sec =
            String(seconds%60)
            .padStart(2,"0");
    
            timerDisplay.textContent =
            `${min}:${sec}`;
    
        },1000);
    }
    
    function createBoard(){
    
        board.innerHTML = "";
    
        const size =
        parseInt(difficultySelect.value);
    
        board.style.gridTemplateColumns =
        `repeat(${size},1fr)`;
    
        const totalCards = size * size;
        const pairCount = totalCards / 2;
    
        cards =
        allEmojis
        .slice(0,pairCount);
    
        cards = [...cards,...cards];
    
        shuffle(cards);
    
        cards.forEach(emoji=>{
    
            const card =
            document.createElement("div");
    
            card.classList.add("card");
    
            card.dataset.emoji = emoji;
    
            card.innerHTML = `
            <div class="card-inner">
                <div class="front">❓</div>
                <div class="back">${emoji}</div>
            </div>
            `;
    
            card.addEventListener(
                "click",
                flipCard
            );
    
            board.appendChild(card);
        });
    }
    
    function flipCard(){
    
        if(lockBoard) return;
    
        if(this === firstCard) return;
    
        if(this.classList.contains("matched"))
        return;
    
        startTimer();
    
        this.classList.add("flip");
    
        if(!firstCard){
    
            firstCard = this;
            return;
        }
    
        secondCard = this;
    
        moves++;
        attempts++;
    
        movesDisplay.textContent = moves;
        attemptsDisplay.textContent =
        attempts;
    
        checkMatch();
    }
    
    function checkMatch(){
    
        const isMatch =
        firstCard.dataset.emoji ===
        secondCard.dataset.emoji;
    
        if(isMatch){
    
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
    
            matches++;
    
            resetTurn();
    
            checkVictory();
        }
        else{
    
            lockBoard = true;
    
            setTimeout(()=>{
    
                firstCard.classList.remove("flip");
                secondCard.classList.remove("flip");
    
                resetTurn();
    
            },800);
        }
    }
    
    function resetTurn(){
    
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }
    
    function checkVictory(){
    
        const size =
        parseInt(difficultySelect.value);
    
        const totalPairs =
        (size * size) / 2;
    
        if(matches !== totalPairs)
        return;
    
        clearInterval(timerInterval);
    
        message.innerHTML =
        `🎉 Bravo !<br>
        Vous avez terminé le niveau
        ${size}×${size}
        en ${moves} tentatives.`;
    
        const key =
        "flipmemory_best_" + size;
    
        const best =
        localStorage.getItem(key);
    
        if(!best || moves < best){
    
            localStorage.setItem(
                key,
                moves
            );
    
            bestScoreDisplay.textContent =
            moves;
    
            message.innerHTML +=
            "<br>🏆 Nouveau record !";
        }
    }
    
    function loadBestScore(){
    
        const size =
        difficultySelect.value;
    
        const best =
        localStorage.getItem(
            "flipmemory_best_" + size
        );
    
        bestScoreDisplay.textContent =
        best ? best : "-";
    }
    
    function restartGame(){
    
        clearInterval(timerInterval);
    
        firstCard = null;
        secondCard = null;
    
        lockBoard = false;
    
        moves = 0;
        attempts = 0;
        matches = 0;
    
        seconds = 0;
        gameStarted = false;
    
        movesDisplay.textContent = 0;
        attemptsDisplay.textContent = 0;
        timerDisplay.textContent = "00:00";
    
        message.innerHTML = "";
    
        loadBestScore();
    
        createBoard();
    }
    
    restartGame();