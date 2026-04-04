const VFD_CONFIG = {
    text: 'I love VFD displays in vintage electronics. Like this one. ',
    colorActive: '#00ff88',      
    colorInactive: '#001a0f',    
    cellShape: 'circle',         
    glow: true,                  
    cellSize: 4,                 
    rows: 7,                     
    scrollSpeed: -0.1,           
    fps: 10,                     
    charSpacing: 1,              
    cellPadding: 0.25            
};

const BITMAP_FONT = {
    "0": { width: 5, data: [14, 19, 21, 21, 21, 25, 14] },
    "1": { width: 4, data: [4, 12, 4, 4, 4, 4, 14] },
    "2": { width: 5, data: [14, 17, 1, 14, 16, 16, 31] },
    "3": { width: 5, data: [14, 17, 1, 14, 1, 17, 14] },
    "4": { width: 5, data: [17, 17, 17, 31, 1, 1, 1] },
    "5": { width: 5, data: [31, 16, 16, 30, 1, 17, 14] },
    "6": { width: 5, data: [14, 17, 16, 30, 17, 17, 14] },
    "7": { width: 5, data: [31, 1, 2, 4, 8, 8, 8] },
    "8": { width: 5, data: [14, 17, 17, 14, 17, 17, 14] },
    "9": { width: 5, data: [14, 17, 17, 15, 1, 17, 14] },
    "A": { width: 5, data: [14, 17, 17, 31, 17, 17, 17] },
    "B": { width: 5, data: [30, 17, 17, 30, 17, 17, 30] },
    "C": { width: 5, data: [14, 17, 16, 16, 16, 17, 14] },
    "D": { width: 5, data: [30, 17, 17, 17, 17, 17, 30] },
    "E": { width: 5, data: [31, 16, 16, 30, 16, 16, 31] },
    "F": { width: 5, data: [31, 16, 16, 30, 16, 16, 16] },
    "G": { width: 5, data: [14, 17, 16, 23, 17, 17, 14] },
    "H": { width: 5, data: [17, 17, 17, 31, 17, 17, 17] },
    "I": { width: 3, data: [7, 2, 2, 2, 2, 2, 7] },
    "J": { width: 5, data: [7, 2, 2, 2, 18, 18, 12] },
    "K": { width: 5, data: [17, 18, 20, 24, 20, 18, 17] },
    "L": { width: 5, data: [16, 16, 16, 16, 16, 16, 31] },
    "M": { width: 5, data: [10, 10, 21, 21, 17, 17, 17] },
    "N": { width: 5, data: [17, 25, 21, 19, 17, 17, 17] },
    "O": { width: 5, data: [14, 17, 17, 17, 17, 17, 14] },
    "P": { width: 5, data: [30, 17, 17, 30, 16, 16, 16] },
    "Q": { width: 5, data: [14, 17, 17, 17, 21, 18, 13] },
    "R": { width: 5, data: [30, 17, 17, 30, 18, 17, 17] },
    "S": { width: 5, data: [14, 17, 16, 14, 1, 17, 14] },
    "T": { width: 5, data: [31, 4, 4, 4, 4, 4, 4] },
    "U": { width: 5, data: [17, 17, 17, 17, 17, 17, 14] },
    "V": { width: 5, data: [17, 17, 17, 17, 10, 10, 4] },
    "W": { width: 5, data: [17, 17, 17, 21, 21, 10, 10] },
    "X": { width: 5, data: [17, 17, 10, 4, 10, 17, 17] },
    "Y": { width: 5, data: [17, 17, 10, 10, 4, 4, 4] },
    "Z": { width: 5, data: [31, 1, 2, 4, 8, 16, 31] },
    " ": { width: 3, data: [0, 0, 0, 0, 0, 0, 0] },
    "•": { width: 3, data: [0, 0, 0, 2, 0, 0, 0] },
    ".": { width: 2, data: [0, 0, 0, 0, 0, 3, 3] },
    "!": { width: 2, data: [2, 2, 2, 2, 2, 0, 2] },
    "?": { width: 5, data: [14, 17, 17, 2, 4, 0, 4] },
    "_": { width: 5, data: [0, 0, 0, 0, 0, 0, 31] },
    ":": { width: 3, data: [0, 2, 0, 0, 0, 2, 0] },
    "%": { width: 5, data: [17, 17, 2, 4, 8, 17, 17] },
    "-": { width: 5, data: [0, 0, 0, 31, 0, 0, 0] },
    "+": { width: 5, data: [0, 4, 4, 31, 4, 4, 0] },
    "/": { width: 5, data: [1, 2, 2, 4, 8, 8, 16] },
    "=": { width: 5, data: [0, 0, 31, 0, 31, 0, 0] },
    "(": { width: 3, data: [2, 4, 4, 4, 4, 4, 2] },
    ")": { width: 3, data: [4, 2, 2, 2, 2, 2, 4] },
    "DEFAULT": { width: 5, data: [0, 0, 0, 0, 0, 0, 0] }
};

