/**
 * PIZZERÍA DEMENTE — LA DEMENCIA DE LA MASA MADRE
 * Arquitectura de animaciones nativas:
 * - Intersection Observer (Scroll Reveal, Image Reveal, Contadores y Sentinelas)
 * - CSS Scroll-Driven Animations (Progreso de lectura y Parallax nativo)
 * - Web Animations API para microinteracciones fluidas sin dependencias pesadas
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const d = document;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];

  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;
  const supportsScrollTimeline =
    typeof CSS !== 'undefined' &&
    CSS.supports &&
    CSS.supports('animation-timeline: scroll()');

  const safe = (fn) => {
    try {
      fn();
    } catch (err) {
      console.warn('[Demente UI]', err);
    }
  };

  // --------------------------------------------------------------------------
  // 1. INTERSECTION OBSERVER: SCROLL REVEAL & IMAGE REVEAL PROGRESIVO
  // --------------------------------------------------------------------------
  safe(() => {
    const revealEls = $$('[data-reveal], [data-img-reveal]');
    if (!revealEls.length) return;

    if (RM || !hasIO) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target;
          const delay = target.getAttribute('data-reveal-delay');
          if (delay) {
            target.style.setProperty('--reveal-delay', `${delay}ms`);
          }

          target.classList.add('is-visible');
          observer.unobserve(target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -36px 0px',
      }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  });

  // --------------------------------------------------------------------------
  // 2. INTERSECTION OBSERVER: NAVBAR & BARRA MÓVIL SIN SCROLL LISTENERS
  // --------------------------------------------------------------------------
  safe(() => {
    const nav = $('.top-nav');
    const navSentinel = $('.nav-scroll-sentinel');
    const footerSentinel = $('.footer-scroll-sentinel');
    const stickyBar = $('.mobile-sticky-bar');

    if (!hasIO) return;

    let isTopVisible = true;
    let isFooterVisible = false;

    const syncStickyBar = () => {
      if (!stickyBar) return;
      if (!isTopVisible && !isFooterVisible) {
        stickyBar.classList.remove('is-hidden');
      } else {
        stickyBar.classList.add('is-hidden');
      }
    };

    if (navSentinel) {
      const topObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isTopVisible = entry.isIntersecting;
            if (nav) {
              nav.classList.toggle('is-scrolled', !isTopVisible);
            }
            syncStickyBar();
          });
        },
        { threshold: 0 }
      );
      topObserver.observe(navSentinel);
    }

    if (footerSentinel && stickyBar) {
      const footerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isFooterVisible = entry.isIntersecting;
            syncStickyBar();
          });
        },
        { threshold: 0 }
      );
      footerObserver.observe(footerSentinel);
    }
  });

  // --------------------------------------------------------------------------
  // 3. FALLBACK LIGERO PARA BARRA DE PROGRESO (SI NO HAY SCROLL-TIMELINE)
  // --------------------------------------------------------------------------
  safe(() => {
    const progressBar = $('.scroll-progress-bar');
    if (!progressBar || RM || supportsScrollTimeline) return;

    let ticking = false;
    const updateProgress = () => {
      const maxScroll = d.documentElement.scrollHeight - window.innerHeight;
      const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      progressBar.style.transform = `scaleX(${ratio})`;
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateProgress);
          ticking = true;
        }
      },
      { passive: true }
    );
  });

  // --------------------------------------------------------------------------
  // 4. CONTADORES NUMÉRICOS ACTIVADOS POR INTERSECTION OBSERVER
  // --------------------------------------------------------------------------
  safe(() => {
    const statNumbers = $$('[data-count]');
    if (!statNumbers.length) return;

    const animateCounter = (el) => {
      const targetVal = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const isDecimal = targetVal % 1 !== 0;

      if (RM) {
        el.textContent = (isDecimal ? targetVal.toFixed(1) : Math.round(targetVal)) + suffix;
        return;
      }

      const duration = 1200;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = Math.min(1, (now - startTime) / duration);
        // Curva cúbica suave sin rebote exagerado
        const eased = 1 - Math.pow(1 - elapsed, 3);
        const current = targetVal * eased;
        el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;

        if (elapsed < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    if (!hasIO || RM) {
      statNumbers.forEach(animateCounter);
      return;
    }

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    statNumbers.forEach((el) => counterObserver.observe(el));
  });

  // --------------------------------------------------------------------------
  // 5. DIAL INTERACTIVO DE PIZZAS EN EL HERO (8 ESPECIALIDADES REALES)
  // --------------------------------------------------------------------------
  safe(() => {
    const dialImg = $('.dial-pizza-img');
    const dialTabs = $$('.dial-tab-btn');
    const badge1Text = $('.dial-badge--1 span:last-child');
    const badge2Text = $('.dial-badge--2 span:last-child');
    const badge1El = $('.dial-badge--1');
    const badge2El = $('.dial-badge--2');

    if (!dialImg || !dialTabs.length) return;

    const pizzaData = [
      { name: 'Jamón Serrano', img: 'img/pizza-jamon-serrano-dial.webp', badge1: 'Jamón Serrano Curado', badge2: 'Salsa Blanca & Rúcula', rot: 0 },
      { name: 'Chorizo Picante', img: 'img/pizza-chorizo-picante-dial.webp', badge1: 'Chorizo Picante & Locoto', badge2: 'Aceite de Oliva & Leña', rot: 45 },
      { name: 'Tocino y Papa', img: 'img/pizza-tocino-papa-dial.webp', badge1: 'Tocino Ahumado Crocante', badge2: 'Cremoso de Papa & Pimienta', rot: 90 },
      { name: 'Cuatro Quesos', img: 'img/pizza-cuatro-quesos-dial.webp', badge1: 'Cuatro Quesos de Altura', badge2: 'Queso de Chía & Azul', rot: 135 },
      { name: 'Salame', img: 'img/pizza-salame-dial.webp', badge1: 'Salame & Cebolla Dulce', badge2: 'Locoto & Pasta de Hierba', rot: 180 },
      { name: 'Hongos de Pino', img: 'img/pizza-hongos-dial.webp', badge1: 'Hongos de Pino Confitados', badge2: 'Almendra & Salsa Blanca', rot: 225 },
      { name: 'Carnívora', img: 'img/pizza-carnivora-dial.webp', badge1: 'Res, Chorizo & Tocino', badge2: 'Mix Demente de Pimientas', rot: 270 },
      { name: 'Hawaiana', img: 'img/pizza-hawaiana-dial.webp', badge1: 'Piña Encurtida de la Casa', badge2: 'Jamón & Ají Dulce', rot: 315 },
    ];

    // Precarga ligera de las fotos del dial para intercambio instantáneo
    pizzaData.forEach((p) => {
      const preload = new Image();
      preload.src = p.img;
    });

    let activeRotation = 0;

    const animateBadgeSwap = (container, textSpan, newText) => {
      if (!textSpan) return;
      if (RM || !container || typeof container.animate !== 'function') {
        textSpan.textContent = newText;
        return;
      }

      const outAnim = container.animate(
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-5px)' },
        ],
        { duration: 140, easing: 'ease-in', fill: 'forwards' }
      );

      outAnim.onfinish = () => {
        textSpan.textContent = newText;
        container.animate(
          [
            { opacity: 0, transform: 'translateY(6px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 240, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
        );
      };
    };

    dialTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        const item = pizzaData[index];
        if (!item) return;

        dialTabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        if (RM || typeof dialImg.animate !== 'function') {
          dialImg.src = item.img;
          dialImg.alt = `Pizza ${item.name} artesanal de Demente`;
          dialImg.style.transform = `scale(1.05) rotate(${item.rot}deg)`;
        } else {
          const prevRot = activeRotation;
          activeRotation = item.rot;

          const swapOut = dialImg.animate(
            [
              { opacity: 1, transform: `scale(1.05) rotate(${prevRot}deg)` },
              { opacity: 0.35, transform: `scale(0.92) rotate(${prevRot - 14}deg)` },
            ],
            { duration: 180, easing: 'ease-in', fill: 'forwards' }
          );

          swapOut.onfinish = () => {
            dialImg.src = item.img;
            dialImg.alt = `Pizza ${item.name} artesanal de Demente`;
            dialImg.animate(
              [
                { opacity: 0.35, transform: `scale(0.92) rotate(${item.rot - 16}deg)` },
                { opacity: 1, transform: `scale(1.05) rotate(${item.rot}deg)` },
              ],
              { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
            );
          };
        }

        animateBadgeSwap(badge1El, badge1Text, item.badge1);
        animateBadgeSwap(badge2El, badge2Text, item.badge2);
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. FILTRO DE PIZZAS CON MICROINTERACCIÓN PROGRESIVA
  // --------------------------------------------------------------------------
  safe(() => {
    const filterBtns = $$('.menu-tab-filter');
    const cards = $$('.menu-item-card');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        filterBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        let visibleOrder = 0;

        cards.forEach((card) => {
          const tags = (card.getAttribute('data-tags') || '').split(' ');
          const match = filter === 'all' || tags.includes(filter);

          if (match) {
            card.style.display = 'flex';
            card.classList.add('is-visible');
            const thumb = $('[data-img-reveal]', card);
            if (thumb) thumb.classList.add('is-visible');

            if (!RM && typeof card.animate === 'function') {
              card.animate(
                [
                  { opacity: 0, transform: 'translate3d(0, 18px, 0) scale(0.97)' },
                  { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
                ],
                {
                  duration: 380,
                  delay: visibleOrder * 45,
                  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  fill: 'both',
                }
              );
            }
            visibleOrder++;
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. DESPLAZAMIENTO SUAVE EN ANCLAS INTERNAS CON OFFSET DEL HEADER
  // --------------------------------------------------------------------------
  safe(() => {
    const internalLinks = $$('a[href^="#"]');
    internalLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = $(href);
        if (!target) return;

        e.preventDefault();
        const headerOffset = 68;
        const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: RM ? 'auto' : 'smooth',
        });
      });
    });
  });
});
