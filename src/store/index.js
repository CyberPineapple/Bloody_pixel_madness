import CurrentPlayer from '../objects/CurrentPlayer/index.js';
import CurrentBullet from '../objects/CurrentBullet/index.js';
import Player from '../objects/Player/index.js';
import Bullet from '../objects/Bullet/index.js';
import Platform from '../objects/Platform/index.js';
import platforms from '../map/index.js';

class GameStore {
  constructor() {
    this.currentPlayer = new CurrentPlayer({ x: 100, y: 100 });

    this.platformList = platforms.map((wall) => new Platform(wall));

    this.bulletListOfCurrentPlayer = [];
    this.playersList = [];
  }

  bulletCounter = 0;

  removeBullet = (id) => {
    this.bulletListOfCurrentPlayer = this.bulletListOfCurrentPlayer.filter((bullet) => bullet.id !== id);
  };

  addBullet = ({ x, y, target }) => {
    const id = this.bulletCounter++;
    this.bulletListOfCurrentPlayer.push(new CurrentBullet({ x, y, id, target }));
  };

  setPlayers = (players) => {
    this.playersList = players.map((playerData) => new Player({ ...playerData }));
  };

  addPlayer = (playerData) => {
    this.playersList.push(new Player(playerData));
  };

  setPlayerCoordinats = (playerData) => {
    const tempPlayer = this.playersList.find((v) => v.id === playerData.id);
    if (tempPlayer) tempPlayer.move(playerData);
  };
}

export default new GameStore();
