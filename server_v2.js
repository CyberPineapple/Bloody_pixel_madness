const WebSocket = require('ws');
const { nanoid } = require('nanoid');

const wss = new WebSocket.Server({
  port: 8080,
});

let players = [];
let bulletList = [];

wss.on('connection', (ws) => {
  const actionTypes = {
    player_register: (data, ws) => playerRegister(data, ws),
    player_set_coords: (data) => playerSetCoordinats(data),
    bullet_create: (data) => bulletCreate(data),
    bullet_set_coords: (data) => bulletSetCoordinats(data),
    bullet_remove: (data) => bulletRemove(data),
    player_death: (data) => playerDeath(data),
    player_add_damage: (data) => playerAddDamage(data),
  };

  ws.on('message', (request) => {
    const { type, data } = JSON.parse(request);
    actionTypes[type](data);
  });

  const playerRegister = (data) => {
    ws.playerData = {
      ...data,
      id: Date.now(),
    };

    players = [...players, ws];
    console.log(`connected new player ${ws.playerData.id} `);

    const response = {
      type: 'player_register',
      data: {
        id: ws.playerData.id,
        players: anotherPlayersData(),
        bullets: bulletList,
      },
    };

    send(response);

    sendMessageToAnotherPlayers({
      type: 'player_add_new',
      data: ws.playerData,
    });
  };

  const playerSetCoordinats = (data) => {
    ws.playerData = { ...ws.playerData, ...data };
    sendMessageToAnotherPlayers({
      type: 'player_set_coords',
      data: ws.playerData,
    });
  };

  const bulletCreate = (data) => {
    bulletList.push(data);
    sendMessageToAnotherPlayers({
      type: 'bullet_add_new',
      data,
    });
  };

  const bulletSetCoordinats = (data) => {
    const tempBullet = bulletList.find((v) => v.id === data.id);
    if (!tempBullet) return;
    tempBullet.x = data.x;
    tempBullet.y = data.y;

    sendMessageToAnotherPlayers({
      type: 'bullet_set_coords',
      data,
    });
  };

  const bulletRemove = (data) => {
    bulletList = bulletList.filter((v) => v.id !== data.id);
    sendMessageToAnotherPlayers({
      type: 'bullet_remove',
      data,
    });
  };

  const playerAddDamage = (data) => {
    sendMessageToAnotherPlayers({
      type: 'player_add_damage',
      data: {
        playerID: data.targetPlayerID,
        damage: data.damage,
      },
    });
  };

  const playerDeath = (data) => {
    console.log(`player ${data.playerID} is death`);

    players.forEach((player) => {
      player.send(
        JSON.stringify({
          type: 'player_death',
          data,
        })
      );
    });
  };

  send = (message) => {
    ws.send(JSON.stringify(message));
  };

  anotherPlayers = () => {
    return players.filter((v) => v.playerData.id !== ws.playerData.id);
  };

  anotherPlayersData = () => {
    return anotherPlayers().map((v) => v.playerData);
  };

  sendMessageToAnotherPlayers = (message) => {
    anotherPlayers().forEach((player) => {
      player.send(JSON.stringify(message));
    });
  };
});

const getUniqId = () => {
  const number = Math.random(); // 0.9394456857981651
  number.toString(36); // '0.xtis06h6'
  const id = number.toString(36).substr(2, 9); // 'xtis06h6'
  return id;
};
