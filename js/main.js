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

function Barriers(height, gap, posX) {
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

const b = new Barriers(700, 300, 400);
document.querySelector("[wm-flappy]").appendChild(b.element);

// const b = new Barrier(true);
// b.setHeight(200);
// document.querySelector("[wm-flappy]").appendChild(b.element);
