const canvas = document.querySelector('#canvas');

canvas.width = 640;
canvas.height = 480;
canvas.style.backgroundColor = 'red';

const ctx = canvas.getContext('2d');
ctx.fillStyle = 'orange';

const worldConfig = {
  gravity: 10,
};

const keyboardKeys = {
  KeyA: false,
  KeyD: false,
  keyW: false,
  keyS: false,
};

const user = new User();

const handleKeyDown = ({ code }) => {
  keyboardKeys[code] = true;
};

const handleKeyUp = ({ code }) => {
  keyboardKeys[code] = false;
};

drawUser = () => {
  ctx.fillStyle = 'orange';
  ctx.clearRect(user.position.x, user.position.y, user.params.width, user.params.height);
  user.gravityPhysics();
  if (keyboardKeys.KeyA) user.runLeft();
  if (keyboardKeys.KeyD) user.runRight();
  if (keyboardKeys.KeyW) user.runUp();
  if (keyboardKeys.KeyS) user.runDown();

  // if (user.position.y + user.params.height < 480) {
  // }

  ctx.fillRect(user.position.x, user.position.y, user.params.width, user.params.height);
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 470, 640, 10);
  ctx.fillRect(0, 0, 10, 480);
  ctx.fillRect(630, 0, 10, 480);
  ctx.fillRect(0, 0, 640, 10);

  // ctx.fillRect(40, 100, 100, 10);
};

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

gameTick = () => {
  drawUser();
};

setInterval(gameTick, 1000 / 45);
