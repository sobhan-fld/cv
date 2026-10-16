const LANGUAGE_FILES = {
    en: 'english.json',
    es: 'espanol.json',
    it: 'italian.json'
};

const LOCALES = {
    en: 'en-US',
    es: 'es-ES',
    it: 'it-IT'
};

const GITHUB_USER = 'sobhan-fld';
const CONTRIBUTIONS_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`;
const CONTRIBUTIONS_SNAPSHOT = 'assets/github-contributions.json';

const UI_TEXT = {
    en: {
        lang: 'en',
        nav: ['Home', 'About', 'Experience', 'Skills', 'GitHub', 'Education', 'Contact'],
        heroKicker: 'CTO • AI Research Engineer • Deep Learning',
        heroPrimary: 'Get In Touch',
        heroSecondary: 'Download PDF',
        rolesLabel: 'Roles',
        nextRole: 'Next',
        contactLabels: {
            email: 'Email',
            location: 'Location',
            dob: 'Year of Birth',
            linkedin: 'LinkedIn',
            github: 'GitHub'
        },
        contactActions: {
            email: 'Send Email',
            linkedin: 'Open LinkedIn',
            github: 'View GitHub'
        },
        stats: [
            { value: '10/10', label: 'MSc Thesis Score – Highest Honors' },
            { value: '96%', label: 'Message Filtering Accuracy' },
            { value: '94%', label: 'Gesture Classification Accuracy' },
            { value: '4+', label: 'Years in AI Research & Engineering' }
        ],
        github: {
            title: 'GitHub Activity',
            heading: '{n} contributions in the last year',
            unit: 'contribution',
            unitPlural: 'contributions',
            none: 'No contributions',
            day: 'day',
            days: 'days',
            stats: ['1 year total', 'Busiest day', 'Longest streak', 'Current streak'],
            levels: ['No contributions', 'Light', 'Moderate', 'Heavy', 'Heaviest'],
            less: 'Less',
            more: 'More',
            viewGroup: 'Chart view',
            view2d: 'Flat heat map',
            view3d: '3D skyline',
            hint2d: 'Hover a day for details · arrow keys to explore',
            hint3d: 'Drag to orbit · double-click to reset',
            hintScrub: 'Keep scrolling to raise it into 3D',
            hintTouch2d: 'Tap a day for details',
            hintTouch3d: 'Tap a day for details · drag sideways to orbit',
            keys: 'Use the arrow keys to read individual days.',
            live: 'live from GitHub',
            snapshot: 'snapshot from {date}',
            error: 'GitHub activity could not be loaded right now.',
            errorLink: 'See it on GitHub'
        },
        footer: '© 2026 Sobhan Fooladi Mahani. Built for clarity, speed, and good engineering.'
    },
    es: {
        lang: 'es',
        nav: ['Inicio', 'Perfil', 'Experiencia', 'Habilidades', 'GitHub', 'Educación', 'Contacto'],
        heroKicker: 'CTO • Ingeniero de Investigación IA • Deep Learning',
        heroPrimary: 'Contactar',
        heroSecondary: 'Descargar PDF',
        rolesLabel: 'Puestos',
        nextRole: 'Siguiente',
        contactLabels: {
            email: 'Correo',
            location: 'Ubicación',
            dob: 'Año de nacimiento',
            linkedin: 'LinkedIn',
            github: 'GitHub'
        },
        contactActions: {
            email: 'Enviar correo',
            linkedin: 'Abrir LinkedIn',
            github: 'Ver GitHub'
        },
        stats: [
            { value: '10/10', label: 'Nota de Tesis – Mención de Honor' },
            { value: '96%', label: 'Precisión en filtrado de mensajes' },
            { value: '94%', label: 'Precisión en clasificación de gestos' },
            { value: '4+', label: 'Años en investigación y desarrollo de IA' }
        ],
        github: {
            title: 'Actividad en GitHub',
            heading: '{n} contribuciones en el último año',
            unit: 'contribución',
            unitPlural: 'contribuciones',
            none: 'Sin contribuciones',
            day: 'día',
            days: 'días',
            stats: ['Total del año', 'Día más activo', 'Racha más larga', 'Racha actual'],
            levels: ['Sin contribuciones', 'Baja', 'Moderada', 'Alta', 'Máxima'],
            less: 'Menos',
            more: 'Más',
            viewGroup: 'Vista del gráfico',
            view2d: 'Mapa de calor plano',
            view3d: 'Skyline en 3D',
            hint2d: 'Pasa el cursor sobre un día para ver detalles · flechas para explorar',
            hint3d: 'Arrastra para girar · doble clic para restablecer',
            hintScrub: 'Sigue desplazándote para elevarlo en 3D',
            hintTouch2d: 'Toca un día para ver detalles',
            hintTouch3d: 'Toca un día para ver detalles · desliza de lado para girar',
            keys: 'Usa las flechas para leer cada día.',
            live: 'en directo desde GitHub',
            snapshot: 'instantánea del {date}',
            error: 'No se pudo cargar la actividad de GitHub en este momento.',
            errorLink: 'Verla en GitHub'
        },
        footer: '© 2026 Sobhan Fooladi Mahani. Diseñado para claridad, velocidad y buena ingeniería.'
    },
    it: {
        lang: 'it',
        nav: ['Home', 'Profilo', 'Esperienza', 'Competenze', 'GitHub', 'Formazione', 'Contatto'],
        heroKicker: 'CTO • Ingegnere di Ricerca AI • Deep Learning',
        heroPrimary: 'Contattami',
        heroSecondary: 'Scarica PDF',
        rolesLabel: 'Ruoli',
        nextRole: 'Successivo',
        contactLabels: {
            email: 'Email',
            location: 'Località',
            dob: 'Anno di nascita',
            linkedin: 'LinkedIn',
            github: 'GitHub'
        },
        contactActions: {
            email: 'Invia email',
            linkedin: 'Apri LinkedIn',
            github: 'Vedi GitHub'
        },
        stats: [
            { value: '10/10', label: 'Voto Tesi Magistrale – con Lode' },
            { value: '96%', label: 'Accuratezza nel filtraggio dei messaggi' },
            { value: '94%', label: 'Accuratezza nella classificazione dei gesti' },
            { value: '4+', label: 'Anni in ricerca e ingegneria AI' }
        ],
        github: {
            title: 'Attività su GitHub',
            heading: '{n} contributi nell’ultimo anno',
            unit: 'contributo',
            unitPlural: 'contributi',
            none: 'Nessun contributo',
            day: 'giorno',
            days: 'giorni',
            stats: ['Totale annuale', 'Giorno più attivo', 'Serie più lunga', 'Serie attuale'],
            levels: ['Nessun contributo', 'Bassa', 'Moderata', 'Alta', 'Massima'],
            less: 'Meno',
            more: 'Più',
            viewGroup: 'Vista del grafico',
            view2d: 'Mappa di calore piatta',
            view3d: 'Skyline 3D',
            hint2d: 'Passa sopra un giorno per i dettagli · frecce per esplorare',
            hint3d: 'Trascina per ruotare · doppio clic per ripristinare',
            hintScrub: 'Continua a scorrere per sollevarlo in 3D',
            hintTouch2d: 'Tocca un giorno per i dettagli',
            hintTouch3d: 'Tocca un giorno per i dettagli · trascina di lato per ruotare',
            keys: 'Usa le frecce per leggere i singoli giorni.',
            live: 'in tempo reale da GitHub',
            snapshot: 'istantanea del {date}',
            error: 'Impossibile caricare l’attività GitHub in questo momento.',
            errorLink: 'Vedila su GitHub'
        },
        footer: '© 2026 Sobhan Fooladi Mahani. Progettato per chiarezza, velocita e ottima ingegneria.'
    }
};

let cvData = null;
let currentLanguage = 'en';
let currentSection = 0;
let hasRenderedContent = false;
let skyline = null;
let contributions = null;

// Two layouts, both on the browser's own scrolling, with every animation bound to scroll
// position: stop anywhere and the motion stops there too; scroll back and it plays in reverse.
// Scenes (large screens): the sections stay in place and scrolling moves the page from one to
// the next. Flow (phones, tablets, short windows): the page scrolls normally and content
// settles in as it arrives. Keep the query in sync with index.html.
const SCENES_QUERY = '(min-width: 1024px) and (min-height: 680px)';
const SECTION_IDS = ['home', 'about', 'experience', 'skills', 'github', 'education', 'contact'];
// Scroll distance, in viewport heights: how long each section holds, and each change between them.
const TRANSITION_VH = 0.6;
const HOLD_VH = { home: 0.3, about: 0.3, skills: 0.3, github: 1.3, education: 0.3, contact: 0.25 };
const ROLE_VH = 0.45;

let sections = [];
let scenesOn = false;
let scenes = [];
let totalScroll = 0;
let smoothY = 0;
let loopId = 0;
let lastTick = 0;
let revealItems = [];
let roleCards = [];
let roleTabs = [];
let activeRole = -1;
let backdropGlows = [];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const compactNav = window.matchMedia('(max-width: 1080px)');
const scenesQuery = window.matchMedia(SCENES_QUERY);
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const ARROW_DOWN = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v10M4 9l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const clampIndex = (value, length) => Math.max(0, Math.min(length - 1, value));
const smoothstep = (a, b, x) => {
    const t = clamp01((x - a) / (b - a));
    return t * t * (3 - 2 * t);
};
const escapeAttr = (text) => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

async function loadCVData(lang = 'en') {
    const selectedLanguage = LANGUAGE_FILES[lang] ? lang : 'en';

    try {
        const response = await fetch(LANGUAGE_FILES[selectedLanguage]);
        if (!response.ok) {
            throw new Error(`Failed to load ${LANGUAGE_FILES[selectedLanguage]} (${response.status})`);
        }

        const data = await response.json();
        const apply = () => {
            cvData = data;
            currentLanguage = selectedLanguage;
            document.documentElement.lang = UI_TEXT[selectedLanguage].lang;
            localStorage.setItem('language', selectedLanguage);

            updateLanguageButtons();
            populateContent();
            updateNavigationLabels();
            updateSkylineLanguage();
            relayout();
        };

        // A language switch cross-fades the page; the first render plays the hero entrance instead.
        if (hasRenderedContent && document.startViewTransition && !prefersReducedMotion) {
            await document.startViewTransition(apply).updateCallbackDone;
        } else {
            apply();
        }
    } catch (error) {
        console.error('Error loading CV data:', error);
    } finally {
        if (!hasRenderedContent) {
            hasRenderedContent = true;
            startHeroEntrance();
            // A deep link lands on its section once the content exists.
            const fromHash = SECTION_IDS.indexOf(window.location.hash.slice(1));
            if (fromHash > 0) jumpTo(fromHash);
        }
        moveNavPill();
        moveLanguageThumb();
    }
}

function startHeroEntrance() {
    // Wait briefly for the display fonts so the name doesn't reflow mid-reveal.
    const fontsReady = document.fonts?.ready || Promise.resolve();
    const timeout = new Promise((resolve) => setTimeout(resolve, 700));
    Promise.race([fontsReady, timeout]).then(() => {
        document.documentElement.classList.add('is-ready');
    });
}

function updateNavigationLabels() {
    const ui = UI_TEXT[currentLanguage];
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.textContent = ui.nav[index] || link.textContent;
    });

    sections.forEach((section, index) => {
        section.setAttribute('aria-label', ui.nav[index] || '');
    });

    const titleIds = {
        aboutTitle: ui.nav[1],
        experienceTitle: ui.nav[2],
        skillsTitle: ui.nav[3],
        githubTitle: ui.github.title,
        educationTitle: ui.nav[5],
        contactTitle: ui.nav[6]
    };

    Object.entries(titleIds).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    });

    const heroKicker = document.getElementById('heroKicker');
    if (heroKicker) heroKicker.textContent = ui.heroKicker;

    const primaryCta = document.querySelector('.scroll-to-section');
    if (primaryCta) primaryCta.textContent = ui.heroPrimary;

    const downloadButton = document.getElementById('downloadButton');
    if (downloadButton) downloadButton.textContent = ui.heroSecondary;

    const footerText = document.getElementById('footerText');
    if (footerText) footerText.textContent = ui.footer;
}

function formatHeroName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    const first = parts.shift() || fullName;
    const rest = parts.join(' ');
    return `
        <span class="title-line"><span>${first}</span></span>
        <span class="title-line"><span>${rest}</span></span>
    `;
}

// The objective's first sentence leads the hero; the rest becomes the About summary.
const splitSentences = (text) => text.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÀÈÌÒÙÑ])/);

function populateContent() {
    if (!cvData) return;

    const ui = UI_TEXT[currentLanguage];

    // Re-rendering the name would replay its entrance, so only touch it when it actually changed.
    const heroName = document.getElementById('heroName');
    if (heroName && cvData.fullName && heroName.textContent.replace(/\s+/g, ' ').trim() !== cvData.fullName.trim()) {
        heroName.innerHTML = formatHeroName(cvData.fullName);
    }

    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) heroTitle.textContent = cvData.title || '';

    const sentences = splitSentences(cvData.objective?.[0] || '');
    const heroDescription = document.getElementById('heroDescription');
    if (heroDescription) heroDescription.textContent = sentences[0] || '';
    const aboutSummary = document.getElementById('aboutSummary');
    if (aboutSummary) aboutSummary.textContent = sentences.slice(1).join(' ');

    renderStats(ui.stats);
    renderExperience(cvData.experience || [], ui);
    renderSkills(cvData.skills || []);
    renderEducation(cvData.education || []);
    renderContact(cvData.contact || {}, ui);
}

function renderStats(stats) {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid) return;

    statsGrid.innerHTML = stats.map((stat) => `
        <div class="stat-card spotlight reveal">
            <div class="stat-number" data-count="${stat.value}">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
}

