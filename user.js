const gravity = 10;

const mapObjects = [
  {
    name: 'wall',
    x: 0,
    y: 470,
    height: 10,
    width: 640,
  },
  {
    name: 'wall',
    x: 0,
    y: 0,
    height: 480,
    width: 10,
  },
  {
    name: 'wall',
    x: 0,
    y: 0,
    height: 10,
    width: 640,
  },
  {
    name: 'wall',
    x: 630,
    y: 0,
    height: 480,
    width: 10,
  },
  // {
  //   name: 'paltform',
  //   x: 40,
  //   y: 100,
  //   height: 5,
  //   width: 100,
  // },
];

class User {
  constructor() {
    this.position = {
      x: 20,
      y: 20,
    };

    this.params = {
      speed: 10,
      height: 10,
      width: 10,
    };
  }

  runLeft = () => {
    if (this.collisionLeft()) return;
    return (this.position.x -= this.params.speed);
  };

  runRight = () => {
    if (this.collisionRight()) return;
    return (this.position.x += this.params.speed);
  };

  runUp = () => {
    if (this.collisionTop()) return;
    return (this.position.y -= this.params.speed * 2);
  };

  runDown = () => {
    if (this.collisionBottom()) return;
    return (this.position.y += this.params.speed);
  };

  collisionBottom = () => {
    const isCollision = mapObjects.some((object) => {
      if (this.position.y + this.params.height === object.y) {
        return true;
      }
      return false;
    });
    return isCollision;
  };

  collisionTop = () => {
    const isCollision = mapObjects.some((object) => {
      if (this.position.y === object.height) {
        return true;
      }
      return false;
    });
    return isCollision;
  };

  collisionLeft = () => {
    const isCollision = mapObjects.some((object) => {
      if (this.position.x === object.width) {
        return true;
      }

      return false;
    });
    return isCollision;
  };

  collisionRight = () => {
    const isCollision = mapObjects.some((object) => {
      if (this.position.x + this.params.width === object.x) {
        return true;
      }

      return false;
    });
    return isCollision;
  };

  gravityPhysics = () => {
    if (this.collisionBottom()) return;
    this.position.y += gravity;
  };
}
