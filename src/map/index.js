import Platform from '../objects/Platform.js';
import { canvas } from '../utils/canvas';

const walls = [];

const map = [
  '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '@@@                                          @',
  '@                @@@@@@@@@             @@@@@@@',
  '@                                      @@@@@@@',
  '@                              @@@@@@@@@@@@@@@',
  '@  @@@@@@@@                            @@@@@@@',
  '@               @@@@@@@@@@             @@@@@@@',
  '@    @@@@@@@                           @@@@@@@',
  '@                                      @@@@@@@',
  '@@@@@@       @@@@@@     @@@@@    @@@@@@@@@@@@@',
  '@@@@@@       @@@@@@     @@@@@@@@@@@@@@@@@@@@@@',
  '@                                            @',
  '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
];

const mapParser = () => {
  const blockXSize = Math.round(canvas.width / map[0].length);
  const blockYSize = Math.round(canvas.height / map.length);

  for (let i = 0; i < map.length; i++) {
    let result = Array.from(map[i].matchAll(/@+/g));
    result = result.map((v) => ({
      length: v[0].length,
      index: v.index,
    }));
    result.forEach((v) => {
      walls.push({
        x: v.index * blockXSize,
        width: v.length * blockXSize,
        y: i * blockYSize,
        height: blockYSize,
      });
    });
  }
};

mapParser();

export const mapObjects = walls.map((wall) => new Platform(wall));

export const bulletArray = [];

export const removeBullet = (id) => {
  const index = bulletArray.findIndex((bullet) => bullet.id !== id);
  console.log('index', index);
  if (index !== -1) return bulletArray.splice(index, 1);
};
