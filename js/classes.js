(function () {
  'use strict';

  var classes = [
    { key: 'strengthBasics', name: 'Strength Basics', type: 'strength', level: 'beginner', day: 'monday', duration: 60, schedule: 'Mon 6:00 PM', image: 'assets/images/class-strength.jpg' },
    { key: 'hiitBlast', name: 'HIIT Blast', type: 'hiit', level: 'advanced', day: 'tuesday', duration: 45, schedule: 'Tue 7:00 AM', image: 'assets/images/class-hiit.jpg' },
    { key: 'yogaFlow', name: 'Yoga Flow', type: 'yoga', level: 'beginner', day: 'wednesday', duration: 60, schedule: 'Wed 8:00 AM', image: 'assets/images/class-yoga.jpg' },
    { key: 'powerlifting', name: 'Powerlifting', type: 'strength', level: 'advanced', day: 'thursday', duration: 75, schedule: 'Thu 6:30 PM', image: 'assets/images/class-strength.jpg' },
    { key: 'cardioKick', name: 'Cardio Kick', type: 'cardio', level: 'intermediate', day: 'friday', duration: 45, schedule: 'Fri 5:30 PM', image: 'assets/images/class-cardio.jpg' },
    { key: 'functionalCircuit', name: 'Functional Circuit', type: 'functional', level: 'intermediate', day: 'saturday', duration: 50, schedule: 'Sat 9:00 AM', image: 'assets/images/class-functional.jpg' },
    { key: 'mobility', name: 'Mobility', type: 'yoga', level: 'beginner', day: 'saturday', duration: 40, schedule: 'Sat 11:00 AM', image: 'assets/images/class-yoga.jpg' }
  ];

  var listEl, typeSelect, daySelect, levelSelect, resetBtn, emptyEl;

  function cap(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

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

  function render(filtered) {
    if (!listEl) return;
    listEl.innerHTML = '';
    if (filtered.length === 0) {
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    filtered.forEach(function (c) {
      var name = tr('classesData.' + c.key + '.name', c.name);
      var typeLabel = tr('classesPage.type' + cap(c.type), cap(c.type));
      var levelLabel = tr('classesPage.level' + cap(c.level), cap(c.level));
      var durationText = tr('classesPage.duration', '{n} min').replace('{n}', c.duration);
      var scheduleText = tr('classesData.' + c.key + '.schedule', c.schedule);
      var scheduleLine = tr('classesPage.sampleSchedule', 'Sample schedule: {schedule}').replace('{schedule}', scheduleText);
      var altSuffix = tr('classesPage.altSuffix', 'class');

      var row = document.createElement('article');
      row.className = 'card';
      var img = document.createElement('img');
      img.src = c.image;
      img.alt = name + ' ' + altSuffix;
      img.className = 'card__media';
      img.width = 600;
      img.height = 450;
      img.loading = 'lazy';
      var h3 = document.createElement('h3');
      h3.className = 'card__title';
      h3.textContent = name;
      var meta = document.createElement('p');
      meta.className = 'text--muted';
      meta.textContent = typeLabel + ' | ' + levelLabel + ' | ' + durationText;
      var sched = document.createElement('p');
      sched.className = 'text--muted';
      sched.textContent = scheduleLine;
      row.appendChild(img);
      row.appendChild(h3);
      row.appendChild(meta);
      row.appendChild(sched);
      listEl.appendChild(row);
    });
  }

  function applyFilters() {
    var type = typeSelect && typeSelect.value ? typeSelect.value : '';
    var day = daySelect && daySelect.value ? daySelect.value : '';
    var level = levelSelect && levelSelect.value ? levelSelect.value : '';
    var filtered = classes.filter(function (c) {
      var matchesType = type === '' || c.type === type;
      var matchesDay = day === '' || c.day === day;
      var matchesLevel = level === '' || c.level === level;
      return matchesType && matchesDay && matchesLevel;
    });
    render(filtered);
  }

  function reset() {
    if (typeSelect) typeSelect.value = '';
    if (daySelect) daySelect.value = '';
    if (levelSelect) levelSelect.value = '';
    render(classes);
  }

  function init() {
    listEl = document.getElementById('classList');
    if (!listEl) return;
    typeSelect = document.getElementById('classType');
    daySelect = document.getElementById('classDay');
    levelSelect = document.getElementById('classLevel');
    resetBtn = document.getElementById('classReset');
    emptyEl = document.getElementById('classEmpty');
    if (typeSelect) typeSelect.addEventListener('change', applyFilters);
    if (daySelect) daySelect.addEventListener('change', applyFilters);
    if (levelSelect) levelSelect.addEventListener('change', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', reset);
    render(classes);
    if (window.IronZoneI18n && typeof window.IronZoneI18n.onChange === 'function') {
      window.IronZoneI18n.onChange(function () {
        applyFilters();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