const companyOf = (location = '') => location.split(/\s*[|,–]\s*/)[0] || location;

// Experience renders twice: a vertical timeline for the flowing page, and a role list beside
// one role card at a time for scenes. CSS shows the one that fits the layout.
function renderExperience(experience, ui) {
    const timeline = document.getElementById('experienceTimeline');
    const roleList = document.getElementById('roleList');
    const roleDetail = document.getElementById('roleDetail');
    const bullets = (exp) => (exp.responsibilities || []).map((item) => `<li>${item}</li>`).join('');

    if (timeline) {
        timeline.innerHTML = '<div class="timeline-progress" aria-hidden="true"></div>' + experience.map((exp) => `
            <article class="experience-item spotlight reveal">
                <div class="experience-header">
                    <div>
                        <div class="experience-position">${exp.position || ''}</div>
                        <div class="experience-location">${exp.location || ''}</div>
                    </div>
                    <div class="experience-period">${exp.period || ''}</div>
                </div>
                <ul class="experience-responsibilities">${bullets(exp)}</ul>
            </article>
        `).join('');
    }

    if (roleList && roleDetail) {
        roleList.setAttribute('aria-label', ui.rolesLabel);
        roleList.innerHTML = experience.map((exp, index) => `
            <li>
                <button type="button" class="role-tab" data-role="${index}" title="${escapeAttr(exp.position || '')}">
                    <span class="role-tab-position">${exp.position || ''}</span>
                    <span class="role-tab-meta">${companyOf(exp.location)} · ${exp.period || ''}</span>
                </button>
            </li>
        `).join('');

        roleDetail.innerHTML = experience.map((exp, index) => {
            const next = experience[index + 1];
            return `
                <article class="role-card spotlight" data-role="${index}">
                    <span class="experience-period">${exp.period || ''}</span>
                    <h3 class="role-title">${exp.position || ''}</h3>
                    <p class="role-location">${exp.location || ''}</p>
                    <ul class="experience-responsibilities">${bullets(exp)}</ul>
                    ${next ? `<p class="role-next">${ARROW_DOWN}<span>${ui.nextRole}: ${next.position || ''}</span></p>` : ''}
                </article>
            `;
        }).join('');

        roleCards = Array.from(roleDetail.querySelectorAll('.role-card')).map((card) => ({
            card,
            bullets: Array.from(card.querySelectorAll('.experience-responsibilities li'))
        }));
        roleTabs = Array.from(roleList.querySelectorAll('.role-tab'));
        roleTabs.forEach((tab) => {
            tab.addEventListener('click', () => scrollToRole(parseInt(tab.dataset.role, 10)));
        });
        activeRole = -1;
        renderRoles(0);
    }
}

