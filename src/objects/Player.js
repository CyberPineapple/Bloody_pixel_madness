import ctx from '../utils/canvas.js';
import mapObjects from '../map/index.js';
import { isStaticIntersect } from '../utils/collision';
import { gravity } from '../configs/index.js';

export default class Player {
  constructor({ x, y, color }) {
    (this.x = x || 50), (this.y = y || 50), (this.height = 20), (this.width = 20);

    if (color) this.params.color = color;

    this.frameCounter = 0;

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  params = {
    jumpHeight: 10,
    speed: 5,
    color: 'white',
  };

  state = {
    jumping: false,
  };

  keyboardKeys = {};

  get playerData() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  handleKeyDown = ({ code }) => (this.keyboardKeys[code] = true);
  handleKeyUp = ({ code }) => (this.keyboardKeys[code] = false);
  clearMove = () => {
    this.dx = 0;
    this.dy = 0;
  };

  draw = () => {
    this.clearMove();
    this.gravityPhysics();

    if (this.keyboardKeys.KeyA) this.runLeft();
    if (this.keyboardKeys.KeyD) this.runRight();
    if (this.keyboardKeys.KeyW) this.jump();
    this.jumpInProgress();
    this.checkCollision();
    this.move();
    ctx.beginPath();
    ctx.fillStyle = this.params.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();
  };

  runLeft = () => (this.dx = -this.params.speed);
  runRight = () => (this.dx = this.params.speed);

  move = () => {
    this.x += this.dx;
    this.y += this.dy;
  };

  jump = () => {
    if (this.state.jumping) return;
    this.state.jumping = true;
  };

  jumpInProgress = () => {
    if (this.state.jumping) {
      if (this.frameCounter % this.params.jumpHeight === 0) this.stopJumping();
      this.frameCounter++;
      this.dy = -gravity;
    }
  };

  stopJumping = () => {
    this.state.jumping = false;
    this.frameCounter = 0;
  };

  gravityPhysics = () => {
    if (this.state.jumping) return;
    this.dy = gravity;
  };

  checkCollision = () => {
    mapObjects.forEach((platform) => {
      this.collision(platform.params);
    });
  };

  collision = (platform) => {
    if (isStaticIntersect(this.playerData, platform)) {
      if (this.dx > 0 && this.x < platform.x) this.dx = 0;
      if (this.dx < 0 && this.x + this.width > platform.x + platform.width) this.dx = 0;
      if (this.dy > 0 && this.y < platform.y) this.dy = 0;
      if (this.dy < 0 && this.y + this.height > platform.y + platform.height) {
        this.dy = 0;
        this.state.jumping = false;
      }
    }
  };
}
