import ctx from '../utils/canvas.js';
import { mapObjects, removeBullet } from '../map/index.js';
import { isStaticIntersect } from '../utils/collision';
import { gravity } from '../configs/index.js';

let bulletCounter = 0;

export default class Bullet {
  constructor({ x, y, target }) {
    (this.x = x), (this.y = y), (this.height = 5), (this.width = 5);
    this.id = bulletCounter++;
    this.dx = (target.y - this.y) / this.width;
    this.dy = (target.x - this.x) / this.height;
  }

  get bulletData() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  params = {
    speed: 1,
    color: 'red',
  };

  draw = () => {
    this.move();
    this.checkCollision();
    ctx.beginPath();
    ctx.fillStyle = this.params.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();
  };

  move = () => {
    this.x += this.dy / 2;
    this.y += this.dx / 2;
  };

  checkCollision = () => {
    mapObjects.forEach((platform) => {
      this.collision(platform.params);
    });
  };

  collision = (platform) => {
    if (isStaticIntersect(this.bulletData, platform)) {
      if (
        this.x > platform.x &&
        this.x + this.width < platform.x + platform.width &&
        this.y > platform.y &&
        this.y + this.height < platform.y + platform.height
      ) {
        removeBullet(this.id);
        return;
      }
    }
  };
}
