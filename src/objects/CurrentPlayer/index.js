import Canvas from '../../utils/canvas.js';
import CurrentBullet from '../CurrentBullet/index.js';
import { isStaticIntersect } from '../../utils/collision';
import { gravity } from '../../configs/index.js';
import Player from '../Player/index';
import Cursor from '../Cursor/index.js';
import GameStore from '../../store/index.js';
import Socket from '../../utils/websocket.js';

export default class CurrentPlayer extends Player {
  constructor({ x, y, id, color = 'blue' }) {
    super({ x, y, color, id });

    this.frameCounter = 0;

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    Canvas.element.addEventListener('mousemove', this.handleMouseMove);
    Canvas.element.addEventListener('click', this.fire);

    this.cursor = new Cursor({ x, y });
  }

  params = {
    jumpHeight: 10,
    speed: 5,
    speedOfFire: 10,
  };

  utils = {
    speedOfFireFramesCounter: 0,
  };

  state = {
    jumping: false,
  };

  keyboardKeys = {};

  handleKeyDown = ({ code }) => (this.keyboardKeys[code] = true);
  handleKeyUp = ({ code }) => (this.keyboardKeys[code] = false);

  handleMouseMove = ({ clientX, clientY }) => {
    this.cursor.move({
      x: clientX,
      y: clientY,
    });
  };

  stopMove = () => {
    this.dx = 0;
    this.dy = 0;
  };

  tick = () => {
    this.stopMove();
    this.gravityPhysics();
    this.utils.speedOfFireFramesCounter++;

    if (this.keyboardKeys.KeyA) this.runLeft();
    if (this.keyboardKeys.KeyD) this.runRight();
    if (this.keyboardKeys.KeyW) this.jump();
    if (this.keyboardKeys.Space) this.autofire();

    this.jumpInProgress();
    this.checkCollision();
    this.move();

    if (Socket.isConnected && this.id) Socket.sendPlayerCoordinats({ ...this.sizeData, id: this.id });

    this.draw();

    this.cursor.draw();
  };

  runLeft = () => {
    this.dx = -this.params.speed;
    this.movementDirection = 'left';
  };

  runRight = () => {
    this.dx = this.params.speed;
    this.movementDirection = 'right';
  };

  move = () => {
    this.x += this.dx;
    this.y += this.dy;
  };

  autofire = () => {
    if (this.utils.speedOfFireFramesCounter % this.params.speedOfFire === 0) this.fire();
  };

  fire = () => {
    GameStore.addBullet({
      x: this.x,
      y: this.y,
      target: this.cursor.sizeData,
    });
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
    [...GameStore.platformList, ...GameStore.playersList].forEach((platform) => {
      this.collision(platform.sizeData);
    });
  };

  collision = (platform) => {
    if (isStaticIntersect(this.sizeData, platform)) {
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
