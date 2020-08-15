import BaseObject from '../BaseObject/index';
import GameStore from '../../store/index.js';

export default class Gun extends BaseObject {
  constructor({ x, y, direction }) {
    const color = 'brown';
    const height = 5;
    const width = 20;
    super({ x, y, height, width, color });

    this.direction = direction || 'right';
    this.dy = 10;
    this.dx = this.width / 2;
  }

  state = {
    isMayUse: true,
  };

  params = {
    speed: 100,
    defaultSpeed: 100,
  };

  get getDirectionOffset() {
    return this.direction === 'left' ? -this.dx : this.dx;
  }

  move = ({ x, y, direction }) => {
    if (direction) this.direction = direction;

    this.x = x + this.getDirectionOffset;
    this.y = y + this.dy;
  };

  use = (target) => {
    if (!this.state.isMayUse) return;
    this.fire(target);

    this.state.isMayUse = false;
    setTimeout(() => {
      this.state.isMayUse = true;
    }, this.params.speed);
  };

  fire = (target) => {
    GameStore.addBullet({
      x: this.centerX + this.getDirectionOffset,
      y: this.y,
      target,
    });
  };
}
