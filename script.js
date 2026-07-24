/* ---------- Loader de entrada ---------- */
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderPct = document.getElementById('loaderPct');
 
(function runLoader() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 18 + 6;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                if (loader) loader.classList.add('is-hidden');
                document.body.classList.remove('is-loading');
            }, 250);
        }
        if (loaderFill) loaderFill.style.width = `${progress}%`;
        if (loaderPct) loaderPct.textContent = `${Math.floor(progress)}%`;
    }, 140);
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
 
/* ---------- Canvas de partículas (constelação) ---------- */
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 130 };
 
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
            this.size = Math.random() * 1.6 + 0.8;
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
                    this.x += (dx / dist) * force * 1.2;
                    this.y += (dy / dist) * force * 1.2;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${themeColor()}, 0.45)`;
            ctx.fill();
        }
    }
 
    function initParticles() {
        const count = Math.min(90, Math.floor((canvas.width * canvas.height) / 16000));
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
                    ctx.strokeStyle = `rgba(${themeColor()}, ${0.14 * (1 - dist / 120)})`;
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
 
/* ---------- Tema claro / escuro ---------- */
let currentTheme = 'light';
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
 
function applyTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    const icon = theme === 'dark' ? '☀️' : '🌙';
    if (themeToggle) themeToggle.textContent = icon;
    if (themeToggleMobile) themeToggleMobile.textContent = icon;
}
function toggleTheme() { applyTheme(currentTheme === 'light' ? 'dark' : 'light'); }
if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
}
 
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
    'Full-Stack Web Developer',
    'Criador de experiências digitais',
    'Apaixonado por design & códigos'
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