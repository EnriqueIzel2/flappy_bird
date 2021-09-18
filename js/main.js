function newElement(tagName, className) {
  const elem = document.createElement(tagName);
  elem.className = className;
  return elem;
}

function Barrier(reverse = false) {
  this.element = newElement("div", "barrier");

  const border = newElement("div", "border");
  const shape = newElement("div", "shape");
  this.element.appendChild(reverse ? shape : border);
  this.element.appendChild(reverse ? border : shape);

  this.setHeight = (height) => (shape.style.height = `${height}px`);
}

function PairBarriers(height, gap, posX) {
  this.element = newElement("div", "barriers");

  this.upper = new Barrier(true);
  this.lower = new Barrier(false);

  this.element.appendChild(this.upper.element);
  this.element.appendChild(this.lower.element);

  this.drawGap = () => {
    const upperHeight = Math.random() * (height - gap);
    const lowerHeight = height - gap - upperHeight;
    this.upper.setHeight(upperHeight);
    this.lower.setHeight(lowerHeight);
  };

  this.getPosX = () => parseInt(this.element.style.left.split("px")[0]);
  this.setPosX = (posX) => (this.element.style.left = `${posX}px`);
  this.getWidth = () => this.element.clientWidth;

  this.drawGap();
  this.setPosX(posX);
}

function Barriers(height, width, gap, space, posCenter) {
  this.pairs = [
    new PairBarriers(height, gap, width),
    new PairBarriers(height, gap, width + space),
    new PairBarriers(height, gap, width + space * 2),
    new PairBarriers(height, gap, width + space * 3),
  ];

  const displacement = 3;

  this.animate = () => {
    this.pairs.forEach((pair) => {
      pair.setPosX(pair.getPosX() - displacement);

      if (pair.getPosX() < -pair.getWidth()) {
        pair.setPosX(pair.getPosX() + space * this.pairs.length);
        pair.drawGap();
      }

      const middle = width / 2;
      const crossedMiddle =
        pair.getPosX() + displacement >= middle && pair.getPosX() < middle;

      crossedMiddle && posCenter();
    });
  };
}

function Bird(heightGame) {
  let isFlapping = false;

  this.element = newElement("img", "bird");
  this.element.src = "../assets/passaro.png";

  this.getPosY = () => parseInt(this.element.style.bottom.split("px")[0]);
  this.setPosY = (posY) => (this.element.style.bottom = `${posY}px`);

  window.onkeydown = (e) => (isFlapping = true);
  window.onkeyup = (e) => (isFlapping = false);

  this.animate = () => {
    const newPosY = this.getPosY() + (isFlapping ? 8 : -5);
    const maxHeight = heightGame - this.element.clientHeight;

    if (newPosY <= 0) {
      this.setPosY(0);
    } else if (newPosY >= maxHeight) {
      this.setPosY(maxHeight);
    } else {
      this.setPosY(newPosY);
    }
  };

  this.setPosY(heightGame / 2);
}

function Score() {
  this.element = newElement("span", "score");
  this.updateScore = (score) => (this.element.innerHTML = score);
  this.updateScore(0);
}

function isOverlapped(elementA, elementB) {
  const a = elementA.getBoundingClientRect();
  const b = elementB.getBoundingClientRect();

  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
  const vetical = a.top + a.height >= b.top && b.top + b.height >= a.top;

  return horizontal && vetical;
}

function crashed(bird, barriers) {
  let crashed = false;

  barriers.pairs.forEach((pair) => {
    if (!crashed) {
      const top = pair.upper.element;
      const bottom = pair.lower.element;

      crashed =
        isOverlapped(bird.element, top) || isOverlapped(bird.element, bottom);
    }
  });

  return crashed;
}

function Game() {
  let scoreCount = 0;

  const gameArea = document.querySelector("[wm-flappy]");
  const heightGame = gameArea.clientHeight;
  const widthGame = gameArea.clientWidth;

  const score = new Score();
  const barriers = new Barriers(heightGame, widthGame, 200, 400, () => {
    score.updateScore(++scoreCount);
  });
  const bird = new Bird(heightGame);

  gameArea.appendChild(score.element);
  gameArea.appendChild(bird.element);
  barriers.pairs.forEach((pair) => gameArea.appendChild(pair.element));

  this.start = () => {
    const timer = setInterval(() => {
      barriers.animate();
      bird.animate();

      if (crashed(bird, barriers)) {
        clearInterval(timer);
      }
    }, 20);
  };
}

new Game().start();
