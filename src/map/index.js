import Platform from '../objects/Platform.js';

const walls = [
  {
    name: 'wall',
    x: 40,
    y: 470,
    height: 10,
    width: 300,
    color: 'red',
  },
  {
    name: 'wall',
    x: 500,
    y: 470,
    height: 10,
    width: 200,
    color: 'grey',
  },
  {
    name: 'wall',
    x: 0,
    y: 0,
    height: 480,
    width: 10,
    color: 'orange',
  },
  {
    name: 'wall',
    x: 0,
    y: 0,
    height: 10,
    width: 640,
    color: 'blue',
  },
  {
    name: 'wall',
    x: 630,
    y: 0,
    height: 480,
    width: 10,
    color: 'magenta',
  },
  {
    x: 50,
    y: 340,
    height: 50,
    width: 200,
    color: 'green',
  },
  {
    x: 300,
    y: 430,
    height: 50,
    width: 200,
    color: 'yellow',
  },
];

const mapObjects = walls.map((wall) => new Platform(wall));

export default mapObjects;
