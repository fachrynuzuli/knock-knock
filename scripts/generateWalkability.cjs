const fs = require('fs');
const { createCanvas } = require('canvas');

// Manual replication of coordinates from gameObjects.ts for simplicity
const width = 2048;
const height = 1342;

// Create white canvas
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#ffffff'; // White = Walkable
ctx.fillRect(0, 0, width, height);

// Draw boundaries
ctx.fillStyle = '#000000'; // Black = Blocked
ctx.fillRect(0, 0, width, 10);
ctx.fillRect(0, 0, 10, height);
ctx.fillRect(width - 10, 0, 10, height);
ctx.fillRect(0, height - 10, width, 10);

const rects = [
  // townHall
  { x: 820, y: 420, width: 440, height: 300 },
  // emptyLand
  { x: 520, y: 450, width: 128, height: 64 },
  { x: 970, y: 450, width: 128, height: 64 },
  { x: 300, y: 870, width: 128, height: 64 },
  { x: 1045, y: 270, width: 128, height: 64 },
  { x: 610, y: 700, width: 128, height: 64 },
  { x: 940, y: 870, width: 128, height: 64 },
  { x: 650, y: 870, width: 128, height: 64 },
  // trees
  { x: 150, y: 300, width: 64, height: 96 },
  { x: 1800, y: 200, width: 64, height: 128 },
  { x: 400, y: 600, width: 48, height: 80 },
  { x: 1600, y: 800, width: 72, height: 100 },
  { x: 800, y: 1000, width: 80, height: 120 },
  // bushes
  { x: 250, y: 150, width: 32, height: 32 },
  { x: 1200, y: 350, width: 48, height: 24 },
  { x: 600, y: 950, width: 40, height: 28 },
  { x: 1400, y: 600, width: 36, height: 30 },
  // rocks
  { x: 100, y: 800, width: 64, height: 48 },
  { x: 1700, y: 400, width: 48, height: 32 },
  { x: 900, y: 150, width: 40, height: 56 },
];

rects.forEach(r => {
  ctx.fillRect(r.x, r.y, r.width, r.height);
});

// Save mask to public folder
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/walkability_mask.png', buffer);
console.log('Walkability mask created at public/walkability_mask.png');
