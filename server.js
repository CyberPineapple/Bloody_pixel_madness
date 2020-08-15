const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let players = [];
let bulletList = [];

const actionTypes = {
  player_register: (data, ws) => playerRegister(data, ws),
  player_set_coords: (data) => playerSetCoordinats(data),
  bullet_create: (data) => bulletCreate(data),
  bullet_set_coords: (data) => bulletSetCoordinats(data),
  bullet_remove: (data) => bulletRemove(data),
  player_death: (data) => playerDeath(data),
  player_add_damage: (data) => playerAddDamage(data),
};

wss.on('connection', (ws) => {
  ws.on('message', (request) => {
    const { type, data } = JSON.parse(request);
    actionTypes[type](data, ws);
  });
});

const playerRegister = (data, ws) => {
  const newPlayer = {
    player: { id: Date.now(), x: data.x, y: data.y },
    socket: ws,
  };

  players.push(newPlayer);

  const playersListWithoutCurrentPlayer = players.filter((v) => v.player.id !== newPlayer.player.id);

  const response = {
    type: 'player_register',
    data: {
      id: newPlayer.player.id,
      players: playersListWithoutCurrentPlayer.map((v) => v.player),
      bullets: bulletList,
    },
  };

  newPlayer.socket.send(JSON.stringify(response));
  console.log(`connected new player ${newPlayer.player.id} `);

  playersListWithoutCurrentPlayer.forEach((player) => {
    player.socket.send(
      JSON.stringify({
        type: 'player_add_new',
        data: newPlayer.player,
      })
    );
  });
};

const playerSetCoordinats = (data) => {
  const tempPlayer = players.find((v) => v.player.id === data.id);
  if (!tempPlayer) return;
  tempPlayer.player.x = data.x;
  tempPlayer.player.y = data.y;
  tempPlayer.player.direction = data.direction;

  const playersListWithoutCurrentPlayer = players.filter((v) => v.player.id !== data.id);

  playersListWithoutCurrentPlayer.forEach((player) => {
    player.socket.send(
      JSON.stringify({
        type: 'player_set_coords',
        data: {
          x: data.x,
          y: data.y,
          direction: data.direction,
          id: data.id,
        },
      })
    );
  });
};

const bulletCreate = (data) => {
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
};

const bulletSetCoordinats = (data) => {
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
};

const bulletRemove = (data) => {
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
};

const playerAddDamage = (data) => {
  const playersListWithoutCurrentPlayer = players.filter((v) => v.player.id !== data.currentPlayerID);

  playersListWithoutCurrentPlayer.forEach((player) => {
    player.socket.send(
      JSON.stringify({
        type: 'player_add_damage',
        data: {
          playerID: data.targetPlayerID,
          damage: data.damage,
        },
      })
    );
  });
};

const playerDeath = (data) => {
  console.log(`player ${data.playerID} is death`);

  players.forEach((player) => {
    player.socket.send(
      JSON.stringify({
        type: 'player_death',
        data,
      })
    );
  });
};
