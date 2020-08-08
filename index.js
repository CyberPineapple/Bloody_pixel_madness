import GameStore from './src/store/index.js';
import Player from './src/objects/Player/index.js';
import Canvas from './src/utils/canvas';

const ws = new WebSocket('ws://localhost:8080');

let isConnectedToServer = false;

let players = [];

ws.onopen = (message) => {
  // return;
  isConnectedToServer = true;
  ws.send(
    JSON.stringify({
      type: 'player_register',
      data: {
        x: GameStore.currentPlayer.x,
        y: GameStore.currentPlayer.y,
      },
    })
  );
};

ws.onclose = (message) => {
  isConnectedToServer = false;
  players = [];
};

ws.onmessage = (response) => {
  const { type, data } = JSON.parse(response.data);
  switch (type) {
    case 'player_register': {
      GameStore.currentPlayer.id = data.id;
      players = data.players.map((playerData) => new Player({ ...playerData }));
      break;
    }

    case 'player_add_new': {
      players.push(new Player(data));
      break;
    }

    case 'player_set_coords': {
      const tempPlayer = players.find((v) => v.id === data.id);
      tempPlayer.move(data);
      break;
    }

    case 'bullet_create': {
      bullet.id = data.id;
      bulletList = data.bullets.map((bulletData) => new Bullet({ ...bulletData }));
      break;
    }

    case 'bullet_add_new': {
      bulletList.push(new Bullet(data));
      break;
    }

    case 'bullet_set_coords': {
      const tempBullet = bulletList.find((v) => v.id === data.id);
      tempBullet.x = data.x;
      tempBullet.y = data.y;
      break;
    }
    default:
      break;
  }
};

const sendPlayerCoords = (player) => {
  if (!player.id) return;
  const message = {
    type: 'player_set_coords',
    data: {
      x: player.x,
      y: player.y,
      id: player.id,
    },
  };
  ws.send(JSON.stringify(message));
};

const gameTick = () => {
  window.requestAnimationFrame(gameTick);
  Canvas.context.clearRect(0, 0, Canvas.element.width, Canvas.element.height);

  if (isConnectedToServer) sendPlayerCoords(GameStore.currentPlayer);
  GameStore.currentPlayer.tick();

  players.forEach((player) => player.draw());

  GameStore.bulletList.forEach((bullet) => bullet.tick());

  GameStore.platformList.forEach((platform) => platform.draw());
};

window.requestAnimationFrame(gameTick);
