import { isStaticIntersect } from '../../utils/collision';
import { getUniqId } from '../../utils/helpers.js';
import Bullet from '../Bullet/index.js';
import GameStore from '../../store/index.js';
import Socket from '../../utils/websocket.js';

export default class CurrentBullet extends Bullet {
  constructor({ x, y, target }) {
    const id = getUniqId();
    super({ x, y, id });

    this.dx = (target.y - this.y) / this.width;
    this.dy = (target.x - this.x) / this.height;

    if (Socket.isConnected) {
      Socket.createBullet({ ...this.sizeData, id: this.id, playerId: GameStore.currentPlayer.id });
    }
  }

  state = {
    bounce: 0,
  };

  params = {
    maxBounceCount: 3,
  };

  tick = () => {
    this.move();
    this.checkCollision();

    if (Socket.isConnected) {
      Socket.sendBulletCoordinats({ ...this.sizeData, id: this.id, playerId: GameStore.currentPlayer.id });
    }

    this.draw();
  };

  move = () => {
    this.x += this.dy / 2;
    this.y += this.dx / 2;
  };

  checkCollision = () => {
    GameStore.platformList.forEach((platform) => {
      this.collision(platform.sizeData);
    });
  };

  collision = (platform) => {
    if (isStaticIntersect(this.sizeData, platform)) {
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
          GameStore.removeBullet(this.id);
          if (Socket.isConnected) {
            Socket.removeBullet({ id: this.id, playerId: GameStore.currentPlayer.id });
          }
        }
      }
    }
  };
}