function renderSkills(skills) {
    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid) return;

    skillsGrid.innerHTML = skills.map((skill) => {
        const split = skill.indexOf(':');
        const categoryTitle = split >= 0 ? skill.slice(0, split).trim() : skill;
        const skillItems = split >= 0
            ? skill.slice(split + 1).split(/[,;]/).map((item) => item.trim()).filter(Boolean)
            : [skill];

        return `
            <article class="skill-category spotlight reveal">
                <h3 class="skill-category-title">${categoryTitle}</h3>
                <ul class="skill-chips">
                    ${skillItems.map((item) => `<li>${item}</li>`).join('')}
                </ul>
            </article>
        `;
    }).join('');
}

function renderEducation(education) {
    const educationList = document.getElementById('educationList');
    if (!educationList) return;

    educationList.innerHTML = education.map((item) => `
        <article class="education-item spotlight reveal">
            <p class="education-text">${item}</p>
        </article>
    `).join('');
}

function renderContact(contact, ui) {
    const contactInfo = document.getElementById('contactInfo');
    const contactActions = document.getElementById('contactActions');

    if (contactInfo) {
        contactInfo.innerHTML = `
            <div class="contact-item spotlight">
                <span class="contact-label">${ui.contactLabels.email}</span>
                <a href="mailto:${contact.email || ''}">${contact.email || ''}</a>
            </div>
            <div class="contact-item spotlight">
                <span class="contact-label">${ui.contactLabels.location}</span>
                <span>${contact.address || ''}</span>
            </div>
            <div class="contact-item spotlight">
                <span class="contact-label">${ui.contactLabels.dob}</span>
                <span>${contact.dob || ''}</span>
            </div>
            <div class="contact-item spotlight">
                <span class="contact-label">${ui.contactLabels.linkedin}</span>
                <a href="${contact.linkedin || '#'}" target="_blank" rel="noreferrer">${contact.linkedin || ''}</a>
            </div>
            <div class="contact-item spotlight">
                <span class="contact-label">${ui.contactLabels.github}</span>
                <a href="${contact.github || '#'}" target="_blank" rel="noreferrer">${contact.github || ''}</a>
            </div>
        `;
    }

    if (contactActions) {
        contactActions.innerHTML = `
            <a href="mailto:${contact.email || ''}" class="btn btn-primary">${ui.contactActions.email}</a>
            <a href="${contact.linkedin || '#'}" target="_blank" rel="noreferrer" class="btn btn-secondary">${ui.contactActions.linkedin}</a>
            <a href="${contact.github || '#'}" target="_blank" rel="noreferrer" class="btn btn-ghost">${ui.contactActions.github}</a>
        `;
    }
}

