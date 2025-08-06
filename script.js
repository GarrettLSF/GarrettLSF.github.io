/**
 * ===================================================================
 *   Elite Install - Prestige Edition Script
 *   Version: 3.0
 *   ===================================================================
 *
 *   This script provides high-performance, accessible, and modular
 *   interactivity for the Elite Install website.
 *
 *   TABLE OF CONTENTS
 *   1. App State & Configuration
 *   2. Core Modules
 *      - mobileNav: Handles the mobile navigation menu and accessibility.
 *      - dynamicGlow: Creates the performant, mouse-following background glow.
 *      - scrollAnimator: Manages fade-in animations on scroll.
 *   3. Initialization
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
            openBodyClass: 'mobile-nav-open',
        },
        glow: {
            // Configuration for the dynamic glow effect
        }
    };


    // --- 2. Core Modules ---

    /**
     * @module mobileNav
     * @description Handles all logic for the mobile navigation menu.
     */
    const mobileNav = {
        init() {
            const toggleButton = document.querySelector(CONFIG.nav.toggleSelector);
            if (!toggleButton) return;

            toggleButton.addEventListener('click', this.toggleMenu.bind(this));
            document.addEventListener('keydown', this.handleKeydown.bind(this));
        },

        toggleMenu(event) {
            const body = document.body;
            const toggleButton = event.currentTarget;
            const isExpanded = body.classList.toggle(CONFIG.nav.openBodyClass);

            toggleButton.setAttribute('aria-expanded', String(isExpanded));
            body.style.overflow = isExpanded ? 'hidden' : '';
        },

        handleKeydown(event) {
            if (event.key === 'Escape' && document.body.classList.contains(CONFIG.nav.openBodyClass)) {
                // Find the button to correctly call the toggle function
                const toggleButton = document.querySelector(CONFIG.nav.toggleSelector);
                if(toggleButton) this.toggleMenu({ currentTarget: toggleButton });
            }
        }
    };

    /**
     * @module dynamicGlow
     * @description Creates a performant, mouse-following background glow.
     */
    const dynamicGlow = {
        mousePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },

        init() {
            // Respect accessibility settings for reduced motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }
            
            document.body.addEventListener('mousemove', e => {
                this.mousePos.x = e.clientX;
                this.mousePos.y = e.clientY;
            });
            
            this.update();
        },

        // Use requestAnimationFrame for a buttery-smooth, performant animation loop
        update() {
            document.body.style.setProperty('--x', `${this.mousePos.x}px`);
            document.body.style.setProperty('--y', `${this.mousePos.y}px`);
            requestAnimationFrame(this.update.bind(this));
        }
    };

    /**
     * @module scrollAnimator
     * @description Fades in elements as they scroll into the viewport.
     */
    const scrollAnimator = {
        init() {
            const elementsToAnimate = document.querySelectorAll(CONFIG.animation.selector);
            if (elementsToAnimate.length === 0) return;

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Apply delay from data attribute for staggered effect
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
     * @description The main entry point for the application.
     *              Initializes all modules after the DOM is ready.
     */
    const main = () => {
        mobileNav.init();
        dynamicGlow.init();
        scrollAnimator.init();
    };

    // Run the main function once the DOM is fully loaded.
    document.addEventListener('DOMContentLoaded', main);

})();
