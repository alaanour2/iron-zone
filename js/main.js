(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    var root = document.documentElement;
    var themeColorMeta = document.querySelector('meta[name="theme-color"]');

    var tr = function (key, fallback) {
      var i18n = window.IronZoneI18n;
      if (i18n && typeof i18n.t === 'function') {
        var val = i18n.t(key);
        if (typeof val === 'string') {
          return val;
        }
      }
      return fallback;
    };

    var currentTheme = function () {
      return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    };

    var applyTheme = function (theme, persist) {
      var isLight = theme === 'light';
      if (isLight) {
        root.setAttribute('data-theme', 'light');
      } else {
        root.removeAttribute('data-theme');
      }
      themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', isLight ? tr('controls.themeToDark', 'Switch to dark theme') : tr('controls.themeToLight', 'Switch to light theme'));
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', isLight ? '#F4F5F0' : '#0A0A0A');
      }
      if (persist) {
        try {
          localStorage.setItem('ironzone:theme', theme);
        } catch (e) {
          // ignore unavailable storage
        }
      }
    };

    themeToggle.addEventListener('click', function () {
      applyTheme(currentTheme() === 'light' ? 'dark' : 'light', true);
    });

    applyTheme(currentTheme(), false);

    var syncTheme = function () {
      applyTheme(currentTheme(), false);
    };
    if (window.IronZoneI18n && typeof window.IronZoneI18n.onChange === 'function') {
      window.IronZoneI18n.onChange(syncTheme);
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        if (window.IronZoneI18n && typeof window.IronZoneI18n.onChange === 'function') {
          window.IronZoneI18n.onChange(syncTheme);
        }
      });
    }
  }

  var navToggle = document.querySelector('.nav__toggle');
  var navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    var closeMenu = function () {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navMenu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMenu();
        navToggle.focus();
      }
    });
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var backToTop = document.createElement('button');
  backToTop.type = 'button';
  backToTop.className = 'back-to-top';
  backToTop.innerHTML =
    '<svg class="back-to-top__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>' +
    '<span class="visually-hidden">Back to top</span>';
  backToTop.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  var onScroll = function () {
    if (window.scrollY > 400) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
          window.setTimeout(function () {
            el.style.opacity = '';
            el.style.transform = '';
            el.style.transition = '';
          }, 650);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.card, .stat').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
})();
