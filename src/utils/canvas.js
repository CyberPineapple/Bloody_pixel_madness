export const canvas = document.querySelector('#canvas');

canvas.width = 640;
canvas.height = 480;
canvas.style.backgroundColor = 'black';

const ctx = canvas.getContext('2d');

export default ctx;
