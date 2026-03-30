/* ============================================
   GALATA KULESİ - PRESENTATION WEBSITE JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initParticles();
    initLightbox();
    initCountUp();
    initQRCode();
    initMobileNav();
});

/* === Navbar Scroll Effect === */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
        // Scrolled styling
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu
                document.getElementById('navLinks').classList.remove('active');
                document.getElementById('navToggle').classList.remove('active');
            }
        });
    });
}

/* === Mobile Navigation === */
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

/* === Scroll Animations (IntersectionObserver) === */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve — allows re-animation if needed
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* === Floating Particles === */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 6 + 5) + 's';
        container.appendChild(particle);
    }
}

/* === Lightbox for Gallery === */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightboxContent');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                lightboxContent.innerHTML = `<img src="${img.src}" alt="${img.alt || 'Galata Kulesi'}">`;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* === Counter Animation === */
function initCountUp() {
    const stats = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateCount(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateCount(el, target) {
    const duration = 2000;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, stepTime);
}

/* === QR Code Generation === */
function initQRCode() {
    const qrContainer = document.getElementById('qrcode');
    if (!qrContainer) return;

    // Use current page URL or a placeholder
    const siteUrl = window.location.href !== 'about:blank'
        ? window.location.href
        : 'https://galata-kulesi-sunum.netlify.app';

    // Check if QRCode library loaded
    if (typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, {
            text: siteUrl,
            width: 200,
            height: 200,
            colorDark: '#1a1110',
            colorLight: '#faf8f4',
            correctLevel: QRCode.CorrectLevel.H
        });
    } else {
        // Fallback if library didn't load
        qrContainer.innerHTML = `
            <div style="width:200px;height:200px;display:flex;align-items:center;justify-content:center;
                        background:#faf8f4;border-radius:8px;text-align:center;padding:20px;
                        color:#1a1110;font-family:Inter,sans-serif;font-size:0.85rem;">
                <div>
                    <i class="fas fa-qrcode" style="font-size:3rem;color:#c9a84c;margin-bottom:10px;display:block;"></i>
                    QR Kod yüklenemedi.<br>Sayfayı yenileyiniz.
                </div>
            </div>
        `;
    }

    // Update URL display
    const qrUrl = document.getElementById('qrUrl');
    if (qrUrl) {
        qrUrl.textContent = siteUrl;
    }
}