class DotMatrixDisplay {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.cellSize = config.cellSize;
        this.rows = config.rows;
        this.text = config.text;
        this.scrollSpeed = config.scrollSpeed;
        this.glow = config.glow;
        this.cellShape = config.cellShape;
        this.cellPadding = config.cellPadding;
        this.charSpacing = config.charSpacing;
        this.fps = config.fps;
        this.colorActive = config.colorActive;
        this.colorInactive = config.colorInactive;
        
        this.offset = 0;
        this.lastTime = null;
        this.accumulator = 0;
        this.targetInterval = 1000 / this.fps;
        this.cols = 0;
        this.chars = [];
        this.bitmapWidth = 0;
        
        this.bgCanvas = document.createElement('canvas');
        this.bgCtx = this.bgCanvas.getContext('2d');
        this.bgDirty = true;
        
        this.handleResize = () => {
            this.setupCanvas();
            this.bgDirty = true;
        };
        
        this.init();
        this.animate();
    }

    init() {
        this.setupCanvas();
        this.parseText(this.text);
        window.addEventListener('resize', this.handleResize);
    }

    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        const canvasWidth = rect.width > 0 ? rect.width : 800;
        
        this.canvas.width = canvasWidth * dpr;
        this.canvas.height = this.rows * this.cellSize * dpr;
        
        this.canvas.style.width = canvasWidth + 'px';
        this.canvas.style.height = (this.rows * this.cellSize) + 'px';
        
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
        this.cols = Math.floor(canvasWidth / this.cellSize);
    }

    parseText(text) {
        this.chars = Array.from(text.toUpperCase()).map(ch => 
            BITMAP_FONT[ch] || BITMAP_FONT['DEFAULT']
        );
        
        this.bitmapWidth = this.chars.reduce(
            (acc, ch) => acc + ch.width + this.charSpacing, 
            0
        );
    }

    drawCellToContext(ctx, col, row, isActive) {
        const x = col * this.cellSize + this.cellSize / 2;
        const y = row * this.cellSize + this.cellSize / 2;
        const radius = this.cellSize / 2 - this.cellPadding;
        const color = isActive ? this.colorActive : this.colorInactive;

        if (isActive && this.glow) {
            ctx.shadowBlur = this.cellSize * 1.5;
            ctx.shadowColor = color;
            ctx.fillStyle = color;
            
            ctx.beginPath();
            if (this.cellShape === 'circle') {
                ctx.arc(x, y, radius, 0, Math.PI * 2);
            } else {
                ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
            }
            ctx.fill();
            
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            if (this.cellShape === 'circle') {
                ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
            } else {
                const r = radius * 0.5;
                ctx.rect(x - r, y - r, r * 2, r * 2);
            }
            ctx.fill();
        } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = color;
            ctx.beginPath();
            if (this.cellShape === 'circle') {
                ctx.arc(x, y, radius, 0, Math.PI * 2);
            } else {
                ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
            }
            ctx.fill();
        }
    }

    drawCell(col, row, isActive) {
        this.drawCellToContext(this.ctx, col, row, isActive);
    }
    
    renderBackground() {
        if (!this.bgDirty) return;
        
        this.bgCanvas.width = this.cols * this.cellSize;
        this.bgCanvas.height = this.rows * this.cellSize;
        
        this.bgCtx.fillStyle = '#000';
        this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.drawCellToContext(this.bgCtx, c, r, false);
            }
        }
        
        this.bgDirty = false;
    }

    render(deltaMs) {
        this.accumulator += deltaMs;

        if (this.accumulator < this.targetInterval) {
            return;
        }

        this.accumulator -= this.targetInterval;
        this.offset += this.scrollSpeed;

        this.renderBackground();
        this.ctx.drawImage(this.bgCanvas, 0, 0);

        const normalizedOffset = ((this.offset % this.bitmapWidth) + this.bitmapWidth) % this.bitmapWidth;
        const firstStart = normalizedOffset - this.bitmapWidth;

        for (let base = firstStart; base < this.cols + this.bitmapWidth; base += this.bitmapWidth) {
            let cursor = base;
            
            for (const ch of this.chars) {
                const w = ch.width;
                
                for (let y = 0; y < ch.data.length; y++) {
                    const rowBits = ch.data[y];
                    
                    for (let x = 0; x < w; x++) {
                        const isActive = (rowBits >> (w - 1 - x)) & 1;
                        
                        if (isActive) {
                            const col = cursor + x;
                            const row = y;
                            
                            if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                                this.drawCell(col, row, true);
                            }
                        }
                    }
                }
                
                cursor += w + this.charSpacing;
            }
        }
    }

    animate = (time) => {
        if (!this.lastTime) {
            this.lastTime = time;
        }

        const deltaMs = time - this.lastTime;
        this.lastTime = time;

        this.render(Math.min(deltaMs, 100));

        requestAnimationFrame(this.animate);
    }
}

