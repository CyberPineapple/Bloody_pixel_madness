import ctx, { canvas } from '../utils/canvas.js';
import { mapObjects, bulletArray } from '../map/index.js';
import Bullet from './Bullet.js';
import { isStaticIntersect } from '../utils/collision';
import { gravity } from '../configs/index.js';

export default class Player {
  constructor({ x, y, id, color, isCurrentUser = false }) {
    (this.x = x || 50), (this.y = y || 50), (this.height = 20), (this.width = 20);
    this.isCurrentUser = isCurrentUser;

    this.params.color = isCurrentUser ? 'red' : 'white';
    if (color) this.params.color = color;

    if (id) this.id = id;

    this.frameCounter = 0;

    if (isCurrentUser) {
      document.addEventListener('keydown', this.handleKeyDown);
      document.addEventListener('keyup', this.handleKeyUp);
      canvas.addEventListener('mousemove', this.handleMouseMove);
    }
  }

  params = {
    jumpHeight: 10,
    speed: 5,
    color: 'white',
    speedOfFire: 10,
  };

  utils = {
    speedOfFireFramesCounter: 0,
  };

  state = {
    jumping: false,
  };

  cursor = {
    x: 0,
    y: 0,
  };

  keyboardKeys = {};

  get playerData() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  handleKeyDown = ({ code }) => (this.keyboardKeys[code] = true);
  handleKeyUp = ({ code }) => (this.keyboardKeys[code] = false);
  handleMouseMove = ({ clientX, clientY }) => {
    this.cursor.x = clientX;
    this.cursor.y = clientY;
  };

  clearMove = () => {
    this.dx = 0;
    this.dy = 0;
  };

  draw = () => {
    this.clearMove();
    this.gravityPhysics();
    this.utils.speedOfFireFramesCounter++;
    if (this.keyboardKeys.KeyA) this.runLeft();
    if (this.keyboardKeys.KeyD) this.runRight();
    if (this.keyboardKeys.KeyW) this.jump();
    if (this.keyboardKeys.Space) this.fire();

    this.jumpInProgress();
    this.checkCollision();
    this.move();
    ctx.beginPath();
    ctx.fillStyle = this.params.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.fillRect(this.cursor.x, this.cursor.y, 5, 5);
    ctx.closePath();
  };

  runLeft = () => (this.dx = -this.params.speed);
  runRight = () => (this.dx = this.params.speed);

  move = () => {
    this.x += this.dx;
    this.y += this.dy;
  };

  fire = () => {
    if (this.utils.speedOfFireFramesCounter % this.params.speedOfFire === 0) {
      bulletArray.push(
        new Bullet({
          x: this.x,
          y: this.y,
          target: this.cursor,
        })
      );
    }
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
