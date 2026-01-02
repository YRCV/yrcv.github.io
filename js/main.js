function toggleMode() {
    const currentMode = document.body.className.includes('dark') ? 'dark' : 'light';
    const newMode = currentMode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
}

function setMode(mode) {
    document.body.className = mode + '-mode';
    localStorage.setItem('preferredMode', mode);
}

function initMode() {
    const savedMode = localStorage.getItem('preferredMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setMode(savedMode || (prefersDark ? 'dark' : 'light'));
}

const container = document.getElementById('pcbContainer');
const reveal = document.getElementById('pcbReveal');
const cursor = document.getElementById('cursor');

const REVEAL_RADIUS = 45;

container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(REVEAL_RADIUS, Math.min(x, rect.width - REVEAL_RADIUS));
    y = Math.max(REVEAL_RADIUS, Math.min(y, rect.height - REVEAL_RADIUS));

    reveal.style.clipPath = `circle(${REVEAL_RADIUS}px at ${x}px ${y}px)`;

    cursor.style.left = (rect.left + x) + 'px';
    cursor.style.top = (rect.top + y) + 'px';
    cursor.style.opacity = '1';
});

container.addEventListener('mouseleave', () => {
    reveal.style.clipPath = 'circle(0px at 50% 50%)';
    cursor.style.opacity = '0';
});

initMode();
