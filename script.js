/**
 * Jaiza | Interactions
 * Mobile nav, header state, reveals, phase tabs
 */

document.addEventListener('DOMContentLoaded', () => {
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

    if (overlay) overlay.addEventListener('click', closeNav);

    nav?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav?.classList.contains('open')) closeNav();
    });

    // Header scroll
    const header = document.querySelector('.site-header');
    const onScroll = () => {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 16);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Reveal on scroll
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
        );
        revealEls.forEach((el, i) => {
            el.style.transitionDelay = `${Math.min(i % 4, 3) * 0.06}s`;
            io.observe(el);
        });
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    // Phase tabs
    const tabs = Array.from(document.querySelectorAll('.phase-tab'));
    const panels = {
        adopt: document.getElementById('panel-adopt'),
        optimize: document.getElementById('panel-optimize'),
        govern: document.getElementById('panel-govern'),
    };

    function activatePhase(key) {
        tabs.forEach((tab) => {
            const active = tab.dataset.phase === key;
            tab.classList.toggle('is-active', active);
            tab.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        Object.entries(panels).forEach(([name, panel]) => {
            if (!panel) return;
            const show = name === key;
            panel.classList.toggle('is-active', show);
            panel.hidden = !show;
        });
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => activatePhase(tab.dataset.phase));
        tab.addEventListener('keydown', (e) => {
            const idx = tabs.indexOf(tab);
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const next = tabs[(idx + 1) % tabs.length];
                next.focus();
                activatePhase(next.dataset.phase);
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
                prev.focus();
                activatePhase(prev.dataset.phase);
            }
        });
    });

    // Form placeholder note
    const form = document.querySelector('.contact-form');
    form?.addEventListener('submit', () => {
        console.log('Configure Formspree endpoint before going live.');
    });
});