function initLanguage() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    currentLanguage = LANGUAGE_FILES[savedLanguage] ? savedLanguage : 'en';
    updateLanguageButtons();

    document.querySelectorAll('.language-option').forEach((button) => {
        button.addEventListener('click', () => {
            const newLanguage = button.dataset.lang;
            if (newLanguage && newLanguage !== currentLanguage) {
                loadCVData(newLanguage);
            }
        });
    });
}

function updateLanguageButtons() {
    document.querySelectorAll('.language-option').forEach((button) => {
        button.classList.toggle('active', button.dataset.lang === currentLanguage);
    });
    moveLanguageThumb();
}

function moveLanguageThumb() {
    const switcher = document.getElementById('languageSwitcher');
    const active = switcher?.querySelector('.language-option.active');
    if (!switcher || !active) return;

    switcher.style.setProperty('--thumb-x', `${active.offsetLeft}px`);
    switcher.style.setProperty('--thumb-w', `${active.offsetWidth}px`);
    if (!switcher.classList.contains('pill-ready')) {
        requestAnimationFrame(() => switcher.classList.add('pill-ready'));
    }
}

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const rect = themeToggle.getBoundingClientRect();
            setTheme(currentTheme === 'dark' ? 'light' : 'dark', rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    }
}

// The new theme spreads out from the toggle as a circle, revealing the page underneath.
function setTheme(nextTheme, originX, originY) {
    const root = document.documentElement;
    const apply = () => {
        root.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
    };

    if (!document.startViewTransition || prefersReducedMotion) {
        apply();
        return;
    }

    const radius = Math.hypot(Math.max(originX, window.innerWidth - originX), Math.max(originY, window.innerHeight - originY));
    root.classList.add('theme-transition');
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
        root.animate(
            { clipPath: [`circle(0px at ${originX}px ${originY}px)`, `circle(${radius}px at ${originX}px ${originY}px)`] },
            { duration: 750, easing: EASE_OUT, pseudoElement: '::view-transition-new(root)' }
        );
    }).catch(() => {});
    transition.finished.finally(() => root.classList.remove('theme-transition'));
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .nav-brand');
    const menuToggle = document.getElementById('menuToggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const indicators = document.querySelectorAll('.indicator');

    const setMenuOpen = (open) => {
        if (!navLinksContainer || !menuToggle) return;
        navLinksContainer.classList.toggle('active', open);
        menuToggle.setAttribute('aria-expanded', String(open));
    };

    document.querySelectorAll('.nav-link').forEach((link, index) => {
        link.style.setProperty('--i', index);
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            goTo(parseInt(link.dataset.section || '0', 10), { focus: true });

            if (compactNav.matches) {
                setMenuOpen(false);
            }
        });
    });

    indicators.forEach((indicator) => {
        indicator.addEventListener('click', () => goTo(parseInt(indicator.dataset.section || '0', 10), { focus: true }));
    });

    document.querySelectorAll('.scroll-to-section').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            goTo(parseInt(button.dataset.target || '6', 10), { focus: true });
        });
    });

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            setMenuOpen(!navLinksContainer.classList.contains('active'));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navLinksContainer.classList.contains('active')) {
                setMenuOpen(false);
                menuToggle.focus();
            }
        });

        compactNav.addEventListener('change', () => {
            setMenuOpen(false);
            moveNavPill();
        });
    }

    document.fonts?.ready.then(() => {
        moveNavPill();
        moveLanguageThumb();
    });
}

