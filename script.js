/* ---------- Loader de entrada: terminal inicializando ambiente seguro ---------- */
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderPct = document.getElementById('loaderPct');
const loaderMsg = document.getElementById('loaderMsg');
const loaderBadge = document.getElementById('loaderBadge');
const loaderCode = document.getElementById('loaderCode');
const loaderLineNumbers = document.getElementById('loaderLineNumbers');

(function runBootTerminal() {
    if (!loader || !loaderCode) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // cada linha: texto puro (o que é "digitado") + versão com destaque de sintaxe (aplicada ao terminar a linha)
    const bootLines = [
        {
            plain: `import { SecureEnvironment } from "./core";`,
            html: `<span class="kw">import</span> { SecureEnvironment } <span class="kw">from</span> <span class="str">"./core"</span><span class="punct">;</span>`,
            status: 'Carregando módulos…'
        },
        {
            plain: `import { Firewall, Cache, DNS } from "./network";`,
            html: `<span class="kw">import</span> { Firewall, Cache, DNS } <span class="kw">from</span> <span class="str">"./network"</span><span class="punct">;</span>`,
            status: 'Carregando módulos de rede…'
        },
        {
            plain: `const env = new SecureEnvironment({ mode: "strict" });`,
            html: `<span class="kw">const</span> env <span class="punct">=</span> <span class="kw">new</span> SecureEnvironment<span class="punct">({</span> mode<span class="punct">:</span> <span class="str">"strict"</span> <span class="punct">});</span>`,
            status: 'Preparando ambiente…'
        },
        {
            plain: `await env.handshake();                 // TLS 1.3 ✓`,
            html: `<span class="kw">await</span> env.handshake<span class="punct">();</span>                 <span class="terminal__comment" style="display:inline">// TLS 1.3 ✓</span>`,
            status: 'Estabelecendo conexão segura…'
        },
        {
            plain: `await env.verifyCertificate();         // válido ✓`,
            html: `<span class="kw">await</span> env.verifyCertificate<span class="punct">();</span>         <span class="terminal__comment" style="display:inline">// válido ✓</span>`,
            status: 'Verificando certificado SSL…'
        },
        {
            plain: `await env.sandbox();                   // isolado ✓`,
            html: `<span class="kw">await</span> env.sandbox<span class="punct">();</span>                   <span class="terminal__comment" style="display:inline">// isolado ✓</span>`,
            status: 'Isolando ambiente de execução…'
        },
        {
            plain: `await env.preloadAssets();             // 100% ✓`,
            html: `<span class="kw">await</span> env.preloadAssets<span class="punct">();</span>             <span class="terminal__comment" style="display:inline">// 100% ✓</span>`,
            status: 'Carregando recursos…'
        },
        {
            plain: `console.log("Ambiente seguro. Bem-vindo(a).");`,
            html: `console.<span class="kw">log</span><span class="punct">(</span><span class="str">"Ambiente seguro. Bem-vindo(a)."</span><span class="punct">);</span>`,
            status: 'Pronto.'
        },
    ];

    const totalChars = bootLines.reduce((sum, l) => sum + l.plain.length, 0);
    let typedChars = 0;

    function updateProgress(extra = 0) {
        const pct = Math.min(100, Math.round(((typedChars + extra) / totalChars) * 100));
        if (loaderFill) loaderFill.style.width = `${pct}%`;
        if (loaderPct) loaderPct.textContent = `${pct}%`;
    }

    function finishBoot() {
        if (loaderBadge) loaderBadge.textContent = 'seguro ✓';
        if (loaderMsg) loaderMsg.textContent = 'Ambiente pronto';
        setTimeout(() => {
            if (loader) loader.classList.add('is-hidden');
            document.body.classList.remove('is-loading');
        }, 2450);
    }

    if (reduceMotion) {
        // sem animação: monta tudo de uma vez e libera o site rapidamente
        loaderCode.innerHTML = bootLines.map(l => `<span>${l.html}</span>`).join('');
        loaderLineNumbers.innerHTML = bootLines.map((_, i) => `<span>${i + 1}</span>`).join('');
        updateProgress(totalChars);
        setTimeout(finishBoot, 400);
        return;
    }

    function typeLine(index) {
        if (index >= bootLines.length) {
            finishBoot();
            return;
        }

        const line = bootLines[index];
        if (loaderMsg) loaderMsg.textContent = line.status;
        if (loaderLineNumbers) loaderLineNumbers.insertAdjacentHTML('beforeend', `<span>${index + 1}</span>`);

        const lineEl = document.createElement('span');
        lineEl.style.display = 'block';
        const cursorEl = document.createElement('span');
        cursorEl.className = 'terminal__cursor';
        lineEl.appendChild(cursorEl);
        loaderCode.appendChild(lineEl);

        let charIndex = 0;
        const speed = 0;

        function typeChar() {
            if (charIndex < line.plain.length) {
                cursorEl.insertAdjacentText('beforebegin', line.plain[charIndex]);
                charIndex++;
                typedChars++;
                updateProgress();
                setTimeout(typeChar, speed + Math.random() * 3);
            } else {
                // linha completa: aplica destaque de sintaxe e segue para a próxima
                lineEl.innerHTML = line.html;
                setTimeout(() => typeLine(index + 1), 25);
            }
        }
        typeChar();
    }

    setTimeout(() => typeLine(0), 150);
})();
 