const DISPLAY_COLOR = '#ff3b22';
const DISPLAY_SCALE = 0.16;

const segmentMap = {
    '0': ['a', 'b', 'c', 'd', 'e', 'f'],
    '1': ['b', 'c'],
    '2': ['a', 'b', 'd', 'e', 'g'],
    '3': ['a', 'b', 'c', 'd', 'g'],
    '4': ['b', 'c', 'f', 'g'],
    '5': ['a', 'c', 'd', 'f', 'g'],
    '6': ['a', 'c', 'd', 'e', 'f', 'g'],
    '7': ['a', 'b', 'c'],
    '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    '9': ['a', 'b', 'c', 'd', 'f', 'g'],
    ' ': []
};

const clockState = {
    digits: [],
    lastValue: '',
    formatter: new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
};

function initClockCache() {
    for (let i = 1; i <= 6; i++) {
        const module = document.getElementById(`digit-${i}`);
        if (!module) continue;

        const segments = {};
        ['a', 'b', 'c', 'd', 'e', 'f', 'g'].forEach(s => {
            segments[s] = module.querySelector(`.segment.${s}`);
        });

        clockState.digits.push({
            module,
            segments,
            dots: {
                top: module.querySelector('.dot.colon-top'),
                bottom: module.querySelector('.dot.dp')
            },
            lastChar: null
        });
    }
}

function updateDisplay(value) {
    const strVal = value.toString().slice(0, 6).padStart(6, '0');
    
    if (strVal === clockState.lastValue) return;
    clockState.lastValue = strVal;

    for (let i = 0; i < clockState.digits.length; i++) {
        const char = strVal[i];
        const digit = clockState.digits[i];

        if (digit.lastChar === char) continue;
        digit.lastChar = char;

        Object.values(digit.segments).forEach(seg => {
            if (seg) seg.classList.remove('on');
        });

        const activeSegments = segmentMap[char] || [];
        activeSegments.forEach(segKey => {
            const seg = digit.segments[segKey];
            if (seg) seg.classList.add('on');
        });

        if (digit.dots.top || digit.dots.bottom) {
            const isColon = (i === 1 || i === 3);
            if (digit.dots.top) digit.dots.top.classList.toggle('on', isColon);
            if (digit.dots.bottom) digit.dots.bottom.classList.toggle('on', isColon);
        }
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function updateColor(hexValue) {
    const root = document.documentElement;
    root.style.setProperty('--led-color', hexValue);

    const rgb = hexToRgb(hexValue);
    if(rgb) {
        root.style.setProperty('--led-glow-1', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`);
        root.style.setProperty('--led-glow-2', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`);
        root.style.setProperty('--led-glow-3', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`);
    }
}

function initLabPage() {
    const canvas = document.getElementById('display');
    if (canvas) {
        new DotMatrixDisplay(canvas, VFD_CONFIG);
    }

    initClockCache();
    document.documentElement.style.setProperty('--display-scale', DISPLAY_SCALE);
    updateColor(DISPLAY_COLOR);

    const getEstClockString = () => {
        const parts = clockState.formatter.formatToParts(new Date());
        const hour = parts.find(p => p.type === 'hour')?.value ?? '00';
        const minute = parts.find(p => p.type === 'minute')?.value ?? '00';
        const second = parts.find(p => p.type === 'second')?.value ?? '00';
        return `${hour}${minute}${second}`;
    };

    const renderClock = () => {
        updateDisplay(getEstClockString());
    };

    renderClock();
    setInterval(renderClock, 1000);
}
