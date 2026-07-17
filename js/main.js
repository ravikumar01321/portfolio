/* ============================================================
   RAVI KUMAR — PORTFOLIO v3 (Premium · Final)
   All interactions · zero dependencies · no custom cursor
   ============================================================ */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer  = window.matchMedia('(pointer: fine)').matches;
    var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

    /* ============ 1. PRELOADER ============ */
    (function () {
        var preloader = $('#preloader');
        var fill = $('#preloaderFill');
        if (!preloader) return;

        var progress = 0;
        var timer = setInterval(function () {
            progress = Math.min(progress + Math.random() * 22, 90);
            if (fill) fill.style.width = progress + '%';
        }, 180);

        var hidden = false;
        function hide() {
            if (hidden) return;
            hidden = true;
            clearInterval(timer);
            if (fill) fill.style.width = '100%';
            setTimeout(function () { preloader.classList.add('done'); }, 350);
        }

        if (document.readyState === 'complete') hide();
        else window.addEventListener('load', hide);
        setTimeout(hide, 4000); // safety net
    })();

    /* ============ 2. FOOTER YEAR ============ */
    var yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ============ 3. THEME TOGGLE ============ */
    (function () {
        var btn = $('#themeToggle');
        var root = document.documentElement;
        if (!btn) return;
        btn.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            localStorage.setItem('portfolio-theme', next);
            var meta = $('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', next === 'dark' ? '#070b12' : '#f4f7fb');
        });
    })();

    /* ============ 4. HEADER · SCROLL PROGRESS · BACK-TO-TOP ============ */
    (function () {
        var header = $('#header');
        var progress = $('#scrollProgress');
        var toTop = $('#backToTop');
        var ticking = false;

        function update() {
            var y = window.scrollY;
            if (header) header.classList.toggle('scrolled', y > 10);
            if (progress) {
                var max = document.documentElement.scrollHeight - window.innerHeight;
                progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
            }
            if (toTop) toTop.classList.toggle('visible', y > 600);
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) { requestAnimationFrame(update); ticking = true; }
        }, { passive: true });
        update();

        if (toTop) {
            toTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            });
        }
    })();

    /* ============ 5. MOBILE NAV ============ */
    (function () {
        var toggle = $('#navToggle');
        var nav = $('#mainNav');
        if (!toggle || !nav) return;

        function close() {
            nav.classList.remove('open');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }

        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            toggle.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', String(open));
        });

        $$('.nav-link', nav).forEach(function (l) { l.addEventListener('click', close); });
        document.addEventListener('click', function (e) {
            if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) close();
        });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    })();

    /* ============ 6. SCROLLSPY (active nav link + aria-current) ============ */
    (function () {
        var links = $$('.nav-link');
        if (!links.length || !('IntersectionObserver' in window)) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = '#' + entry.target.id;
                links.forEach(function (l) {
                    var on = l.getAttribute('href') === id;
                    l.classList.toggle('active', on);
                    if (on) l.setAttribute('aria-current', 'true');
                    else l.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        $$('section[id]').forEach(function (s) { observer.observe(s); });
    })();

    /* ============ 7. TYPEWRITER ============ */
    (function () {
        var el = $('#typewriter');
        if (!el || reduceMotion) return;

        var roles = ['Full Stack Developer', 'AI Enthusiast', 'B.Tech CSE Student', 'Problem Solver'];
        var roleIdx = 0, charIdx = roles[0].length, deleting = true;

        setTimeout(function tick() {
            if (deleting) {
                charIdx--;
                el.textContent = roles[roleIdx].substring(0, charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    roleIdx = (roleIdx + 1) % roles.length;
                    return void setTimeout(tick, 350);
                }
                return void setTimeout(tick, 38);
            }
            charIdx++;
            el.textContent = roles[roleIdx].substring(0, charIdx);
            if (charIdx === roles[roleIdx].length) {
                deleting = true;
                return void setTimeout(tick, 2300);
            }
            setTimeout(tick, 75);
        }, 2600);
    })();

    /* ============ 8. SCROLL REVEAL ============ */
    (function () {
        if (reduceMotion || !('IntersectionObserver' in window)) {
            $$('.reveal').forEach(function (el) { el.classList.add('visible'); });
            return;
        }
        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        var i = 0;
        $$('.reveal').forEach(function (el) {
            el.style.transitionDelay = ((i++ % 4) * 80) + 'ms';
            observer.observe(el);
        });
    })();

    /* ============ 9. ANIMATED COUNTERS ============ */
    (function () {
        var nums = $$('.stat-num');
        if (!nums.length) return;

        function countUp(el) {
            var target = parseInt(el.dataset.target, 10) || 0;
            var suffix = el.dataset.suffix || '';
            if (reduceMotion) { el.textContent = target + suffix; return; }
            var start = null, dur = 1400;
            function step(ts) {
                if (!start) start = ts;
                var p = Math.min((ts - start) / dur, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        if (!('IntersectionObserver' in window)) { nums.forEach(countUp); return; }
        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { countUp(entry.target); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.5 });
        nums.forEach(function (n) { observer.observe(n); });
    })();

    /* ============ 10. SKILL BARS ============ */
    (function () {
        var bars = $$('.bar-fill');
        if (!bars.length) return;

        function fillBar(el) { el.style.width = (el.dataset.level || 0) + '%'; }

        if (reduceMotion || !('IntersectionObserver' in window)) { bars.forEach(fillBar); return; }
        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { fillBar(entry.target); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.4 });
        bars.forEach(function (b) { observer.observe(b); });
    })();

    /* ============ 11. 3D TILT CARDS ============ */
    (function () {
        if (reduceMotion || !finePointer) return;

        $$('.tilt').forEach(function (card) {
            var raf = null;

            card.addEventListener('pointermove', function (e) {
                if (raf) return;
                raf = requestAnimationFrame(function () {
                    var r = card.getBoundingClientRect();
                    var px = (e.clientX - r.left) / r.width - 0.5;
                    var py = (e.clientY - r.top) / r.height - 0.5;
                    card.style.transform =
                        'perspective(850px) rotateY(' + (px * 9) + 'deg) rotateX(' + (-py * 9) + 'deg) translateY(-4px)';
                    raf = null;
                });
            });

            card.addEventListener('pointerleave', function () {
                card.style.transition = 'transform .5s cubic-bezier(.22,.8,.35,1)';
                card.style.transform = 'perspective(850px) rotateY(0) rotateX(0)';
                setTimeout(function () { card.style.transition = ''; }, 500);
            });
        });
    })();

    /* ============ 12. MAGNETIC BUTTONS ============ */
    (function () {
        if (reduceMotion || !finePointer) return;

        $$('.magnetic').forEach(function (btn) {
            btn.addEventListener('pointermove', function (e) {
                var r = btn.getBoundingClientRect();
                var x = e.clientX - r.left - r.width / 2;
                var y = e.clientY - r.top - r.height / 2;
                btn.style.transform = 'translate(' + x * 0.25 + 'px,' + y * 0.3 + 'px)';
            });
            btn.addEventListener('pointerleave', function () {
                btn.style.transition = 'transform .4s cubic-bezier(.22,.8,.35,1)';
                btn.style.transform = 'translate(0,0)';
                setTimeout(function () { btn.style.transition = ''; }, 400);
            });
        });
    })();

    /* ============ 13. PARTICLE NETWORK (hero canvas) ============ */
    (function () {
        if (reduceMotion) return;
        var canvas = $('#particleCanvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        if (!ctx) return;

        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var W, H, particles = [], raf = null;
        var mouse = { x: null, y: null };
        var DENSITY_DIVISOR = 16000;

        function resize() {
            var rect = canvas.parentElement.getBoundingClientRect();
            W = rect.width; H = rect.height;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            spawn();
        }

        function spawn() {
            var count = Math.min(Math.floor((W * H) / DENSITY_DIVISOR), 110);
            particles = [];
            for (var i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.45,
                    vy: (Math.random() - 0.5) * 0.45,
                    r: Math.random() * 1.8 + 0.7
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            var dark = document.documentElement.getAttribute('data-theme') !== 'light';
            var dotColor = dark ? 'rgba(120,190,240,' : 'rgba(30,110,180,';
            var lineColor = dark ? 'rgba(90,170,230,' : 'rgba(60,130,200,';

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;

                if (mouse.x !== null) {
                    var dxm = mouse.x - p.x, dym = mouse.y - p.y;
                    var dm = Math.sqrt(dxm * dxm + dym * dym);
                    if (dm < 140 && dm > 0.001) {
                        p.x += dxm / dm * 0.35;
                        p.y += dym / dm * 0.35;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = dotColor + '0.55)';
                ctx.fill();

                for (var j = i + 1; j < particles.length; j++) {
                    var q = particles[j];
                    var dx = p.x - q.x, dy = p.y - q.y;
                    var d = dx * dx + dy * dy;
                    if (d < 16900) {
                        ctx.beginPath();
                        ctx.strokeStyle = lineColor + (0.16 * (1 - Math.sqrt(d) / 130)) + ')';
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            }
            raf = requestAnimationFrame(draw);
        }

        var hero = canvas.parentElement;
        hero.addEventListener('pointermove', function (e) {
            var r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        });
        hero.addEventListener('pointerleave', function () { mouse.x = null; mouse.y = null; });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
            else if (!raf) raf = requestAnimationFrame(draw);
        });

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 200);
        });

        resize();
        raf = requestAnimationFrame(draw);
    })();

    /* ============ 14. HERO NAME — LETTER-BY-LETTER ENTRANCE ============ */
    (function () {
        if (reduceMotion) return;
        var name = $('.hero-name');
        if (!name) return;
        var text = name.textContent;
        name.textContent = '';
        name.setAttribute('aria-label', text);
        Array.prototype.forEach.call(text, function (ch, i) {
            var s = document.createElement('span');
            s.className = 'ltr gradient-text';
            s.setAttribute('aria-hidden', 'true');
            s.textContent = ch === ' ' ? ' ' : ch;
            s.style.animationDelay = (350 + i * 45) + 'ms';
            name.appendChild(s);
        });
    })();

    /* ============ 15. CARD SPOTLIGHT (in-card glow · NOT a cursor) ============ */
    (function () {
        if (reduceMotion || !finePointer) return;
        var sel = '.skill-category, .project-card, .achievement-card, .timeline-card,' +
                  ' .contact-form, .contact-info, .service-card, .terminal';
        $$(sel).forEach(function (card) {
            card.classList.add('spot');
            card.addEventListener('pointermove', function (e) {
                var r = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
        });
    })();

    /* ============ 16. TOAST + COPY EMAIL ============ */
    (function () {
        var toast = $('#toast');
        var btn = $('#copyEmail');
        var EMAIL = 'p.bunny8133@gmail.com';
        var timer = null;

        window.__showToast = function (msg) {
            if (!toast) return;
            toast.textContent = msg;
            toast.classList.add('show');
            clearTimeout(timer);
            timer = setTimeout(function () { toast.classList.remove('show'); }, 2400);
        };

        if (!btn) return;
        btn.addEventListener('click', function () {
            function done() {
                window.__showToast('Email copied to clipboard ✓');
                btn.classList.add('copied');
                setTimeout(function () { btn.classList.remove('copied'); }, 1600);
            }
            function legacyCopy() {
                var ta = document.createElement('textarea');
                ta.value = EMAIL;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ }
                document.body.removeChild(ta);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(EMAIL).then(done).catch(legacyCopy);
            } else {
                legacyCopy();
            }
        });
    })();

    /* ============ 17. LIVE GITHUB REPO COUNT ============ */
    (function () {
        var elc = $('#ghCount');
        if (!elc || !window.fetch) return;
        fetch('https://api.github.com/users/ravikumar01321', {
            headers: { 'Accept': 'application/vnd.github+json' }
        })
            .then(function (r) { if (!r.ok) throw new Error('rate limited'); return r.json(); })
            .then(function (u) {
                if (typeof u.public_repos === 'number') {
                    elc.textContent = '· ' + u.public_repos + ' public repos';
                    elc.classList.add('loaded');
                }
            })
            .catch(function () { /* link alone is fine */ });
    })();

    /* ============ 18. PROJECTS — API WITH STATIC FALLBACK ============ */
    (function () {
        var grid = $('#projectsGrid');
        if (!grid || !window.fetch) return;

        function el(tag, cls, text) {
            var n = document.createElement(tag);
            if (cls) n.className = cls;
            if (text !== undefined) n.textContent = text;
            return n;
        }

        function render(list) {
            grid.innerHTML = '';
            list.forEach(function (p) {
                var card = el('article', 'project-card tilt reveal visible');
                var imgWrap = el('div', 'project-image placeholder-img');
                imgWrap.appendChild(el('div', 'project-icon', p.title));
                card.appendChild(imgWrap);

                var body = el('div', 'project-body');
                if (Array.isArray(p.tags) && p.tags.length) {
                    var tags = el('div', 'project-tags');
                    p.tags.forEach(function (t) { tags.appendChild(el('span', '', t)); });
                    body.appendChild(tags);
                }
                body.appendChild(el('h3', '', p.title));
                body.appendChild(el('p', '', p.description));

                var links = el('div', 'project-links');
                if (p.github) {
                    var gh = el('a', 'link', 'GitHub');
                    gh.href = p.github; gh.target = '_blank'; gh.rel = 'noopener noreferrer';
                    links.appendChild(gh);
                }
                if (p.demo) {
                    var dm = el('a', 'link', 'Live Demo');
                    dm.href = p.demo; dm.target = '_blank'; dm.rel = 'noopener noreferrer';
                    links.appendChild(dm);
                }
                if (links.children.length) body.appendChild(links);
                card.appendChild(body);
                grid.appendChild(card);
            });
        }

        var ctrl = new AbortController();
        var t = setTimeout(function () { ctrl.abort(); }, 3500);
        fetch('api/projects', { signal: ctrl.signal })
            .then(function (res) {
                clearTimeout(t);
                if (!res.ok) throw new Error('no api');
                return res.json();
            })
            .then(function (data) { if (Array.isArray(data) && data.length) render(data); })
            .catch(function () { /* static fallback cards stay */ });
    })();

    /* ============ 19. CONTACT FORM (validate → API → mailto fallback) ============ */
    (function () {
        var form = $('#contactForm');
        if (!form) return;

        var F = {
            name:    { input: $('#formName'),    err: $('#nameError') },
            email:   { input: $('#formEmail'),   err: $('#emailError') },
            subject: { input: $('#formSubject'), err: $('#subjectError') },
            message: { input: $('#formMessage'), err: $('#messageError') }
        };
        var status = $('#formStatus');
        var btn = $('#submitBtn');
        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        function setErr(f, msg) {
            f.err.textContent = msg;
            f.input.classList.toggle('invalid', !!msg);
            f.input.setAttribute('aria-invalid', msg ? 'true' : 'false');
        }

        function validate() {
            var ok = true;
            Object.keys(F).forEach(function (k) {
                var f = F[k], v = f.input.value.trim(), msg = '';
                if (k === 'name' && v.length < 2) msg = 'Please enter your name (2+ characters).';
                if (k === 'email' && !emailRe.test(v)) msg = 'Please enter a valid email address.';
                if (k === 'subject' && v.length < 2) msg = 'Please enter a subject.';
                if (k === 'message' && v.length < 10) msg = 'Message should be at least 10 characters.';
                setErr(f, msg);
                if (msg) ok = false;
            });
            return ok;
        }

        Object.keys(F).forEach(function (k) {
            F[k].input.addEventListener('input', function () {
                setErr(F[k], '');
                status.textContent = '';
                status.className = 'form-status';
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validate()) return;

            btn.disabled = true;
            btn.querySelector('span').textContent = 'Sending…';
            status.textContent = '';
            status.className = 'form-status';

            var payload = {
                name: F.name.input.value.trim(),
                email: F.email.input.value.trim(),
                subject: F.subject.input.value.trim(),
                message: F.message.input.value.trim()
            };

            function resetBtn() {
                btn.disabled = false;
                btn.querySelector('span').textContent = 'Send Message';
            }
            function ok(msg) {
                status.textContent = msg;
                status.classList.add('success');
                if (window.__showToast) window.__showToast('Message sent ✓');
                form.reset();
                resetBtn();
            }
            function mailtoFallback() {
                resetBtn();
                var url = 'mailto:p.bunny8133@gmail.com'
                    + '?subject=' + encodeURIComponent('[Portfolio] ' + payload.subject)
                    + '&body=' + encodeURIComponent(payload.message + '\n\n— ' + payload.name + ' (' + payload.email + ')');
                status.textContent = 'Opening your email app to send the message directly…';
                status.classList.add('success');
                if (window.__showToast) window.__showToast('Opening your email app…');
                window.location.href = url;
            }

            if (!window.fetch) return mailtoFallback();

            fetch('api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(function (res) {
                    if (res.ok) ok('✅ Message sent! I’ll get back to you soon.');
                    else mailtoFallback();
                })
                .catch(mailtoFallback);
        });
    })();

})();


