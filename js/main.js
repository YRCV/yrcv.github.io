
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

// --- About Page Data Loading ---
async function loadAboutData() {
    try {
        const response = await fetch('data/about.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Populate profile section
        const profileImage = document.getElementById('profileImage');
        if (profileImage) {
            profileImage.src = data.profileImage;
            profileImage.alt = data.name;
        }

        const profileName = document.getElementById('profileName');
        if (profileName) profileName.textContent = data.name;

        const profileTitle = document.getElementById('profileTitle');
        if (profileTitle) profileTitle.textContent = data.title;

        // Populate bio paragraphs
        const bioContent = document.getElementById('bioContent');
        if (bioContent) {
            bioContent.innerHTML = '';
            data.bio.forEach(paragraph => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                bioContent.appendChild(p);
            });
        }

        // Populate gallery
        const galleryGrid = document.getElementById('galleryGrid');
        if (galleryGrid && data.gallery) {
            galleryGrid.innerHTML = '';
            data.gallery.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';

                const img = document.createElement('img');
                img.src = image.src;
                img.alt = image.alt;
                img.className = 'gallery-image';
                galleryItem.appendChild(img);

                // Add caption overlay if description exists
                if (image.alt) {
                    const caption = document.createElement('div');
                    caption.className = 'gallery-caption';
                    caption.textContent = image.alt;
                    galleryItem.appendChild(caption);
                }

                galleryGrid.appendChild(galleryItem);
            });
        }

        console.log('About page data loaded successfully');

    } catch (error) {
        console.error('Error loading about data:', error);
        const bioContent = document.getElementById('bioContent');
        if (bioContent) {
            bioContent.innerHTML = '<p>Error loading content. Please refresh the page.</p>';
        }
    }
}

// Load Experience Page Data
async function loadExperienceData() {
    try {
        const response = await fetch('data/experience.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Separate experiences by type
        const workExperiences = data.experiences.filter(exp => exp.type === 'work' || exp.type === 'teaching');
        const leadershipExperiences = data.experiences.filter(exp => exp.type === 'leadership');

        // Populate Work section
        const workContainer = document.getElementById('work-experiences');
        if (workContainer) {
            workContainer.innerHTML = '';
            workExperiences.forEach(exp => {
                workContainer.appendChild(createExperienceCard(exp));
            });
        }

        // Populate Leadership section
        const leadershipContainer = document.getElementById('leadership-experiences');
        if (leadershipContainer) {
            leadershipContainer.innerHTML = '';
            leadershipExperiences.forEach(exp => {
                leadershipContainer.appendChild(createExperienceCard(exp));
            });
        }

        console.log('Experience page data loaded successfully');

    } catch (error) {
        console.error('Error loading experience data:', error);
    }
}

function createExperienceCard(exp) {
    const card = document.createElement('div');
    card.className = 'experience-card';

    // Create header
    const header = document.createElement('div');
    header.className = 'experience-header';

    const titleGroup = document.createElement('div');
    titleGroup.className = 'experience-title-group';

    const role = document.createElement('h3');
    role.className = 'experience-role';
    role.textContent = exp.role;
    titleGroup.appendChild(role);

    const company = document.createElement('div');
    company.className = 'experience-company';
    company.textContent = exp.company;
    titleGroup.appendChild(company);

    header.appendChild(titleGroup);

    const date = document.createElement('div');
    date.className = 'experience-date';
    date.textContent = `${exp.startDate} – ${exp.endDate}`;
    header.appendChild(date);

    card.appendChild(header);

    // Create description
    if (exp.description && exp.description.length > 0) {
        const description = document.createElement('div');
        description.className = 'experience-description';

        const ul = document.createElement('ul');
        exp.description.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });

        description.appendChild(ul);
        card.appendChild(description);
    }

    return card;
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
    'contact': 'pages/contact.html',
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
        } else if (pageName === 'about') {
            loadAboutData();
        } else if (pageName === 'experience') {
            loadExperienceData();
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