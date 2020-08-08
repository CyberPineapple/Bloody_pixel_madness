import Canvas from '../../utils/canvas.js';
import BaseObject from '../BaseObject/index';

export default class Cursor extends BaseObject {
  constructor({ x, y, color = 'green' }) {
    const width = 5;
    const height = 5;
    super({ x, y, width, height, color });
  }

  move = ({ x, y }) => {
    this.x = x;
    this.y = y;
  };
}
