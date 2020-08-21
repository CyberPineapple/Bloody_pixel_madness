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
    this.drawHead();
    this.drawBody();
    this.drawLeftFoot();
    this.drawRightFoot();
  };

  move = () => {
    this.setPlayerData();
    this.drawHead();
    this.drawBody();
    if (GameStore.gameCounter % 2 === 0) {
      this.drawLeftFoot();
    } else {
      this.drawRightFoot();
    }

    Canvas.context.closePath();
  };

  jump = () => {
    this.setPlayerData();
    this.drawBody();
  };

  drawLeftFoot = () => {
    Canvas.context.beginPath();
    Canvas.context.fillStyle = this.color;
    Canvas.context.fillRect(this.x, this.y + this.height, 5, -7);
    Canvas.context.closePath();
  };

  drawRightFoot = () => {
    Canvas.context.beginPath();
    Canvas.context.fillStyle = this.color;
    Canvas.context.fillRect(this.x + this.width, this.y + this.height, -5, -7);
    Canvas.context.closePath();
  };

  drawBody = () => {
    Canvas.context.beginPath();
    Canvas.context.fillStyle = this.color;
    Canvas.context.fillRect(this.x, this.y + 10, this.width, this.height - 17);
    Canvas.context.closePath();
  };

  drawHead = () => {
    Canvas.context.beginPath();
    Canvas.context.fillStyle = this.color;
    Canvas.context.fillRect(this.x + (this.width * 0.4) / 4, this.y, this.width * 0.8, 10);
    Canvas.context.closePath();
  };
}
