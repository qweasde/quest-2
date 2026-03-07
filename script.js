// Крестики-нолики
const cells = document.querySelectorAll(".cell");
const winMessage = document.getElementById("win-message");
let moves = 0;
let gameSolved = false;

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    if (cell.textContent !== "") return;

    // Игрок ставит ❤️
    cell.textContent = "❤️";
    moves++;

    // Проверяем победу ❤️
    if (checkWin("❤️")) {
      winMessage.style.color = "#000000";
      gameSolved = true;

      return;
    }

    // AI ставит ❌, но так, чтобы ❤️ могла выиграть
    setTimeout(aiMove, 300);
  });
});

function aiMove() {
  const empty = Array.from(cells).filter(c => c.textContent === "");
  if (empty.length === 0) return;

  const cell = empty[Math.floor(Math.random() * empty.length)];
  cell.textContent = "❌";

  // Если крестики выиграли, убираем ❌, чтобы ❤️ могла победить
  if (checkWin("❌")) {
    cell.textContent = "";
  }
}

// Проверка победы
function checkWin(player) {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  return winCombos.some(combo => 
    combo.every(idx => cells[idx].textContent === player)
  );
}

// Конец крестики-нолики

// Поп-ап

const words = document.querySelectorAll('.word-popup');
const popup = document.getElementById('text-popup');
const popupImg = document.getElementById('popup-img');
const popupVideo = document.getElementById('popup-video');

words.forEach(word => {
    word.addEventListener('mouseenter', () => {
        const imgSrc = word.dataset.img;
        const videoSrc = word.dataset.video;

        if (videoSrc) {
            popupVideo.src = videoSrc;
            popupVideo.style.display = 'block';
            popupVideo.play();

            popupImg.style.display = 'none';
            popupImg.src = '';
        } else if (imgSrc) {
            popupImg.src = imgSrc;
            popupImg.style.display = 'block';

            popupVideo.style.display = 'none';
            popupVideo.pause();
            popupVideo.src = '';
        }

        const rect = word.getBoundingClientRect();
        popup.style.top = rect.bottom + window.scrollY + 5 + 'px';
        popup.style.left = rect.left + window.scrollX + 'px';
        popup.style.display = 'block';
    });

    word.addEventListener('mouseleave', () => {
        popup.style.display = 'none';
        popupImg.style.display = 'none';
        popupVideo.style.display = 'none';
        popupVideo.pause();
        popupVideo.src = '';
    });
});

// Конец поп-ап


// Слайдер -------------------

const slides = document.querySelectorAll(".slide");
let index = 0;
let locked = false;

function scrollToSlide(i) {
  locked = true;
  slides[i].scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    locked = false;
  }, 800);
}

function onPuzzleSolved() {
    puzzleSolved = true; // теперь можно скроллить

    // показать popup
    const popup = document.getElementById('puzzle-popup');
    popup.classList.add('show');

    // кнопка "Дальше"
    const nextBtn = document.getElementById('next-slide-btn');
    nextBtn.addEventListener('click', () => {
        popup.classList.remove('show'); // скрываем popup
        if (index < slides.length - 1) {
            index++;
            scrollToSlide(index); // автоскролл на следующий слайд
        }
    }, { once: true }); // обработчик срабатывает только один раз
}

const container = document.getElementById('puzzle-container');
const pieces = Array.from(container.children);

// массив текущих позиций блоков (0..8), 8 — пустой
let positions = [...Array(9).keys()];

// соседние индексы пустой ячейки
function getNeighbors(idx) {
    const neighbors = [];
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    if (row > 0) neighbors.push(idx - 3); // сверху
    if (row < 2) neighbors.push(idx + 3); // снизу
    if (col > 0) neighbors.push(idx - 1); // слева
    if (col < 2) neighbors.push(idx + 1); // справа
    return neighbors;
}

// обновление отображения через порядок grid
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
    const emptyIdx = positions.indexOf(8);        // пустой блок
    const posClicked = positions.indexOf(clickedIdx);

    if (getNeighbors(emptyIdx).includes(posClicked)) {
        // меняем местами кликнутый и пустой блок
        [positions[emptyIdx], positions[posClicked]] = [positions[posClicked], positions[emptyIdx]];
        render();
        checkSolved();
    }
});

const puzzleSlide = document.getElementById("slide-3");
const gameSlide = document.getElementById("slide-4");

const puzzleIndex = Array.from(slides).indexOf(puzzleSlide);
const gameIndex = Array.from(slides).indexOf(gameSlide);
let puzzleSolved = false; // флаг, собран ли пазл

window.addEventListener("wheel", (e) => {
  e.preventDefault();

  if (locked) return;

  // 🔒 Блок 3 слайда (пазл)
  if (index === puzzleIndex && !puzzleSolved) return;

  // 🔒 Блок 4 слайда (крестики)
  if (index === gameIndex && !gameSolved) return;

  if (e.deltaY > 0 && index < slides.length - 1) {
    index++;
    scrollToSlide(index);
  } else if (e.deltaY < 0 && index > 0) {
    index--;
    scrollToSlide(index);
  }

}, { passive: false });

