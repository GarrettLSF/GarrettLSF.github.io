/**
 * ===================================================================
 * Elite Install - Professional Edition Script
 * Version: 1.0
 * ===================================================================
 *
 * This script provides high-performance, accessible, and modular
 * interactivity for the Elite Install website.
 *
 * TABLE OF CONTENTS
 * 1. App State & Configuration
 * 2. Core Modules
 * - mobileNav: Handles the mobile navigation menu, focus trapping, and accessibility.
 * - stickyHeader: Manages the header state on scroll.
 * - scrollAnimator: Manages fade-in animations on scroll.
 * 3. Initialization
 *
 * ===================================================================
 */

// Encapsulate the entire script in an IIFE (Immediately Invoked Function Expression)
// to create a private scope and avoid polluting the global namespace.
(() => {
    'use strict';

    // --- 1. App State & Configuration ---
    const CONFIG = {
        animation: {
            selector: '.fade-in-up',
            visibleClass: 'is-visible',
            observerThreshold: 0.1,
        },
        nav: {
            toggleSelector: '.mobile-menu-toggle',
            linksSelector: '#nav-links',
            openBodyClass: 'mobile-nav-open',
        },
        header: {
            selector: '.main-header',
            scrolledClass: 'is-scrolled',
            scrollThreshold: 10, // Pixels to scroll before adding the class
        }
    };


    // --- 2. Core Modules ---

    /**
     * @module mobileNav
     * @description Handles all logic for the mobile navigation menu, including focus trapping for accessibility.
     */
    const mobileNav = {
        init() {
            this.toggleButton = document.querySelector(CONFIG.nav.toggleSelector);
            this.navLinksContainer = document.querySelector(CONFIG.nav.linksSelector);
            if (!this.toggleButton || !this.navLinksContainer) return;

            this.focusableElements = this.navLinksContainer.querySelectorAll('a[href], button');
            this.firstFocusable = this.focusableElements[0];
            this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];

            this.toggleButton.addEventListener('click', this.toggleMenu.bind(this));
            document.addEventListener('keydown', this.handleKeydown.bind(this));
        },

        toggleMenu() {
            const body = document.body;
            const isExpanded = body.classList.toggle(CONFIG.nav.openBodyClass);

            this.toggleButton.setAttribute('aria-expanded', String(isExpanded));
            body.style.overflow = isExpanded ? 'hidden' : '';

            if (isExpanded) {
                this.firstFocusable.focus();
            }
        },

        handleKeydown(event) {
            const isNavOpen = document.body.classList.contains(CONFIG.nav.openBodyClass);
            if (!isNavOpen) return;

            if (event.key === 'Escape') {
                this.toggleMenu();
            }

            // Focus trap logic
            if (event.key === 'Tab') {
                if (event.shiftKey) { // Shift + Tab
                    if (document.activeElement === this.firstFocusable) {
                        this.lastFocusable.focus();
                        event.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === this.lastFocusable) {
                        this.firstFocusable.focus();
                        event.preventDefault();
                    }
                }
            }
        }
    };

    /**
     * @module stickyHeader
     * @description Adds a class to the header when the user scrolls down.
     */
    const stickyHeader = {
        init() {
            this.header = document.querySelector(CONFIG.header.selector);
            if (!this.header) return;

            // Use a flag to avoid running the check on every single scroll event pixel
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        this.updateHeaderState();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
            // Run on load as well in case the page is reloaded scrolled down
            this.updateHeaderState();
        },

        updateHeaderState() {
            if (window.scrollY > CONFIG.header.scrollThreshold) {
                this.header.classList.add(CONFIG.header.scrolledClass);
            } else {
                this.header.classList.remove(CONFIG.header.scrolledClass);
            }
        }
    };

    /**
     * @module scrollAnimator
     * @description Fades in elements as they scroll into the viewport using Intersection Observer.
     */
    const scrollAnimator = {
        init() {
            const elementsToAnimate = document.querySelectorAll(CONFIG.animation.selector);
            if (elementsToAnimate.length === 0) return;

            // Do not run animations if user prefers reduced motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                elementsToAnimate.forEach(el => el.classList.add(CONFIG.animation.visibleClass));
                return;
            }

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Apply delay from data attribute for a staggered effect
                        const delay = entry.target.dataset.delay || '0';
                        entry.target.style.transitionDelay = `${delay}ms`;
                        entry.target.classList.add(CONFIG.animation.visibleClass);
                        obs.unobserve(entry.target); // Performance boost: stop watching once visible
                    }
                });
            }, {
                threshold: CONFIG.animation.observerThreshold
            });

            elementsToAnimate.forEach(el => observer.observe(el));
        }
    };


    // --- 3. Initialization ---

    /**
     * @function main
     * @description The main entry point for the application. Initializes all modules after the DOM is ready.
     */
    const main = () => {
        mobileNav.init();
        stickyHeader.init();
        scrollAnimator.init();
    };

    // Run the main function once the DOM is fully loaded.
    // Using 'interactive' is slightly faster than 'complete' or 'load'
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();
