

// --- Mode management ---
function toggleMode() {
    const currentMode = document.body.className.includes('dark') ? 'dark' : 'light';
    const newMode = currentMode === 'dark' ? 'light' : 'dark';
    playClick();
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
async function loadAboutData(preloadedData) {
    try {
        let data = preloadedData;

        if (!data) {
            const response = await fetch('data/about.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            data = await response.json();
        }

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
                p.innerHTML = paragraph;
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
                img.loading = 'lazy';
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



        // Load skills into About page
        loadSkillsIntoAbout();

    } catch (error) {
        console.error('Error loading about data:', error);
        const bioContent = document.getElementById('bioContent');
        if (bioContent) {
            bioContent.innerHTML = '<p>Error loading content. Please refresh the page.</p>';
        }
    }
}

// Load Skills into About Page
async function loadSkillsIntoAbout() {
    try {
        const response = await fetch('data/skills.json');
        if (!response.ok) return;

        const data = await response.json();
        const container = document.getElementById('skillsContent');

        if (container && data.categories) {
            container.innerHTML = '';

            data.categories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'skill-category';

                const categoryName = document.createElement('div');
                categoryName.className = 'skill-category-name';
                categoryName.textContent = category.name;
                categoryDiv.appendChild(categoryName);

                const skillList = document.createElement('div');
                skillList.className = 'skill-list';

                category.skills.forEach(skill => {
                    const skillBox = document.createElement('div');
                    skillBox.className = 'skill-box';
                    skillBox.textContent = skill;
                    skillList.appendChild(skillBox);
                });

                categoryDiv.appendChild(skillList);
                container.appendChild(categoryDiv);
            });
        }
    } catch (error) {
        console.error('Error loading skills into about page:', error);
    }
}

