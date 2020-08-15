import BaseObject from '../BaseObject/index';
import { getUniqId } from '../../utils/helpers.js';
import Canvas from '../../utils/canvas.js';

export default class Bonus extends BaseObject {
  constructor({ x, y, type }) {
    const width = 10;
    const height = 10;
    const color = 'magenta';
    super({ x, y, width, height, color });

    this.id = getUniqId();
    this.type = type || 'speed';
  }

  typesBonus = {
    speed: () => this.bonusSpeed(),
    gunSpeed: () => this.bonusGunSpeed(),
    medicBox: () => this.bonusMedicBox(),
  };

  use = (player) => {
    this.player = player;
    this.typesBonus[this.type](player);
  };

  deactivateBonus = () => {
    this.player.activeObjects.KeyE = () => null;
  };

  bonusSpeed = () => {
    this.player.params.speed = 8;
    setTimeout(() => {
      this.player.params.speed = 5;
    }, 5000);
    this.deactivateBonus();
  };

  draw() {
    super.draw();
    Canvas.context.beginPath();
    Canvas.context.textAlign = 'center';
    Canvas.context.fillText(this.type, this.centerX, this.y - 10);
    Canvas.context.closePath();
  }

  bonusMedicBox = () => {
    this.player.HP += 40;
    this.deactivateBonus();
  };

  bonusGunSpeed = () => {
    this.player.inventory.gun.params.speed = 50;
    setTimeout(() => {
      this.player.inventory.gun.params.speed = this.player.inventory.gun.params.defaultSpeed;
    }, 5000);
    this.deactivateBonus();
  };
}
