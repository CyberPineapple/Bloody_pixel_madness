import ctx from '../utils/canvas.js';
import mapObjects from '../map/index.js';

export default class Player {
  constructor({ x, y, color }) {
    (this.x = x || 50),
      (this.y = y || 50),
      (this.dx = 10),
      (this.height = 30),
      (this.width = 30),
      (this.color = color || 'white'),
      (this.dy = 10);
    this.jumping = false;
    this.frameCounter = 0;
    this.jumpHeight = 12;
  }

  draw = () => {
    if (this.jumping) {
      if (this.frameCounter % this.jumpHeight === 0) this.stopJumping();
      this.frameCounter++;
      this.y -= this.dy;
    }

    this.gravityPhysics();
    this.collision();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();
  };

  stopJumping = () => {
    this.jumping = false;
    this.frameCounter = 0;
  };

  runLeft = () => (this.x -= this.dx);

  runRight = () => (this.x += this.dx);

  jump = () => {
    if (!this.jumping && this.collision.y) this.jumping = true;
  };

  gravityPhysics = () => {
    if (!this.jumping) {
      this.y += this.dy;
    }
  };

  collision = () => {
    this.collision.y = false;
    this.collision.x = false;
    mapObjects.forEach((platform) => {
      this.platformCollision(platform.params);
    });
  };

  platformCollision = (platform) => {
    const playerHorizontalSize = this.x + this.width;
    const playerVerticalSize = this.y + this.height;

    if (this.collision.x && this.collision.y) return;

    if (!this.collision.y && playerHorizontalSize > platform.x && playerHorizontalSize < platform.x + platform.width) {
      // if (this.y + this.height >= platform.y && this.y < platform.y + platform.height) {
      if (this.y + this.height > platform.y && this.y < platform.y) {
        this.y = platform.y - this.height;
        this.collision.y = true;
        return;
      }

      if (this.y < platform.y + platform.height && this.y > platform.y) {
        this.y = platform.y + platform.height;
        this.collision.y = true;
        return;
      }
    }

    if (this.collision.y && playerVerticalSize > platform.y && playerVerticalSize < platform.y + platform.height) {
      if (this.x + this.width > platform.x && this.x < platform.x) {
        this.x = platform.x - this.width;
        this.collision.x = true;
        return;
      }

      if (this.x < platform.x + platform.width && this.x > platform.x) {
        this.x = platform.x + platform.width;
        this.collision.x = true;
        return;
      }
    }
  };
}
