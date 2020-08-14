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
    maxBounceCount: 7,
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
    GameStore.platformList.forEach(this.collisionPlatform);
    GameStore.playersList.forEach(this.collisionPlayer);
    this.collisionPlayer(GameStore.currentPlayer);
  };

  collisionPlatform = (platform) => {
    if (isStaticIntersect(this.sizeData, platform.sizeData)) {
      if (this.y > platform.y && this.y + this.height < platform.y + platform.height) {
        if (this.state.bounce < this.params.maxBounceCount) {
          this.dy = -this.dy;
          this.incrementBounce();
        } else {
          this.removeBullet();
          return;
        }
      }

      if (this.x > platform.x && this.x + this.width < platform.x + platform.width) {
        if (this.state.bounce < this.params.maxBounceCount) {
          this.dx = -this.dx;
          this.incrementBounce();
        } else {
          this.removeBullet();
          return;
        }
      }
    }
  };

  collisionPlayer = (player) => {
    if (isStaticIntersect(this.sizeData, player.sizeData)) {
      if (
        this.y > player.y &&
        this.y + this.height < player.y + player.height &&
        this.x > player.x &&
        this.x + this.width < player.x + player.width
      ) {
        this.removeBullet();
        player.addDamage(10);
      }
    }
  };

  removeBullet = () => {
    GameStore.removeBullet(this.id);
    if (Socket.isConnected) {
      Socket.removeBullet({ id: this.id, playerId: GameStore.currentPlayer.id });
    }
  };

  incrementBounce = () => (this.state.bounce += 1);
}
