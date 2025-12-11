// --- Text Flap Effect ---
(function () {
    const t = ' "â€œâ€â€˜â€™¹²³!#$&%()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstüvwxyz{|}~½¼¡«»×▒▓│┤╡╢_╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌'.split("");
    class e {
        constructor(t, e) {
            this.X3 = t; this.X2 = e; this.X10 = []; this.X1 = []; this.X4 = [];
        }
        X5(t) {
            const e = t.split(""); const s = e.length;
            e.forEach((t, e) => {
                const s = this.X2.indexOf(t);
                -1 == s ? (this.X2.push(t), (this.X10[e] = this.X2.length - 1)) : (this.X10[e] = s);
            });
            this.X1 = Array(s).fill(0); this.X4 = Array(s).fill(0);
        }
        X7() {
            for (let t = 0; t < this.X1.length; t++) this.X1[t] = this.X10[t];
            this.X4.fill(0);
        }
        X8() {
            const t = Math.floor(10 * Math.random()) + 5;
            for (let e = 0; e < this.X1.length; e++) {
                this.X1[e] = (this.X1[e] + this.X2.length - t) % this.X2.length;
                this.X4[e] = Math.floor(10 * Math.random());
            }
        }
        X9(t, e) {
            for (let s = 0; s < this.X4.length; s++) this.X4[s] = t + s * e;
        }
        flap() {
            "false" == this.X3.dataset.paused && this.X1.forEach((t, e) => {
                this.X4[e] > 0 ? this.X4[e]-- : this.X1[e] != this.X10[e] && (this.X1[e] = (this.X1[e] + 1) % this.X2.length);
            });
        }
        X6() {
            let t = this.X1.reduce((t, e, s) => {
                let a = this.X2[this.X1[s]];
                return ">" == a ? (a = "&gt;") : "<" == a && (a = "&lt;"), t + a;
            }, "");
            this.X3.innerHTML != t && (this.X3.innerHTML = t);
        }
    }

    const s = []; let a = 0;
    document.querySelectorAll(".flap").forEach((n) => {
        const i = n.innerText.trimEnd().split("\n").map((t) => t.trimEnd().replaceAll("\t", ""));
        n.innerHTML = ""; "0" === n.dataset.offset && (a = 0);
        i.forEach((i) => {
            const h = document.createElement("H4");
            h.dataset.paused = "true"; n.appendChild(h);
            new IntersectionObserver(function (t) {
                !0 === t[0].isIntersecting && (h.dataset.paused = "false");
            }, { threshold: [0] }).observe(h);
            const r = new e(h, t);
            r.X5(i); r.X6(); r.X9(5 * a++, 1);
            r.X3.addEventListener("mouseenter", (t) => { r.X8(); });
            s.push(r);
        });
    });

    let n = 0;
    requestAnimationFrame(function animate(e) {
        requestAnimationFrame(animate);
        if (n++ % 2 == 0) {
            for (const t of s) { t.flap(); t.X6(); }
        }
    });

    document.querySelectorAll(".flap").forEach((t) => {
        t.classList.remove("hidden");
    });
})();

