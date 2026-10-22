(function () {
  'use strict';

  var STORAGE_KEY = 'ironzone:lang';
  var DEFAULT_LANG = 'en';
  var SUPPORTED = ['en', 'ar'];
  var translations = {};
  var current = DEFAULT_LANG;
  var listeners = [];
  var ready = false;
  var pendingCallbacks = [];

  function getStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStored(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // storage unavailable
    }
  }

  function resolve(path) {
    var parts = path.split('.');
    var node = translations;
    for (var i = 0; i < parts.length; i++) {
      if (node == null || typeof node !== 'object') {
        return null;
      }
      node = node[parts[i]];
    }
    return node == null ? null : node;
  }

  function t(key, vars) {
    var val = resolve(key);
    if (val == null || typeof val !== 'string') {
      return null;
    }
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        val = val.split('{' + name + '}').join(String(vars[name]));
      });
    }
    return val;
  }

  function list(key) {
    var val = resolve(key);
    return Array.isArray(val) ? val : null;
  }

  function apply(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n'));
      if (typeof val === 'string') {
        el.textContent = val;
      }
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n-placeholder'));
      if (typeof val === 'string') {
        el.setAttribute('placeholder', val);
      }
    });
    root.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n-aria-label'));
      if (typeof val === 'string') {
        el.setAttribute('aria-label', val);
      }
    });
    root.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n-alt'));
      if (typeof val === 'string') {
        el.setAttribute('alt', val);
      }
    });
    root.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n-content'));
      if (typeof val === 'string') {
        el.setAttribute('content', val);
      }
    });
  }

  function setDirection(lang) {
    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }

  function updateToggle() {
    var group = document.getElementById('langSwitch');
    if (!group) {
      return;
    }
    var opts = group.querySelectorAll('.lang-switch__opt');
    for (var i = 0; i < opts.length; i++) {
      var opt = opts[i];
      var optLang = opt.getAttribute('data-lang');
      var isActive = optLang === current;
      opt.classList.toggle('is-active', isActive);
      opt.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      var name = optLang === 'ar' ? t('controls.langNameAr') : t('controls.langNameEn');
      opt.setAttribute('aria-label', name || opt.textContent);
    }
    group.setAttribute('data-lang', current);
  }

  function notify() {
    listeners.forEach(function (cb) {
      try {
        cb(current);
      } catch (e) {
        // isolate listener errors
      }
    });
  }

  function activate(lang, persist) {
    current = lang;
    ready = true;
    setDirection(lang);
    apply(document);
    updateToggle();
    if (persist) {
      setStored(lang);
    }
    notify();
    pendingCallbacks.splice(0).forEach(function (cb) {
      try {
        cb(lang);
      } catch (e) {
        // isolate callback errors
      }
    });
  }

  function load(lang) {
    return fetch('i18n/' + lang + '.json', { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) {
        throw new Error('HTTP ' + res.status);
      }
      return res.json();
    });
  }

  function switchTo(lang, persist) {
    if (SUPPORTED.indexOf(lang) === -1) {
      lang = DEFAULT_LANG;
    }
    return load(lang).then(function (json) {
      translations = json;
      activate(lang, persist);
    });
  }

  function init() {
    var stored = getStored();
    var lang = SUPPORTED.indexOf(stored) !== -1 ? stored : DEFAULT_LANG;

    load(lang)
      .catch(function () {
        if (lang !== DEFAULT_LANG) {
          return load(DEFAULT_LANG);
        }
        throw new Error('i18n data unavailable');
      })
      .then(function (json) {
        translations = json;
        activate(lang, false);
      })
      .catch(function (err) {
        try {
          if (window.console && console.warn) {
            console.warn(
              '[i18n] Translation files could not be loaded. Serve the site over HTTP (for example a local web server) to enable language switching.',
              err && err.message
            );
          }
        } catch (e) {
          // ignore
        }
      });

    var group = document.getElementById('langSwitch');
    if (group) {
      group.addEventListener('click', function (e) {
        var target = e.target;
        var btn = target && target.closest ? target.closest('.lang-switch__opt') : null;
        if (!btn || !group.contains(btn)) {
          return;
        }
        var next = btn.getAttribute('data-lang');
        if (!next || next === current) {
          return;
        }
        switchTo(next, true).catch(function () {
          switchTo(DEFAULT_LANG, true).catch(function () {
            // ignore
          });
        });
      });
    }
  }

  window.IronZoneI18n = {
    t: t,
    list: list,
    apply: apply,
    getLang: function () {
      return current;
    },
    isReady: function () {
      return ready;
    },
    onChange: function (cb) {
      if (typeof cb === 'function') {
        listeners.push(cb);
        if (ready) {
          try {
            cb(current);
          } catch (e) {
            // isolate listener errors
          }
        }
      }
    },
    whenReady: function (cb) {
      if (typeof cb !== 'function') {
        return;
      }
      if (ready) {
        cb(current);
      } else {
        pendingCallbacks.push(cb);
      }
    },
    set: function (lang) {
      return switchTo(lang, true);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
