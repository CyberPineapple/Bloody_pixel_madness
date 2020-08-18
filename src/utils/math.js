export const getVectorLength = (obj1, obj2) => {
  return Math.sqrt(Math.pow(obj2.x - obj1.x, 2) + Math.pow(obj2.y - obj1.y, 2));
};

export const getNormalizedVector = (obj1, obj2) => {
  const vectorLength = getVectorLength(obj1, obj2);
  const x = (obj2.y - obj1.y) / vectorLength;
  const y = (obj2.x - obj1.x) / vectorLength;
  return { x, y };
};

export const getRotateVector = (obj, angle) => {
  const radianAngle = (angle * Math.PI) / 180;
  const x = obj.x * Math.cos(radianAngle) - obj.y * Math.sin(radianAngle);
  const y = obj.x * Math.sin(radianAngle) + obj.y * Math.cos(radianAngle);
  return { x, y };
};