// --- MAIN APPLICATION LOGIC ---
(function () {
    // Wait for the DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function () {

        // --- Page Navigation Logic ---
        const navHome = document.getElementById('nav-home');
        const navProjects = document.getElementById('nav-projects');
        const allProjectsLink = document.getElementById('home-all-projects-link');
        const pages = document.querySelectorAll('.page');

        function showPage(pageId) {
            pages.forEach(page => {
                page.classList.remove('active');
            });
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }

            // --- NEW LOGIC ---
            // If we are going back to the home page, close any open project
            if (pageId === 'home-page') {
                closeProject();
            }
            // --- END NEW LOGIC ---

            navHome.classList.toggle('active', pageId === 'home-page');
            navProjects.classList.toggle('active', pageId === 'projects-page');
            window.scrollTo(0, 0);
        }

        // Add listeners for page navigation
        if (navHome) {
            navHome.addEventListener('click', function (e) {
                e.preventDefault();
                showPage('home-page');
            });
        }

        if (navProjects) {
            navProjects.addEventListener('click', function (e) {
                e.preventDefault();
                showPage('projects-page');
            });
        }

        if (allProjectsLink) {
            allProjectsLink.addEventListener('click', function (e) {
                e.preventDefault();
                showPage('projects-page');
            });
        }


        // --- Project Modal Logic ---
        function showProject(projectId) {
            const detail = document.getElementById(projectId + '-detail');
            if (detail) {
                detail.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeProject() {
            document.querySelectorAll('.project-detail').forEach(detail => {
                detail.classList.remove('active');
            });
            document.body.style.overflow = 'auto';
        }

        // Add listeners for opening project modals
        document.querySelectorAll('.project-card.clickable').forEach(card => {
            card.addEventListener('click', function () {
                const projectId = this.dataset.projectId;
                if (projectId) {
                    showProject(projectId);
                }
            });
        });

        // Add listeners for closing project modals (using event delegation)
        document.body.addEventListener('click', function (e) {
            const closeButton = e.target.closest('.close-btn');
            if (closeButton) {
                closeProject();
            }
        });


        // --- Global Keydown Listeners ---
        document.addEventListener('keydown', function (e) {
            const isModalActive = !!document.querySelector('.project-detail.active');

            if (e.key === 'Escape') {
                if (isModalActive) {
                    closeProject();
                }
            }

            // --- MODIFIED LOGIC ---
            // Allow 'h' to work even if modal is active
            if (e.key === 'h') {
                showPage('home-page'); // This will now also close the modal via new logic in showPage
            }

            // Keep original logic for 'p' (only works if modal is closed)
            if (!isModalActive) {
                if (e.key === 'p') {
                    showPage('projects-page');
                }
            }
            // --- END MODIFIED LOGIC ---
        });


        // --- Theme Toggle & Moon Interaction Logic ---
        let lastScrollY = window.scrollY;
        const themeToggle = document.querySelector('.theme-toggle'); // Floating moon
        const themeToggleBtn = document.getElementById('theme-toggle-btn'); // Nav bar button
        let biteCount = 0;

        // --- Theme Toggle Button (in Nav Bar) ---
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', function () {
                document.body.classList.toggle('light-mode');
                const isLightMode = document.body.classList.contains('light-mode');

                // If we switch to light mode, reset the moon's "bite"
                if (isLightMode) {
                    themeToggle.classList.remove('bite-1', 'bite-2', 'bite-3', 'bite-4');
                    biteCount = 0;
                }
            });
        }

        // --- Floating Moon/Sun Interaction ---
        if (themeToggle) {
            themeToggle.addEventListener('click', function () {
                const isLightMode = document.body.classList.contains('light-mode');

                // Only run bite effect if in dark mode
                if (!isLightMode) {
                    biteCount++;
                    themeToggle.classList.remove('bite-1', 'bite-2', 'bite-3', 'bite-4');
                    if (biteCount <= 4) {
                        themeToggle.classList.add(`bite-${biteCount}`);
                    }
                    if (biteCount >= 4) {
                        setTimeout(() => {
                            themeToggle.classList.remove('bite-1', 'bite-2', 'bite-3', 'bite-4');
                            biteCount = 0;
                        }, 2000);
                    }
                }

                // Bounce animation (works for both sun/moon)
                themeToggle.style.animation = 'themeBounce 0.5s ease';
                setTimeout(() => {
                    themeToggle.style.animation = '';
                }, 500);
            });
        }


        // Add bounce keyframes dynamically
        const style = document.createElement('style');
        style.textContent = `
      @keyframes themeBounce {
        0%, 100% { transform: scale(1) translateY(var(--moon-y, 0)); }
        50% { transform: scale(0.95) translateY(var(--moon-y, 0)); }
      }
    `;
        document.head.appendChild(style);

        window.addEventListener('scroll', function () {
            const currentScrollY = window.scrollY;
            const scrollDiff = currentScrollY - lastScrollY;

            const currentTransform = themeToggle.style.transform || 'translateY(0px)';
            const currentY = parseFloat(currentTransform.match(/translateY\(([-\d.]+)px\)/)?.[1] || 0);
            const newY = currentY + (scrollDiff * 0.3);

            if (themeToggle) {
                themeToggle.style.setProperty('--moon-y', `${newY}px`);
                themeToggle.style.transform = `translateY(${newY}px)`;
            }

            lastScrollY = currentScrollY;
        });

    });
})();
