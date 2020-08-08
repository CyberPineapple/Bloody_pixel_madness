import CurrentPlayer from '../objects/CurrentPlayer/index.js';
import CurrentBullet from '../objects/CurrentBullet/index.js';
import Platform from '../objects/Platform/index.js';
import platforms from '../map/index.js';

class GameStore {
  constructor() {
    this.currentPlayer = new CurrentPlayer({ x: 100, y: 100 });

    this.platformList = platforms.map((wall) => new Platform(wall));

    this.bulletList = [];
  }

  removeBullet = (id) => {
    this.bulletList = this.bulletList.filter((bullet) => bullet.id !== id);
  };

  addBullet = ({ x, y, target }) => {
    this.bulletList.push(new CurrentBullet({ x, y, target }));
  };
}

export default new GameStore();
