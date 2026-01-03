
// --- Mode management ---
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

// --- PCB Reveal Effect ---
function initPCBEffect() {
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

    console.log('PCB effect initialized');
}

// --- Router for page navigation ---

// Map routes
const routes = {
    'landing': 'pages/landing.html',
    'about': 'pages/about.html',
    'experience': 'pages/experience.html',
    'projects': 'pages/projects.html',
    'skills': 'pages/skills.html',
    'blog': 'pages/blog.html',
};

async function loadPage(pageName) {
    const content = document.getElementById('content');

    if (pageName.startsWith('blog/')) {
        const postId = pageName.split('/')[1];
        const response = await fetch(`pages/blog-post.html`);
        const html = await response.text();
        content.innerHTML = html;
        return;
    }

    try {
        const response = await fetch(routes[pageName]);
        if (!response.ok) throw new Error(`Page ${pageName} not found`);

        const html = await response.text();
        content.innerHTML = html;

        console.log(`Loaded page: ${pageName}`);

        if (pageName === 'landing') {
            initPCBEffect();
        } else if (pageName === 'blog') {
            //loadBlogPosts();
        }
    } catch (error) {
        console.error('Error loading page:', error);
        content.innerHTML = '<p>Page not found</p>';
    }
}

// Handle link clicks
function handleNavigation(event) {
    if (event.target.matches('a[href^="#"]')) {
        event.preventDefault();

        const href = event.target.getAttribute('href');
        const pageName = href.substring(1);

        if (pageName === 'landing' || pageName === '') {
            window.history.pushState({}, '', window.location.pathname);
            loadPage('landing');
        } else {
            window.history.pushState({}, '', `#${pageName}`);
            loadPage(pageName);
        }
    }
}

document.addEventListener('click', handleNavigation);
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    const pageName = hash || 'landing';
    loadPage(pageName);
});

// Initialize the right page
function initRouter() {
    const hash = window.location.hash.substring(1);
    
    if (!hash || hash === 'landing') {
        window.history.replaceState({}, '', window.location.pathname);
        loadPage('landing');
    } else {
        loadPage(hash);
    }
}

// --- Initialize everything ---
function init() {
    console.log('Initializing site...');
    initMode();
    initRouter();
}

// Wait for page to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}