import Canvas from '../../utils/canvas.js';

export default class BaseObject {
  constructor({ x, y, width, height, color }) {
    this.color = color || 'white';
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 50;
    this.height = height || 50;
  }

  get sizeData() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  draw = () => {
    Canvas.context.beginPath();
    Canvas.context.fillStyle = this.color;
    Canvas.context.fillRect(this.x, this.y, this.width, this.height);
    Canvas.context.closePath();
  };
}