// в функции checkSolved() пазла
function checkSolved() {
    if (positions.every((val, i) => val === i)) {
        onPuzzleSolved(); // вызываем разблокировку скролла и автоскролл
    }
}

// перемешивание пазла
function shuffle() {
    for (let i = 0; i < 50; i++) {
        const emptyIdx = positions.indexOf(8);
        const neighbors = getNeighbors(emptyIdx);
        const swapIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
        [positions[emptyIdx], positions[swapIdx]] = [positions[swapIdx], positions[emptyIdx]];
    }
    render();
}

// старт
shuffle();

const solveBtn = document.getElementById("solve-btn");

function solvePuzzle() {
    // positions — массив текущих позиций блоков
    // просто сортируем по порядку: 0..8
    positions.sort((a, b) => a - b);
    render();

    // вызываем функцию победы
    onPuzzleSolved();
}



solveBtn.addEventListener("click", () => {
    solvePuzzle();
});


// Музыка --------------
document.getElementById("bg-audio").style.display = "none";

const audio = document.getElementById('bg-audio');
const playPauseBtn = document.getElementById('playPause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const trackName = document.getElementById('trackName');
const volumeSlider = document.getElementById('volume');
const readyBtn = document.getElementById("ready-btn");

const tracks = [
  { src: "music/mus.mp3", name: "Неужели это все любовь" },
  { src: "music/mus2.mp3", name: "Космос" },
  { src: "music/mus3.mp3", name: "Созвездие ангела" },
  { src: "music/mus4.mp3", name: "Приходи ко мне во снах" }
];

let currentTrack = 0;

audio.volume = 0.2;

function loadTrack(index) {
  audio.src = tracks[index].src;
  trackName.textContent = tracks[index].name;
}

function updateButtonState() {
  if (audio.paused) {
    playPauseBtn.classList.remove("playing");
  } else {
    playPauseBtn.classList.add("playing");
  }
}

audio.addEventListener("ended", () => {
  currentTrack = (currentTrack + 1) % tracks.length; // следующий трек
  loadTrack(currentTrack);
  audio.play().catch(e => console.log("Ошибка автопроигрывания:", e));
});

// Play / Pause
playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

// Prev
prevBtn.addEventListener('click', () => {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
  audio.play();
});

// Next
nextBtn.addEventListener('click', () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  audio.play();
});

// Volume
volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});

audio.addEventListener('play', updateButtonState);
audio.addEventListener('pause', updateButtonState);

loadTrack(currentTrack);

// Автовоспроизведение через 7 секунд после первого клика пользователя
readyBtn.addEventListener("click", () => {
    // Включаем музыку
    audio.play().catch(e => console.log("Музыка не включилась:", e));

    // Прокручиваем страницу вниз на высоту окна
    window.scrollBy({
        top: window.innerHeight,
        left: 0,
        behavior: 'smooth'
    });
});

// Конец музыка

const typeBlocks = document.querySelectorAll(".typewriter");

function prepareElement(element) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push({
      node: walker.currentNode,
      text: walker.currentNode.textContent
    });
    walker.currentNode.textContent = "";
  }

  return textNodes;
}

function typeNodes(textNodes, speed = 10) {
  return new Promise(resolve => {

    let nodeIndex = 0;

    function typeNextNode() {
      if (nodeIndex >= textNodes.length) {
        resolve(); // закончили весь блок
        return;
      }

      const { node, text } = textNodes[nodeIndex];
      let charIndex = 0;

      function typeChar() {
        if (charIndex < text.length) {
          node.textContent += text[charIndex];
          charIndex++;
          setTimeout(typeChar, speed);
        } else {
          nodeIndex++;
          typeNextNode();
        }
      }

      typeChar();
    }

    typeNextNode();
  });
}

async function typeSlideSequentially(slide) {
  const blocks = slide.querySelectorAll(".typewriter");

  for (const block of blocks) {

    if (block.dataset.typed) continue;

    block.dataset.typed = "true";
    block.style.visibility = "visible";

    const prepared = prepareElement(block);
    await typeNodes(prepared); // ЖДЁМ завершения перед следующим
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      typeSlideSequentially(entry.target);
    }
  });
}, { threshold: 0.6 });

slides.forEach(slide => observer.observe(slide));

const letter = document.getElementById("letter");
const envelope = document.getElementById("envelope");
const qr = document.getElementById("qr-container");
const paper = document.querySelector(".paper");
const qrText = qr.querySelector(".qr-text");

letter.addEventListener("click", () => {

    envelope.classList.add("open");

    // Ждём анимацию открытия
    setTimeout(() => {
        letter.classList.add("hide");
    }, 1000);

    setTimeout(() => {
        envelope.appendChild(paper);
    }, 400);

    // Показываем QR
    setTimeout(() => {
        qr.style.display = "block";               // картинка QR
         
        if(qrText) qrText.classList.add("show"); // добавляем класс show
        qr.classList.add("show");  // анимация opacity для контейнера
    }, 1300);

});