/* ---------- Cursor customizado ---------- */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
 
if (supportsFinePointer && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
 
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });
 
    function animateRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();
 
    document.querySelectorAll('a, button, .icon, .dot-nav__item').forEach((el) => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });
}
 
/* ---------- Canvas de partículas (constelação) — reage a rato e toque em todo o site ---------- */
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    let touchClearTimerGlobal = null;
 
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
 
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
 
    /* toque: telemóveis e tablets — o dedo interage com as formas de fundo
       em qualquer ponto do site, tal como o rato no desktop */
    window.addEventListener('touchstart', (e) => {
        if (!e.touches.length) return;
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        clearTimeout(touchClearTimerGlobal);
    }, { passive: true });
 
    window.addEventListener('touchmove', (e) => {
        if (!e.touches.length) return;
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        clearTimeout(touchClearTimerGlobal);
    }, { passive: true });
 
    window.addEventListener('touchend', () => {
        touchClearTimerGlobal = setTimeout(() => { mouse.x = null; mouse.y = null; }, 900);
    }, { passive: true });
 
    function themeColor() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        return isDark ? '99, 102, 241' : '79, 70, 229';
    }
 
    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.size = Math.random() * 1.8 + 0.9;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
 
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 1.3;
                    this.y += (dy / dist) * force * 1.3;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${themeColor()}, 0.7)`;
            ctx.fill();
        }
    }
 
    function initParticles() {
        const count = Math.min(150, Math.floor((canvas.width * canvas.height) / 10000));
        particles = Array.from({ length: count }, () => new Particle());
    }
    initParticles();
    window.addEventListener('resize', initParticles);
 
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${themeColor()}, ${0.28 * (1 - dist / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
 
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}
 
/* ---------- Aviso de cookies ---------- */
const cookieNotification = document.getElementById('aviso-de-cookies');
const closeButton = document.getElementById('aviso-de-cookies-fechar');
 
function closeCookieNotification() {
    cookieNotification.style.display = 'none';
}
if (closeButton) {
    closeButton.addEventListener('click', () => {
        setCookie('cookieConsent', 'true', 365);
        closeCookieNotification();
    });
}
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}
function getCookie(name) {
    const cookieValue = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
    return cookieValue ? cookieValue[2] : null;
}
const cookieConsent = getCookie('cookieConsent');
if (!cookieConsent && cookieNotification) {
    setTimeout(() => { cookieNotification.style.display = 'flex'; }, 2200);
}
 
/* ---------- Menu hamburguer ---------- */
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}
 
/* ---------- Slider dia / noite (interpolação contínua, como um volume) ---------- */
const THEME_DAY = {
    bg: [246, 247, 252], bgAlt: [238, 240, 251],
    surface: [255, 255, 255], surfaceAlpha: 0.72,
    surfaceSolid: [255, 255, 255],
    border: [97, 90, 199], borderAlpha: 0.16,
    borderStrong: [97, 90, 199], borderStrongAlpha: 0.32,
    ink: [17, 19, 43], inkSoft: [88, 92, 130], inkFaint: [130, 133, 171]
};
const THEME_NIGHT = {
    bg: [10, 11, 28], bgAlt: [15, 17, 40],
    surface: [22, 24, 51], surfaceAlpha: 0.6,
    surfaceSolid: [20, 22, 47],
    border: [139, 92, 246], borderAlpha: 0.22,
    borderStrong: [139, 92, 246], borderStrongAlpha: 0.4,
    ink: [238, 240, 253], inkSoft: [167, 171, 214], inkFaint: [109, 113, 160]
};
 
function clamp01(n) { return Math.min(Math.max(n, 0), 1); }
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpRgb(a, b, t) { return a.map((c, i) => Math.round(lerp(c, b[i], t))); }
 
function applyThemeValue(t) {
    t = clamp01(t);
    const root = document.body.style;
 
    root.setProperty('--bg', `rgb(${lerpRgb(THEME_DAY.bg, THEME_NIGHT.bg, t).join(',')})`);
    root.setProperty('--bg-alt', `rgb(${lerpRgb(THEME_DAY.bgAlt, THEME_NIGHT.bgAlt, t).join(',')})`);
    root.setProperty('--surface', `rgba(${lerpRgb(THEME_DAY.surface, THEME_NIGHT.surface, t).join(',')}, ${lerp(THEME_DAY.surfaceAlpha, THEME_NIGHT.surfaceAlpha, t).toFixed(2)})`);
    root.setProperty('--surface-solid', `rgb(${lerpRgb(THEME_DAY.surfaceSolid, THEME_NIGHT.surfaceSolid, t).join(',')})`);
    root.setProperty('--border', `rgba(${lerpRgb(THEME_DAY.border, THEME_NIGHT.border, t).join(',')}, ${lerp(THEME_DAY.borderAlpha, THEME_NIGHT.borderAlpha, t).toFixed(2)})`);
    root.setProperty('--border-strong', `rgba(${lerpRgb(THEME_DAY.borderStrong, THEME_NIGHT.borderStrong, t).join(',')}, ${lerp(THEME_DAY.borderStrongAlpha, THEME_NIGHT.borderStrongAlpha, t).toFixed(2)})`);
    root.setProperty('--ink', `rgb(${lerpRgb(THEME_DAY.ink, THEME_NIGHT.ink, t).join(',')})`);
    root.setProperty('--ink-soft', `rgb(${lerpRgb(THEME_DAY.inkSoft, THEME_NIGHT.inkSoft, t).join(',')})`);
    root.setProperty('--ink-faint', `rgb(${lerpRgb(THEME_DAY.inkFaint, THEME_NIGHT.inkFaint, t).join(',')})`);
 
    /* alterna o estado binário para partes do site que ainda dependem de um on/off
       (opacidade dos blobs, cor das partículas do canvas) */
    document.body.setAttribute('data-theme', t > 0.5 ? 'dark' : 'light');
}
 
let themeValue = 0; // 0 = dia, 1 = noite
let isDraggingTheme = false;
let activeThemeTrack = null;
const themeSliders = document.querySelectorAll('.theme-slider');
 
function valueFromClientX(track, clientX) {
    const rect = track.getBoundingClientRect();
    return clamp01((clientX - rect.left) / rect.width);
}
 
function setSliderVisual(t) {
    themeSliders.forEach((el) => {
        const thumb = el.querySelector('.theme-slider__thumb');
        if (thumb) thumb.style.left = `${t * 100}%`;
        el.setAttribute('aria-valuenow', String(Math.round(t * 100)));
    });
}
 
function setThemeValue(t) {
    themeValue = clamp01(t);
    applyThemeValue(themeValue);
    setSliderVisual(themeValue);
}
 
function animateThemeTo(target, duration = 450) {
    const start = themeValue;
    const startTime = performance.now();
    function step(now) {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        setThemeValue(start + (target - start) * eased);
        if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
 
themeSliders.forEach((el) => {
    const track = el.querySelector('.theme-slider__track');
    const sunIcon = el.querySelector('.theme-slider__icon--sun');
    const moonIcon = el.querySelector('.theme-slider__icon--moon');
    if (!track) return;
 
    track.addEventListener('mousedown', (e) => {
        isDraggingTheme = true;
        activeThemeTrack = track;
        document.body.classList.add('is-theme-dragging');
        setThemeValue(valueFromClientX(track, e.clientX));
        e.preventDefault();
    });
    track.addEventListener('touchstart', (e) => {
        isDraggingTheme = true;
        activeThemeTrack = track;
        document.body.classList.add('is-theme-dragging');
        setThemeValue(valueFromClientX(track, e.touches[0].clientX));
    }, { passive: true });
 
    if (sunIcon) sunIcon.addEventListener('click', () => animateThemeTo(0));
    if (moonIcon) moonIcon.addEventListener('click', () => animateThemeTo(1));
 
    el.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { animateThemeTo(Math.max(themeValue - 0.1, 0), 150); e.preventDefault(); }
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { animateThemeTo(Math.min(themeValue + 0.1, 1), 150); e.preventDefault(); }
        if (e.key === 'Home') { animateThemeTo(0); e.preventDefault(); }
        if (e.key === 'End') { animateThemeTo(1); e.preventDefault(); }
    });
});
 
function endThemeDrag() {
    isDraggingTheme = false;
    activeThemeTrack = null;
    document.body.classList.remove('is-theme-dragging');
}
 
window.addEventListener('mousemove', (e) => {
    if (isDraggingTheme && activeThemeTrack) setThemeValue(valueFromClientX(activeThemeTrack, e.clientX));
});
window.addEventListener('mouseup', endThemeDrag);
window.addEventListener('touchmove', (e) => {
    if (isDraggingTheme && activeThemeTrack && e.touches.length) setThemeValue(valueFromClientX(activeThemeTrack, e.touches[0].clientX));
}, { passive: true });
window.addEventListener('touchend', endThemeDrag);
window.addEventListener('touchcancel', endThemeDrag);
 
/* estado inicial: site abre sempre em modo noite */
setThemeValue(1);
 
/* ---------- Barra de progresso + nav com sombra + botão topo ---------- */
const scrollProgress = document.getElementById('scrollProgress');
const desktopNav = document.getElementById('desktop-nav');
const backToTop = document.getElementById('backToTop');
 
function updateScrollUI() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${progress}%`;
    if (desktopNav) desktopNav.classList.toggle('scrolled', scrollTop > 40);
    if (backToTop) backToTop.classList.toggle('visible', scrollTop > 500);
}
if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
 
