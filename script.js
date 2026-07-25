/**
 * Jaiza | Interactions
 * Mobile menu, header scroll state, scroll-reveal animations
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Mobile Navigation ───
    const toggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('mainNav');
    const overlay = document.getElementById('navOverlay');

    function openNav() {
        nav.classList.add('open');
        overlay.classList.add('active');
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        nav.classList.remove('open');
        overlay.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            nav.classList.contains('open') ? closeNav() : openNav();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeNav);
    }

    // Close nav on link click (mobile)
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Close nav on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            closeNav();
        }
    });


    // ─── Header Scroll State ───
    const header = document.querySelector('.site-header');
    let lastScroll = 0;

    function handleHeaderScroll() {
        const currentScroll = window.scrollY;
        if (currentScroll > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // run on load


    // ─── Scroll-Reveal Animations ───
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
        observer.observe(el);
    });


    // ─── Form Handling (placeholder) ───
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            // Formspree endpoint is a placeholder — let native behavior handle it
            console.log('Form submission — configure Formspree endpoint.');
        });
    }
});