function updateIndicators() {
    document.querySelectorAll('.indicator').forEach((indicator) => {
        indicator.classList.toggle('active', parseInt(indicator.dataset.section, 10) === currentSection);
    });
}

function updateNavigation() {
    document.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.toggle('active', parseInt(link.dataset.section, 10) === currentSection);
    });
    moveNavPill();
}

// One pill slides between nav links, so the current section reads as a position, not a flicker.
function moveNavPill() {
    const container = document.getElementById('navLinks');
    const active = container?.querySelector('.nav-link.active');
    if (!container || !active || compactNav.matches) return;

    container.style.setProperty('--pill-x', `${active.offsetLeft}px`);
    container.style.setProperty('--pill-w', `${active.offsetWidth}px`);
    if (!container.classList.contains('pill-ready')) {
        requestAnimationFrame(() => container.classList.add('pill-ready'));
    }
}

function setCurrentSection(index) {
    if (index === currentSection) return;
    currentSection = index;
    sections.forEach((section, i) => section.classList.toggle('is-current', i === index));
    updateIndicators();
    updateNavigation();
    history.replaceState(null, '', index ? `#${SECTION_IDS[index]}` : `${window.location.pathname}${window.location.search}`);
}

// ── Layout and the scroll-driven frame ──

function initLayout() {
    sections = Array.from(document.querySelectorAll('.content-section'));
    backdropGlows = Array.from(document.querySelectorAll('.glow'));
    window.__site = true;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', () => {
        moveNavPill();
        moveLanguageThumb();
        relayout();
    });
    window.addEventListener('hashchange', () => {
        const index = SECTION_IDS.indexOf(window.location.hash.slice(1));
        goTo(index > 0 ? index : 0);
    });
    scenesQuery.addEventListener('change', applyLayout);

    applyLayout();
}

function applyLayout() {
    const root = document.documentElement;
    const keep = currentSection;
    scenesOn = scenesQuery.matches;
    root.classList.toggle('scenes', scenesOn);
    root.classList.toggle('flow', !scenesOn);
    clearMotionStyles();
    relayout();
    jumpTo(keep);
}

// Scene lengths depend on the window height and the number of roles; reveal lists on the content.
function relayout() {
    if (!sections.length) return;
    const track = document.getElementById('sceneTrack');

    if (scenesOn) {
        const vh = window.innerHeight;
        let y = 0;
        scenes = sections.map((element) => {
            const id = element.id;
            const hold = (id === 'experience' ? ROLE_VH * Math.max(1, roleCards.length) : HOLD_VH[id] ?? 0.3) * vh;
            const items = id === 'home' ? [] : Array.from(element.querySelectorAll('.section-header, .reveal'))
                .filter((item) => !item.closest('.timeline-wrap'));
            const scene = { element, id, start: y, end: y + hold, items, shown: element.classList.contains('is-shown') };
            y += hold + TRANSITION_VH * vh;
            return scene;
        });
        totalScroll = scenes[scenes.length - 1].end;
        if (track) track.style.height = `${Math.round(totalScroll + vh)}px`;
        revealItems = [];
    } else {
        scenes = [];
        if (track) track.style.height = '0px';
        revealItems = Array.from(document.querySelectorAll('.content-section:not(#home) .section-header, .content-section:not(#home) .reveal'))
            .filter((item) => !item.classList.contains('role-list') && !item.classList.contains('role-detail'));
    }

    smoothY = window.scrollY;
    renderFrame();
}

function clearMotionStyles() {
    document.querySelectorAll('.content-section, .content-section .section-header, .content-section .reveal').forEach((element) => {
        element.style.opacity = '';
        element.style.transform = '';
        element.style.translate = '';
        element.style.scale = '';
        element.classList.remove('is-shown');
    });
}

function requestFrame() {
    if (loopId) return;
    lastTick = performance.now();
    loopId = requestAnimationFrame(tick);
}

// Smoothed scroll: visuals ease toward the real position, so a notchy mouse wheel still glides.
function tick(now) {
    loopId = 0;
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTick) / 1000));
    lastTick = now;
    const target = window.scrollY;
    smoothY += (target - smoothY) * (prefersReducedMotion ? 1 : 1 - Math.exp(-dt * 11));
    if (Math.abs(target - smoothY) < 0.3) smoothY = target;
    renderFrame();
    if (smoothY !== target) loopId = requestAnimationFrame(tick);
}

