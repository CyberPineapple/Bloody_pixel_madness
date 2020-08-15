import GameStore from '../store/index.js';

class Socket {
  isConnected = false;

  actionTypes = {
    player_register: (data) => this.playerRegister(data),
    player_add_new: (data) => this.playerAddNew(data),
    player_set_coords: (data) => this.playerSetCoordinats(data),
    bullet_create: (data) => this.bulletCreate(data),
    bullet_add_new: (data) => this.bulletAddNew(data),
    bullet_set_coords: (data) => this.bulletSetCoordinats(data),
    bullet_remove: (data) => this.bulletRemove(data),
    player_add_damage: (data) => this.playerAddDamage(data),
    player_death: (data) => this.playerDeath(data),
  };

  connect = () => {
    // this.websocket = new WebSocket('ws://messenger.servehttp.com:8082'); // online
    this.websocket = new WebSocket('ws://localhost:8080'); // locale
    this.websocket.onopen = this.onOpen;
    this.websocket.onclose = this.onClose;
    this.websocket.onmessage = this.onMessage;
  };

  onOpen = () => {
    this.isConnected = true;
    this.registerPlayerRequest();
  };

  onClose = () => {
    this.isConnected = false;
  };

  onMessage = (message) => {
    const { type, data } = JSON.parse(message.data);
    const action = this.actionTypes[type];
    if (action) action(data);
  };

  send = (message) => this.websocket.send(JSON.stringify(message));

  playerRegister = (data) => {
    GameStore.currentPlayer.id = data.id;
    GameStore.setPlayers(data.players);
  };

  playerAddNew = (data) => GameStore.addPlayer(data);
  playerSetCoordinats = (data) => GameStore.setPlayerCoordinats(data);
  bulletAddNew = (data) => GameStore.addBulletOfAnotherPlayer(data);
  bulletSetCoordinats = (data) => GameStore.setBulletCoordinats(data);
  bulletRemove = (data) => GameStore.removeBulletOfAnotherPlayer(data);
  playerAddDamage = (data) => GameStore.addDamageToPlayer(data);
  playerDeath = (data) => GameStore.playerDeath(data);

  registerPlayerRequest = () => {
    this.send({
      type: 'player_register',
      data: {
        x: GameStore.currentPlayer.x,
        y: GameStore.currentPlayer.y,
      },
    });
  };

  sendPlayerCoordinats = (playerData) => {
    this.send({
      type: 'player_set_coords',
      data: playerData,
    });
  };

  sendBulletCoordinats = (bulletData) => {
    this.send({
      type: 'bullet_set_coords',
      data: bulletData,
    });
  };

  removeBullet = (bulletData) => {
    this.send({
      type: 'bullet_remove',
      data: bulletData,
    });
  };

  createBullet = (bulletData) => {
    this.send({
      type: 'bullet_create',
      data: bulletData,
    });
  };

  sendPlayerDeath = (playerData) => {
    this.send({
      type: 'player_death',
      data: playerData,
    });
  };

  sendPlayerAddDamage = (playerData) => {
    this.send({
      type: 'player_add_damage',
      data: {
        ...playerData,
        currentPlayerID: GameStore.currentPlayer.id,
      },
    });
  };
}

export default new Socket();