/* ---------- Nav ativa (topo + pontos laterais) ---------- */
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const dotItems = document.querySelectorAll('.dot-nav__item');
 
dotItems.forEach((dot) => {
    dot.addEventListener('click', () => {
        const target = document.querySelector(dot.dataset.target);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
 
function updateActiveNav() {
    let currentId = '';
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 160 && rect.bottom >= 160) currentId = section.id;
    });
    navAnchors.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
    dotItems.forEach((dot) => {
        dot.classList.toggle('active', dot.dataset.target === `#${currentId}`);
    });
}
 
window.addEventListener('scroll', () => {
    updateScrollUI();
    updateActiveNav();
}, { passive: true });
 
/* ---------- Revelar ao rolar ---------- */
const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
revealItems.forEach((item) => revealObserver.observe(item));
 
/* ---------- Contadores animados (stats) ---------- */
const statNumbers = document.querySelectorAll('.stat__num');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1200;
        const start = performance.now();
        function step(now) {
            const elapsed = now - start;
            const pct = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - pct, 3);
            el.textContent = Math.floor(eased * target);
            if (pct < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
        statsObserver.unobserve(el);
    });
}, { threshold: 0.4 });
statNumbers.forEach((el) => statsObserver.observe(el));
 
/* ---------- Tilt 3D na foto de perfil ---------- */
const heroPic = document.getElementById('heroPic');
const heroPicImg = document.getElementById('about-pic');
if (heroPic && heroPicImg) {
    heroPic.addEventListener('mousemove', (e) => {
        const rect = heroPic.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroPicImg.style.transform = `rotateX(${(y * -12).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg) scale(1.03)`;
    });
    heroPic.addEventListener('mouseleave', () => {
        heroPicImg.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
}
 
/* ---------- Máquina de escrever no papel/função ---------- */
const roleText = document.getElementById('roleText');
const roles = [
    'Front-End Web Developer Specialist',
    'Criador de experiências digitais',
    'Apaixonado por design & código'
];
let roleIndex = 0, charIndex = 0, isDeleting = false;
 
function typeRole() {
    if (!roleText) return;
    const current = roles[roleIndex];
    if (!isDeleting) {
        charIndex++;
        roleText.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) { isDeleting = true; setTimeout(typeRole, 1700); return; }
    } else {
        charIndex--;
        roleText.textContent = current.slice(0, charIndex);
        if (charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    }
    setTimeout(typeRole, isDeleting ? 30 : 60);
}
if (roleText) setTimeout(typeRole, 1600);
 
/* ---------- Botões magnéticos ---------- */
document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
});
 
