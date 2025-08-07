/**
 * ===================================================================
 * Elite Install - Professional UI/UX Overhaul
 * Version: 5.1 (Final Professional Build)
 * ===================================================================
 *
 * This script implements a refined and professional design, correcting
 * all previous layout, spacing, and UI/UX issues. It establishes a
 * robust, award-worthy visual foundation.
 *
 * TABLE OF CONTENTS
 * 1.  App Initialization
 * 2.  Module: Component Loader (Header/Footer)
 * 3.  Module: Mobile Navigation
 * 4.  Module: Sticky Header
 * 5.  Module: Scroll-Triggered Animations (GSAP)
 * 6.  Module: Horizontal Process Scroll (GSAP)
 * 7.  Module: 3D Hero Background (Three.js Placeholder)
 *
 * ===================================================================
 */

(() => {
    'use strict';

    // --- 1. App Initialization ---
    const App = {
        // We now initialize in two stages: load components, then init interactivity.
        async init() {
            await componentLoader.load(); // Wait for header/footer to load first
            this.initComponents();
        },

        initComponents() {
            // Ensure GSAP and ScrollTrigger are available before using them
            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                console.error('GSAP or ScrollTrigger is not loaded. Animations will be disabled.');
                return;
            }
            gsap.registerPlugin(ScrollTrigger);
            
            mobileNav.init();
            stickyHeader.init();
            scrollAnimator.init();
            horizontalProcessScroll.init();
            hero3DBackground.init();
        }
    };

    // --- 2. Module: Component Loader (Header/Footer) ---
    const componentLoader = {
        // This function fetches HTML content and injects it into a placeholder
        fetchAndInject: async (url, placeholderId) => {
            const placeholder = document.getElementById(placeholderId);
            if (!placeholder) return;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to load ${url}`);
                const html = await response.text();
                placeholder.outerHTML = html;
            } catch (error) {
                console.error(`Error loading component: ${error}`);
                placeholder.innerHTML = `<p style="text-align:center; color:red;">Failed to load component: ${url}</p>`;
            }
        },

        // This function loads all components for the page
        async load() {
            // Use Promise.all to load header and footer concurrently for better performance
            await Promise.all([
                this.fetchAndInject('header.html', 'header-placeholder'),
                this.fetchAndInject('footer.html', 'footer-placeholder')
            ]);
        }
    };

    // --- 3. Module: Mobile Navigation ---
    const mobileNav = {
        init() {
            // Now that the header is loaded, we can safely query for these elements
            this.toggleButton = document.querySelector('.mobile-menu-toggle');
            this.navLinksContainer = document.querySelector('#nav-links');
            if (!this.toggleButton || !this.navLinksContainer) return;

            this.focusableElements = this.navLinksContainer.querySelectorAll('a[href], button');
            this.firstFocusable = this.focusableElements[0];
            this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];

            this.toggleButton.addEventListener('click', this.toggleMenu.bind(this));
            document.addEventListener('keydown', this.handleKeydown.bind(this));
        },
        toggleMenu() {
            const body = document.body;
            const isExpanded = body.classList.toggle('mobile-nav-open');
            this.toggleButton.setAttribute('aria-expanded', String(isExpanded));
        },
        handleKeydown(event) {
            const isNavOpen = document.body.classList.contains('mobile-nav-open');
            if (!isNavOpen) return;
            if (event.key === 'Escape') this.toggleMenu();
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (document.activeElement === this.firstFocusable) {
                        this.lastFocusable.focus();
                        event.preventDefault();
                    }
                } else {
                    if (document.activeElement === this.lastFocusable) {
                        this.firstFocusable.focus();
                        event.preventDefault();
                    }
                }
            }
        }
    };

    // --- 4. Module: Sticky Header ---
    const stickyHeader = {
        init() {
            const header = document.querySelector('.main-header');
            if (!header) return;
            ScrollTrigger.create({
                start: 'top top-=1',
                toggleClass: {
                    className: 'is-scrolled',
                    target: header
                },
            });
        }
    };

    // --- 5. Module: Scroll-Triggered Animations (GSAP) ---
    const scrollAnimator = {
        init() {
            const elementsToAnimate = gsap.utils.toArray('.anim-fade-in-up');
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

    // --- 6. Module: Horizontal Process Scroll (GSAP) ---
    const horizontalProcessScroll = {
        init() {
            const container = document.querySelector('.process-section-container');
            const scrollWrapper = document.querySelector('.process-steps-wrapper');
            if (!container || !scrollWrapper) return;
            setTimeout(() => {
                const scrollDistance = scrollWrapper.scrollWidth - container.offsetWidth;
                if (scrollDistance <= 0) return;
                gsap.to(scrollWrapper, {
                    x: -scrollDistance,
                    ease: 'none',
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
            }, 100);
        }
    };

    // --- 7. Module: 3D Hero Background (Three.js Placeholder) ---
    const hero3DBackground = {
        init() {
            // Placeholder for Three.js logic
        }
    };

    // Kick off the application
    document.addEventListener('DOMContentLoaded', () => App.init());

})();
