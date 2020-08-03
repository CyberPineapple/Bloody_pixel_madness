import Player from './src/objects/Player';
import ctx from './src/utils/canvas';
import mapObjects from './src/map/index.js';

const keyboardKeys = {
  KeyA: false,
  KeyD: false,
  keyW: false,
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
};

const player = new Player({});

const player2 = new Player({ x: 100, y: 100, color: 'orange' });

const handleKeyDown = ({ code }) => {
  keyboardKeys[code] = true;
};

const handleKeyUp = ({ code }) => {
  keyboardKeys[code] = false;
};

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

const gameTick = () => {
  window.requestAnimationFrame(gameTick);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keyboardKeys.KeyA) player.runLeft();
  if (keyboardKeys.KeyD) player.runRight();
  if (keyboardKeys.KeyW) player.jump();

  if (keyboardKeys.ArrowLeft) player2.runLeft();
  if (keyboardKeys.ArrowRight) player2.runRight();
  if (keyboardKeys.ArrowUp) player2.jump();

  player2.draw();

  player.draw();

  mapObjects.forEach((object) => {
    object.draw();
  });
};

window.requestAnimationFrame(gameTick);
