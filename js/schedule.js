(function () {
  'use strict';

  var STORAGE_KEY = 'ironzone:classRequests';

  var DAYS = [
    { key: 'monday', labelKey: 'classesPage.monday' },
    { key: 'tuesday', labelKey: 'classesPage.tuesday' },
    { key: 'wednesday', labelKey: 'classesPage.wednesday' },
    { key: 'thursday', labelKey: 'classesPage.thursday' },
    { key: 'friday', labelKey: 'classesPage.friday' },
    { key: 'saturday', labelKey: 'classesPage.saturday' }
  ];

  var SESSIONS = [
    { id: 'mon-strength', day: 'monday', time: '6:00 PM', classKey: 'strengthBasics', trainer: 'Alex Johnson', capacity: 16, booked: 9 },
    { id: 'mon-mobility', day: 'monday', time: '7:30 PM', classKey: 'mobility', trainer: 'Nina Patel', capacity: 12, booked: 11 },
    { id: 'tue-hiit', day: 'tuesday', time: '7:00 AM', classKey: 'hiitBlast', trainer: 'Sarah Chen', capacity: 14, booked: 14 },
    { id: 'tue-cardio', day: 'tuesday', time: '6:00 PM', classKey: 'cardioKick', trainer: 'Emma Blake', capacity: 20, booked: 12 },
    { id: 'wed-yoga', day: 'wednesday', time: '8:00 AM', classKey: 'yogaFlow', trainer: 'Nina Patel', capacity: 14, booked: 6 },
    { id: 'wed-functional', day: 'wednesday', time: '6:30 PM', classKey: 'functionalCircuit', trainer: 'Tom Rivera', capacity: 16, booked: 8 },
    { id: 'thu-powerlifting', day: 'thursday', time: '6:30 PM', classKey: 'powerlifting', trainer: 'Mike Davis', capacity: 10, booked: 7 },
    { id: 'fri-cardio', day: 'friday', time: '5:30 PM', classKey: 'cardioKick', trainer: 'Emma Blake', capacity: 20, booked: 15 },
    { id: 'fri-strength', day: 'friday', time: '7:00 PM', classKey: 'strengthBasics', trainer: 'Alex Johnson', capacity: 16, booked: 4 },
    { id: 'sat-functional', day: 'saturday', time: '9:00 AM', classKey: 'functionalCircuit', trainer: 'Tom Rivera', capacity: 16, booked: 13 },
    { id: 'sat-mobility', day: 'saturday', time: '11:00 AM', classKey: 'mobility', trainer: 'Nina Patel', capacity: 12, booked: 5 }
  ];

  var tabsEl, panelsEl, requestStore = {};

  function tr(key, fallback, vars) {
    var i18n = window.IronZoneI18n;
    if (i18n && typeof i18n.t === 'function') {
      var val = i18n.t(key, vars);
      if (typeof val === 'string') {
        return val;
      }
    }
    if (typeof fallback === 'string' && vars) {
      return fallback.replace(/\{(\w+)\}/g, function (m, name) {
        return vars[name] !== undefined ? String(vars[name]) : m;
      });
    }
    return fallback;
  }

  function readRequests() {
    var raw = window.IronZoneStorage ? window.IronZoneStorage.get(STORAGE_KEY) : null;
    if (!raw) return {};
    try {
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
      return parsed;
    } catch (e) {
      return {};
    }
  }

  function writeRequests(obj) {
    if (!window.IronZoneStorage) return false;
    return window.IronZoneStorage.set(STORAGE_KEY, JSON.stringify(obj));
  }

  function capacityState(session) {
    if (session.booked >= session.capacity) return 'is-full';
    if (session.booked / session.capacity >= 0.75) return 'is-low';
    return '';
  }

  function buildSession(session) {
    var name = tr('classesData.' + session.classKey + '.name', '');

    var wrap = document.createElement('article');
    wrap.className = 'schedule__session';

    var info = document.createElement('div');
    var heading = document.createElement('p');
    heading.className = 'schedule__name';
    var time = document.createElement('span');
    time.className = 'schedule__time';
    time.textContent = session.time + ' - ';
    var nameEl = document.createElement('span');
    nameEl.textContent = name;
    heading.appendChild(time);
    heading.appendChild(nameEl);

    var meta = document.createElement('p');
    meta.className = 'schedule__meta';
    meta.textContent = tr('schedule.withTrainer', 'With {trainer}', { trainer: session.trainer });

    info.appendChild(heading);
    info.appendChild(meta);

    var cap = document.createElement('div');
    cap.className = 'schedule__capacity';
    var bar = document.createElement('div');
    bar.className = 'schedule__capacity-bar';
    var fill = document.createElement('span');
    fill.className = 'schedule__capacity-fill ' + capacityState(session).trim();
    fill.style.width = Math.min(100, Math.round((session.booked / session.capacity) * 100)) + '%';
    bar.appendChild(fill);
    var capText = document.createElement('span');
    capText.className = 'schedule__capacity-text';
    capText.textContent = tr('schedule.capacity', '{booked} of {capacity} spots taken', { booked: session.booked, capacity: session.capacity });
    cap.appendChild(bar);
    cap.appendChild(capText);

    var isRequested = !!requestStore[session.id];
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn--ghost schedule__request' + (isRequested ? ' is-requested' : '');
    btn.setAttribute('data-session', session.id);
    btn.setAttribute('aria-pressed', isRequested ? 'true' : 'false');
    btn.textContent = isRequested
      ? tr('schedule.requested', 'Spot Requested')
      : tr('schedule.request', 'Request a Spot');
    if (session.booked >= session.capacity && !isRequested) {
      btn.disabled = true;
      btn.textContent = tr('schedule.full', 'Session Full');
    }

    wrap.appendChild(info);
    wrap.appendChild(cap);
    wrap.appendChild(btn);
    return wrap;
  }

  function renderPanels() {
    if (!panelsEl) return;
    panelsEl.innerHTML = '';

    DAYS.forEach(function (day, index) {
      var panel = document.createElement('div');
      panel.className = 'tabpanel';
      panel.id = 'schedule-panel-' + day.key;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', 'schedule-tab-' + day.key);
      panel.tabIndex = 0;
      panel.hidden = index !== 0;

      var sessions = SESSIONS.filter(function (s) {
        return s.day === day.key;
      });

      if (!sessions.length) {
        var none = document.createElement('p');
        none.className = 'text--muted';
        none.textContent = tr('schedule.noSessions', 'No sessions scheduled for this day.');
        panel.appendChild(none);
      } else {
        sessions.forEach(function (s) {
          panel.appendChild(buildSession(s));
        });
      }

      panelsEl.appendChild(panel);
    });
  }

  function buildTabs() {
    if (!tabsEl) return;
    tabsEl.innerHTML = '';
    DAYS.forEach(function (day, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab' + (index === 0 ? ' is-active' : '');
      btn.id = 'schedule-tab-' + day.key;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-controls', 'schedule-panel-' + day.key);
      btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      btn.tabIndex = index === 0 ? 0 : -1;
      btn.textContent = tr(day.labelKey, day.key);
      tabsEl.appendChild(btn);
    });
  }

  function activateTab(index) {
    if (!tabsEl || !panelsEl) return;
    var tabs = tabsEl.querySelectorAll('[role="tab"]');
    var panels = panelsEl.querySelectorAll('[role="tabpanel"]');

    tabs.forEach(function (tab, i) {
      var isActive = i === index;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.tabIndex = isActive ? 0 : -1;
    });
    panels.forEach(function (panel, i) {
      panel.hidden = i !== index;
    });
  }

  function onTabClick(e) {
    var btn = e.target.closest ? e.target.closest('[role="tab"]') : null;
    if (!btn) return;
    var tabs = Array.prototype.slice.call(tabsEl.querySelectorAll('[role="tab"]'));
    activateTab(tabs.indexOf(btn));
  }

  function onTabKeydown(e) {
    var btn = e.target.closest ? e.target.closest('[role="tab"]') : null;
    if (!btn) return;
    var tabs = Array.prototype.slice.call(tabsEl.querySelectorAll('[role="tab"]'));
    var index = tabs.indexOf(btn);
    var next = null;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      next = 0;
    } else if (e.key === 'End') {
      next = tabs.length - 1;
    }

    if (next !== null) {
      e.preventDefault();
      activateTab(next);
      tabs[next].focus();
    }
  }

  function onRequestClick(e) {
    var btn = e.target.closest ? e.target.closest('.schedule__request') : null;
    if (!btn || btn.disabled) return;

    var id = btn.getAttribute('data-session');
    if (!id) return;

    if (requestStore[id]) {
      delete requestStore[id];
    } else {
      requestStore[id] = true;
    }
    writeRequests(requestStore);
    renderPanels();
    activateTab(currentIndex());
  }

  function currentIndex() {
    if (!tabsEl) return 0;
    var active = tabsEl.querySelector('[role="tab"][aria-selected="true"]');
    var tabs = Array.prototype.slice.call(tabsEl.querySelectorAll('[role="tab"]'));
    return Math.max(0, tabs.indexOf(active));
  }

  function init() {
    tabsEl = document.getElementById('scheduleTabs');
    panelsEl = document.getElementById('schedulePanels');
    if (!tabsEl || !panelsEl) return;

    requestStore = readRequests();

    buildTabs();
    renderPanels();

    tabsEl.addEventListener('click', onTabClick);
    tabsEl.addEventListener('keydown', onTabKeydown);
    panelsEl.addEventListener('click', onRequestClick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
