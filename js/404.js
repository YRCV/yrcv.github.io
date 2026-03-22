const canvas = document.getElementById('sand-canvas');
const ctx = canvas.getContext('2d', { alpha: false });

const CELL_SIZE = 4;
let cols, rows;
let grid = [];
let mask = [];
let topSpawns = [];

// offscreen render buffer
const renderCanvas = document.createElement('canvas');
const renderCtx = renderCanvas.getContext('2d', { alpha: false });
let imgData;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    cols = Math.ceil(canvas.width / CELL_SIZE);
    rows = Math.ceil(canvas.height / CELL_SIZE);
    
    renderCanvas.width = cols;
    renderCanvas.height = rows;
    imgData = renderCtx.createImageData(cols, rows);
    
    grid = new Uint8Array(cols * rows);
    mask = new Uint8Array(cols * rows);
    topSpawns = new Int32Array(cols).fill(-1);

    // render mask bounds
    const textCanvas = document.createElement('canvas');
    textCanvas.width = cols;
    textCanvas.height = rows;
    const textCtx = textCanvas.getContext('2d');
    
    textCtx.fillStyle = 'white';
    textCtx.textAlign = 'center';
    textCtx.textBaseline = 'middle';
    
    const fontSize = Math.min(cols * 0.45, rows * 0.7); 
    textCtx.font = `bold ${fontSize}px "SF MONO", "Fira Code", monospace`;
    textCtx.fillText('404', cols / 2, rows / 2);
    
    // read pixels into mask
    const textData = textCtx.getImageData(0, 0, cols, rows).data;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const index = (y * cols + x) * 4;
            if (textData[index + 3] > 127) {
                mask[y * cols + x] = 1;
                if (topSpawns[x] === -1) {
                    topSpawns[x] = y;
                }
            }
        }
    }
}

window.addEventListener('resize', resize);
resize();

// interaction
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousedown', () => isMouseDown = true);
window.addEventListener('mouseup', () => isMouseDown = false);
window.addEventListener('mousemove', (e) => {
    mouseX = Math.floor(e.clientX / CELL_SIZE);
    mouseY = Math.floor(e.clientY / CELL_SIZE);
});

window.addEventListener('touchstart', () => isMouseDown = true);
window.addEventListener('touchend', () => isMouseDown = false);
window.addEventListener('touchmove', (e) => {
    mouseX = Math.floor(e.touches[0].clientX / CELL_SIZE);
    mouseY = Math.floor(e.touches[0].clientY / CELL_SIZE);
});

function spawnSand() {
    // rain from mask tops
    for (let x = 0; x < cols; x++) {
        const startY = topSpawns[x];
        if (startY !== -1 && Math.random() > 0.65) {
            if (grid[startY * cols + x] === 0) {
                grid[startY * cols + x] = 1;
            }
        }
    }
    
    // draw sand with mouse
    if (isMouseDown && mouseX >= 0 && mouseX < cols && mouseY >= 0 && mouseY < rows) {
        let brushSize = 2;
        for (let y = -brushSize; y <= brushSize; y++) {
            for (let x = -brushSize; x <= brushSize; x++) {
                if (x*x + y*y <= brushSize*brushSize) {
                    let gx = mouseX + x;
                    let gy = mouseY + y;
                    if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
                        let idx = gy * cols + gx;
                        if (mask[idx] === 1 && grid[idx] === 0) {
                            grid[idx] = 1;
                        }
                    }
                }
            }
        }
    }
}

function updatePhysics() {
    spawnSand();
    
    // update bottom to top
    for (let y = rows - 2; y >= 0; y--) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        const startX = dir === 1 ? 0 : cols - 1;
        const endX = dir === 1 ? cols : -1;
        
        for (let x = startX; x !== endX; x += dir) {
            const idx = y * cols + x;
            
            if (grid[idx] === 1) {
                const below = (y + 1) * cols + x;
                const belowLeft = (y + 1) * cols + (x - 1);
                const belowRight = (y + 1) * cols + (x + 1);
                
                const destBelow = grid[below] === 0 && mask[below] === 1;
                const destLeft = x > 0 && grid[belowLeft] === 0 && mask[belowLeft] === 1;
                const destRight = x < cols - 1 && grid[belowRight] === 0 && mask[belowRight] === 1;
                
                if (destBelow) {
                    grid[below] = 1;
                    grid[idx] = 0;
                } else {
                    if (destLeft && destRight) {
                        grid[idx] = 0;
                        if (Math.random() < 0.5) {
                            grid[belowLeft] = 1;
                        } else {
                            grid[belowRight] = 1;
                        }
                    } else if (destLeft) {
                        grid[belowLeft] = 1;
                        grid[idx] = 0;
                    } else if (destRight) {
                        grid[belowRight] = 1;
                        grid[idx] = 0;
                    }
                }
            }
        }
    }
}

function render() {
    const isDark = document.body.classList.contains('dark-mode');
    
    const bgR = isDark ? 10 : 245;
    const bgG = isDark ? 10 : 245;
    const bgB = isDark ? 10 : 245;
    
    const sR = isDark ? 190 : 80;
    const sG = isDark ? 190 : 80;
    const sB = isDark ? 190 : 80;
    
    const data = imgData.data;
    
    for (let i = 0; i < grid.length; i++) {
        const p = i * 4;
        
        if (grid[i] === 1) { 
            data[p] = sR;
            data[p+1] = sG;
            data[p+2] = sB;
            data[p+3] = 255;
        } else {
            data[p] = bgR;
            data[p+1] = bgG;
            data[p+2] = bgB;
            data[p+3] = 255;
        }
    }
    
    renderCtx.putImageData(imgData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
}

function loop() {
    updatePhysics();
    render();
    requestAnimationFrame(loop);
}

loop();
