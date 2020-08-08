import Canvas from '../utils/canvas';

const platforms = [];

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
  const blockXSize = Math.round(Canvas.element.width / map[0].length);
  const blockYSize = Math.round(Canvas.element.height / map.length);

  for (let i = 0; i < map.length; i++) {
    let result = Array.from(map[i].matchAll(/@+/g));
    result = result.map((v) => ({
      length: v[0].length,
      index: v.index,
    }));
    result.forEach((v) => {
      platforms.push({
        x: v.index * blockXSize,
        width: v.length * blockXSize,
        y: i * blockYSize,
        height: blockYSize,
      });
    });
  }
};

mapParser();

export default platforms;