/* ---------- Code Playground: glifos de código interativos (rato + toque) ---------- */
const CODE_SYMBOLS = ['<>', '{}', '()', '/>', '=>', '[]', '#', '$', ';', '&&', '::', '||', '==', '!=', '++', '--', '**', '</>', '%', 'λ', '->', '?.', '??', '...', '<=', '>=', '#!', '0x', 'fn'];
 
const glyphsCanvas = document.getElementById('glyphsCanvas');
if (glyphsCanvas) {
    const box = document.getElementById('codePlayground');
    const gctx = glyphsCanvas.getContext('2d');
    let glyphs = [];
    let gMouse = { x: null, y: null };
    let touchClearTimer = null;
 
    function resizeGlyphs() {
        glyphsCanvas.width = box.offsetWidth;
        glyphsCanvas.height = box.offsetHeight;
    }
    resizeGlyphs();
    window.addEventListener('resize', resizeGlyphs);
 
    let lastAutoRelease = 0;
 
    function maybeReleaseFromBox(clientX, clientY, force) {
        if (typeof window.releaseCodeSymbols !== 'function') return;
        const now = performance.now();
        if (!force && now - lastAutoRelease < 1100) return;
        lastAutoRelease = now;
        window.releaseCodeSymbols(clientX, clientY, force ? 5 : 2);
    }
 
    box.addEventListener('mouseenter', (e) => maybeReleaseFromBox(e.clientX, e.clientY, true));
    box.addEventListener('mousemove', (e) => {
        const rect = box.getBoundingClientRect();
        gMouse.x = e.clientX - rect.left;
        gMouse.y = e.clientY - rect.top;
        maybeReleaseFromBox(e.clientX, e.clientY, false);
    });
    box.addEventListener('mouseleave', () => { gMouse.x = null; gMouse.y = null; });
 
    /* toque: telemóveis e tablets — regista já no primeiro toque e mantém
       o efeito por instantes ao soltar o dedo, para um simples toque também funcionar */
    function setGlyphTouch(touch, isStart) {
        const rect = box.getBoundingClientRect();
        gMouse.x = touch.clientX - rect.left;
        gMouse.y = touch.clientY - rect.top;
        clearTimeout(touchClearTimer);
        maybeReleaseFromBox(touch.clientX, touch.clientY, !!isStart);
    }
    box.addEventListener('touchstart', (e) => setGlyphTouch(e.touches[0], true), { passive: true });
    box.addEventListener('touchmove', (e) => setGlyphTouch(e.touches[0], false), { passive: true });
    box.addEventListener('touchend', () => {
        touchClearTimer = setTimeout(() => { gMouse.x = null; gMouse.y = null; }, 900);
    }, { passive: true });
    box.addEventListener('touchcancel', () => { gMouse.x = null; gMouse.y = null; }, { passive: true });
 
    class Glyph {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * glyphsCanvas.width;
            this.y = Math.random() * glyphsCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.symbol = CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)];
            this.isPurple = Math.random() > 0.5;
            this.size = Math.random() * 6 + 10;
            this.baseAlpha = Math.random() * 0.3 + 0.35;
            this.energized = false;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 10 || this.x > glyphsCanvas.width - 10) this.vx *= -1;
            if (this.y < 10 || this.y > glyphsCanvas.height - 10) this.vy *= -1;
 
            this.energized = false;
            if (gMouse.x !== null) {
                const dx = this.x - gMouse.x;
                const dy = this.y - gMouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x += (dx / (dist || 1)) * force * 1.5;
                    this.y += (dy / (dist || 1)) * force * 1.5;
                    this.energized = true;
                }
            }
        }
        draw() {
            gctx.font = `${this.energized ? this.size * 1.15 : this.size}px "JetBrains Mono", monospace`;
            const color = this.isPurple ? '139, 92, 246' : '59, 91, 253';
            const alpha = this.energized ? Math.min(this.baseAlpha + 0.45, 1) : this.baseAlpha;
            gctx.fillStyle = `rgba(${color}, ${alpha})`;
            gctx.textAlign = 'center';
            gctx.textBaseline = 'middle';
            gctx.fillText(this.symbol, this.x, this.y);
        }
    }
 
    function initGlyphs() {
        const count = Math.min(50, Math.max(24, Math.floor((glyphsCanvas.width * glyphsCanvas.height) / 4500)));
        glyphs = Array.from({ length: count }, () => new Glyph());
    }
    initGlyphs();
    window.addEventListener('resize', initGlyphs);
 
    function animateGlyphs() {
        gctx.clearRect(0, 0, glyphsCanvas.width, glyphsCanvas.height);
        glyphs.forEach((g) => g.update());
 
        for (let i = 0; i < glyphs.length; i++) {
            for (let j = i + 1; j < glyphs.length; j++) {
                const dx = glyphs[i].x - glyphs[j].x;
                const dy = glyphs[i].y - glyphs[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    gctx.beginPath();
                    gctx.setLineDash([3, 4]);
                    gctx.strokeStyle = `rgba(139, 92, 246, ${0.3 * (1 - dist / 110)})`;
                    gctx.lineWidth = 1;
                    gctx.moveTo(glyphs[i].x, glyphs[i].y);
                    gctx.lineTo(glyphs[j].x, glyphs[j].y);
                    gctx.stroke();
                    gctx.setLineDash([]);
                }
            }
            glyphs[i].draw();
        }
        requestAnimationFrame(animateGlyphs);
    }
    animateGlyphs();
}
 
