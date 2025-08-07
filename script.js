/**
 * ===================================================================
 * Elite Install - Performance-Optimized Professional JavaScript
 * Version: 7.0 (High-Performance 2D Implementation)
 * ===================================================================
 *
 * This script implements award-worthy interactions with a focus on
 * performance, accessibility, and smooth user experience. All 3D
 * elements have been replaced with optimized 2D animations.
 *
 * TABLE OF CONTENTS
 * 1.  Performance-First App Initialization
 * 2.  Module: Efficient Component Loader
 * 3.  Module: Optimized Mobile Navigation
 * 4.  Module: Lightweight Sticky Header
 * 5.  Module: High-Performance Scroll Animations
 * 6.  Module: Smooth Horizontal Process Scroll
 * 7.  Module: 2D Hero Background Animation
 * 8.  Module: Micro-interactions & Polish
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
                // Prioritize critical path loading
                await this.loadCriticalComponents();
                await this.initializeInteractions();
                this.logPerformanceMetrics();
                this.isInitialized = true;
            } catch (error) {
                this.handleError(error);
            }
        },

        async loadCriticalComponents() {
            // Load header/footer concurrently for faster page load
            await componentLoader.load();
        },

        async initializeInteractions() {
            // Check dependencies once
            if (!this.checkDependencies()) {
                throw new Error('Required libraries not loaded');
            }

            gsap.registerPlugin(ScrollTrigger);
            
            // Initialize modules in performance order
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

    // --- 2. Module: Efficient Component Loader ---
    const componentLoader = {
        cache: new Map(),
        
        async load() {
            const promises = [
                this.loadComponent('header.html', 'header-placeholder'),
                this.loadComponent('footer.html', 'footer-placeholder')
            ];
            
            await Promise.allSettled(promises);
            // Small delay to ensure DOM updates
            return new Promise(resolve => requestAnimationFrame(resolve));
        },

        async loadComponent(url, placeholderId) {
            const placeholder = document.getElementById(placeholderId);
            if (!placeholder) return;

            try {
                let html = this.cache.get(url);
                
                if (!html) {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`Failed to load ${url}`);
                    html = await response.text();
                    this.cache.set(url, html);
                }
                
                placeholder.outerHTML = html;
            } catch (error) {
                console.warn(`Component loading failed: ${url}`);
                placeholder.innerHTML = '<div style="display: none;"></div>';
            }
        }
    };

    // --- 3. Module: Optimized Mobile Navigation ---
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
                focusable: null // Will be set after nav is found
            };
            
            if (this.elements.nav) {
                this.elements.focusable = this.elements.nav.querySelectorAll(
                    'a[href], button:not([disabled])'
                );
            }
        },

        bindEvents() {
            // Use passive listeners where possible
            this.elements.toggle.addEventListener('click', this.toggle.bind(this));
            document.addEventListener('keydown', this.handleKeydown.bind(this));
            
            // Close on outside click (debounced)
            document.addEventListener('click', this.debounce(this.handleOutsideClick.bind(this), 10));
            
            // Close on link click
            this.elements.focusable?.forEach(link => {
                link.addEventListener('click', () => this.isOpen && this.close());
            });

            // Handle resize
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
            
            // Focus first link on next frame
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

    // --- 4. Module: Lightweight Sticky Header ---
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

    // --- 5. Module: High-Performance Scroll Animations ---
    const scrollAnimator = {
        animatedElements: [],
        
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
                        toggleActions: 'play none none reverse'
                    }
                });
            });
        },

        createStaggeredAnimations() {
            const featureCards = document.querySelectorAll('.feature-card');
            if (!featureCards.length) return;

            gsap.set(featureCards, { opacity: 0, y: 40 });
            
            ScrollTrigger.batch(featureCards, {
                onEnter: elements => {
                    gsap.to(elements, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        stagger: 0.1
                    });
                },
                start: 'top 80%'
            });
        },

        disableAnimations() {
            const elements = document.querySelectorAll('.anim-fade-in-up');
            gsap.set(elements, { opacity: 1, y: 0 });
        }
    };

    // --- 6. Module: Smooth Horizontal Process Scroll ---
    const horizontalProcessScroll = {
        container: null,
        wrapper: null,
        
        init() {
            this.container = document.querySelector('.process-section-container');
            this.wrapper = document.querySelector('.process-steps-wrapper');
            
            if (!this.container || !this.wrapper) return;

            // Delay to ensure layout is complete
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

            this.addKeyboardSupport();
        },

        addKeyboardSupport() {
            const scrollArea = this.container.querySelector('.process-horizontal-scroll');
            if (!scrollArea) return;

            scrollArea.setAttribute('tabindex', '0');
            scrollArea.addEventListener('keydown', event => {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    window.scrollBy({ top: -50, behavior: 'smooth' });
                } else if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    window.scrollBy({ top: 50, behavior: 'smooth' });
                }
            });
        }
    };

    // --- 7. Module: 2D Hero Background Animation ---
    const hero2DBackground = {
        canvas: null,
        ctx: null,
        particles: [],
        animationId: null,
        mouse: { x: 0, y: 0 },
        
        init() {
            const container = document.getElementById('hero-canvas-container');
            if (!container) return;

            this.createCanvas(container);
            this.createParticles();
            this.addEventListeners();
            this.startAnimation();
        },

        createCanvas(container) {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d', { alpha: true });
            
            this.resizeCanvas();
            container.appendChild(this.canvas);
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
            const count = Math.min(50, Math.floor(this.width / 20)); // Adaptive count
            this.particles = [];
            
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2,
                    originalX: 0,
                    originalY: 0
                });
                
                // Store original position for mouse interaction
                const particle = this.particles[this.particles.length - 1];
                particle.originalX = particle.x;
                particle.originalY = particle.y;
            }
        },

        addEventListeners() {
            const container = this.canvas.parentElement;
            
            // Throttled mouse movement
            let mouseMoveTimeout;
            container.addEventListener('mousemove', event => {
                const rect = container.getBoundingClientRect();
                this.mouse.x = event.clientX - rect.left;
                this.mouse.y = event.clientY - rect.top;
                
                clearTimeout(mouseMoveTimeout);
                mouseMoveTimeout = setTimeout(() => {
                    this.mouse.x = this.width / 2;
                    this.mouse.y = this.height / 2;
                }, 2000);
            }, { passive: true });

            // Resize handling
            window.addEventListener('resize', this.debounce(() => {
                this.resizeCanvas();
                this.createParticles();
            }, 250), { passive: true });

            // Intersection Observer for performance
            const observer = new IntersectionObserver(entries => {
                this.isVisible = entries[0].isIntersecting;
            }, { threshold: 0.1 });
            
            observer.observe(container);
        },

        startAnimation() {
            let lastTime = 0;
            const fps = 30; // Reduced FPS for better performance
            const interval = 1000 / fps;
            
            const animate = currentTime => {
                this.animationId = requestAnimationFrame(animate);
                
                if (currentTime - lastTime < interval) return;
                if (!this.isVisible) return;
                
                lastTime = currentTime;
                this.updateParticles();
                this.drawParticles();
            };
            
            this.isVisible = true;
            animate(0);
        },

        updateParticles() {
            this.particles.forEach(particle => {
                // Subtle movement
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Mouse interaction (reduced intensity)
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100 * 0.02;
                    particle.x -= dx * force;
                    particle.y -= dy * force;
                }
                
                // Boundaries with wrapping
                if (particle.x < 0) particle.x = this.width;
                if (particle.x > this.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.height;
                if (particle.y > this.height) particle.y = 0;
            });
        },

        drawParticles() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            
            this.particles.forEach(particle => {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
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

    // --- 8. Module: Micro-interactions & Polish ---
    const microInteractions = {
        init() {
            this.initButtonEffects();
            this.initCardEffects();
            this.initFormEnhancements();
        },

        initButtonEffects() {
            const buttons = document.querySelectorAll('.btn');
            
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    gsap.to(btn, { scale: 1.02, duration: 0.2, ease: 'power2.out' });
                }, { passive: true });
                
                btn.addEventListener('mouseleave', () => {
                    gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
                }, { passive: true });
                
                btn.addEventListener('mousedown', () => {
                    gsap.to(btn, { scale: 0.98, duration: 0.1 });
                }, { passive: true });
                
                btn.addEventListener('mouseup', () => {
                    gsap.to(btn, { scale: 1.02, duration: 0.1 });
                }, { passive: true });
            });
        },

        initCardEffects() {
            const cards = document.querySelectorAll('.feature-card');
            
            cards.forEach(card => {
                const icon = card.querySelector('.feature-icon');
                
                card.addEventListener('mouseenter', () => {
                    if (icon) {
                        gsap.to(icon, { 
                            scale: 1.05, 
                            duration: 0.3, 
                            ease: 'back.out(1.4)' 
                        });
                    }
                }, { passive: true });
                
                card.addEventListener('mouseleave', () => {
                    if (icon) {
                        gsap.to(icon, { 
                            scale: 1, 
                            duration: 0.3, 
                            ease: 'back.out(1.4)' 
                        });
                    }
                }, { passive: true });
            });
        },

        initFormEnhancements() {
            const inputs = document.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    gsap.to(input, { 
                        borderColor: '#FFFFFF', 
                        boxShadow: '0 0 0 3px rgba(255,255,255,0.1)',
                        duration: 0.2 
                    });
                });
                
                input.addEventListener('blur', () => {
                    gsap.to(input, { 
                        borderColor: 'rgba(255,255,255,0.1)', 
                        boxShadow: 'none',
                        duration: 0.2 
                    });
                });
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
