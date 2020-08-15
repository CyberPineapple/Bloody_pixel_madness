export const isStaticIntersect = (obj1, obj2) => {
  return (
    obj1.y + obj1.height > obj2.y &&
    obj1.x + obj1.width > obj2.x &&
    obj1.x < obj2.x + obj2.width &&
    obj1.y < obj2.y + obj2.height
  );
};

export const platformCollision = (platform, obj) => {
  if (isStaticIntersect(obj.sizeData, platform.sizeData)) {
    if (obj.dx > 0 && obj.x < platform.x) {
      obj.x = platform.x - obj.width;
    }
    if (obj.dx < 0 && obj.x + obj.width > platform.x + platform.width) {
      obj.x = platform.x + platform.width;
    }
    if (obj.dy > 0 && obj.y < platform.y) {
      obj.y = platform.y - obj.height;
      if (obj.isPlayer) obj.state.isMayJump = true;
    }
    if (obj.dy < 0 && obj.y + obj.height > platform.y + platform.height) {
      obj.y = platform.y + platform.height;
    }
  }
};
