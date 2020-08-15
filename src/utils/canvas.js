const canvas = document.querySelector('#canvas');

canvas.width = 640;
canvas.height = 480;

canvas.style.backgroundColor = 'black';

const context = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const Canvas = {
  element: canvas,
  width: canvas.width,
  heigth: canvas.height,
  centerX,
  centerY,
  context,
  gameover: function() {
    this.context.beginPath();
    this.context.fillStyle = 'red';
    this.context.font = '60px Tahoma';
    this.context.textAlign = 'center';
    this.context.fillText('You are Died!', this.centerX, this.centerY);
    this.context.closePath();
  },
};

export default Canvas;
