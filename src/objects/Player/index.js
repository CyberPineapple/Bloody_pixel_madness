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

  gun = {
    color: 'brown',
    height: Math.round(this.height / 5),
    width: this.width,
    marginTop: Math.round(this.height / 1.5),
  };

  get isLeftDirection() {
    return this.movementDirection === 'left';
  }

  get isRightDirection() {
    return this.movementDirection === 'right';
  }

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
    if (this.isLeftDirection) {
      // draw eyes
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
      // draw gun
      Canvas.context.fillStyle = this.gun.color;
      Canvas.context.fillRect(
        this.centerX - this.gun.width,
        this.y + this.gun.marginTop,
        this.gun.width,
        this.gun.height
      );
    } else {
      // draw eyes
      Canvas.context.fillRect(this.xl, this.y + this.eyes.marginTop, this.eyes.width, this.eyes.heigth);
      Canvas.context.fillRect(this.centerX, this.y + this.eyes.marginTop, this.eyes.width, this.eyes.heigth);
      // draw gun
      Canvas.context.fillStyle = this.gun.color;
      Canvas.context.fillRect(this.centerX, this.y + this.gun.marginTop, this.gun.width, this.gun.height);
    }
    Canvas.context.closePath();
  }
}
