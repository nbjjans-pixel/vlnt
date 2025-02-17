function addFloatingHearts() {
    const card = document.querySelector(".card");
    const cardRect = card.getBoundingClientRect();
    const numHearts = 10; // Number of floating hearts

    for (let i = 0; i < numHearts; i++) {
        // Create a heart element
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "❤️";

        const offsetX = Math.random() * (window.innerWidth - cardRect.width);
        const offsetY = Math.random() * (window.innerHeight - cardRect.height);

        heart.style.left = `${offsetX}px`;
        heart.style.top = `${offsetY}px`;


        heart.style.animationDelay = `${Math.random() * 3}s`;
        heart.style.animationDuration = `${Math.random() * 3 + 4}s`;

        document.body.appendChild(heart);
    }
}

// Call this function to start floating hearts when the card is opened
function openCard() {
    let card = document.querySelector(".card");
    card.style.transform = "rotateY(180deg)";

    setTimeout(() => {
        document.querySelector(".front").style.display = "none";
        document.querySelector(".inside").style.display = "flex";

        // Start the background music when the card is opened
        const music = document.getElementById('backgroundMusic');
        music.play();

        addFloatingHearts();
    }, 300);
}

function showSurprise(event) {
    event.stopPropagation();
    let surprise = document.getElementById("surprise");
    surprise.innerHTML = '<img src="img/weeee.jpg" alt="Surprise Image" style="max-width: 100%; border-radius: 10px;">';
    surprise.style.display = "block";

    setTimeout(() => {
        document.getElementById("playButton").style.display = "block";
    }, 1000);
}

const pictures = [
    "img/1.jpeg",
    "img/2.jpeg",
    "img/3.jpeg",
    "img/4.jpeg",
    "img/5.jpeg",
    "img/6.jpeg",
    "img/7.jpeg",
    "img/8.jpeg",
    "img/9.jpeg",
    "img/10.jpg",
    "img/11.jpg",
];

let currentPictureIndex = 0;

function showNextPicture(container) {
    currentPictureIndex = (currentPictureIndex + 1) % pictures.length;
    container.innerHTML = `
        <div class="slideshow" style="text-align: center; padding-top: 20vh;">
            <img src="${pictures[currentPictureIndex]}" 
                 alt="Memory ${currentPictureIndex + 1}" 
                 style="max-width: 80%; max-height: 70vh; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
            <p style="margin-top: 20px; font-size: 20px; color: #333;">
                Click anywhere to see the next picture ❤️
            </p>
        </div>
    `;
}

function startSlideshow(container) {
    container.innerHTML = `
        <div class="slideshow" style="text-align: center; padding-top: 20vh;">
            <h1>Our Special Memories 💝</h1>
            <img src="${pictures[0]}" 
                 alt="Memory 1" 
                 style="max-width: 80%; max-height: 70vh; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
            <p style="margin-top: 20px; font-size: 20px; color: #333;">
                Click anywhere to see the next picture ❤️
            </p>
        </div>
    `;

    container.style.cursor = "pointer";
    container.onclick = () => showNextPicture(container);
}

function startGame(event) {
    event.stopPropagation();
    document.querySelector(".card").style.display = "none";
    const gameContainer = document.getElementById("gameContainer");
    gameContainer.style.display = "block";

    const player = document.getElementById("player");
    let heartCount = 0;
    let hearts = [];

    player.style.left = "50%";
    player.style.top = "50%";

    for (let i = 0; i < 5; i++) {
        createHeart();
    }

    document.addEventListener("keydown", movePlayer);

    function movePlayer(e) {
        const currentLeft = parseFloat(player.style.left);
        const currentTop = parseFloat(player.style.top);
        const step = 20;

        switch(e.key) {
            case "ArrowLeft":
                player.style.left = Math.max(0, currentLeft - step) + "px";
                break;
            case "ArrowRight":
                player.style.left = Math.min(window.innerWidth - 50, currentLeft + step) + "px";
                break;
            case "ArrowUp":
                player.style.top = Math.max(0, currentTop - step) + "px";
                break;
            case "ArrowDown":
                player.style.top = Math.min(window.innerHeight - 50, currentTop + step) + "px";
                break;
        }

        checkCollisions();
    }

    function createHeart() {
        const heart = document.createElement("div");
        heart.className = "heart";
        heart.innerHTML = "❤️";
        heart.style.left = Math.random() * (window.innerWidth - 50) + "px";
        heart.style.top = Math.random() * (window.innerHeight - 50) + "px";
        gameContainer.appendChild(heart);
        hearts.push(heart);
    }

    function checkCollisions() {
        const playerRect = player.getBoundingClientRect();

        hearts.forEach((heart, index) => {
            const heartRect = heart.getBoundingClientRect();

            if (isColliding(playerRect, heartRect)) {
                heart.remove();
                hearts.splice(index, 1);
                heartCount++;
                document.getElementById("heartCount").textContent = heartCount;

                if (heartCount >= 5) {
                    gameWon();
                }
            }
        });
    }

    function isColliding(rect1, rect2) {
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

    function gameWon() {
        gameContainer.innerHTML = `
            <div style="text-align: center; padding-top: 40vh; font-size: 24px;">
                <h1>You Won! 💖</h1>
                <p>You collected all the hearts!</p>
                <button onclick="startSlideshow(gameContainer)" 
                        style="padding: 10px 20px; font-size: 18px; margin-top: 20px;">
                    Show Pictures
                </button>
            </div>
        `;
    }
}