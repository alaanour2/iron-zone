(function () {
  'use strict';

  var trainers = window.IronZoneTrainers || [];
  var mount = document.getElementById('trainerProfile');
  var notFound = document.getElementById('trainerNotFound');
  if (!mount) {
    return;
  }

  var activeTab = 'about';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function tr(key, fallback) {
    var i18n = window.IronZoneI18n;
    if (i18n && typeof i18n.t === 'function') {
      var val = i18n.t(key);
      if (typeof val === 'string') {
        return val;
      }
    }
    return fallback;
  }

  function tlist(key) {
    var i18n = window.IronZoneI18n;
    if (i18n && typeof i18n.list === 'function') {
      var val = i18n.list(key);
      if (val) {
        return val;
      }
    }
    return [];
  }

  function getLang() {
    var i18n = window.IronZoneI18n;
    if (i18n && typeof i18n.getLang === 'function') {
      return i18n.getLang();
    }
    return 'en';
  }

  function cap(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text != null) {
      node.textContent = text;
    }
    return node;
  }

  function getTrainerId() {
    var params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (e) {
      return null;
    }
    return params.get('id') || params.get('trainer');
  }

  function findTrainer(id) {
    for (var i = 0; i < trainers.length; i++) {
      if (trainers[i].key === id) {
        return trainers[i];
      }
    }
    return null;
  }

  function nameOf(t) {
    return tr('trainersData.' + t.key + '.name', t.name);
  }

  function specialtyOf(t) {
    return tr('trainersPage.spec' + cap(t.specialty), cap(t.specialty));
  }

  function languageNames(t) {
    var map = {
      ar: tr('trainerPage.langAr', 'Arabic'),
      en: tr('trainerPage.langEn', 'English')
    };
    var separator = getLang() === 'ar' ? '، ' : ', ';
    return (t.languages || [])
      .map(function (code) {
        return map[code] || code;
      })
      .join(separator);
  }

  function buildStat(valueText, label, countValue) {
    var li = el('li', 'profile__stat');
    var value;
    if (countValue != null) {
      value = el('span', 'profile__stat-value', reduceMotion ? String(countValue) : '0');
      value.setAttribute('data-count', String(countValue));
    } else {
      value = el('span', 'profile__stat-value profile__stat-value--text', valueText);
    }
    li.appendChild(value);
    li.appendChild(el('span', 'profile__stat-label', label));
    return li;
  }

  function buildHero(t) {
    var hero = el('article', 'profile__hero');

    var media = el('div', 'profile__media');
    var img = document.createElement('img');
    img.className = 'profile__photo';
    img.src = t.image;
    img.alt = nameOf(t) + ', ' + specialtyOf(t) + ' ' + tr('trainersPage.altSuffix', 'coach');
    img.width = 600;
    img.height = 450;
    media.appendChild(img);
    hero.appendChild(media);

    var intro = el('div', 'profile__intro');
    intro.appendChild(el('p', 'section__eyebrow', tr('trainerPage.heroEyebrow', 'Personal Trainer')));
    intro.appendChild(el('h1', 'profile__name', nameOf(t)));
    intro.appendChild(el('p', 'profile__specialty', specialtyOf(t)));

    var stats = el('ul', 'profile__stats');
    stats.appendChild(buildStat(null, tr('trainerPage.yearsLabel', 'Years of experience'), t.years));
    stats.appendChild(buildStat(null, tr('trainerPage.ageLabel', 'Age'), t.age));
    stats.appendChild(buildStat(languageNames(t), tr('trainerPage.languagesLabel', 'Languages'), null));
    intro.appendChild(stats);

    var actions = el('div', 'profile__actions');
    var join = el('a', 'btn', tr('trainerPage.joinCta', 'Join Now'));
    join.href = 'join.html';
    var book = el('a', 'btn btn--ghost', tr('trainerPage.bookCta', 'Book a session'));
    book.href = 'contact.html';
    actions.appendChild(join);
    actions.appendChild(book);
    intro.appendChild(actions);

    hero.appendChild(intro);
    return hero;
  }

  function buildPanelContent(id, panel, t) {
    if (id === 'about') {
      panel.appendChild(el('p', 'profile__bio', tr('profiles.' + t.key + '.bio', tr('trainersData.' + t.key + '.bio', ''))));
      var focus = tlist('profiles.' + t.key + '.focus');
      if (focus.length) {
        panel.appendChild(el('h2', 'profile__subhead', tr('trainerPage.focusTitle', 'Focus areas')));
        var chips = el('ul', 'chips');
        focus.forEach(function (item) {
          chips.appendChild(el('li', 'chip', item));
        });
        panel.appendChild(chips);
      }
      return;
    }

    if (id === 'experience') {
      panel.appendChild(el('h2', 'profile__subhead', tr('trainerPage.experienceTitle', 'Coaching experience')));
      var jobs = tlist('profiles.' + t.key + '.experience');
      var timeline = el('ol', 'timeline');
      jobs.forEach(function (job) {
        var item = el('li', 'timeline__item');
        item.appendChild(el('span', 'timeline__marker'));
        var body = el('div', 'timeline__body');
        if (job && typeof job === 'object') {
          body.appendChild(el('h3', 'timeline__role', job.role || ''));
          body.appendChild(el('p', 'timeline__place', job.place || ''));
          if (job.period) {
            body.appendChild(el('span', 'timeline__period', job.period));
          }
        } else {
          body.appendChild(el('p', 'timeline__place', String(job)));
        }
        item.appendChild(body);
        timeline.appendChild(item);
      });
      panel.appendChild(timeline);
      return;
    }

    if (id === 'portfolio') {
      panel.appendChild(el('h2', 'profile__subhead', tr('trainerPage.achievementsHeading', 'Achievements')));
      var achievements = el('ul', 'checklist');
      tlist('profiles.' + t.key + '.achievements').forEach(function (item) {
        achievements.appendChild(el('li', 'checklist__item', item));
      });
      panel.appendChild(achievements);

      panel.appendChild(el('h2', 'profile__subhead', tr('trainerPage.certificationsHeading', 'Certifications')));
      var certs = el('ul', 'checklist');
      tlist('profiles.' + t.key + '.certifications').forEach(function (item) {
        certs.appendChild(el('li', 'checklist__item', item));
      });
      panel.appendChild(certs);
      return;
    }

    if (id === 'locations') {
      panel.appendChild(el('h2', 'profile__subhead', tr('trainerPage.locationsTitle', "Where I've trained people")));
      var locations = el('ul', 'location-list');
      tlist('profiles.' + t.key + '.locations').forEach(function (item) {
        var li = el('li', 'location-list__item');
        li.appendChild(el('span', 'location-list__pin'));
        li.appendChild(el('span', 'location-list__name', item));
        locations.appendChild(li);
      });
      panel.appendChild(locations);
    }
  }

  function setTab(id, moveFocus) {
    activeTab = id;
    if (!mount) {
      return;
    }
    mount.querySelectorAll('.tablist [role="tab"]').forEach(function (btn) {
      var selected = btn.getAttribute('aria-controls') === 'panel-' + id;
      btn.setAttribute('aria-selected', selected ? 'true' : 'false');
      btn.tabIndex = selected ? 0 : -1;
      btn.classList.toggle('is-active', selected);
      if (selected && moveFocus) {
        btn.focus();
      }
    });
    mount.querySelectorAll('[role="tabpanel"]').forEach(function (panel) {
      panel.hidden = panel.id !== 'panel-' + id;
    });
  }

  function onTabKey(event) {
    var tabs = Array.prototype.slice.call(mount.querySelectorAll('.tablist [role="tab"]'));
    var index = tabs.indexOf(event.currentTarget);
    if (index === -1) {
      return;
    }
    var rtl = document.documentElement.getAttribute('dir') === 'rtl';
    var nextKey = rtl ? 'ArrowLeft' : 'ArrowRight';
    var prevKey = rtl ? 'ArrowRight' : 'ArrowLeft';
    var target = null;
    if (event.key === nextKey) {
      target = (index + 1) % tabs.length;
    } else if (event.key === prevKey) {
      target = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      target = 0;
    } else if (event.key === 'End') {
      target = tabs.length - 1;
    }
    if (target !== null) {
      event.preventDefault();
      tabs[target].focus();
      tabs[target].click();
    }
  }

  function buildTabs(t) {
    var wrap = el('div', 'tabs');
    var tablist = el('div', 'tablist');
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-label', tr('trainerPage.tablistLabel', 'Trainer profile sections'));

    var definitions = [
      { id: 'about', label: tr('trainerPage.aboutTab', 'About') },
      { id: 'experience', label: tr('trainerPage.experienceTab', 'Experience') },
      { id: 'portfolio', label: tr('trainerPage.portfolioTab', 'Portfolio') },
      { id: 'locations', label: tr('trainerPage.locationsTab', 'Locations') }
    ];

    definitions.forEach(function (def) {
      var btn = el('button', 'tab', def.label);
      btn.type = 'button';
      btn.id = 'tab-' + def.id;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-controls', 'panel-' + def.id);
      var selected = def.id === activeTab;
      btn.setAttribute('aria-selected', selected ? 'true' : 'false');
      btn.tabIndex = selected ? 0 : -1;
      if (selected) {
        btn.classList.add('is-active');
      }
      btn.addEventListener('click', function () {
        setTab(def.id, false);
      });
      btn.addEventListener('keydown', onTabKey);
      tablist.appendChild(btn);
    });
    wrap.appendChild(tablist);

    var panels = el('div', 'tabpanels');
    definitions.forEach(function (def) {
      var panel = el('div', 'tabpanel');
      panel.id = 'panel-' + def.id;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', 'tab-' + def.id);
      panel.tabIndex = 0;
      panel.hidden = def.id !== activeTab;
      buildPanelContent(def.id, panel, t);
      panels.appendChild(panel);
    });
    wrap.appendChild(panels);
    return wrap;
  }

  function buildPager(t) {
    if (trainers.length < 2) {
      return null;
    }
    var index = trainers.indexOf(t);
    var prev = trainers[(index - 1 + trainers.length) % trainers.length];
    var next = trainers[(index + 1) % trainers.length];

    var pager = el('nav', 'profile__pager');

    var prevLink = el('a', 'pager__link pager__link--prev');
    prevLink.href = 'trainer.html?id=' + encodeURIComponent(prev.key);
    prevLink.appendChild(el('span', 'pager__label', tr('trainerPage.prev', 'Previous trainer')));
    prevLink.appendChild(el('span', 'pager__name', nameOf(prev)));

    var nextLink = el('a', 'pager__link pager__link--next');
    nextLink.href = 'trainer.html?id=' + encodeURIComponent(next.key);
    nextLink.appendChild(el('span', 'pager__label', tr('trainerPage.next', 'Next trainer')));
    nextLink.appendChild(el('span', 'pager__name', nameOf(next)));

    pager.appendChild(prevLink);
    pager.appendChild(nextLink);
    return pager;
  }

  function animateStats() {
    var values = mount.querySelectorAll('[data-count]');
    values.forEach(function (node) {
      var target = parseInt(node.getAttribute('data-count'), 10) || 0;
      if (reduceMotion) {
        node.textContent = String(target);
        return;
      }
      var start = null;
      var duration = 900;
      var step = function (timestamp) {
        if (start === null) {
          start = timestamp;
        }
        var progress = Math.min((timestamp - start) / duration, 1);
        node.textContent = String(Math.round(target * progress));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          node.textContent = String(target);
        }
      };
      window.requestAnimationFrame(step);
    });
  }

  function render() {
    var t = findTrainer(getTrainerId());
    mount.innerHTML = '';

    if (!t) {
      mount.hidden = true;
      if (notFound) {
        notFound.hidden = false;
      }
      document.title = 'IRON ZONE - Trainer';
      return;
    }

    mount.hidden = false;
    if (notFound) {
      notFound.hidden = true;
    }
    mount.appendChild(buildHero(t));
    mount.appendChild(buildTabs(t));
    var pager = buildPager(t);
    if (pager) {
      mount.appendChild(pager);
    }

    document.title = nameOf(t) + ' | IRON ZONE';
    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', nameOf(t) + ' – ' + specialtyOf(t) + ' | IRON ZONE');
    }
    animateStats();
  }

  function init() {
    if (window.IronZoneI18n && typeof window.IronZoneI18n.onChange === 'function') {
      window.IronZoneI18n.onChange(function () {
        render();
      });
    }
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
