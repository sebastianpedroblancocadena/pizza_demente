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
        threshold: 0.04,
        rootMargin: '0px 0px 80px 0px',
      }
    );

    revealEls.forEach((el) => revealObserver.observe(el));

    // Respaldo al saltar con anclas o desplazamiento muy rápido
    let revealSweepTimer = null;
    window.addEventListener(
      'scroll',
      () => {
        clearTimeout(revealSweepTimer);
        revealSweepTimer = setTimeout(() => {
          const vh = window.innerHeight;
          revealEls.forEach((el) => {
            if (el.classList.contains('is-visible')) return;
            const rect = el.getBoundingClientRect();
            if (rect.top <= vh + 40) {
              const delay = el.getAttribute('data-reveal-delay');
              if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
              el.classList.add('is-visible');
              revealObserver.unobserve(el);
            }
          });
        }, 80);
      },
      { passive: true }
    );
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
    const dialStage = $('.hero-dial-container');
    const dialImg = $('.dial-pizza-img');
    const dialTabs = $$('.dial-tab-btn');
    const dialCtaBtn = $('.btn-dial-cta');
    const nameBadge = $('.dial-pizza-name-badge');

    if (!dialImg || !dialTabs.length) return;

    const pizzaData = [
      { name: 'Jamón Serrano', img: 'img/pizza-jamon-serrano-dial.webp', ingredients: 'Jamón Serrano Curado, Salsa Blanca & Rúcula', price: 'Bs 82', rot: 0 },
      { name: 'Chorizo Picante', img: 'img/pizza-chorizo-picante-dial.webp', ingredients: 'Chorizo Picante, Locotos & Aceite de Oliva', price: 'Bs 80', rot: 45 },
      { name: 'Tocino y Papa', img: 'img/pizza-tocino-papa-dial.webp', ingredients: 'Tocino Ahumado, Cremoso de Papa & Pimientas', price: 'Bs 80', rot: 90 },
      { name: 'Cuatro Quesos', img: 'img/pizza-cuatro-quesos-dial.webp', ingredients: 'Mozzarella, Queso de Chía, Parmesano & Azul', price: 'Bs 84', rot: 135 },
      { name: 'Salame', img: 'img/pizza-salame-dial.webp', ingredients: 'Salame, Locotos, Cebolla Caramelizada & Hierbas', price: 'Bs 73', rot: 180 },
      { name: 'Hongos de Pino', img: 'img/pizza-hongos-dial.webp', ingredients: 'Hongos de Pino Confitados, Cebolla & Almendras', price: 'Bs 74', rot: 225 },
      { name: 'Carnívora', img: 'img/pizza-carnivora-dial.webp', ingredients: 'Carne de Res, Chorizo, Tocino & Mix Pimientas', price: 'Bs 87', rot: 270 },
      { name: 'Hawaiana', img: 'img/pizza-hawaiana-dial.webp', ingredients: 'Piña Encurtida de la Casa, Jamón & Ají Dulce', price: 'Bs 70', rot: 315 },
    ];

    // Precarga diferida para no frenar el renderizado inicial en móvil
    window.addEventListener('load', () => {
      pizzaData.slice(1).forEach((p, i) => {
        setTimeout(() => {
          const preload = new Image();
          preload.src = p.img;
          if (typeof preload.decode === 'function') {
            preload.decode().catch(() => {});
          }
        }, 250 * (i + 1));
      });
    }, { once: true });

    let currentIndex = 0;
    let activeRotation = 0;
    let autoTimer = null;
    let currentOutAnim = null;
    let currentInAnim = null;

    const selectPizza = (index, isAuto = false) => {
      const targetIndex = ((index % pizzaData.length) + pizzaData.length) % pizzaData.length;
      if (targetIndex === currentIndex) return;

      const prevIndex = currentIndex;
      currentIndex = targetIndex;
      const item = pizzaData[targetIndex];
      if (!item) return;

      dialTabs.forEach((t, i) => {
        const active = i === targetIndex;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      // Actualiza badge de nombre en móvil
      if (nameBadge) {
        nameBadge.style.opacity = '0';
        setTimeout(() => {
          nameBadge.textContent = item.name;
          nameBadge.style.opacity = '1';
        }, 160);
      }

      if (dialCtaBtn) {
        const msg = encodeURIComponent(`Hola Demente, quiero pedir la Pizza ${item.name} (${item.price})`);
        dialCtaBtn.href = `https://wa.me/59173211810?text=${msg}`;
      }

      const steps = ((targetIndex - prevIndex) + pizzaData.length) % pizzaData.length || 1;
      const spinDelta = isAuto ? 45 : Math.max(45, Math.min(steps * 45, 180));
      const prevRot = activeRotation;
      const midRot = prevRot + spinDelta * 0.55;
      const targetRot = prevRot + spinDelta;
      activeRotation = targetRot;

      if (RM || typeof dialImg.animate !== 'function') {
        dialImg.src = item.img;
        dialImg.alt = `Pizza ${item.name} artesanal de Demente`;
        dialImg.style.transform = `scale(1.04) rotate(${targetRot}deg)`;
        return;
      }

      if (currentOutAnim) currentOutAnim.cancel();
      if (currentInAnim) currentInAnim.cancel();

      currentOutAnim = dialImg.animate(
        [
          { opacity: 1, transform: `scale(1.04) rotate(${prevRot}deg)` },
          { opacity: 0.52, transform: `scale(0.98) rotate(${midRot}deg)` },
        ],
        { duration: 320, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
      );

      currentOutAnim.onfinish = () => {
        currentOutAnim = null;
        dialImg.src = item.img;
        dialImg.alt = `Pizza ${item.name} artesanal de Demente`;
        currentInAnim = dialImg.animate(
          [
            { opacity: 0.52, transform: `scale(0.98) rotate(${midRot}deg)` },
            { opacity: 1, transform: `scale(1.04) rotate(${targetRot}deg)` },
          ],
          { duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
        );
        currentInAnim.onfinish = () => {
          currentInAnim = null;
        };
      };
    };

    const startAutoCycle = () => {
      if (RM) return;
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        if (!d.hidden) {
          selectPizza(currentIndex + 1, true);
        }
      }, 4500);
    };

    dialTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        selectPizza(index, false);
        startAutoCycle();
      });
    });

    const dialPlate = $('.dial-pizza-plate');
    if (dialPlate) {
      dialPlate.addEventListener('click', () => {
        selectPizza(currentIndex + 1, false);
        startAutoCycle();
      });
    }

    startAutoCycle();
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