// Load Experience Page Data
async function loadExperienceData(preloadedData) {
    try {
        let data = preloadedData;

        if (!data) {
            const response = await fetch('data/experience.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            data = await response.json();
        }

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

// --- Project Modal ---
function ensureProjectModal() {
    if (document.getElementById('project-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'project-modal-overlay';
    overlay.className = 'project-modal-overlay';

    const backdrop = document.createElement('div');
    backdrop.className = 'project-modal-backdrop';
    backdrop.addEventListener('click', closeProjectModal);

    const card = document.createElement('div');
    card.className = 'project-modal-card';
    card.id = 'project-modal-card';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'project-modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeProjectModal);
    card.appendChild(closeBtn);

    // Header (title + subtitle)
    const header = document.createElement('div');
    header.className = 'project-modal-header';
    const titleEl = document.createElement('h2');
    titleEl.className = 'project-modal-title';
    titleEl.id = 'pm-title';
    const subtitleEl = document.createElement('p');
    subtitleEl.className = 'project-modal-subtitle';
    subtitleEl.id = 'pm-subtitle';
    header.appendChild(titleEl);
    header.appendChild(subtitleEl);
    card.appendChild(header);

    // Image
    const imageWrap = document.createElement('div');
    imageWrap.className = 'project-modal-image-wrap';
    imageWrap.id = 'pm-image-wrap';
    const blurImg = document.createElement('img');
    blurImg.className = 'project-modal-image-blur';
    blurImg.id = 'pm-blur';
    blurImg.alt = '';
    blurImg.loading = 'lazy';
    const mainImg = document.createElement('img');
    mainImg.className = 'project-modal-image';
    mainImg.id = 'pm-img';
    mainImg.loading = 'lazy';
    imageWrap.appendChild(blurImg);
    imageWrap.appendChild(mainImg);
    card.appendChild(imageWrap);

    // Links (GitHub / Demo)
    const linksRow = document.createElement('div');
    linksRow.className = 'project-modal-links';
    linksRow.id = 'pm-links';
    card.appendChild(linksRow);

    // Divider
    const divider = document.createElement('div');
    divider.className = 'project-modal-divider';
    card.appendChild(divider);

    // Sections
    const sections = document.createElement('div');
    sections.className = 'project-modal-sections';

    ['problem', 'solution', 'tech'].forEach(key => {
        const section = document.createElement('div');
        section.className = 'project-modal-section';
        section.id = `pm-section-${key}`;
        const label = document.createElement('div');
        label.className = 'project-modal-section-label';
        label.textContent = key === 'tech' ? 'Technical Details' : key.charAt(0).toUpperCase() + key.slice(1);
        section.appendChild(label);
        const body = document.createElement('div');
        body.className = 'project-modal-section-body';
        body.id = `pm-${key}-body`;
        section.appendChild(body);
        sections.appendChild(section);
    });

    card.appendChild(sections);
    overlay.appendChild(backdrop);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProjectModal();
    });
}

function openProjectModal(project) {
    ensureProjectModal();

    // Title & subtitle
    document.getElementById('pm-title').textContent = project.title;
    const subtitleEl = document.getElementById('pm-subtitle');
    subtitleEl.textContent = project.subtitle || '';
    subtitleEl.className = 'project-modal-subtitle' + (project.highlightSubtitle ? ' highlight' : '');

    // Image
    const src = project.image || '';
    document.getElementById('pm-blur').src = src;
    const mainImg = document.getElementById('pm-img');
    mainImg.src = src;
    mainImg.alt = project.title;

    // Links
    const linksRow = document.getElementById('pm-links');
    linksRow.innerHTML = '';
    if (project.github) {
        const a = document.createElement('a');
        a.href = project.github;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'project-modal-link';
        a.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> GitHub`;
        linksRow.appendChild(a);
    }
    if (project.demo) {
        const a = document.createElement('a');
        a.href = project.demo;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'project-modal-link';
        a.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Demo`;
        linksRow.appendChild(a);
    }

    // Problem
    document.getElementById('pm-problem-body').textContent = project.problem || '-';
    // Solution
    document.getElementById('pm-solution-body').textContent = project.solution || '-';
    // Tech details
    const techBody = document.getElementById('pm-tech-body');
    if (project.technicalDetails) {
        techBody.textContent = project.technicalDetails;
    } else if (project.tech && project.tech.length) {
        // Fallback: render tech tags
        techBody.innerHTML = '';
        const tagsWrap = document.createElement('div');
        tagsWrap.className = 'project-modal-tech';
        project.tech.forEach(t => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = t;
            tagsWrap.appendChild(tag);
        });
        techBody.appendChild(tagsWrap);
    } else {
        techBody.textContent = '-';
    }

    // Open
    const overlay = document.getElementById('project-modal-overlay');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    const content = document.getElementById('content');
    if (content) content.classList.add('modal-open');
    playOpen();
}

function closeProjectModal() {
    const overlay = document.getElementById('project-modal-overlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    const content = document.getElementById('content');
    if (content) content.classList.remove('modal-open');
    playClose();
}

// Load Projects Page Data
async function loadProjectsData(preloadedData) {
    try {
        let data = preloadedData;

        if (!data) {
            const response = await fetch('data/projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            data = await response.json();
        }

        const grid = document.getElementById('projects-grid');

        if (grid && data.projects) {
            grid.innerHTML = '';

            data.projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'project-card';
                card.style.cursor = 'pointer';
                card.addEventListener('click', (e) => {
                    // Don't open modal if user clicked a link icon
                    if (e.target.closest('.project-icon-link')) return;
                    openProjectModal(project);
                });

                // Project image container with blurred background
                const imageContainer = document.createElement('div');
                imageContainer.className = 'project-image-container';

                // Blurred background image
                const blurredImg = document.createElement('img');
                blurredImg.src = project.image;
                blurredImg.className = 'project-image-blur';
                blurredImg.loading = 'lazy';
                imageContainer.appendChild(blurredImg);

                // Main clear image on top
                const img = document.createElement('img');
                img.src = project.image;
                img.alt = '';
                img.className = 'project-image project-image--loading';
                img.loading = 'lazy';

                const revealCard = () => {
                    img.classList.remove('project-image--loading');
                    card.classList.remove('project-card--skeleton');
                };
                img.addEventListener('load', revealCard, { once: true });
                img.addEventListener('error', revealCard, { once: true });

                imageContainer.appendChild(img);
                card.appendChild(imageContainer);

                // Start in skeleton state
                card.classList.add('project-card--skeleton');


                // Project content
                const content = document.createElement('div');
                content.className = 'project-content';

                // Title with icons
                const titleRow = document.createElement('div');
                titleRow.className = 'project-title-row';

                const title = document.createElement('h3');
                title.className = 'project-title';
                title.textContent = project.title;
                titleRow.appendChild(title);



                // Icons container
                const iconsContainer = document.createElement('div');
                iconsContainer.className = 'project-icons';

                if (project.github) {
                    const githubLink = document.createElement('a');
                    githubLink.href = project.github;
                    githubLink.target = '_blank';
                    githubLink.className = 'project-icon-link';
                    githubLink.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>`;
                    iconsContainer.appendChild(githubLink);
                }

                if (project.demo) {
                    const demoLink = document.createElement('a');
                    demoLink.href = project.demo;
                    demoLink.target = '_blank';
                    demoLink.className = 'project-icon-link';
                    demoLink.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>`;
                    iconsContainer.appendChild(demoLink);
                }

                titleRow.appendChild(iconsContainer);
                content.appendChild(titleRow);

                // Subtitle (if exists) - below title
                if (project.subtitle) {
                    const subtitle = document.createElement('div');
                    subtitle.className = project.highlightSubtitle ? 'project-subtitle highlight' : 'project-subtitle';
                    subtitle.textContent = project.subtitle;
                    content.appendChild(subtitle);
                }

                // Description
                const description = document.createElement('p');
                description.className = 'project-description';
                description.textContent = project.description;
                content.appendChild(description);

                // Tech stack
                const techContainer = document.createElement('div');
                techContainer.className = 'project-tech';
                project.tech.forEach(tech => {
                    const tag = document.createElement('span');
                    tag.className = 'tech-tag';
                    tag.textContent = tech;
                    techContainer.appendChild(tag);
                });
                content.appendChild(techContainer);


                card.appendChild(content);
                grid.appendChild(card);
            });
        }



    } catch (error) {
        console.error('Error loading projects data:', error);
    }
}

// Load Skills Page Data
async function loadSkillsData(preloadedData) {
    try {
        let data = preloadedData;

        if (!data) {
            const response = await fetch('data/skills.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            data = await response.json();
        }

        const container = document.getElementById('skills-content');
        if (container && data.categories) {
            container.innerHTML = '';

            data.categories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'skill-category';

                const categoryName = document.createElement('div');
                categoryName.className = 'skill-category-name';
                categoryName.textContent = category.name;
                categoryDiv.appendChild(categoryName);

                const skillList = document.createElement('div');
                skillList.className = 'skill-list';

                category.skills.forEach(skill => {
                    const skillBox = document.createElement('div');
                    skillBox.className = 'skill-box';
                    skillBox.textContent = skill;
                    skillList.appendChild(skillBox);
                });

                categoryDiv.appendChild(skillList);
                container.appendChild(categoryDiv);
            });
        }



    } catch (error) {
        console.error('Error loading skills data:', error);
    }
}

// --- PCB Reveal Effect ---
function initPCBEffect() {
    const container = document.getElementById('pcbContainer');
    const reveal = document.getElementById('pcbReveal');
    const cursor = document.getElementById('cursor');

    const REVEAL_RADIUS = 45;
    let sweepDone = false;

    // Intro sweep: animate circle from left → right → collapse
    function runIntroSweep() {
        const rect = container.getBoundingClientRect();
        const sweepDuration = 1800; // ms for the left→right pass
        const fadeDuration = 400;  // ms to collapse after
        const startY = rect.height / 2;
        const startX = REVEAL_RADIUS;
        const endX = rect.width - REVEAL_RADIUS;
        let startTime = null;

        function sweepStep(ts) {
            if (!startTime) startTime = ts;
            const elapsed = ts - startTime;
            const t = Math.min(elapsed / sweepDuration, 1);
            // ease-in-out cubic
            const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            const x = startX + (endX - startX) * eased;

            reveal.style.clipPath = `circle(${REVEAL_RADIUS}px at ${x}px ${startY}px)`;

            if (t < 1) {
                requestAnimationFrame(sweepStep);
            } else {
                // Collapse back
                reveal.style.transition = `clip-path ${fadeDuration}ms ease`;
                reveal.style.clipPath = 'circle(0px at 50% 50%)';
                setTimeout(() => {
                    reveal.style.transition = '';
                    sweepDone = true;
                }, fadeDuration);
            }
        }

        requestAnimationFrame(sweepStep);
    }

    // Small delay so the page has settled before the sweep
    // Only play up to twice per session
    const sweepCount = parseInt(sessionStorage.getItem('pcbSweepCount') || '0', 10);
    if (sweepCount < 2) {
        sessionStorage.setItem('pcbSweepCount', sweepCount + 1);
        setTimeout(runIntroSweep, 600);
    }

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
        // Start fetching HTML immediately
        const htmlPromise = fetch(routes[pageName]).then(response => {
            if (!response.ok) throw new Error(`Page ${pageName} not found`);
            return response.text();
        });

        // Start fetching Data immediately (Parallel Fetching)
        let dataPromise = Promise.resolve(null);
        if (pageName === 'about') {
            dataPromise = fetch('data/about.json').then(r => r.json()).catch(() => null);
        } else if (pageName === 'experience') {
            dataPromise = fetch('data/experience.json').then(r => r.json()).catch(() => null);
        } else if (pageName === 'projects') {
            dataPromise = fetch('data/projects.json').then(r => r.json()).catch(() => null);
        } else if (pageName === 'skills') {
            dataPromise = fetch('data/skills.json').then(r => r.json()).catch(() => null);
        }

        // Wait for both to complete
        const [html, data] = await Promise.all([htmlPromise, dataPromise]);

        content.innerHTML = html;



        if (pageName === 'landing') {
            initPCBEffect();
        } else if (pageName === 'about') {
            loadAboutData(data);
        } else if (pageName === 'experience') {
            loadExperienceData(data);
        } else if (pageName === 'skills') {
            loadSkillsData(data);
        } else if (pageName === 'projects') {
            loadProjectsData(data);
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
            playClose();
            window.history.pushState({}, '', window.location.pathname);
            loadPage('landing');
        } else {
            playNavigate();
            window.history.pushState({}, '', '#' + pageName);
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

// Background click sound — fires on empty/non-interactive areas
document.addEventListener('click', function (e) {
    const INTERACTIVE = 'a, button, input, select, textarea, label, .project-card, .mode-button, .gallery-item, .contact-link, .skill-box, .experience-card';
    if (!e.target.closest(INTERACTIVE)) {
        playBackground();
    }
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

    initMode();
    initRouter();
}

// Wait for page to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}