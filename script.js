/**
 * Jaiza | Minimal JavaScript Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if we only want it to animate once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-in or fade-in-up classes
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');
    animatedElements.forEach(el => observer.observe(el));
    
    // Form submission handling (placeholder behavior)
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            // Because this is currently a placeholder Formspree endpoint, 
            // we let the native behavior handle it unless further requested.
            // A simple console log to verify interaction.
            console.log('Form submission intercepted. Point to active Formspree endpoint.');
        });
    }
});