/* ---------- Símbolos libertados pelo site (rato + toque, em qualquer secção) ---------- */
const escapedCanvas = document.getElementById('escaped-glyphs-canvas');
const releaseBtn = document.getElementById('releaseGlyphsBtn');
 
if (escapedCanvas) {
    const ectx = escapedCanvas.getContext('2d');
    const MAX_ESCAPED = 40;
    let escaped = [];
 
    /* rastreio de rato/toque partilhado por todo o site (não apenas dentro da caixa) */
    const siteMouse = { x: null, y: null };
    let siteTouchTimer = null;
 
    function resizeEscaped() {
        escapedCanvas.width = window.innerWidth;
        escapedCanvas.height = window.innerHeight;
    }
    resizeEscaped();
    window.addEventListener('resize', resizeEscaped);
 
    window.addEventListener('mousemove', (e) => {
        siteMouse.x = e.clientX;
        siteMouse.y = e.clientY;
    });
    window.addEventListener('touchstart', (e) => {
        if (!e.touches.length) return;
        siteMouse.x = e.touches[0].clientX;
        siteMouse.y = e.touches[0].clientY;
        clearTimeout(siteTouchTimer);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
        if (!e.touches.length) return;
        siteMouse.x = e.touches[0].clientX;
        siteMouse.y = e.touches[0].clientY;
        clearTimeout(siteTouchTimer);
    }, { passive: true });
    window.addEventListener('touchend', () => {
        siteTouchTimer = setTimeout(() => { siteMouse.x = null; siteMouse.y = null; }, 900);
    }, { passive: true });
 
    class EscapedGlyph {
        constructor(x, y) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1.6 + 0.5;
            this.x = x;
            this.y = y;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.symbol = CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)];
            this.isPurple = Math.random() > 0.5;
            this.size = Math.random() * 8 + 14;
            this.targetAlpha = Math.random() * 0.3 + 0.4;
            this.alpha = 0;
            this.age = 0;
            this.life = Math.floor(Math.random() * 900 + 1400); // ~23s a ~38s a 60fps
            this.energized = false;
        }
        update() {
            this.age++;
            /* atrito suave para a explosão inicial acalmar num flutuar lento */
            this.vx *= 0.992;
            this.vy *= 0.992;
            this.x += this.vx;
            this.y += this.vy;
 
            if (this.x < 0 || this.x > escapedCanvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > escapedCanvas.height) this.vy *= -1;
 
            this.energized = false;
            if (siteMouse.x !== null) {
                const dx = this.x - siteMouse.x;
                const dy = this.y - siteMouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 160) {
                    const force = (160 - dist) / 160;
                    this.x += (dx / (dist || 1)) * force * 1.4;
                    this.y += (dy / (dist || 1)) * force * 1.4;
                    this.energized = true;
                }
            }
 
            if (this.age < 40) this.alpha = (this.age / 40) * this.targetAlpha;
            else if (this.age > this.life - 90) this.alpha = Math.max(0, this.targetAlpha * ((this.life - this.age) / 90));
            else this.alpha = this.targetAlpha;
        }
        get isDead() { return this.age >= this.life; }
        draw() {
            ectx.font = `${this.energized ? this.size * 1.15 : this.size}px "JetBrains Mono", monospace`;
            const color = this.isPurple ? '139, 92, 246' : '59, 91, 253';
            const alpha = this.energized ? Math.min(this.alpha + 0.4, 1) : this.alpha;
            ectx.fillStyle = `rgba(${color}, ${alpha})`;
            ectx.textAlign = 'center';
            ectx.textBaseline = 'middle';
            ectx.fillText(this.symbol, this.x, this.y);
        }
    }
 
    function releaseBurst(x, y, count) {
        for (let i = 0; i < count; i++) {
            escaped.push(new EscapedGlyph(x, y));
        }
        while (escaped.length > MAX_ESCAPED) escaped.shift();
    }
    window.releaseCodeSymbols = releaseBurst;
 
    if (releaseBtn) {
        releaseBtn.addEventListener('click', () => {
            const rect = releaseBtn.getBoundingClientRect();
            const originX = rect.left + rect.width / 2;
            const originY = rect.top + rect.height / 2;
            releaseBurst(originX, originY, 8);
        });
    }
 
    function animateEscaped() {
        ectx.clearRect(0, 0, escapedCanvas.width, escapedCanvas.height);
        escaped = escaped.filter((g) => !g.isDead);
        escaped.forEach((g) => g.update());
 
        for (let i = 0; i < escaped.length; i++) {
            for (let j = i + 1; j < escaped.length; j++) {
                const dx = escaped[i].x - escaped[j].x;
                const dy = escaped[i].y - escaped[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ectx.beginPath();
                    ectx.setLineDash([3, 4]);
                    ectx.strokeStyle = `rgba(139, 92, 246, ${0.22 * (1 - dist / 130)})`;
                    ectx.lineWidth = 1;
                    ectx.moveTo(escaped[i].x, escaped[i].y);
                    ectx.lineTo(escaped[j].x, escaped[j].y);
                    ectx.stroke();
                    ectx.setLineDash([]);
                }
            }
            escaped[i].draw();
        }
        requestAnimationFrame(animateEscaped);
    }
    animateEscaped();
}
 
