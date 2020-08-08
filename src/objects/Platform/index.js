import BaseObject from '../BaseObject/index';

export default class Platform extends BaseObject {
  constructor({ x, y, height, width, color = 'green' }) {
    super({ x, y, width, height, color });
  }
}
