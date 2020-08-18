import CurrentPlayer from '../objects/CurrentPlayer/index.js';
import CurrentBullet from '../objects/CurrentBullet/index.js';
import Player from '../objects/Player/index.js';
import Bullet from '../objects/Bullet/index.js';
import Platform from '../objects/Platform/index.js';
import Bonus from '../objects/Bonus/index.js';
import platforms from '../map/index.js';

class GameStore {
  constructor() {
    this.gameCounter = 0;
    this.currentPlayer = new CurrentPlayer({ x: 100, y: 100 });

    this.bonusList = [];

    this.platformList = platforms.map((wall) => new Platform(wall));

    this.bulletListOfCurrentPlayer = [];
    this.bulletListOfAnotherPlayers = [];
    this.playersList = [];
  }

  incrementGameCounter = () => this.gameCounter++;

  removeBullet = (id) => {
    this.bulletListOfCurrentPlayer = this.bulletListOfCurrentPlayer.filter((bullet) => bullet.id !== id);
  };

  addBullet = ({ x, y, target }) => {
    this.bulletListOfCurrentPlayer.push(new CurrentBullet({ x, y, target }));
  };

  removeBonus = (id) => {
    this.bonusList = this.bonusList.filter((bonus) => bonus.id !== id);
  };

  addBonus = ({ x, y, type }) => {
    this.bonusList.push(new Bonus({ x, y, type }));
  };

  setPlayers = (players) => {
    this.playersList = players.map((playerData) => new Player({ ...playerData }));
  };

  addPlayer = (playerData) => {
    this.playersList.push(new Player(playerData));
  };

  removePlayer = (id) => {
    this.playersList = this.playersList.filter((player) => player.id !== id);
  };

  setPlayerCoordinats = (playerData) => {
    const tempPlayer = this.playersList.find((v) => v.id === playerData.id);
    if (tempPlayer) tempPlayer.setData(playerData);
  };

  //  fix me
  addDamageToPlayer = (playerData) => {
    const tempPlayer =
      this.currentPlayer.id === playerData.playerID
        ? this.currentPlayer
        : this.playersList.find((v) => v.id === playerData.playerID);

    if (tempPlayer) tempPlayer.HP -= playerData.damage;
  };

  //  fix me
  playerDeath = (playerData) => {
    if (this.currentPlayer.id === playerData.playerID) return (this.currentPlayer.state.isDeath = true);
    this.removePlayer(playerData.playerID);
  };

  setBulletCoordinats = (bulletData) => {
    const tempBullet = this.bulletListOfAnotherPlayers.find((v) => v.id === bulletData.id);
    if (tempBullet) tempBullet.move(bulletData);
  };

  addBulletOfAnotherPlayer = (bulletData) => {
    this.bulletListOfAnotherPlayers.push(new Bullet(bulletData));
  };

  removeBulletOfAnotherPlayer = (bulletData) => {
    this.bulletListOfAnotherPlayers = this.bulletListOfAnotherPlayers.filter((bullet) => bullet.id !== bulletData.id);
  };
}

export default new GameStore();
