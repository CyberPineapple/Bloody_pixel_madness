import { isStaticIntersect } from '../../utils/collision';
import BaseObject from '../BaseObject/index.js';

export default class Bullet extends BaseObject {
  constructor({ x, y, id }) {
    const width = 5;
    const height = 5;
    const color = 'red';

    super({ x, y, width, height, color });
    if (id) this.id = id;
  }

  move = ({ x, y }) => {
    this.x = x;
    this.y = y;
  };
}
