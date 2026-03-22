const LANGUAGE_FILES = {
    en: 'english.json',
    es: 'espanol.json',
    it: 'italian.json'
};

const UI_TEXT = {
    en: {
        lang: 'en',
        nav: ['Home', 'About', 'Experience', 'Skills', 'Education', 'Contact'],
        sectionEyebrows: ['Profile', 'Journey', 'Toolkit', 'Foundation', 'Connect'],
        heroKicker: 'AI Engineer • Deep Learning • R&D',
        heroPrimary: 'Get In Touch',
        heroSecondary: 'Download PDF',
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
            { value: '94%', label: 'Signal Classification Accuracy' },
            { value: '96%', label: 'Message Filtering Accuracy' },
            { value: '30%', label: 'Processing Efficiency Gain' },
            { value: '3+', label: 'Years in AI, Backend, and R&D' }
        ],
        footer: '© 2026 Sobhan Fooladi Mahani. Built for clarity, speed, and good engineering.'
    },
    es: {
        lang: 'es',
        nav: ['Inicio', 'Perfil', 'Experiencia', 'Habilidades', 'Educación', 'Contacto'],
        sectionEyebrows: ['Perfil', 'Trayectoria', 'Herramientas', 'Base', 'Conectar'],
        heroKicker: 'Ingeniero de IA • Deep Learning • I+D',
        heroPrimary: 'Contactar',
        heroSecondary: 'Descargar PDF',
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
            { value: '94%', label: 'Precisión en clasificación de señales' },
            { value: '96%', label: 'Precisión en filtrado de mensajes' },
            { value: '30%', label: 'Mejora de eficiencia de procesamiento' },
            { value: '3+', label: 'Años en IA, backend e I+D' }
        ],
        footer: '© 2026 Sobhan Fooladi Mahani. Diseñado para claridad, velocidad y buena ingeniería.'
    },
    it: {
        lang: 'it',
        nav: ['Home', 'Profilo', 'Esperienza', 'Competenze', 'Formazione', 'Contatto'],
        sectionEyebrows: ['Profilo', 'Percorso', 'Strumenti', 'Base', 'Contatto'],
        heroKicker: 'Ingegnere AI • Deep Learning • R&S',
        heroPrimary: 'Contattami',
        heroSecondary: 'Scarica PDF',
        contactLabels: {
            email: 'Email',
            location: 'Localita',
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
            { value: '94%', label: 'Accuratezza nella classificazione dei segnali' },
            { value: '96%', label: 'Accuratezza nel filtro dei messaggi' },
            { value: '30%', label: 'Miglioramento dell efficienza di elaborazione' },
            { value: '3+', label: 'Anni in AI, backend e R&S' }
        ],
        footer: '© 2026 Sobhan Fooladi Mahani. Progettato per chiarezza, velocita e ottima ingegneria.'
    }
};

let cvData = null;
let currentLanguage = 'en';
let currentSection = 0;
let sectionObserver = null;
let revealObserver = null;

let scene;
let camera;
let renderer;
let particleSystem;
let animationFrameId = null;
let mouse = { x: 0, y: 0 };
let targetMouse = { x: 0, y: 0 };

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

async function loadCVData(lang = 'en') {
    const selectedLanguage = LANGUAGE_FILES[lang] ? lang : 'en';

    try {
        const response = await fetch(LANGUAGE_FILES[selectedLanguage]);
        if (!response.ok) {
            throw new Error(`Failed to load ${LANGUAGE_FILES[selectedLanguage]} (${response.status})`);
        }

        cvData = await response.json();
        currentLanguage = selectedLanguage;
        document.documentElement.lang = UI_TEXT[selectedLanguage].lang;
        localStorage.setItem('language', selectedLanguage);

        updateLanguageButtons();
        populateContent();
        updateNavigationLabels();
        initScrollAnimations();
    } catch (error) {
        console.error('Error loading CV data:', error);
    }
}

