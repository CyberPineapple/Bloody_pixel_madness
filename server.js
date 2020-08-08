const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let players = [];

let bulletList = [];

wss.on('connection', (ws) => {
  ws.on('message', (request) => {
    parseMessage(JSON.parse(request));
  });

  const parseMessage = (request) => {
    const { type, data } = request;
    switch (type) {
      case 'player_register': {
        const newPlayer = {
          player: { id: Date.now(), x: data.x, y: data.y },
          socket: ws,
        };

        players.push(newPlayer);

        const playersListWithoutCurrentPlayer = players.filter((v) => v.player.id !== newPlayer.player.id);

        const response = {
          type,
          data: {
            id: newPlayer.player.id,
            players: playersListWithoutCurrentPlayer.map((v) => v.player),
            bullets: bulletList,
          },
        };

        newPlayer.socket.send(JSON.stringify(response));
        console.log('connected new player');

        playersListWithoutCurrentPlayer.forEach((player) => {
          player.socket.send(
            JSON.stringify({
              type: 'player_add_new',
              data: newPlayer.player,
            })
          );
        });
        break;
      }

      case 'player_set_coords': {
        const tempPlayer = players.find((v) => v.player.id === data.id);
        if (!tempPlayer) return;
        tempPlayer.player.x = data.x;
        tempPlayer.player.y = data.y;

        const playersListWithoutCurrentPlayer = players.filter((v) => v.player.id !== data.id);

        playersListWithoutCurrentPlayer.forEach((player) => {
          player.socket.send(
            JSON.stringify({
              type: 'player_set_coords',
              data: {
                x: data.x,
                y: data.y,
                id: data.id,
              },
            })
          );
        });
        break;
      }

      case 'bullet_create': {
        const newBullet = {
          id: data.id,
          x: data.x,
          y: data.y,
        };

        bulletList.push(newBullet);

        const playersListWithoutCurrentPlayer = players.filter((v) => v.player.id !== data.playerId);
        const bulletListWithoutNewBullet = bulletList.filter((v) => v.id !== newBullet.id);

        playersListWithoutCurrentPlayer.forEach((player) => {
          player.socket.send(
            JSON.stringify({
              type: 'bullet_add_new',
              data: newBullet,
            })
          );
        });
      }

      case 'bullet_set_coords': {
        const tempBullet = bulletList.find((v) => v.id === data.id);
        if (!tempBullet) return;
        tempBullet.x = data.x;
        tempBullet.y = data.y;

        const playersListWithoutCurrentPlayer = players.filter((v) => v.player.id !== data.id);

        playersListWithoutCurrentPlayer.forEach((player) => {
          player.socket.send(
            JSON.stringify({
              type: 'bullet_set_coords',
              data: {
                x: data.x,
                y: data.y,
                id: data.id,
              },
            })
          );
        });
        break;
      }

      case 'bullet_remove': {
        bulletList = bulletList.filter((v) => v.id !== data.id);

        const playersListWithoutCurrentPlayer = players.filter((v) => v.player.id !== data.id);

        playersListWithoutCurrentPlayer.forEach((player) => {
          player.socket.send(
            JSON.stringify({
              type: 'bullet_remove',
              data: {
                id: data.id,
              },
            })
          );
        });
      }

      default:
        break;
    }
  };
});