/* ---------- Terminal da Missão: efeito de "a escrever código" ao vivo ---------- */
const terminalCode = document.querySelector('#missao .terminal__code');
if (terminalCode) {
    const lineEls = Array.from(terminalCode.children);
    const originalHTML = lineEls.map((el) => el.innerHTML);
    const originalText = lineEls.map((el) => el.textContent);
 
    /* começa vazio; se o JS falhar, o texto estático original nunca chega a ser limpo */
    lineEls.forEach((el) => { el.textContent = ''; });
 
    const typingCursor = document.createElement('span');
    typingCursor.className = 'terminal__cursor';
    if (lineEls[0]) lineEls[0].appendChild(typingCursor);
 
    let hasTyped = false;
 
    function typeTerminal() {
        if (hasTyped) return;
        hasTyped = true;
        let lineIndex = 0;
        let charIndex = 0;
 
        function typeChar() {
            if (lineIndex >= lineEls.length) {
                typingCursor.remove();
                return;
            }
            const el = lineEls[lineIndex];
            const fullText = originalText[lineIndex];
 
            if (charIndex <= fullText.length) {
                el.textContent = fullText.slice(0, charIndex);
                el.appendChild(typingCursor);
                charIndex++;
                setTimeout(typeChar, Math.random() * 10 + 7);
            } else {
                /* linha terminada: repõe o markup original (com destaque de sintaxe, se houver) */
                el.innerHTML = originalHTML[lineIndex];
                lineIndex++;
                charIndex = 0;
                setTimeout(typeChar, 110);
            }
        }
        typeChar();
    }
 
    const terminalEl = document.querySelector('#missao .terminal');
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setTimeout(typeTerminal, 450);
                terminalObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.35 });
    if (terminalEl) terminalObserver.observe(terminalEl);
}
 
/* ---------- Efeito spotlight nos cards ---------- */
document.querySelectorAll('.spotlight').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
});
 
/* ---------- Estado inicial ---------- */
updateScrollUI();
updateActiveNav();