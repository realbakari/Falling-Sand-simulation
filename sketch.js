// Constants for canvas size and simulation parameters
const WIDTH = 800;
const HEIGHT = 800;
const MIN_BRUSH_SIZE = 3;
let MIN_CELL_SIZE = 5; // Use let instead of const for a variable that may be modified

let grid; // 2D array to represent the grid
let currentHue; // Current hue value for coloring grid elements
let brushSize = 11; // Size of the brush for user interaction
let chance = 0.05; // Chance for sand particles to move during simulation
let simulationRunning = true; // Flag to control simulation state

// Helper function to get an element at specific coordinates in the grid
function getElementAt(x, y) {
  if (x >= 0 && y >= 0 && x < grid.length && y < grid[0].length) {
    return grid[x][y];
  } else {
    return null;
  }
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  initializeGrid(); // Initialize the grid with default values
  currentHue = 0; // Initialize currentHue
}

function draw() {
  background(0);
  drawGrid(); // Draw grid elements on the canvas
  updateSimulation(); // Update simulation logic
  drawUI(); // Draw user interface elements
}

// Function called when the mouse is dragged
function mouseDragged() {
  updateGridWithMouse(); // Update the grid based on mouse interaction
}

// Function called when a key is pressed
function keyPressed() {
  if (keyCode === 32) {
    toggleSimulation(); // Toggle the simulation on/off when the spacebar is pressed
  }
}

// Function called when the mouse wheel is scrolled
function mouseWheel(event) {
  changeParameters(event); // Change simulation parameters based on mouse wheel
}

// Initialize the grid with default values
function initializeGrid() {
  grid = new Array(floor(WIDTH / MIN_CELL_SIZE)).fill().map(() => new Array(floor(HEIGHT / MIN_CELL_SIZE)).fill(0));
}

// Draw the grid on the canvas
function drawGrid() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] > 0) {
        // Draw colored rectangles for non-zero grid elements
        let fillColor = color(`hsb(${grid[i][j]}, 100%, 100%)`);
        fill(fillColor);
        noStroke();
        rect(i * MIN_CELL_SIZE, j * MIN_CELL_SIZE, MIN_CELL_SIZE, MIN_CELL_SIZE);
      }
    }
  }
}

// Update the simulation based on the sand logic
function updateSimulation() {
  if (simulationRunning) {
    for (let j = grid[0].length - 1; j >= 0; j--) {
      for (let i = 0; i < grid.length; i++) {
        if (grid[i][j] > 0) {
          let below = getElementAt(i, j + 1);
          if (below !== null) {
            if (below === 0) {
              grid[i][j + 1] = grid[i][j];
              grid[i][j] = 0;
            } else {
              let dir = random() > 0.5 ? 1 : -1;
              let a = getElementAt(i + dir, j + 1);
              let b = getElementAt(i - dir, j + 1);
              if (a !== null && a === 0) {
                grid[i + dir][j + 1] = grid[i][j];
                grid[i][j] = 0;
              } else if (b !== null && b === 0) {
                grid[i - dir][j + 1] = grid[i][j];
                grid[i][j] = 0;
              }
            }
          }
        }
      }
    }
  }
}

// Update the grid based on mouse interaction
function updateGridWithMouse() {
  let xPos = floor(mouseX / MIN_CELL_SIZE);
  let yPos = floor(mouseY / MIN_CELL_SIZE);
  for (let x = -floor(brushSize / 2); x < floor(brushSize / 2); x++) {
    for (let y = -floor(brushSize / 2); y < floor(brushSize / 2); y++) {
      if (chance >= random() || mouseButton === RIGHT) {
        let xp = xPos + x;
        let yp = yPos + y;
        if (xp >= 0 && yp >= 0 && xp < grid.length && yp < grid[0].length) {
          if (mouseButton === LEFT) {
            if (grid[xp][yp] === 0) grid[xp][yp] = floor(currentHue += 0.05);
          } else if (mouseButton === RIGHT) {
            grid[xp][yp] = 0;
          }
        }
      }
    }
  }
}

// Toggle the simulation on/off
function toggleSimulation() {
  simulationRunning = !simulationRunning;
}

// Change simulation parameters based on mouse wheel
function changeParameters(event) {
  const bInc = 2;
  const cInc = 1;
  const chanceInc = 0.05;

  if (event.deltaY > 0) {
    if (keyIsDown(CONTROL)) {
      MIN_CELL_SIZE += cInc;
      grid = new Array(floor(WIDTH / MIN_CELL_SIZE)).fill().map(() => new Array(floor(HEIGHT / MIN_CELL_SIZE)).fill(0));
    } else if (keyIsDown(ALT)) {
      chance += chanceInc;
    } else {
      brushSize += bInc;
    }
  } else if (event.deltaY < 0) {
    if (keyIsDown(CONTROL)) {
      MIN_CELL_SIZE -= cInc;
      if (MIN_CELL_SIZE >= MIN_BRUSH_SIZE) {
        grid = new Array(floor(WIDTH / MIN_CELL_SIZE)).fill().map(() => new Array(floor(HEIGHT / MIN_CELL_SIZE)).fill(0));
      }
    } else if (keyIsDown(ALT)) {
      chance -= chanceInc;
    } else {
      brushSize -= bInc;
    }
  }

  brushSize = max(MIN_BRUSH_SIZE, brushSize);
  let MIN_CELL_SIZE = 5; // Corrected to MIN_CELL_SIZE without 'let'
  chance = constrain(chance, 0, 1);
}

// Draw user interface elements on the canvas
function drawUI() {
  fill(255);
  textSize(16);
  text(`Brush size: ${brushSize}\nCELL_SIZE: ${MIN_CELL_SIZE}\nChance: ${chance.toFixed(3)}\nSimulation running: ${simulationRunning ? 'Yes' : 'No'}`, 10, 25);
}
