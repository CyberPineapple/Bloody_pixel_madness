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
  };

  connect = () => {
    this.websocket = new WebSocket('ws://localhost:8080');
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
}

export default new Socket();

//     case 'bullet_create': {
//       bullet.id = data.id;
//       bulletListOfCurrentPlayer = data.bullets.map((bulletData) => new Bullet({ ...bulletData }));
//       break;
//     }

//     case 'bullet_add_new': {
//       bulletListOfCurrentPlayer.push(new Bullet(data));
//       break;
//     }

//     case 'bullet_set_coords': {
//       const tempBullet = bulletListOfCurrentPlayer.find((v) => v.id === data.id);
//       tempBullet.x = data.x;
//       tempBullet.y = data.y;
//       break;
//     }
//     default:
//       break;
//   }
// };
