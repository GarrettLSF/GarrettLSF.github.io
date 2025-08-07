/**
 * ===================================================================
 * Elite Install - Awwwards Edition Final Script
 * Version: 9.0 (Integrated & Optimized)
 * ===================================================================
 *
 * This script integrates all high-level animation and interaction
 * modules for an award-winning user experience.
 *
 * TABLE OF CONTENTS
 * 1.  Module: Signature Headline Interaction
 * 2.  Module: High-Performance Scroll Animations
 * 3.  Module: Innovative Navigation Menu
 * 4.  Module: Meticulous Page Polish (Cursor & Transitions)
 * 5.  Module: 2D Hero Background (from original script)
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
            return;
        }
        this.splitText();
        this.createAnimation();
    },
    splitText() {
        const text = this.headline.textContent;
        this.headline.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            span.style.display = 'inline-block';
            this.headline.appendChild(span);
        });
    },
    createAnimation() {
        const letters = Array.from(this.headline.querySelectorAll('span'));
        gsap.set(this.headline, { perspective: 800 });
        gsap.set(letters, { transformOrigin: '50% 50%', willChange: 'transform, opacity' });
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: '+=1000',
                scrub: 1,
            }
        });
        timeline.to(letters, {
            duration: 1,
            x: () => gsap.utils.random(-250, 250),
            y: () => gsap.utils.random(-150, 150),
            z: () => gsap.utils.random(-300, 300),
            rotationX: () => gsap.utils.random(-90, 90),
            rotationY: () => gsap.utils.random(-90, 90),
            opacity: 0,
            stagger: { each: 0.02, from: 'random' },
            ease: 'power2.out'
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
                duration: 0.8,
                ease: 'power2.out',
                delay: parseFloat(el.dataset.delay || 0) / 1000,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true,
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
                start: 'top 85%',
                once: true,
                onEnter: () => gsap.to(card, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }),
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
 * 3. Module: Innovative Navigation Menu
 * ===================================================================
 */
const innovativeMenu = {
    isOpen: false,
    elements: {},
    init() {
        this.elements = {
            toggleBtn: document.querySelector('.menu-toggle-btn'),
            overlay: document.querySelector('.nav-overlay'),
            body: document.body,
            magneticLinks: document.querySelectorAll('.nav-link-magnetic')
        };
        if (!this.elements.toggleBtn || !this.elements.overlay) return;
        this.bindEvents();
    },
    bindEvents() {
        this.elements.toggleBtn.addEventListener('click', () => this.toggleMenu());
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.isOpen) this.closeMenu();
        });
        this.elements.magneticLinks.forEach(link => {
            const span = link.querySelector('span');
            link.addEventListener('mousemove', e => this.handleMagneticMove(e, link, span));
            link.addEventListener('mouseleave', () => this.handleMagneticLeave(link, span));
        });
    },
    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    },
    openMenu() {
        if (this.isOpen) return;
        this.isOpen = true;
        this.elements.body.classList.add('menu-open');
        this.elements.toggleBtn.setAttribute('aria-expanded', 'true');
        this.elements.overlay.style.visibility = 'visible';
    },
    closeMenu() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.elements.body.classList.remove('menu-open');
        this.elements.toggleBtn.setAttribute('aria-expanded', 'false');
        setTimeout(() => { if (!this.isOpen) this.elements.overlay.style.visibility = 'hidden'; }, 800);
    },
    handleMagneticMove(e, link, span) {
        const { left, top, width, height } = link.getBoundingClientRect();
        const xPos = (e.clientX - left - width / 2) * 0.4;
        const yPos = (e.clientY - top - height / 2) * 0.4;
        gsap.to(span, { x: xPos, y: yPos, duration: 0.8, ease: 'power4.out' });
    },
    handleMagneticLeave(link, span) {
        gsap.to(span, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
    }
};

/**
 * ===================================================================
 * 4. Module: Meticulous Page Polish (Cursor & Transitions)
 * ===================================================================
 */
const pagePolish = {
    elements: {},
    cursorPos: { x: 0, y: 0 },
    init() {
        this.elements = {
            cursor: document.querySelector('.custom-cursor'),
            transitionOverlay: document.querySelector('.page-transition-overlay'),
            interactiveElements: document.querySelectorAll('a, button, .project-gallery-card')
        };
        if (this.elements.cursor) this.initCursor();
        if (this.elements.transitionOverlay) this.initPageTransitions();
    },
    initCursor() {
        if (window.matchMedia("(hover: none)").matches) {
            this.elements.cursor.style.display = 'none';
            return;
        }
        window.addEventListener('mousemove', e => {
            this.cursorPos = { x: e.clientX, y: e.clientY };
        });
        const renderCursor = () => {
            gsap.to(this.elements.cursor, { duration: 0.3, x: this.cursorPos.x, y: this.cursorPos.y, ease: 'power3.out' });
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);
        this.elements.interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.elements.cursor.classList.add('is-hovering'));
            el.addEventListener('mouseleave', () => this.elements.cursor.classList.remove('is-hovering'));
        });
    },
    initPageTransitions() {
        gsap.to(this.elements.transitionOverlay, { duration: 0.8, y: '-100%', ease: 'power2.inOut' });
        const internalLinks = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"])');
        internalLinks.forEach(link => {
            link.addEventListener('click', e => {
                if (e.metaKey || e.ctrlKey) return;
                e.preventDefault();
                gsap.to(this.elements.transitionOverlay, {
                    duration: 0.8,
                    y: '0%',
                    ease: 'power2.inOut',
                    onComplete: () => window.location.href = link.href
                });
            });
        });
        window.addEventListener('pageshow', e => {
            if (e.persisted) gsap.to(this.elements.transitionOverlay, { duration: 0.8, y: '-100%', ease: 'power2.inOut' });
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

            innovativeMenu.init();
            pagePolish.init();
            signatureInteraction.init();
            scrollAnimator.init();
            hero2DBackground.init();
            
            console.log("Elite Install: Awwwards Edition Initialized.");
        } catch (error) {
            console.error("Elite Install Initialization Failed:", error);
            document.body.classList.add('js-disabled');
        }
    }
};

document.addEventListener('DOMContentLoaded', App.init);
