const audioBtn = document.querySelector('.audio-btn');
const audio = document.getElementById('voice-audio');

audioBtn.addEventListener('click', () => {
    audio.play();
});


const container = document.getElementById('puzzle-container');
const pieces = Array.from(container.children);

// массив текущих позиций блоков (0..8), 8 — пустой
let positions = [...Array(9).keys()];

// соседние индексы пустой ячейки
function getNeighbors(idx) {
    const neighbors = [];
    const row = Math.floor(idx / 3);
    const col = idx % 3;

    if (row > 0) neighbors.push(idx - 3);
    if (row < 2) neighbors.push(idx + 3);
    if (col > 0) neighbors.push(idx - 1);
    if (col < 2) neighbors.push(idx + 1);

    return neighbors;
}

// обновление отображения
function render() {
    positions.forEach((pos, i) => {
        pieces[pos].style.order = i;
    });
}

// обработка клика
container.addEventListener('click', e => {
    const clickedPiece = e.target.closest('.puzzle-piece');
    if (!clickedPiece || clickedPiece.classList.contains('empty')) return;

    const clickedIdx = pieces.indexOf(clickedPiece);
    const emptyIdx = positions.indexOf(8);
    const posClicked = positions.indexOf(clickedIdx);

    if (getNeighbors(emptyIdx).includes(posClicked)) {
        [positions[emptyIdx], positions[posClicked]] =
        [positions[posClicked], positions[emptyIdx]];

        render();
        checkSolved();
    }
});

// проверка сборки
function checkSolved() {
    if (positions.every((val, i) => val === i)) {
        const popup = document.getElementById('puzzle-popup');
        const overlay = document.getElementById('popup-overlay');
        if (popup && overlay) {
            popup.style.display = 'block';
            overlay.style.display = 'block';
        }
    }
}

// перемешивание
function shuffle() {
    for (let i = 0; i < 50; i++) {
        const emptyIdx = positions.indexOf(8);
        const neighbors = getNeighbors(emptyIdx);
        const swapIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
        
        [positions[emptyIdx], positions[swapIdx]] =
        [positions[swapIdx], positions[emptyIdx]];
    }
    render();
}

// решение пазла
function solvePuzzle() {
    positions.sort((a, b) => a - b);
    render();
    checkSolved(); // Проверяем, не собрался ли пазл после решения
}

// старт
shuffle();

// Кнопка решения пазла
const solveBtn = document.getElementById("solve-btn");
if (solveBtn) {
    solveBtn.addEventListener("click", () => {
        solvePuzzle();
    });
}

const shuffleBtn = document.getElementById("shuffle-btn");
if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
        shuffle();
    });
}

// Кнопка закрытия попапа
const nextSlideBtn = document.getElementById("next-slide-btn");
if (nextSlideBtn) {
    nextSlideBtn.addEventListener("click", () => {
        const popup = document.getElementById('puzzle-popup');
        const overlay = document.getElementById('popup-overlay');
        if (popup && overlay) {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }
    });
}