function updateNavigationLabels() {
    const ui = UI_TEXT[currentLanguage];
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.textContent = ui.nav[index] || link.textContent;
    });

    const eyebrows = ui.sectionEyebrows.slice(1);
    const titleIds = {
        experienceTitle: ui.nav[2],
        skillsTitle: ui.nav[3],
        educationTitle: ui.nav[4],
        contactTitle: ui.nav[5]
    };

    Object.entries(titleIds).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    });

    const eyebrowIds = ['experienceEyebrow', 'skillsEyebrow', 'educationEyebrow', 'contactEyebrow'];
    eyebrowIds.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = eyebrows[index];
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
        <span class="title-line">${first}</span>
        <span class="title-line">${rest}</span>
    `;
}

function populateContent() {
    if (!cvData) return;

    const ui = UI_TEXT[currentLanguage];

    const heroName = document.getElementById('heroName');
    if (heroName && cvData.fullName) {
        heroName.innerHTML = formatHeroName(cvData.fullName);
    }

    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) heroTitle.textContent = cvData.title || '';

    const heroDescription = document.getElementById('heroDescription');
    if (heroDescription) heroDescription.textContent = cvData.objective?.[0] || '';

    renderStats(ui.stats);
    renderExperience(cvData.experience || []);
    renderSkills(cvData.skills || []);
    renderEducation(cvData.education || []);
    renderContact(cvData.contact || {}, ui);
}

function renderStats(stats) {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid) return;

    statsGrid.innerHTML = stats.map((stat) => `
        <div class="stat-card fade-in">
            <div class="stat-number">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
}

function renderExperience(experience) {
    const timeline = document.getElementById('experienceTimeline');
    if (!timeline) return;

    timeline.innerHTML = experience.map((exp) => `
        <article class="experience-item fade-in">
            <div class="experience-header">
                <div>
                    <div class="experience-position">${exp.position || ''}</div>
                    <div class="experience-location">${exp.location || ''}</div>
                </div>
                <div class="experience-period">${exp.period || ''}</div>
            </div>
            <ul class="experience-responsibilities">
                ${(exp.responsibilities || []).map((item) => `<li>${item}</li>`).join('')}
            </ul>
        </article>
    `).join('');
}

function renderSkills(skills) {
    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid) return;

    skillsGrid.innerHTML = skills.map((skill) => {
        const parts = skill.split(':');
        const categoryTitle = parts[0]?.trim() || skill;
        const skillItems = parts[1]
            ? parts[1].split(',').map((item) => item.trim()).filter(Boolean)
            : [skill];

        return `
            <article class="skill-category fade-in">
                <div class="skill-category-title">${categoryTitle}</div>
                <ul class="skill-list">
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
        <article class="education-item fade-in">
            <p class="education-text">${item}</p>
        </article>
    `).join('');
}

