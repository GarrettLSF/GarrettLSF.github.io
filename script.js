/**
 * ===================================================================
 * Elite Install - Performance-Optimized Professional JavaScript
 * Version: 8.0 (Stabilized & Simplified)
 * ===================================================================
 *
 * This script implements award-worthy interactions with a focus on
 * performance, accessibility, and smooth user experience. All 3D
 * elements have been replaced with optimized 2D animations.
 *
 * Simplified architecture by removing the dynamic component loader
 * to increase reliability and reduce points of failure.
 *
 * TABLE OF CONTENTS
 * 1.  Performance-First App Initialization
 * 2.  Module: Optimized Mobile Navigation
 * 3.  Module: Lightweight Sticky Header
 * 4.  Module: High-Performance Scroll Animations
 * 5.  Module: Smooth Horizontal Process Scroll
 * 6.  Module: 2D Hero Background Animation
 * 7.  Module: Micro-interactions & Polish
 *
 * ===================================================================
 */

(() => {
    'use strict';

    // --- 1. Performance-First App Initialization ---
    const App = {
        isInitialized: false,
        performanceStart: performance.now(),
        
        async init() {
            try {
                // Initialize interactions now that dependencies are guaranteed
                this.initializeInteractions();
                this.logPerformanceMetrics();
                this.isInitialized = true;
            } catch (error) {
                this.handleError(error);
            }
        },

        async initializeInteractions() {
            // Check dependencies once
            if (!this.checkDependencies()) {
                throw new Error('Required libraries (GSAP, ScrollTrigger) not loaded. Make sure the script tags are in your HTML.');
            }

            gsap.registerPlugin(ScrollTrigger);
            
            // Initialize all modules
            mobileNav.init();
            stickyHeader.init();
            hero2DBackground.init();
            scrollAnimator.init();
            horizontalProcessScroll.init();
            microInteractions.init();
        },

        checkDependencies() {
            return typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
        },

        logPerformanceMetrics() {
            const loadTime = performance.now() - this.performanceStart;
            console.log(`Elite Install: Initialized in ${Math.round(loadTime)}ms`);
        },

        handleError(error) {
            console.error('Elite Install Error:', error);
            document.body.classList.add('js-disabled');
        }
    };

    // --- 2. Module: Optimized Mobile Navigation ---
    const mobileNav = {
        elements: {},
        isOpen: false,
        
        init() {
            this.cacheElements();
            if (!this.elements.toggle || !this.elements.nav) return;
            
            this.bindEvents();
            this.setupAccessibility();
        },

        cacheElements() {
            this.elements = {
                toggle: document.querySelector('.mobile-menu-toggle'),
                nav: document.querySelector('#nav-links'),
                body: document.body,
                focusable: null
            };
            
            if (this.elements.nav) {
                this.elements.focusable = this.elements.nav.querySelectorAll(
                    'a[href], button:not([disabled])'
                );
            }
        },

        bindEvents() {
            this.elements.toggle.addEventListener('click', this.toggle.bind(this));
            document.addEventListener('keydown', this.handleKeydown.bind(this));
            document.addEventListener('click', this.debounce(this.handleOutsideClick.bind(this), 10));
            
            this.elements.focusable?.forEach(link => {
                link.addEventListener('click', () => this.isOpen && this.close());
            });

            window.addEventListener('resize', this.debounce(() => {
                if (window.innerWidth > 768 && this.isOpen) this.close();
            }, 100), { passive: true });
        },

        setupAccessibility() {
            this.elements.toggle.setAttribute('aria-expanded', 'false');
            this.elements.toggle.setAttribute('aria-controls', 'nav-links');
        },

        toggle() {
            this.isOpen ? this.close() : this.open();
        },

        open() {
            this.isOpen = true;
            this.elements.body.classList.add('mobile-nav-open');
            this.elements.toggle.setAttribute('aria-expanded', 'true');
            requestAnimationFrame(() => {
                this.elements.focusable?.[0]?.focus();
            });
        },

        close() {
            this.isOpen = false;
            this.elements.body.classList.remove('mobile-nav-open');
            this.elements.toggle.setAttribute('aria-expanded', 'false');
            this.elements.toggle.focus();
        },

        handleKeydown(event) {
            if (!this.isOpen || event.key !== 'Escape') return;
            this.close();
        },

        handleOutsideClick(event) {
            if (!this.isOpen) return;
            if (!this.elements.nav.contains(event.target) && 
                !this.elements.toggle.contains(event.target)) {
                this.close();
            }
        },

        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };

    // --- 3. Module: Lightweight Sticky Header ---
    const stickyHeader = {
        header: null,
        lastScrollY: 0,
        isScrolled: false,
        
        init() {
            this.header = document.querySelector('.main-header');
            if (!this.header) return;

            this.createScrollTrigger();
            this.addSmartScroll();
        },

        createScrollTrigger() {
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
        },

        addSmartScroll() {
            let ticking = false;
            const handleScroll = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const currentScrollY = window.scrollY;
                        const scrollingDown = currentScrollY > this.lastScrollY;
                        const scrolledEnough = currentScrollY > 200;

                        if (scrolledEnough && scrollingDown) {
                            this.header.style.transform = 'translateY(-100%)';
                        } else {
                            this.header.style.transform = 'translateY(0)';
                        }

                        this.lastScrollY = currentScrollY;
                        ticking = false;
                    });
                    ticking = true;
                }
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
        }
    };

    // --- 4. Module: High-Performance Scroll Animations ---
    const scrollAnimator = {
        init() {
            if (this.prefersReducedMotion()) {
                this.disableAnimations();
                return;
            }
            this.createScrollAnimations();
            this.createStaggeredAnimations();
        },

        prefersReducedMotion() {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        },

        createScrollAnimations() {
            const elements = document.querySelectorAll('.anim-fade-in-up');
            elements.forEach(el => {
                const delay = parseFloat(el.dataset.delay || 0) / 1000;
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    delay,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none' // Play once and stay
                    }
                });
            });
        },

        createStaggeredAnimations() {
            const featureCards = document.querySelectorAll('.feature-card');
            if (!featureCards.length) return;

            gsap.set(featureCards, { opacity: 0, y: 40 });
            ScrollTrigger.batch(featureCards, {
                onEnter: batch => {
                    gsap.to(batch, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        stagger: {
                            each: 0.1,
                            from: "start"
                        }
                    });
                },
                start: 'top 80%',
                once: true // Animate them once
            });
        },

        disableAnimations() {
            const elements = document.querySelectorAll('.anim-fade-in-up, .feature-card');
            gsap.set(elements, { opacity: 1, y: 0 });
        }
    };

    // --- 5. Module: Smooth Horizontal Process Scroll ---
    const horizontalProcessScroll = {
        container: null,
        wrapper: null,
        
        init() {
            this.container = document.querySelector('.process-section-container');
            this.wrapper = document.querySelector('.process-steps-wrapper');
            if (!this.container || !this.wrapper) return;
            
            requestAnimationFrame(() => {
                setTimeout(() => this.createScrollAnimation(), 100);
            });
        },

        createScrollAnimation() {
            const scrollDistance = this.wrapper.scrollWidth - this.container.offsetWidth;
            if (scrollDistance <= 0) return;

            gsap.to(this.wrapper, {
                x: -scrollDistance,
                ease: 'none',
                scrollTrigger: {
                    trigger: this.container,
                    start: 'center center',
                    end: () => `+=${scrollDistance}`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            });
        }
    };

    // --- 6. Module: 2D Hero Background Animation ---
    const hero2DBackground = {
        canvas: null,
        ctx: null,
        particles: [],
        animationId: null,
        mouse: { x: 0, y: 0 },
        isVisible: false,

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
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            this.ctx.scale(dpr, dpr);
            this.width = rect.width;
            this.height = rect.height;
        },

        createParticles() {
            const count = Math.min(50, Math.floor(this.width / 25));
            this.particles = [];
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.4 + 0.1
                });
            }
        },

        addEventListeners() {
            const observer = new IntersectionObserver(entries => {
                this.isVisible = entries[0].isIntersecting;
            }, { threshold: 0.01 });
            observer.observe(this.canvas.parentElement);
            window.addEventListener('resize', this.debounce(() => {
                this.resizeCanvas();
                this.createParticles();
            }, 250), { passive: true });
        },

        startAnimation() {
            const animate = () => {
                this.animationId = requestAnimationFrame(animate);
                if (!this.isVisible) return;
                this.drawParticles();
            };
            animate();
        },

        drawParticles() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > this.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.height) p.vy *= -1;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                this.ctx.fill();
            });
        },

        debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
    };

    // --- 7. Module: Micro-interactions & Polish ---
    const microInteractions = {
        init() {
            this.initButtonEffects();
            this.initCardEffects();
            this.initFormEnhancements();
        },

        initButtonEffects() {
            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.03, duration: 0.2, ease: 'power2.out' }));
                btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' }));
            });
        },

        initCardEffects() {
            document.querySelectorAll('.feature-card').forEach(card => {
                const icon = card.querySelector('.feature-icon');
                card.addEventListener('mouseenter', () => {
                    if (icon) gsap.to(icon, { scale: 1.05, duration: 0.3, ease: 'back.out(1.4)' });
                });
                card.addEventListener('mouseleave', () => {
                    if (icon) gsap.to(icon, { scale: 1, duration: 0.3, ease: 'back.out(1.4)' });
                });
            });
        },

        initFormEnhancements() {
            document.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('focus', () => gsap.to(input, { borderColor: '#FFFFFF', boxShadow: '0 0 0 3px rgba(255,255,255,0.1)', duration: 0.2 }));
                input.addEventListener('blur', () => gsap.to(input, { borderColor: 'rgba(255,255,255,0.1)', boxShadow: 'none', duration: 0.2 }));
            });
        }
    };

    // --- Application Startup ---
    const startApp = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', App.init.bind(App));
        } else {
            App.init();
        }
    };

    startApp();

})();
