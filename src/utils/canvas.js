const canvas = document.querySelector('#canvas');

canvas.width = 640;
canvas.height = 480;
canvas.style.backgroundColor = 'black';

const context = canvas.getContext('2d');

const Canvas = {
  element: canvas,
  context,
};

export default Canvas;
