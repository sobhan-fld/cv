// CV Data
let cvData = null;

// Load CV data
async function loadCVData() {
    try {
        const response = await fetch('english.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        cvData = await response.json();
        console.log('CV data loaded:', cvData);
        console.log('Experience data:', cvData.experience);
        console.log('Skills data:', cvData.skills);
        
        // Wait a bit for DOM to be fully ready, then populate
        setTimeout(() => {
            populateContent();
        }, 100);
    } catch (error) {
        console.error('Error loading CV data:', error);
    }
}

// Three.js Scene Setup
let scene, camera, renderer, particles, particleSystem;
let mouse = { x: 0, y: 0 };
let targetMouse = { x: 0, y: 0 };
let animationFrameId = null;

function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050508, 10, 50);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Renderer
    const canvas = document.getElementById('canvas3d');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x050508, 0);

    // Create particle system
    createParticleSystem();

    // Create lights for the scene
    createLights();

    // Create 3D text (optional, can be added later)
    // create3DText();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial scroll progress update
    updateScrollProgress();
    update3DSceneFromScroll();

    // Start animation
    animate();

    // Hide loading screen after a delay (with error handling)
    setTimeout(() => {
        try {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error hiding loading screen:', error);
        }
    }, 1500);
}

function createParticleSystem() {
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Get current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const color1 = new THREE.Color(currentTheme === 'dark' ? 0x3b82f6 : 0x2563eb); // Primary color
    const color2 = new THREE.Color(currentTheme === 'dark' ? 0x8b5cf6 : 0x7c3aed); // Secondary color
    const color3 = new THREE.Color(currentTheme === 'dark' ? 0x10b981 : 0x059669); // Accent color (green)

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Positions in a sphere
        const radius = Math.random() * 50 + 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Colors
        const colorChoice = Math.random();
        let color;
        if (colorChoice < 0.33) {
            color = color1;
        } else if (colorChoice < 0.66) {
            color = color2;
        } else {
            color = color3;
        }

        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        // Sizes
        sizes[i] = Math.random() * 3 + 1;
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
                
                // Add wave motion
                pos.y += sin(time * 0.5 + pos.x * 0.1) * 0.5;
                pos.x += cos(time * 0.3 + pos.z * 0.1) * 0.5;
                
                // Scroll-based parallax transformation
                float scrollRot = scrollProgress * 3.14159265359 * 2.0;
                float scrollScale = 1.0 + scrollProgress * 0.5;
                
                // Rotate particles based on scroll
                float cosRot = cos(scrollRot);
                float sinRot = sin(scrollRot);
                float rotX = cosRot * pos.x - sinRot * pos.z;
                float rotZ = sinRot * pos.x + cosRot * pos.z;
                pos.x = rotX;
                pos.z = rotZ;
                
                // Scale based on scroll
                pos = pos * scrollScale;
                
                // Parallax offset based on scroll
                pos.y += scrollProgress * 10.0;
                
                // Mouse interaction (subtle)
                vec2 mouseInfluence = (mouse - vec2(pos.x, pos.y)) * 0.005;
                pos.xy = pos.xy + mouseInfluence;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                gl_FragColor = vec4(vColor, alpha * 0.8);
            }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthTest: false
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function createLights() {
    // Add lights for the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Get current theme for lights
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const lightColor1 = currentTheme === 'dark' ? 0x3b82f6 : 0x2563eb;
    const lightColor2 = currentTheme === 'dark' ? 0x8b5cf6 : 0x7c3aed;
    const lightColor3 = currentTheme === 'dark' ? 0x10b981 : 0x059669;
    
    const pointLight1 = new THREE.PointLight(lightColor1, 0.8, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(lightColor2, 0.8, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(lightColor3, 0.8, 100);
    pointLight3.position.set(0, 0, 10);
    scene.add(pointLight3);
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Update particles
    if (particleSystem) {
        particleSystem.material.uniforms.time.value = time;
        particleSystem.material.uniforms.mouse.value.set(
            targetMouse.x * 0.5,
            targetMouse.y * 0.5
        );
        // scrollProgress is updated in updateScrollTransform() below
    }

    // Camera movement based on mouse (subtle)
    camera.position.x += (targetMouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-targetMouse.y * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Smooth mouse interpolation
    mouse.x += (targetMouse.x - mouse.x) * 0.05;
    mouse.y += (targetMouse.y - mouse.y) * 0.05;

    // Update 3D scene based on current section
    updateScrollTransform();

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Normal Scrolling with Intersection Observer
let currentSection = 0;
let totalSections = 6;

function onScroll() {
    // Normal scroll behavior - just update progress and 3D scene
    updateScrollProgress();
    update3DSceneFromScroll();
}

function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    const progressFill = document.getElementById('scrollProgressFill');
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
}

function update3DSceneFromScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    
    if (particleSystem && particleSystem.material && particleSystem.material.uniforms) {
        particleSystem.material.uniforms.scrollProgress.value = progress;
    }
    
    // Camera movement based on scroll
    camera.position.z = 5 + progress * 3;
    camera.rotation.z = Math.sin(progress * Math.PI * 2) * 0.05;
}

function updateSections() {
    // Use Intersection Observer to detect visible sections
    const sections = document.querySelectorAll('.content-section');
    
    // Make first section visible immediately
    if (sections.length > 0) {
        sections[0].classList.add('visible');
        currentSection = 0;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const sectionIndex = parseInt(entry.target.getAttribute('data-section'));
                if (!isNaN(sectionIndex)) {
                    // Update current section if it's the most visible one
                    const rect = entry.target.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    const visibleRatio = Math.min(rect.height, viewportHeight) / viewportHeight;
                    
                    if (visibleRatio > 0.3) {
                        currentSection = sectionIndex;
                        updateIndicators();
                        updateNavigation();
                    }
                }
            }
        });
    }, {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-10% 0px -10% 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSection);
    });
}

function updateNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.classList.toggle('active', index === currentSection);
    });
}

function changeSection(index) {
    const sections = document.querySelectorAll('.content-section');
    if (index >= 0 && index < sections.length) {
        sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update scroll-based 3D transformations (for animation loop)
function updateScrollTransform() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    
    if (particleSystem && particleSystem.material && particleSystem.material.uniforms) {
        particleSystem.material.uniforms.scrollProgress.value = progress;
    }
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const indicators = document.querySelectorAll('.indicator');

    // Nav links
    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            changeSection(index);
            
            // Close mobile menu
            if (window.innerWidth <= 768 && navLinksContainer) {
                navLinksContainer.classList.remove('active');
            }
        });
    });

    // Section indicators
    if (indicators.length > 0) {
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                changeSection(index);
            });
        });
    }

    // Menu toggle for mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });
    }
    
    // Scroll-to-section buttons
    document.querySelectorAll('.scroll-to-section').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = parseInt(btn.getAttribute('data-target'));
            changeSection(target);
        });
    });
}

// Populate content from JSON
function populateContent() {
    if (!cvData) {
        console.warn('CV data not loaded yet');
        return;
    }
    
    console.log('Populating content...');
    
    // Ensure DOM elements exist
    if (!document.getElementById('experienceTimeline')) {
        console.error('experienceTimeline element does not exist in DOM');
    }
    if (!document.getElementById('skillsGrid')) {
        console.error('skillsGrid element does not exist in DOM');
    }

    // Hero section
    if (cvData.fullName) {
        document.getElementById('heroName').innerHTML = `
            <span class="title-line">${cvData.fullName.split(' ')[0]}</span>
            <span class="title-line">${cvData.fullName.split(' ').slice(1).join(' ')}</span>
        `;
    }

    if (cvData.title) {
        document.getElementById('heroTitle').textContent = cvData.title;
    }

    if (cvData.objective && cvData.objective[0]) {
        document.getElementById('heroDescription').textContent = cvData.objective[0].substring(0, 80) + '...';
    }

    // About section
    if (cvData.objective && cvData.objective[0]) {
        document.getElementById('aboutText').textContent = cvData.objective[0];
    }

    // Experience section
    if (cvData.experience && Array.isArray(cvData.experience)) {
        const timeline = document.getElementById('experienceTimeline');
        if (timeline) {
            timeline.innerHTML = '';

            cvData.experience.forEach((exp, index) => {
                if (exp && exp.position) {
                    const expItem = document.createElement('div');
                    expItem.className = 'experience-item fade-in';
                    expItem.innerHTML = `
                        <div class="experience-header">
                            <div>
                                <div class="experience-position">${exp.position || ''}</div>
                                <div class="experience-location">${exp.location || ''}</div>
                            </div>
                            <div class="experience-period">${exp.period || ''}</div>
                        </div>
                        <ul class="experience-responsibilities">
                            ${(exp.responsibilities || []).map(resp => `<li>${resp}</li>`).join('')}
                        </ul>
                    `;
                    timeline.appendChild(expItem);

                    // Trigger animation on scroll
                    setTimeout(() => {
                        observeElement(expItem);
                    }, index * 100);
                }
            });
        } else {
            console.error('Experience timeline element not found');
        }
    } else {
        console.warn('No experience data found in CV data');
    }

    // Skills section
    if (cvData.skills && Array.isArray(cvData.skills)) {
        const skillsGrid = document.getElementById('skillsGrid');
        if (skillsGrid) {
            skillsGrid.innerHTML = '';

            cvData.skills.forEach((skill, index) => {
                if (skill) {
                    const skillCategory = document.createElement('div');
                    skillCategory.className = 'skill-category fade-in';
                    
                    const skillParts = skill.split(':');
                    const categoryTitle = skillParts[0] || skill;
                    const skillItems = skillParts[1] ? skillParts[1].split(',').map(s => s.trim()).filter(s => s) : [skill];

                    skillCategory.innerHTML = `
                        <div class="skill-category-title">${categoryTitle}</div>
                        <ul class="skill-list">
                            ${skillItems.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    `;
                    skillsGrid.appendChild(skillCategory);

                    setTimeout(() => {
                        observeElement(skillCategory);
                    }, index * 100);
                }
            });
        } else {
            console.error('Skills grid element not found');
        }
    } else {
        console.warn('No skills data found in CV data');
    }

    // Education section
    if (cvData.education) {
        const educationList = document.getElementById('educationList');
        educationList.innerHTML = '';

        cvData.education.forEach((edu, index) => {
            const eduItem = document.createElement('div');
            eduItem.className = 'education-item fade-in';
            eduItem.innerHTML = `<p class="education-text">${edu}</p>`;
            educationList.appendChild(eduItem);

            setTimeout(() => {
                observeElement(eduItem);
            }, index * 100);
        });
    }

    // Contact section
    if (cvData.contact) {
        const contactInfo = document.getElementById('contactInfo');
        contactInfo.innerHTML = `
            <div class="contact-item">
                <strong>Email:</strong> ${cvData.contact.email}
            </div>
            <div class="contact-item">
                <strong>Location:</strong> ${cvData.contact.address}
            </div>
            <div class="contact-item">
                <strong>Date of Birth:</strong> ${cvData.contact.dob}
            </div>
            <div class="contact-item">
                <strong>LinkedIn:</strong> 
                <a href="${cvData.contact.linkedin}" target="_blank" style="color: var(--primary-color);">
                    ${cvData.contact.linkedin}
                </a>
            </div>
        `;

        const contactActions = document.getElementById('contactActions');
        contactActions.innerHTML = `
            <a href="mailto:${cvData.contact.email}" class="btn btn-primary">Send Email</a>
            <a href="${cvData.contact.linkedin}" target="_blank" class="btn btn-linkedin">LinkedIn</a>
        `;
    }
}

