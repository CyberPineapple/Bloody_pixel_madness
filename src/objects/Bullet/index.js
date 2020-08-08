import Canvas from '../../utils/canvas.js';
import { mapObjects, removeBullet } from '../../map/index.js';
import { isStaticIntersect } from '../../utils/collision';

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

  state = {
    bounce: 0,
  };

  params = {
    speed: 1,
    color: 'red',
    maxBounceCount: 3,
  };

  draw = () => {
    this.move();
    this.checkCollision();
    Canvas.context.beginPath();
    Canvas.context.fillStyle = this.params.color;
    Canvas.context.fillRect(this.x, this.y, this.width, this.height);
    Canvas.context.closePath();
  };

  move = () => {
    this.x += this.dy / 2;
    this.y += this.dx / 2;
  };

  checkCollision = () => {
    mapObjects.forEach((platform) => {
      this.collision(platform.sizeData);
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
        if (this.state.bounce < this.params.maxBounceCount) {
          this.dx = -this.dx;
          this.dy = -this.dy;
          this.state.bounce += 1;
        } else {
          removeBullet(this.id);
        }
      }
    }
  };
}
