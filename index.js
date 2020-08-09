import GameStore from './src/store/index.js';
import Canvas from './src/utils/canvas';
import socket from './src/utils/websocket.js';

socket.connect();

const gameTick = () => {
  window.requestAnimationFrame(gameTick);
  Canvas.context.clearRect(0, 0, Canvas.element.width, Canvas.element.height);

  GameStore.bulletListOfCurrentPlayer.forEach((bullet) => bullet.tick());
  GameStore.bulletListOfAnotherPlayers.forEach((bullet) => bullet.draw());
  GameStore.platformList.forEach((platform) => platform.draw());
  GameStore.playersList.forEach((player) => player.draw());

  GameStore.currentPlayer.tick();
};

window.requestAnimationFrame(gameTick);