// Intersection Observer for scroll animations
function observeElement(element) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(element);
}

// Initialize all fade-in elements
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observeElement(element);
    });
}

// Theme Management
function initTheme() {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update theme toggle icon
    updateThemeIcon(savedTheme);
    
    // Theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Update 3D scene colors based on theme
            update3DSceneTheme(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

function update3DSceneTheme(theme) {
    // Update particle colors based on theme
    if (particleSystem && particleSystem.geometry && particleSystem.geometry.attributes.color) {
        const colors = particleSystem.geometry.attributes.color.array;
        const color1 = new THREE.Color(theme === 'dark' ? 0x3b82f6 : 0x2563eb); // Primary
        const color2 = new THREE.Color(theme === 'dark' ? 0x8b5cf6 : 0x7c3aed); // Secondary
        const color3 = new THREE.Color(theme === 'dark' ? 0x10b981 : 0x059669); // Accent
        
        for (let i = 0; i < colors.length; i += 3) {
            const choice = Math.random();
            let color;
            if (choice < 0.33) {
                color = color1;
            } else if (choice < 0.66) {
                color = color2;
            } else {
                color = color3;
            }
            
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }
        
        particleSystem.geometry.attributes.color.needsUpdate = true;
    }
    
    // Update lights based on theme
    if (scene) {
        scene.children.forEach(child => {
            if (child instanceof THREE.PointLight) {
                if (child.color.getHex() === 0x00d4ff || child.color.getHex() === 0x2563eb) {
                    child.color.setHex(theme === 'dark' ? 0x3b82f6 : 0x2563eb);
                } else if (child.color.getHex() === 0x7b2cbf || child.color.getHex() === 0x7c3aed) {
                    child.color.setHex(theme === 'dark' ? 0x8b5cf6 : 0x7c3aed);
                } else if (child.color.getHex() === 0x00ff88 || child.color.getHex() === 0x059669) {
                    child.color.setHex(theme === 'dark' ? 0x10b981 : 0x059669);
            }
        }
    });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize theme first
        initTheme();
        
        // Load CV data
        loadCVData();

        // Initialize Three.js
        initThreeJS();

        // Initialize navigation
        initNavigation();

        // Initialize sections with Intersection Observer
        setTimeout(() => {
            updateSections();
            updateIndicators();
            updateNavigation();
            updateScrollProgress();
            
            // Update 3D scene with current theme
            const currentTheme = document.documentElement.getAttribute('data-theme');
            update3DSceneTheme(currentTheme);
        }, 100);
    } catch (error) {
        console.error('Initialization error:', error);
        // Make sure loading screen is hidden even on error
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});
