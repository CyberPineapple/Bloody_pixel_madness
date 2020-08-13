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
    GameStore.addBullet({
      x: this.x + this.getDirectionOffset,
      y: this.y,
      target,
    });

    this.state.isMayUse = false;
    setTimeout(() => {
      this.state.isMayUse = true;
    }, 100);
  };
}
