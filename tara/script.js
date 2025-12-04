const postcard = document.getElementById('postcard');
const flipControl = document.getElementById('flipControl');
const launchWishBtn = document.getElementById('launchWish');
const sparkleLayer = document.getElementById('sparkleLayer');
const wishTemplate = document.getElementById('wishTemplate');
const ctaRow = document.querySelector('.cta-row');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pointerFineQuery = window.matchMedia('(pointer: fine)');
const allowTilt = !prefersReducedMotion && pointerFineQuery.matches;
const allowAmbient = !prefersReducedMotion;
let toastTimer = null;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

function toggleFlip() {
    if (!postcard) return;
    const isFlipped = postcard.classList.toggle('is-flipped');
    if (flipControl) {
        flipControl.setAttribute('aria-pressed', String(isFlipped));
    }
}

function addSparkle({ left, top, ambient = false }) {
    if (!sparkleLayer) return;
    const sparkle = document.createElement('span');
    sparkle.className = ambient ? 'sparkle ambient' : 'sparkle';
    sparkle.style.left = `${left}%`;
    sparkle.style.top = `${top}%`;
    if (!ambient) {
        sparkle.style.setProperty('--tx', `${randomBetween(-90, 90)}px`);
        sparkle.style.setProperty('--ty', `${randomBetween(-220, -80)}px`);
    } else {
        sparkle.style.animationDelay = `${Math.random() * 4}s`;
    }
    sparkleLayer.appendChild(sparkle);

    const lifespan = ambient ? 6000 : 2400;
    setTimeout(() => sparkle.remove(), lifespan);
}

function spraySparkles(count = 18) {
    const bounds = launchWishBtn?.getBoundingClientRect();
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;

    for (let i = 0; i < count; i++) {
        const baseX = bounds ? (bounds.left + bounds.width / 2) / vw * 100 : Math.random() * 100;
        const baseY = bounds ? (bounds.top + bounds.height / 2) / vh * 100 : Math.random() * 100;
        addSparkle({
            left: baseX + randomBetween(-5, 5),
            top: baseY + randomBetween(-5, 5),
            ambient: false
        });
    }
}

function createAmbientSparkles(total = 12) {
    for (let i = 0; i < total; i++) {
        addSparkle({
            left: Math.random() * 100,
            top: Math.random() * 100,
            ambient: true
        });
    }
}

function launchWish() {
    if (!wishTemplate) return;
    const star = wishTemplate.content.firstElementChild.cloneNode(true);
    document.body.appendChild(star);
    requestAnimationFrame(() => star.classList.add('active'));
    setTimeout(() => star.remove(), 3600);
    spraySparkles();
    showWishMessage();
    if (allowAmbient) {
        launchFireworks();
    }
}

function launchFireworks(count = 4) {
    const bounds = postcard?.getBoundingClientRect();
    const originX = bounds ? bounds.left + bounds.width / 2 : window.innerWidth / 2;
    const originY = bounds ? bounds.top + bounds.height * 0.35 : window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
        const firework = document.createElement('span');
        firework.className = 'firework';
        firework.style.left = `${originX}px`;
        firework.style.top = `${originY}px`;
        firework.style.setProperty('--travel-x', `${randomBetween(-140, 140)}px`);
        firework.style.setProperty('--travel-y', `${randomBetween(-200, -80)}px`);
        firework.style.setProperty('--hue', `${Math.floor(randomBetween(10, 360))}`);
        document.body.appendChild(firework);
        setTimeout(() => firework.remove(), 900);
    }
}

function showWishMessage() {
    if (!ctaRow) return;
    if (toastTimer) {
        clearTimeout(toastTimer);
    }
    const existing = ctaRow.querySelector('.wish-toast');
    existing?.remove();
    const toast = document.createElement('div');
    toast.className = 'wish-toast';
    toast.textContent = 'Make a wish ✨';
    ctaRow.appendChild(toast);
    toastTimer = setTimeout(() => {
        toast.remove();
        toastTimer = null;
    }, 2100);
}

function handleTilt(event) {
    if (!postcard) return;
    const rect = postcard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const tiltX = (0.5 - y) * 12;
    const tiltY = (x - 0.5) * 14;
    postcard.style.setProperty('--tilt-x', `${tiltX}deg`);
    postcard.style.setProperty('--tilt-y', `${tiltY}deg`);
}

function resetTilt() {
    postcard?.style.setProperty('--tilt-x', '0deg');
    postcard?.style.setProperty('--tilt-y', '0deg');
}

if (postcard) {
    postcard.addEventListener('click', () => {
        toggleFlip();
    });

    postcard.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleFlip();
        }
    });

    if (allowTilt) {
        postcard.addEventListener('pointermove', handleTilt);
        postcard.addEventListener('pointerleave', resetTilt);
        postcard.addEventListener('pointerup', resetTilt);
    }
}

if (flipControl) {
    flipControl.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleFlip();
    });
}

if (launchWishBtn) {
    launchWishBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        launchWish();
    });
}

if (allowAmbient) {
    createAmbientSparkles();
    setInterval(() => createAmbientSparkles(4), 5000);
}

