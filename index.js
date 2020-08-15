import GameStore from './src/store/index.js';
import Canvas from './src/utils/canvas';
import socket from './src/utils/websocket.js';

socket.connect();

GameStore.addBonus({ x: 200, y: 100, type: 'medicBox' });
GameStore.addBonus({ x: 400, y: 100, type: 'speed' });
GameStore.addBonus({ x: 200, y: 200, type: 'gunSpeed' });

const gameTick = () => {
  if (GameStore.currentPlayer.isDeath) {
    return Canvas.gameover();
  }

  Canvas.context.clearRect(0, 0, Canvas.element.width, Canvas.element.height);
  GameStore.bulletListOfCurrentPlayer.forEach((bullet) => bullet.tick());
  GameStore.bulletListOfAnotherPlayers.forEach((bullet) => bullet.draw());
  GameStore.bonusList.forEach((bonus) => bonus.draw());
  GameStore.platformList.forEach((platform) => platform.draw());
  GameStore.playersList.forEach((player) => player.draw());

  GameStore.currentPlayer.tick();

  window.requestAnimationFrame(gameTick);
};

window.requestAnimationFrame(gameTick);