function renderFrame() {
    let progress;
    if (scenesOn && scenes.length) {
        renderScenes(smoothY);
        progress = totalScroll > 0 ? smoothY / totalScroll : 0;
    } else {
        renderFlow();
        const range = document.documentElement.scrollHeight - window.innerHeight;
        progress = range > 0 ? smoothY / range : 0;
    }
    progress = clamp01(progress);

    const progressFill = document.getElementById('scrollProgressFill');
    if (progressFill) progressFill.style.transform = `scaleX(${progress.toFixed(4)})`;
    document.querySelector('.nav-container')?.classList.toggle('is-scrolled', smoothY > 24);
    renderBackdrop(progress);
}

// ── Scenes ──

// Where y falls: holding scene `index` (f = 0, `local` = progress through its hold), or
// changing from `index` to the next (f = 0…1).
function sceneAt(y) {
    for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        if (y <= scene.end) {
            const length = scene.end - scene.start;
            return { index: i, f: 0, local: length > 0 ? clamp01((y - scene.start) / length) : 0 };
        }
        const next = scenes[i + 1];
        if (next && y < next.start) {
            return { index: i, f: (y - scene.end) / (next.start - scene.end), local: 1 };
        }
    }
    return { index: scenes.length - 1, f: 0, local: 1 };
}

function renderScenes(y) {
    const { index, f, local } = sceneAt(y);
    const current = scenes[index];
    const incoming = f > 0 ? scenes[index + 1] : null;

    scenes.forEach((scene) => {
        const shown = scene === current || scene === incoming;
        if (shown !== scene.shown) {
            scene.shown = shown;
            scene.element.classList.toggle('is-shown', shown);
        }
    });

    // Leaving: the section passes the viewer, growing as it fades.
    styleScene(current, f, 'out');
    settleItems(current);
    scrubScene(current, local);

    // Arriving: the next section comes in from the distance, heading first, then its cards.
    if (incoming) {
        styleScene(incoming, f, 'in');
        cascadeItems(incoming, f);
        scrubScene(incoming, 0);
    }

    setCurrentSection(incoming && f > 0.5 ? index + 1 : index);
}

function styleScene(scene, f, direction) {
    const element = scene.element;
    if (direction === 'out' && f <= 0) {
        element.style.opacity = '';
        element.style.transform = '';
        return;
    }
    // Sequential, not a cross-fade: the leaving section clears in the first half of the change,
    // the arriving one comes in over the second, so their text never overlaps.
    const e = direction === 'out' ? smoothstep(0, 0.5, f) : smoothstep(0.42, 1, f);
    const opacity = direction === 'out' ? 1 - e : e;
    element.style.opacity = opacity.toFixed(3);
    if (prefersReducedMotion) {
        element.style.transform = '';
    } else if (direction === 'out') {
        element.style.transform = `translate3d(0, ${(-2.5 * e).toFixed(2)}vh, 0) scale(${(1 + 0.08 * e).toFixed(4)})`;
    } else {
        element.style.transform = `translate3d(0, ${(3 * (1 - e)).toFixed(2)}vh, 0) scale(${(0.92 + 0.08 * e).toFixed(4)})`;
    }
}

function cascadeItems(scene, f) {
    scene.settled = false;
    scene.items.forEach((item, k) => {
        const start = 0.45 + Math.min(k, 6) * 0.05;
        const e = prefersReducedMotion ? 1 : smoothstep(start, Math.min(1, start + 0.35), f);
        item.style.opacity = e.toFixed(3);
        item.style.translate = `0 ${((1 - e) * 32).toFixed(1)}px`;
        item.querySelectorAll('[data-count]').forEach((number) => scrubCount(number, e));
    });
}

function settleItems(scene) {
    if (scene.settled) return;
    scene.settled = true;
    scene.items.forEach((item) => {
        item.style.opacity = '';
        item.style.translate = '';
        item.querySelectorAll('[data-count]').forEach((number) => scrubCount(number, 1));
    });
}

// Inside a held section, scroll keeps driving: Experience steps through its roles, GitHub rises.
function scrubScene(scene, local) {
    if (scene.id === 'experience') renderRoles(local);
    if (scene.id === 'github') skyline?.setProgress(clamp01((local - 0.08) / 0.72));
}

// Each role owns an equal stretch of the Experience hold. At each seam the leaving card clears
// before the next arrives, so their text never overlaps.
function renderRoles(h) {
    const n = roleCards.length;
    if (!n) return;
    const rf = Math.max(0, Math.min(n - 1, h * n - 0.5));

    roleCards.forEach(({ card, bullets }, k) => {
        const a = k === 0 ? 1 : smoothstep(k - 0.5, k - 0.18, rf);
        const b = k === n - 1 ? 1 : 1 - smoothstep(k + 0.2, k + 0.5, rf);
        const visible = a * b;
        const shift = rf < k ? (1 - a) * 40 : -(1 - b) * 28;
        card.style.opacity = visible.toFixed(3);
        card.style.translate = `0 ${shift.toFixed(1)}px`;
        card.style.visibility = visible > 0.01 ? 'visible' : 'hidden';
        bullets.forEach((bullet, j) => {
            const lag = j * 0.07;
            const e = rf < k ? clamp01((a - lag) / Math.max(0.3, 1 - lag)) : 1;
            bullet.style.opacity = e >= 1 ? '' : e.toFixed(3);
            bullet.style.translate = e >= 1 ? '' : `0 ${((1 - e) * 10).toFixed(1)}px`;
        });
    });

    document.getElementById('roleList')?.style.setProperty('--role-progress', (rf / Math.max(1, n - 1)).toFixed(4));

    const active = Math.round(rf);
    if (active === activeRole) return;
    activeRole = active;
    roleTabs.forEach((tab, i) => {
        tab.classList.toggle('is-passed', i <= active);
        if (i === active) tab.setAttribute('aria-current', 'true');
        else tab.removeAttribute('aria-current');
    });
    roleCards.forEach(({ card }, i) => {
        card.toggleAttribute('inert', i !== active);
        card.setAttribute('aria-hidden', String(i !== active));
    });
}

