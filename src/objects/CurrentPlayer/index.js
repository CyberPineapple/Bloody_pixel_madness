import Canvas from '../../utils/canvas.js';
import CurrentBullet from '../CurrentBullet/index.js';
import { isStaticIntersect, platformCollision } from '../../utils/collision';
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
    isDeath: false,
  };

  activeObjects = {
    Space: (target) => this.inventory.gun.use(target),
    KeyE: () => null,
  };

  keyboardKeys = {};
  frameCounter = 0;

  get isDeath() {
    return this.state.isDeath;
  }

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
    if (this.keyboardKeys.KeyE) this.activeObjects.KeyE();

    this.jumpPhysics();
    this.move();
    this.checkCollision();

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

  death = () => {
    this.state.isDeath = true;
  };

  checkCollision = () => {
    GameStore.platformList.forEach((platform) => platformCollision(platform, this));
    GameStore.playersList.forEach((player) => platformCollision(player, this));
    GameStore.bonusList.forEach(this.collisionBonus);
  };

  collisionBonus = (bonus) => {
    if (isStaticIntersect(this.sizeData, bonus.sizeData)) {
      // if (
      //   this.y > bonus.y &&
      //   this.y + this.height < bonus.y + bonus.height &&
      //   this.x > bonus.x &&
      //   this.x + this.width < bonus.x + bonus.width
      // ) {
      this.activeObjects.KeyE = () => bonus.use(this);
      GameStore.removeBonus(bonus.id);
      // }
    }
  };
}
