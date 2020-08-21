import BaseObject from '../BaseObject/index';
import Gun from '../Gun/index';
import Canvas from '../../utils/canvas.js';
import Socket from '../../utils/websocket.js';
import PlayerAnimation from './animations/index.js';

export default class Player extends BaseObject {
  constructor({ x, y, id, color = 'orange' }) {
    const width = 20;
    const height = 40;
    super({ x, y, width, height, color });

    if (id) this.id = id;

    this.movementDirection = 'right';
    this.HP = 100;
    this.isPlayer = true;

    this.animations = new PlayerAnimation(() => this.sizeData);

    this.currentAnimation = 'stay';
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

  get HPLineLength() {
    return (this.HP * this.width) / 100;
  }

  setData = ({ x, y, direction, animation }) => {
    this.y = y;
    this.x = x;
    this.currentAnimation = animation;
    this.movementDirection = direction;
  };

  draw() {
    // super.draw();

    // draw hp indicator
    Canvas.context.beginPath();
    Canvas.context.fillStyle = 'red';
    Canvas.context.fillRect(this.x, this.y - 5, this.HPLineLength, 2);
    Canvas.context.closePath();

    this.animations[this.currentAnimation](); // draw player animation

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
    if (Socket.isConnected && this.id) Socket.sendPlayerDeath({ playerID: this.id });
  };

  addDamage = (damage) => {
    if (this.HP <= 0) {
      this.death();
    } else {
      this.HP -= damage;
      if (Socket.isConnected && this.id) Socket.sendPlayerAddDamage({ targetPlayerID: this.id, damage });
    }
  };
}
