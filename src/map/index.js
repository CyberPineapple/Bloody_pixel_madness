import Platform from '../objects/Platform.js';
import { canvas } from '../utils/canvas';

const walls = [
  // {
  //   name: 'wall',
  //   x: 40,
  //   y: 470,
  //   height: 10,
  //   width: 300,
  //   color: 'red',
  // },
  // {
  //   name: 'wall',
  //   x: 500,
  //   y: 470,
  //   height: 10,
  //   width: 200,
  //   color: 'grey',
  // },
  // {
  //   name: 'wall',
  //   x: 0,
  //   y: 0,
  //   height: 480,
  //   width: 10,
  //   color: 'orange',
  // },
  // {
  //   name: 'wall',
  //   x: 0,
  //   y: 0,
  //   height: 10,
  //   width: 640,
  //   color: 'blue',
  // },
  // {
  //   name: 'wall',
  //   x: 630,
  //   y: 0,
  //   height: 480,
  //   width: 10,
  //   color: 'magenta',
  // },
  // {
  //   x: 50,
  //   y: 340,
  //   height: 50,
  //   width: 200,
  //   color: 'green',
  // },
  // {
  //   x: 300,
  //   y: 430,
  //   height: 50,
  //   width: 200,
  //   color: 'yellow',
  // },
];

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
  '@@@@@@       @@@@@@     @@@@@@@@@@@@@@@@@@@@@@',
  '@                                            @',
  '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
];

const mapParser = () => {
  const blockXSize = canvas.width / map[0].length;
  const blockYSize = canvas.height / map.length;

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

const mapObjects = walls.map((wall) => new Platform(wall));

export default mapObjects;
