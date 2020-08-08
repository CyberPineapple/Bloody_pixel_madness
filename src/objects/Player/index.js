import Canvas from '../../utils/canvas.js';
import BaseObject from '../BaseObject/index';

export default class Player extends BaseObject {
  constructor({ x, y, id, color = 'white' }) {
    const width = 20;
    const height = 20;
    super({ x, y, width, height, color });

    if (id) this.id = id;
  }

  move = ({ x, y }) => {
    this.x = x;
    this.y = y;
  };
}
