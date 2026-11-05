/**
 * Jaiza | The AI Audit
 * Mobile nav, header state, scroll reveals, count-ups, FAQ accordion,
 * contact form (mailto, no backend)
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ---------- mobile nav ---------- */
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

    if (toggle && nav && overlay) {
        toggle.addEventListener('click', () => {
            nav.classList.contains('open') ? closeNav() : openNav();
        });
        overlay.addEventListener('click', closeNav);
        nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
        });
    }

    /* ---------- header scroll state ---------- */
    const header = document.getElementById('siteHeader');
    const onScroll = () => {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- reveal on scroll (per-section stagger) ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ('IntersectionObserver' in window && !reduceMotion) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
        );
        // stagger only siblings within the same parent, not across the whole page
        const byParent = new Map();
        revealEls.forEach((el) => {
            const p = el.parentElement;
            const n = byParent.get(p) || 0;
            el.style.transitionDelay = `${Math.min(n, 3) * 0.07}s`;
            byParent.set(p, n + 1);
            io.observe(el);
        });
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    /* ---------- count-up stats ---------- */
    const counters = document.querySelectorAll('.count[data-count]');
    if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
        const cio = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const target = parseInt(el.dataset.count, 10);
                    const dur = 900;
                    const t0 = performance.now();
                    const tick = (t) => {
                        const p = Math.min((t - t0) / dur, 1);
                        const eased = 1 - Math.pow(1 - p, 3);
                        el.textContent = Math.round(target * eased);
                        if (p < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                    cio.unobserve(el);
                });
            },
            { threshold: 0.4 }
        );
        counters.forEach((c) => cio.observe(c));
    } else {
        counters.forEach((c) => { c.textContent = c.dataset.count; });
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.faq-item').forEach((item) => {
        const btn = item.querySelector('.faq-q');
        const panel = item.querySelector('.faq-a');
        if (!btn || !panel) return;
        btn.addEventListener('click', () => {
            const open = btn.getAttribute('aria-expanded') === 'true';
            // close others
            document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach((other) => {
                if (other !== btn) {
                    other.setAttribute('aria-expanded', 'false');
                    other.parentElement.querySelector('.faq-a').style.maxHeight = '0px';
                }
            });
            btn.setAttribute('aria-expanded', String(!open));
            panel.style.maxHeight = open ? '0px' : panel.scrollHeight + 'px';
        });
    });

    /* ---------- contact form ---------- */
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    const sendAnother = document.getElementById('sendAnother');

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function fieldOf(id) {
        return document.getElementById(id);
    }

    function validate() {
        let ok = true;
        const name = fieldOf('fName');
        const email = fieldOf('fEmail');
        const company = fieldOf('fCompany');
        const need = fieldOf('fNeed');

        [name, email, company, need].forEach((el) => el.classList.remove('invalid'));

        if (!name.value.trim()) { name.classList.add('invalid'); ok = false; }
        if (!EMAIL_RE.test(email.value.trim())) { email.classList.add('invalid'); ok = false; }
        if (!company.value.trim()) { company.classList.add('invalid'); ok = false; }
        if (!need.value) { need.classList.add('invalid'); ok = false; }

        return ok;
    }

    if (form && success) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validate()) {
                formError.hidden = false;
                return;
            }
            formError.hidden = true;

            const name = fieldOf('fName').value.trim();
            const email = fieldOf('fEmail').value.trim();
            const company = fieldOf('fCompany').value.trim();
            const need = fieldOf('fNeed');
            const needLabel = need.options[need.selectedIndex].text;
            const notes = fieldOf('fNotes').value.trim();

            const subject = `Audit request — ${company}`;
            const body = [
                `Name: ${name}`,
                `Work email: ${email}`,
                `Company: ${company}`,
                `Needs: ${needLabel}`,
                notes ? `Notes: ${notes}` : '',
                '',
                '— sent from jaiza site'
            ].filter(Boolean).join('\n');

            window.location.href = `mailto:contact@jaiza.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            form.hidden = true;
            success.hidden = false;
            success.classList.add('is-visible');
            success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        });

        ['fName', 'fEmail', 'fCompany', 'fNeed'].forEach((id) => {
            fieldOf(id).addEventListener('input', (e) => e.target.classList.remove('invalid'));
            fieldOf(id).addEventListener('change', (e) => e.target.classList.remove('invalid'));
        });

        if (sendAnother) {
            sendAnother.addEventListener('click', () => {
                form.reset();
                formError.hidden = true;
                success.hidden = true;
                form.hidden = false;
                fieldOf('fName').focus();
            });
        }
    }
});
