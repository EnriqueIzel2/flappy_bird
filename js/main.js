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

const barreiras = new Barriers(700, 1100, 300, 400);
const area = document.querySelector("[wm-flappy]");
barreiras.pairs.forEach((pair) => area.appendChild(pair.element));

setInterval(() => barreiras.animate(), 20);
