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
        if (!nav || !overlay || !toggle) return;
        nav.classList.add('open');
        overlay.classList.add('active');
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        if (!nav || !overlay || !toggle) return;
        nav.classList.remove('open');
        overlay.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.contains('open') ? closeNav() : openNav();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeNav);
    }

    if (nav) {
        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeNav);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav && nav.classList.contains('open')) {
            closeNav();
        }
    });

    // ─── Header Scroll State ───
    const header = document.querySelector('.site-header');

    function handleHeaderScroll() {
        if (!header) return;
        const currentScroll = window.scrollY;
        if (currentScroll > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // ─── Active Nav Link on Scroll ───
    const sectionLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    const sections = Array.from(sectionLinks)
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    function setActiveLink() {
        if (!sectionLinks.length || !sections.length) return;

        const offset = window.scrollY + 140;
        let activeId = sections[0].id;

        sections.forEach((section) => {
            if (section.offsetTop <= offset) {
                activeId = section.id;
            }
        });

        sectionLinks.forEach((link) => {
            const matches = link.getAttribute('href') === `#${activeId}`;
            link.classList.toggle('is-active', matches);
        });
    }

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();

    // ─── Scroll-Reveal Animations ───
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-up').forEach((el) => {
        observer.observe(el);
    });

    // ─── Form Handling (placeholder) ───
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', () => {
            console.log('Form submission — configure Formspree endpoint.');
        });
    }
});
