import Player from './src/objects/Player';
import ctx from './src/utils/canvas';
import { mapObjects, bulletArray } from './src/map/index.js';

const ws = new WebSocket('ws://localhost:8080');

let isConnectedToServer = false;

const player = new Player({ isCurrentUser: true });

let players = [];

ws.onopen = (message) => {
  isConnectedToServer = true;
  ws.send(
    JSON.stringify({
      type: 'player_register',
      data: {
        x: player.x,
        y: player.y,
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
      player.id = data.id;
      players = data.players.map((playerData) => new Player({ ...playerData }));
      break;
    }

    case 'player_add_new': {
      players.push(new Player(data));
      break;
    }

    case 'player_set_coords': {
      const tempPlayer = players.find((v) => v.id === data.id);
      tempPlayer.x = data.x;
      tempPlayer.y = data.y;
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.draw();
  if (isConnectedToServer) sendPlayerCoords(player);

  players.forEach((player) => player.draw());

  bulletArray.forEach((bullet) => bullet.draw());

  mapObjects.forEach((object) => object.draw());
};

window.requestAnimationFrame(gameTick);