// ── Flow ──

// Headings and cards settle in over the bottom third of the screen, in step with the scroll.
function renderFlow() {
    const vh = window.innerHeight;
    const lag = window.scrollY - smoothY;
    // The last stretch of the page can't scroll up into the reveal zone, so reaching the end finishes it.
    const toEnd = document.documentElement.scrollHeight - vh - smoothY;
    const ending = clamp01(1 - toEnd / (vh * 0.3));
    const tops = revealItems.map((item) => item.getBoundingClientRect().top + lag);
    revealItems.forEach((item, i) => {
        const p = prefersReducedMotion ? 1 : Math.max(clamp01((vh * 0.97 - tops[i]) / (vh * 0.3)), tops[i] < vh ? ending : 0);
        if (item._reveal === p) return;
        item._reveal = p;
        if (p >= 1) {
            item.style.opacity = '';
            item.style.translate = '';
            item.style.scale = '';
        } else {
            const e = 1 - Math.pow(1 - p, 3);
            item.style.opacity = e.toFixed(3);
            item.style.translate = `0 ${((1 - e) * 36).toFixed(1)}px`;
            item.style.scale = (0.96 + 0.04 * e).toFixed(4);
        }
        item.querySelectorAll('[data-count]').forEach((number) => scrubCount(number, p));
    });

    renderGithubPin(lag);
    updateTimelineProgress();
    updateActiveSection();
}

// On phones the GitHub card pins in place while the scroll raises the skyline beneath it.
function githubPinGeometry() {
    const section = document.getElementById('github');
    const track = section?.querySelector('.section-content');
    const card = section?.querySelector('.skyline-host');
    if (!section || !track || !card) return null;
    const navBottom = document.querySelector('.nav-container')?.getBoundingClientRect().bottom || 80;
    const pinTop = Math.min(navBottom + 12, window.innerHeight - card.offsetHeight - 12);
    return { section, track, pinTop, travel: track.offsetHeight - card.offsetHeight };
}

function renderGithubPin(lag) {
    const pin = githubPinGeometry();
    if (!pin) return;
    pin.section.style.setProperty('--pin-top', `${Math.round(pin.pinTop)}px`);
    const top = pin.track.getBoundingClientRect().top + lag;
    const progress = pin.travel > 0 ? clamp01((pin.pinTop - top) / pin.travel) : 1;
    skyline?.setProgress(clamp01((progress - 0.1) / 0.7));
}

// The timeline fills down to the reading line; each role lights up as the line reaches it.
function updateTimelineProgress() {
    const timeline = document.getElementById('experienceTimeline');
    if (!timeline) return;

    const rect = timeline.getBoundingClientRect();
    const anchor = window.innerHeight * 0.62;
    const lineTop = rect.top + 8;
    const lineHeight = Math.max(1, rect.height - 16);
    const progress = Math.min(1, Math.max(0, (anchor - lineTop) / lineHeight));
    timeline.style.setProperty('--timeline-progress', progress.toFixed(4));

    timeline.querySelectorAll('.experience-item').forEach((item) => {
        item.classList.toggle('is-passed', item.getBoundingClientRect().top + 34 <= anchor);
    });
}

