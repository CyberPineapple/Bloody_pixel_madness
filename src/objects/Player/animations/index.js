import Canvas from '../../../utils/canvas.js';
import GameStore from '../../../store/index.js';

export default class PlayerAnimation {
  constructor(func) {
    this.getPlayerData = func;
    this.color = 'orange';

    this.frameCounter = 0;
  }

  move = () => {};

  setPlayerData = () => {
    const data = this.getPlayerData();
    this.x = data.x;
    this.y = data.y;
    this.width = data.width;
    this.height = data.height;
  };

  eyes = {
    color: 'white',
    marginTop: Math.round(this.height / 10),
    heigth: Math.round(this.height / 3),
    width: Math.round(this.width / 10),
  };

  stay = () => {
    this.setPlayerData();

    Canvas.context.beginPath();
    Canvas.context.fillStyle = this.color;

    Canvas.context.fillRect(this.x, this.y, this.width, this.height - 7);

    Canvas.context.fillRect(this.x, this.y, 5, this.height);
    Canvas.context.fillRect(this.x + this.width, this.y, -5, this.height);

    Canvas.context.closePath();
  };

  move = () => {
    this.setPlayerData();
    Canvas.context.beginPath();
    Canvas.context.fillStyle = this.color;
    if (GameStore.gameCounter % 2 === 0) {
      this.move1();
    } else {
      this.move2();
    }

    Canvas.context.closePath();
  };

  move1 = () => {
    Canvas.context.fillRect(this.x, this.y, this.width, this.height - 7);
    Canvas.context.fillRect(this.x + this.width, this.y, -5, this.height);
  };

  move2 = () => {
    Canvas.context.fillRect(this.x, this.y, this.width, this.height - 7);
    Canvas.context.fillRect(this.x, this.y, 5, this.height);
  };

  jump = () => {
    this.setPlayerData();
    Canvas.context.beginPath();
    Canvas.context.fillStyle = this.color;
    Canvas.context.fillRect(this.x, this.y, this.width, this.height - 7);
    Canvas.context.closePath();
  };
}
