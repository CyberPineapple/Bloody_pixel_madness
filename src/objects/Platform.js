import ctx from '../utils/canvas.js';

export default class Platform {
  constructor({ x, y, height, width, color }) {
    this.params = {
      x,
      y,
      height,
      width,
      color: color || 'blue',
    };
  }

  draw = () => {
    ctx.beginPath();
    ctx.fillStyle = this.params.color;
    ctx.fillRect(this.params.x, this.params.y, this.params.width, this.params.height);
    ctx.closePath();
  };
}
