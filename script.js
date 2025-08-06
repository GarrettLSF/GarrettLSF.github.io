/**
 * ===================================================================
 *   Elite Install & Haul - Main JavaScript File
 *   Version: 1.0
 *   ===================================================================
 *   Handles client-side interactivity for the website.
 *   - Mobile navigation menu toggle
 *   - Contact form submission simulation
 * ===================================================================
 */

// Use a strict mode to prevent common errors
'use strict';

// Wait for the DOM to be fully loaded before running any scripts
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Mobile Navigation Toggle
     * Toggles the 'mobile-nav-open' class on the body to show/hide the menu.
     * Updates ARIA attributes for accessibility.
     */
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            const body = document.body;
            body.classList.toggle('mobile-nav-open');

            // Toggle ARIA attribute for screen readers
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', String(!isExpanded));

            // Optional: Prevent body scrolling when menu is open
            if (body.classList.contains('mobile-nav-open')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }

    /**
     * Contact Form Submission
     * Handles the contact form. In a real application, this would use fetch()
     * to send data to a backend server (like one written in Java).
     */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            // Prevent the default browser form submission behavior
            event.preventDefault();

            // In a real-world scenario, you would collect form data and send it.
            // const formData = new FormData(contactForm);
            // const data = Object.fromEntries(formData.entries());
            //
            // fetch('/api/contact', {
            //     method: 'POST',
            *     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // }).then(response => response.json()).then(result => { ... });

            // For this static site, we just show a success message and reset the form.
            alert('Thank you for your interest! We will contact you within 4 business hours.');
            contactForm.reset();
        });
    }

});