function renderContact(contact, ui) {
    const contactInfo = document.getElementById('contactInfo');
    const contactActions = document.getElementById('contactActions');

    if (contactInfo) {
        contactInfo.innerHTML = `
            <div class="contact-item">
                <span class="contact-label">${ui.contactLabels.email}</span>
                <a href="mailto:${contact.email || ''}">${contact.email || ''}</a>
            </div>
            <div class="contact-item">
                <span class="contact-label">${ui.contactLabels.location}</span>
                <span>${contact.address || ''}</span>
            </div>
            <div class="contact-item">
                <span class="contact-label">${ui.contactLabels.dob}</span>
                <span>${contact.dob || ''}</span>
            </div>
            <div class="contact-item">
                <span class="contact-label">${ui.contactLabels.linkedin}</span>
                <a href="${contact.linkedin || '#'}" target="_blank" rel="noreferrer">${contact.linkedin || ''}</a>
            </div>
            <div class="contact-item">
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
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
            updateThemeIcon(nextTheme);
            update3DSceneTheme(nextTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '◐' : '◑';
    }
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .nav-brand');
    const menuToggle = document.getElementById('menuToggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const indicators = document.querySelectorAll('.indicator');

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetSection = parseInt(link.dataset.section || '0', 10);
            changeSection(targetSection);

            if (window.innerWidth <= 900 && navLinksContainer) {
                navLinksContainer.classList.remove('active');
            }
        });
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => changeSection(index));
    });

    document.querySelectorAll('.scroll-to-section').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            changeSection(parseInt(button.dataset.target || '5', 10));
        });
    });

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });
    }
}

function changeSection(index) {
    const sections = document.querySelectorAll('.content-section');
    if (sections[index]) {
        sections[index].scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start'
        });
    }
}

function updateIndicators() {
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSection);
    });
}

function updateNavigation() {
    document.querySelectorAll('.nav-link').forEach((link, index) => {
        link.classList.toggle('active', index === currentSection);
    });
}

function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    const progressFill = document.getElementById('scrollProgressFill');

    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
}

function updateSections() {
    if (sectionObserver) {
        sectionObserver.disconnect();
    }

    const sections = document.querySelectorAll('.content-section');

    sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const sectionIndex = parseInt(entry.target.dataset.section || '0', 10);
                currentSection = sectionIndex;
                updateIndicators();
                updateNavigation();
            }
        });
    }, {
        threshold: 0.45,
        rootMargin: '-10% 0px -20% 0px'
    });

    sections.forEach((section) => sectionObserver.observe(section));
}

function initScrollAnimations() {
    if (revealObserver) {
        revealObserver.disconnect();
    }

    const elements = document.querySelectorAll('.fade-in');
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach((element) => {
        if (prefersReducedMotion) {
            element.classList.add('visible');
        } else {
            revealObserver.observe(element);
        }
    });
}

function initThreeJS() {
    const canvas = document.getElementById('canvas3d');
    if (!canvas || typeof THREE === 'undefined') return;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x09111f, 12, 42);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 7;

    renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    createParticleSystem();
    createLights();
    update3DSceneTheme(document.documentElement.getAttribute('data-theme') || 'dark');

    window.addEventListener('resize', onWindowResize);
    if (!prefersReducedMotion) {
        window.addEventListener('mousemove', onMouseMove);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    animate();
}

function createParticleSystem() {
    const isMobile = window.innerWidth < 900;
    const particleCount = prefersReducedMotion ? 120 : (isMobile ? 280 : 520);
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i += 1) {
        const i3 = i * 3;
        const radius = Math.random() * 24 + 6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        sizes[i] = Math.random() * 2 + 0.4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            mouse: { value: new THREE.Vector2(0, 0) },
            scrollProgress: { value: 0 }
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform vec2 mouse;
            uniform float scrollProgress;

            void main() {
                vColor = color;
                vec3 pos = position;
                pos.y += sin(time * 0.35 + pos.x * 0.16) * 0.22;
                pos.x += cos(time * 0.25 + pos.z * 0.14) * 0.18;
                pos.xy += mouse * 0.08;
                pos.z += scrollProgress * 3.0;

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (120.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;

            void main() {
                float d = distance(gl_PointCoord, vec2(0.5));
                float alpha = 1.0 - smoothstep(0.0, 0.5, d);
                gl_FragColor = vec4(vColor, alpha * 0.55);
            }
        `,
        transparent: true,
        vertexColors: true,
        depthTest: false,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function createLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    const pointA = new THREE.PointLight(0x66d9ef, 0.75, 80);
    const pointB = new THREE.PointLight(0xff8a5b, 0.55, 80);

    pointA.position.set(6, 4, 8);
    pointB.position.set(-5, -3, 7);

    scene.add(ambient, pointA, pointB);
}

function update3DSceneTheme(theme) {
    if (!particleSystem?.geometry?.attributes?.color) return;

    const palette = theme === 'dark'
        ? [0x7dd3fc, 0xf59e0b, 0x34d399]
        : [0x2563eb, 0xf97316, 0x059669];

    const colors = particleSystem.geometry.attributes.color.array;
    for (let i = 0; i < colors.length; i += 3) {
        const hex = palette[(i / 3) % palette.length];
        const color = new THREE.Color(hex);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }
    particleSystem.geometry.attributes.color.needsUpdate = true;

    scene.children.forEach((child) => {
        if (child instanceof THREE.PointLight) {
            child.intensity = theme === 'dark' ? 0.75 : 0.45;
        }
    });
}

function onWindowResize() {
    if (!camera || !renderer) return;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
}

function onMouseMove(event) {
    targetMouse.x = ((event.clientX / window.innerWidth) * 2 - 1) * 0.35;
    targetMouse.y = (-(event.clientY / window.innerHeight) * 2 + 1) * 0.35;
}

function onScroll() {
    updateScrollProgress();
    update3DSceneFromScroll();
}

function update3DSceneFromScroll() {
    if (!camera || !particleSystem?.material?.uniforms) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

    particleSystem.material.uniforms.scrollProgress.value = progress;
    camera.position.z = 7 + (progress * 1.4);
}

function animate() {
    if (!renderer || !scene || !camera) return;

    animationFrameId = requestAnimationFrame(animate);

    if (particleSystem?.material?.uniforms) {
        const time = performance.now() * 0.0007;
        mouse.x += (targetMouse.x - mouse.x) * 0.06;
        mouse.y += (targetMouse.y - mouse.y) * 0.06;
        particleSystem.material.uniforms.time.value = time;
        particleSystem.material.uniforms.mouse.value.set(mouse.x, mouse.y);
        particleSystem.rotation.y += prefersReducedMotion ? 0.0002 : 0.0009;
    }

    renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    initNavigation();
    updateSections();
    updateScrollProgress();
    loadCVData(currentLanguage);
    initThreeJS();
});

window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});
