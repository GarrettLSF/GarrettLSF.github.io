// Scroll-reveal for fade/slide-in animations using Intersection Observer
const createScrollReveal = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.anim-fade-in-up, .anim-slide-in-left, .anim-slide-in-right').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '50px'
    });

    document.querySelectorAll('.anim-fade-in-up, .anim-slide-in-left, .anim-slide-in-right').forEach(el => {
        observer.observe(el);
    });
};

document.addEventListener('DOMContentLoaded', createScrollReveal);

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    initBackToTop();
    initMobileNav();
    initScrollAnimations();
    initHeroCanvas();
});

// Back to Top Button Implementation
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.title = 'Back to Top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Scroll back to top');
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Mobile Navigation Implementation
function initMobileNav() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('#nav-links');
    const body = document.body;

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('active');
        body.classList.toggle('mobile-nav-open');
    });
}

// Scroll Animations
function initScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.anim-fade-in-up').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.style.transform = 'none';
                    entry.target.style.opacity = '1';
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    document.querySelectorAll('.anim-fade-in-up').forEach(el => observer.observe(el));
}

// Hero Canvas Background
function initHeroCanvas() {
    const container = document.getElementById('hero-canvas-container');
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    let particles = [];
    const particleCount = 50;
    
    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${particle.opacity})`;
            ctx.fill();
        });
        requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
}
/**
 * ===================================================================
 * Elite Install - Awwwards Edition Script (Reverted Nav)
 * Version: 9.1
 * ===================================================================
 *
 * This script integrates the Awwwards-level visual effects with the
 * original, preferred navigation system.
 *
 * TABLE OF CONTENTS
 * 1.  Module: Signature Headline Interaction
 * 2.  Module: High-Performance Scroll Animations
 * 3.  Module: Original Mobile Navigation (Restored)
 * 4.  Module: Sticky Header (Restored)
 * 5.  Module: 2D Hero Background
 * 6.  Main App Initialization & Startup
 *
 * ===================================================================
 */

'use strict';

/**
 * ===================================================================
 * 1. Module: Signature Headline Interaction
 * ===================================================================
 */
const signatureInteraction = {
    headline: null,
    init() {
        this.headline = document.querySelector('.hero-headline-deconstruct');
        if (!this.headline || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            if (this.headline) this.headline.style.opacity = 1;
            return;
        }
        // We no longer need to split the text, as the spans are in the HTML.
        this.createAnimation();
    },
    createAnimation() {
        const words = Array.from(this.headline.querySelectorAll('span'));
        // Set initial state for a fade-in animation
        gsap.set(words, { 
            autoAlpha: 0, 
            y: 30 
        });

        // Create a timeline to animate the words in
        gsap.to(words, {
            duration: 0.8,
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.2
        });
    }
};

/**
 * ===================================================================
 * 2. Module: High-Performance Scroll Animations
 * ===================================================================
 */
const scrollAnimator = {
    init() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.disableAnimations();
            return;
        }
        this.createFadeInAnimations();
        this.createProjectCardAnimations();
    },
    createFadeInAnimations() {
        const elements = document.querySelectorAll('.anim-fade-in-up');
        elements.forEach(el => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.38, // faster fade-in
                ease: 'power2.out',
                delay: parseFloat(el.dataset.delay || 0) / 1000,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 98%', // reveal much earlier
                    toggleActions: 'play none none none',
                    once: true,
                    onEnter: () => {
                        el.classList.add('visible');
                    }
                }
            });
        });
    },
    createProjectCardAnimations() {
        const cards = document.querySelectorAll('.project-gallery-card');
        cards.forEach(card => {
            gsap.set(card, { autoAlpha: 0, y: 50 });
            ScrollTrigger.create({
                trigger: card,
                start: 'top 98%', // reveal much earlier
                once: true,
                onEnter: () => gsap.to(card, { autoAlpha: 1, y: 0, duration: 0.38, ease: 'power2.out' }), // faster
            });
        });
    },
    disableAnimations() {
        const elements = document.querySelectorAll('.anim-fade-in-up, .project-gallery-card');
        gsap.set(elements, { opacity: 1, y: 0, autoAlpha: 1 });
    }
};

/**
 * ===================================================================
 * 3. Module: Original Mobile Navigation (Restored)
 * ===================================================================
 */
const mobileNav = {
    elements: {},
    isOpen: false,
    init() {
        this.elements = {
            toggle: document.querySelector('.mobile-menu-toggle'),
            nav: document.querySelector('#nav-links'),
            body: document.body
        };
        if (!this.elements.toggle || !this.elements.nav) return;
        this.bindEvents();
    },
    bindEvents() {
        this.elements.toggle.addEventListener('click', () => this.toggle());
        this.elements.toggle.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });
    },
    toggle() {
        this.isOpen = !this.isOpen;
        this.elements.body.classList.toggle('mobile-nav-open', this.isOpen);
        this.elements.toggle.setAttribute('aria-expanded', this.isOpen);
    }
};

/**
 * ===================================================================
 * 4. Module: Sticky Header (Restored)
 * ===================================================================
 */
const stickyHeader = {
    header: null,
    isScrolled: false,
    init() {
        this.header = document.querySelector('.main-header');
        if (!this.header) return;

        ScrollTrigger.create({
            start: 'top -1',
            end: '+=99999',
            onUpdate: self => {
                const shouldBeScrolled = self.progress > 0;
                if (shouldBeScrolled !== this.isScrolled) {
                    this.isScrolled = shouldBeScrolled;
                    this.header.classList.toggle('is-scrolled', shouldBeScrolled);
                }
            }
        });
    }
};

/**
 * ===================================================================
 * 5. Module: 2D Hero Background
 * ===================================================================
 */
const hero2DBackground = {
    canvas: null, ctx: null, particles: [], isVisible: false,
    init() {
        const container = document.getElementById('hero-canvas-container');
        if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        this.createCanvas(container);
        this.createParticles();
        this.addEventListeners();
        this.startAnimation();
    },
    createCanvas(container) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.canvas.setAttribute('aria-hidden', 'true');
        container.appendChild(this.canvas);
        this.resizeCanvas();
    },
    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = rect.width * dpr; this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`; this.canvas.style.height = `${rect.height}px`;
        this.ctx.scale(dpr, dpr);
        this.width = rect.width; this.height = rect.height;
    },
    createParticles() {
        const count = Math.min(50, Math.floor(this.width / 25));
        this.particles = Array.from({ length: count }, () => ({
            x: Math.random() * this.width, y: Math.random() * this.height,
            vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 2 + 1, opacity: Math.random() * 0.4 + 0.1
        }));
    },
    addEventListeners() {
        const observer = new IntersectionObserver(e => { this.isVisible = e[0].isIntersecting; }, { threshold: 0.01 });
        observer.observe(this.canvas.parentElement);
        window.addEventListener('resize', () => { this.resizeCanvas(); this.createParticles(); }, { passive: true });
    },
    startAnimation() {
        const animate = () => {
            if (this.isVisible) this.drawParticles();
            requestAnimationFrame(animate);
        };
        animate();
    },
    drawParticles() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            this.ctx.fill();
        });
    }
};

/**
 * ===================================================================
 * 6. Main App Initialization
 * ===================================================================
 */
const App = {
    init() {
        try {
            if (typeof gsap === 'undefined') throw new Error('GSAP not loaded');
            gsap.registerPlugin(ScrollTrigger);

            mobileNav.init();
            stickyHeader.init();
            signatureInteraction.init();
            scrollAnimator.init();
            hero2DBackground.init();

            // Accessibility: focus management for skip link
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.addEventListener('click', e => {
                    const main = document.querySelector('main, [role="main"]');
                    if (main) {
                        main.setAttribute('tabindex', '-1');
                        main.focus();
                        setTimeout(() => main.removeAttribute('tabindex'), 1000);
                    }
                });
            }

            // Back to Top: add focus-visible for accessibility
            const backToTop = document.getElementById('backToTop');
            if (backToTop) {
                backToTop.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
            }

            console.log("Elite Install: Reverted Nav Edition Initialized.");
        } catch (error) {
            console.error("Elite Install Initialization Failed:", error);
            document.body.classList.add('js-disabled');
        }
    }
};

document.addEventListener('DOMContentLoaded', App.init);
