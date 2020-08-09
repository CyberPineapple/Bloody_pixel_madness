import BaseObject from '../BaseObject/index';
import Canvas from '../../utils/canvas.js';

export default class Player extends BaseObject {
  constructor({ x, y, id, color = 'orange' }) {
    const width = 20;
    const height = 20;
    super({ x, y, width, height, color });

    if (id) this.id = id;

    this.movementDirection = 'right';
  }

  eyes = {
    color: 'white',
    marginTop: Math.round(this.height / 10),
    heigth: Math.round(this.height / 3),
    width: Math.round(this.width / 10),
  };

  move = ({ x, y }) => {
    this.y = y;
    if (this.x === x) return;
    this.movementDirection = this.x > x ? 'left' : 'right';
    this.x = x;
  };

  draw() {
    super.draw();

    Canvas.context.beginPath();
    Canvas.context.fillStyle = this.eyes.color;
    if (this.movementDirection === 'left') {
      Canvas.context.fillRect(
        this.x - this.eyes.width,
        this.y + this.eyes.marginTop,
        this.eyes.width,
        this.eyes.heigth
      );
      Canvas.context.fillRect(
        this.centerX - this.eyes.width,
        this.y + this.eyes.marginTop,
        this.eyes.width,
        this.eyes.heigth
      );
    } else {
      Canvas.context.fillRect(this.xl, this.y + this.eyes.marginTop, this.eyes.width, this.eyes.heigth);
      Canvas.context.fillRect(this.centerX, this.y + this.eyes.marginTop, this.eyes.width, this.eyes.heigth);
    }
    Canvas.context.closePath();
  }
}