// The section whose top has passed 40% of the viewport is the one being read.
function updateActiveSection() {
    const anchor = window.innerHeight * 0.4;
    let index = 0;
    sections.forEach((section, i) => {
        if (section.getBoundingClientRect().top <= anchor) index = i;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        index = sections.length - 1;
    }
    setCurrentSection(index);
}

// Figures count up with their reveal; the suffix ("%", "/10", "+") stays fixed.
function scrubCount(element, amount) {
    const target = element.dataset.count || '';
    const match = /^(\d+)(.*)$/.exec(target);
    if (!match) return;
    const eased = 1 - Math.pow(1 - clamp01(amount), 3);
    const text = amount >= 1 ? target : `${Math.round(parseInt(match[1], 10) * eased)}${match[2]}`;
    if (element.textContent !== text) element.textContent = text;
}

// ── Navigation by scroll position ──

function sectionScrollTop(index) {
    if (scenesOn && scenes[index]) return scenes[index].start + (index ? 1 : 0);
    const section = sections[index];
    return section ? section.getBoundingClientRect().top + window.scrollY - 64 : 0;
}

function goTo(index, options = {}) {
    if (!sections.length) return;
    const next = clampIndex(index, sections.length);
    window.scrollTo({ top: sectionScrollTop(next), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    if (options.focus) sections[next].focus({ preventScroll: true });
}

function jumpTo(index) {
    // Instant on purpose: the page's CSS smooth scrolling would otherwise animate the jump.
    window.scrollTo({ top: sectionScrollTop(clampIndex(index, sections.length)), behavior: 'instant' });
    smoothY = window.scrollY;
    renderFrame();
}

function scrollToRole(role) {
    const scene = scenes.find((item) => item.id === 'experience');
    if (!scene || !roleCards.length) return;
    const top = scene.start + ((role + 0.5) / roleCards.length) * (scene.end - scene.start);
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

// The skyline's 2D/3D buttons scroll to the start or the top of its rise.
function scrollSkylineTo(view) {
    const t = view === '3d' ? 1 : 0;
    const local = 0.08 + t * 0.72 + (t ? 0.02 : 0);
    let top;
    const scene = scenes.find((item) => item.id === 'github');
    if (scenesOn && scene) {
        top = scene.start + local * (scene.end - scene.start);
    } else {
        const pin = githubPinGeometry();
        if (!pin) return;
        const trackTop = pin.track.getBoundingClientRect().top + window.scrollY;
        top = trackTop - pin.pinTop + (0.1 + t * 0.7 + (t ? 0.02 : 0)) * pin.travel;
    }
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

// ── Background: two soft lights that drift across the page as you scroll ──

function renderBackdrop(progress) {
    if (backdropGlows.length < 2) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const size = Math.max(w, h) * 0.8;
    const wave = Math.sin(progress * Math.PI);
    const ax = w * (0.12 + 0.6 * progress) - size / 2;
    const ay = h * (0.18 + 0.3 * wave) - size / 2;
    const bx = w * (0.88 - 0.55 * progress) - size / 2;
    const by = h * (0.9 - 0.5 * progress) - size / 2;
    backdropGlows[0].style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0)`;
    backdropGlows[1].style.transform = `translate3d(${bx.toFixed(1)}px, ${by.toFixed(1)}px, 0)`;
}

function initSpotlight() {
    if (!finePointer) return;

    document.addEventListener('pointermove', (event) => {
        const card = event.target.closest?.('.spotlight');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    }, { passive: true });
}

function initPortraitTilt() {
    const stage = document.querySelector('.hero-spotlight');
    const card = document.querySelector('.profile-image-wrapper');
    if (!stage || !card || !finePointer || prefersReducedMotion) return;

    stage.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        const py = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
        card.style.setProperty('--ry', `${((px - 0.5) * 12).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${((0.5 - py) * 10).toFixed(2)}deg`);
        card.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
        card.classList.add('is-tilting');
    });

    stage.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.classList.remove('is-tilting');
    });
}

// ── GitHub activity ──

async function fetchJSON(url, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
            throw new Error(`Failed to load ${url} (${response.status})`);
        }
        return await response.json();
    } finally {
        clearTimeout(timer);
    }
}

// Live numbers from GitHub when the API answers; otherwise the snapshot committed with the site.
async function loadContributions() {
    try {
        const json = await fetchJSON(CONTRIBUTIONS_API, 5000);
        if (!Array.isArray(json.contributions) || !json.contributions.length) {
            throw new Error('Empty contributions payload');
        }
        return {
            days: json.contributions.map(({ date, count }) => ({ date, count })),
            live: true
        };
    } catch (error) {
        console.warn('Live GitHub contributions unavailable, using snapshot:', error);
        const json = await fetchJSON(CONTRIBUTIONS_SNAPSHOT, 5000);
        const days = json.contributions.map(({ date, count }) => ({ date, count }));
        return { days, live: false, asOf: json.fetchedAt || days[days.length - 1]?.date };
    }
}

// In scenes the skyline's 3D stage gets whatever height the section leaves over.
function skylineRoom() {
    const panel = document.getElementById('github');
    const wrapper = panel?.querySelector('.section-content-wrapper');
    const stage = panel?.querySelector('.skyline-stage');
    if (!scenesOn || !wrapper || !stage || !panel.clientHeight) return Infinity;

    const style = getComputedStyle(panel);
    const room = panel.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    const row = panel.querySelector('.skyline-row');
    const rowHeight = row && !panel.querySelector('.skyline.row-hidden') ? row.offsetHeight : 0;
    return room - (wrapper.offsetHeight - stage.offsetHeight - rowHeight) - 4;
}

async function initGitHubActivity() {
    const host = document.getElementById('githubSkyline');
    if (!host || !window.ContributionSkyline) return;

    try {
        contributions = await loadContributions();
    } catch (error) {
        console.error('Error loading GitHub contributions:', error);
        renderGitHubError(host);
        return;
    }

    skyline = window.ContributionSkyline.create(host, {
        data: contributions.days,
        strings: UI_TEXT[currentLanguage].github,
        locale: LOCALES[currentLanguage],
        maxHeight: skylineRoom,
        scrub: true,
        onViewRequest: scrollSkylineTo,
        source: {
            live: contributions.live,
            asOf: contributions.asOf,
            url: `https://github.com/${GITHUB_USER}`,
            user: GITHUB_USER
        }
    });
    relayout();
}

function renderGitHubError(host) {
    const text = UI_TEXT[currentLanguage].github;
    host.removeAttribute('aria-busy');
    host.innerHTML = `
        <div class="skyline-error">
            <p>${text.error}</p>
            <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noreferrer" class="btn btn-secondary">${text.errorLink}</a>
        </div>
    `;
}

function updateSkylineLanguage() {
    if (skyline) {
        skyline.setLanguage(UI_TEXT[currentLanguage].github, LOCALES[currentLanguage]);
    } else if (!contributions) {
        const error = document.querySelector('.skyline-error');
        if (error) renderGitHubError(document.getElementById('githubSkyline'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    initNavigation();
    initLayout();
    initSpotlight();
    initPortraitTilt();
    loadCVData(currentLanguage);
    initGitHubActivity();
});
