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

    this.cursor = new Cursor({ x, y });
  }

  params = {
    jumpHeight: 15,
    jumpSpeed: 3,
    speed: 5,
  };

  state = {
    isMayJump: true,
  };

  activeObjects = {
    Space: (target) => this.inventary.gun.use(target),
  };

  keyboardKeys = {};
  frameCounter = 0;

  handleKeyDown = ({ code }) => (this.keyboardKeys[code] = true);
  handleKeyUp = ({ code }) => (this.keyboardKeys[code] = false);

  handleMouseMove = ({ clientX, clientY }) => {
    this.cursor.move({
      x: clientX,
      y: clientY,
    });
    this.movementDirection = this.centerX > clientX ? 'left' : 'right';
  };

  stopMove = () => {
    this.dx = 0;
    this.dy = 0;
  };

  tick = () => {
    this.stopMove();
    this.gravityPhysics();

    if (this.keyboardKeys.KeyA) this.runLeft();
    if (this.keyboardKeys.KeyD) this.runRight();
    if (this.keyboardKeys.KeyW) this.jump();
    if (this.keyboardKeys.Space) this.activeObjects.Space(this.cursor.sizeData);

    this.jumpPhysics();
    this.checkCollision();
    this.move();

    if (Socket.isConnected && this.id) Socket.sendPlayerCoordinats({ ...this.sizeData, id: this.id });

    this.draw();

    this.cursor.draw();
  };

  runLeft = () => (this.dx = -this.params.speed);
  runRight = () => (this.dx = this.params.speed);

  move = () => {
    this.x += this.dx;
    this.y += this.dy;
  };

  jump = () => {
    if (!this.state.isMayJump) return;
    this.state.isMayJump = false;
    this.frameCounter = 0;
  };

  jumpPhysics = () => {
    if (this.state.isMayJump) return;
    if (this.frameCounter >= this.params.jumpHeight) {
      this.dy = gravity;
    } else {
      this.frameCounter++;
      this.dy = -gravity - this.params.jumpSpeed;
    }
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
      if (this.dy > 0 && this.y < platform.y) {
        this.dy = 0;
        this.state.isMayJump = true;
      }
      if (this.dy < 0 && this.y + this.height > platform.y + platform.height) {
        this.dy = 0;
      }
    }
  };
}
