import { mapObjects, removeBullet } from '../../map/index.js';
import { isStaticIntersect } from '../../utils/collision';
import BaseObject from '../BaseObject/index.js';

export default class Bullet extends BaseObject {
  constructor({ x, y, target }) {
    const width = 5;
    const height = 5;
    const color = 'red';

    super({ x, y, width, height, color });
  }
}
