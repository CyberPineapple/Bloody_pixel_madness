import BaseObject from '../BaseObject/index';
import Gun from '../Gun/index';
import Canvas from '../../utils/canvas.js';

export default class Player extends BaseObject {
  constructor({ x, y, id, color = 'orange' }) {
    const width = 20;
    const height = 20;
    super({ x, y, width, height, color });

    if (id) this.id = id;

    this.movementDirection = 'right';
    this.HP = 100;
  }

  inventory = {
    gun: new Gun({ x: this.x, y: this.y, direction: this.movementDirection }),
  };

  eyes = {
    color: 'white',
    marginTop: Math.round(this.height / 10),
    heigth: Math.round(this.height / 3),
    width: Math.round(this.width / 10),
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

    // draw hp indicator
    Canvas.context.beginPath();
    Canvas.context.fillStyle = 'red';
    Canvas.context.fillRect(this.x, this.y - 5, this.HP * 0.2, 2);
    Canvas.context.closePath();

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
    } else {
      // draw eyes
      Canvas.context.fillRect(this.xl, this.y + this.eyes.marginTop, this.eyes.width, this.eyes.heigth);
      Canvas.context.fillRect(this.centerX, this.y + this.eyes.marginTop, this.eyes.width, this.eyes.heigth);
    }
    Canvas.context.closePath();

    for (let key in this.inventory) {
      this.inventory[key].move({
        x: this.x,
        y: this.y,
        direction: this.movementDirection,
      });
      this.inventory[key].draw();
    }
  }

  death = () => {
    this.color = 'red';
  };

  addDamage = (damage) => {
    this.HP -= damage;
    if (this.HP <= 0) this.death();
  };
}
