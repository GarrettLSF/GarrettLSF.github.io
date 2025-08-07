/**
 * ===================================================================
 * Elite Install - Digital Premier Blueprint Script
 * Version: 2.0
 * ===================================================================
 *
 * This script implements the "Refined Dynamism" philosophy using GSAP
 * for high-performance, orchestrated animations and interactive elements.
 *
 * TABLE OF CONTENTS
 * 1. App Initialization
 * 2. Module: Mobile Navigation
 * 3. Module: Sticky Header
 * 4. Module: Scroll-Triggered Animations (GSAP)
 * 5. Module: Horizontal Process Scroll (GSAP)
 * 6. Module: 3D Hero Background (Three.js Placeholder)
 *
 * ===================================================================
 */

(() => {
    'use strict';

    // --- 1. App Initialization ---
    document.addEventListener('DOMContentLoaded', () => {
        // Ensure GSAP and ScrollTrigger are available before using them
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('GSAP or ScrollTrigger is not loaded.');
            return;
        }
        gsap.registerPlugin(ScrollTrigger);

        mobileNav.init();
        stickyHeader.init();
        scrollAnimator.init();
        horizontalProcessScroll.init();
        hero3DBackground.init(); // Initialize the 3D background
    });


    // --- 2. Module: Mobile Navigation ---
    const mobileNav = {
        init() {
            this.toggleButton = document.querySelector('.mobile-menu-toggle');
            this.navLinksContainer = document.querySelector('#nav-links');
            if (!this.toggleButton || !this.navLinksContainer) return;

            this.focusableElements = this.navLinksContainer.querySelectorAll('a[href], button');
            this.firstFocusable = this.focusableElements[0];
            this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];

            this.toggleButton.addEventListener('click', this.toggleMenu.bind(this));
        },
        toggleMenu() {
            const body = document.body;
            const isExpanded = body.classList.toggle('mobile-nav-open');
            this.toggleButton.setAttribute('aria-expanded', String(isExpanded));
        }
    };


    // --- 3. Module: Sticky Header ---
    const stickyHeader = {
        init() {
            this.header = document.querySelector('.main-header');
            if (!this.header) return;
            
            ScrollTrigger.create({
                start: 'top top-=10',
                onUpdate: self => {
                    self.direction === -1 ? this.header.classList.remove('is-scrolled') : this.header.classList.add('is-scrolled');
                },
                toggleClass: {
                    className: 'is-scrolled',
                    target: this.header
                }
            });
        }
    };


    // --- 4. Module: Scroll-Triggered Animations (GSAP) ---
    const scrollAnimator = {
        init() {
            const elementsToAnimate = gsap.utils.toArray('.anim-fade-in-up');
            
            // Do not run animations if user prefers reduced motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                gsap.set(elementsToAnimate, { opacity: 1, y: 0 });
                return;
            }

            elementsToAnimate.forEach(el => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power4.out',
                    delay: el.dataset.delay ? parseFloat(el.dataset.delay) / 1000 : 0,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    }
                });
            });
        }
    };
    

    // --- 5. Module: Horizontal Process Scroll (GSAP) ---
    const horizontalProcessScroll = {
        init() {
            const container = document.querySelector('.process-section-container');
            const scrollWrapper = document.querySelector('.process-steps-wrapper');
            if (!container || !scrollWrapper) return;

            // Calculate the total width to scroll
            // scrollWidth is the total width of the content, offsetWidth is the visible width of the container
            const scrollDistance = scrollWrapper.scrollWidth - container.offsetWidth;

            gsap.to(scrollWrapper, {
                x: -scrollDistance,
                ease: 'none', // Linear scroll
                scrollTrigger: {
                    trigger: container,
                    start: 'center center',
                    end: () => `+=${scrollDistance}`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                }
            });
        }
    };
    
    // --- 6. Module: 3D Hero Background (Three.js Placeholder) ---
    const hero3DBackground = {
        init() {
            if (typeof THREE === 'undefined') {
                // console.log('Three.js not loaded, skipping 3D background.');
                return;
            }

            const container = document.getElementById('hero-canvas-container');
            if (!container) return;
            
            // This is a placeholder for the advanced Three.js implementation.
            // A full implementation would involve creating a scene, camera,
            // WebGLRenderer, adding objects (like a particle system or noise field),
            // and an animation loop that updates the scene on each frame.
            // This setup demonstrates where the logic would be initialized.
            
            /*
            Example structure:
            1. const scene = new THREE.Scene();
            2. const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            3. const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            4. renderer.setSize(window.innerWidth, window.innerHeight);
            5. container.appendChild(renderer.domElement);
            
            6. // Create particles or other 3D objects
               const particles = createParticleSystem();
               scene.add(particles);
            
            7. // Animation loop
               function animate() {
                   requestAnimationFrame(animate);
                   // update particle positions, etc.
                   renderer.render(scene, camera);
               }
               animate();
               
            8. // Handle window resize
            */
        }
    };

})();
