(function () {
  'use strict';

  var STORAGE_KEY = 'ironzone:workoutLog';
  var SVG_NS = 'http://www.w3.org/2000/svg';

  var formEl, listEl, chartEl, emptyEl, statsEl, exerciseSelect, noticeEl;

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

  function readEntries() {
    var raw = window.IronZoneStorage ? window.IronZoneStorage.get(STORAGE_KEY) : null;
    if (!raw) {
      return [];
    }
    try {
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter(function (item) {
        return item && typeof item.exercise === 'string' && typeof item.weight === 'number';
      });
    } catch (e) {
      return [];
    }
  }

  function writeEntries(entries) {
    if (!window.IronZoneStorage) {
      return false;
    }
    return window.IronZoneStorage.set(STORAGE_KEY, JSON.stringify(entries));
  }

  function formatDate(iso) {
    var parts = String(iso).split('-');
    if (parts.length !== 3) {
      return iso;
    }
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (isNaN(d.getTime())) {
      return iso;
    }
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function renderStats(entries) {
    if (!statsEl) return;
    statsEl.innerHTML = '';

    var best = 0;
    var volume = 0;
    var sessions = entries.length;

    entries.forEach(function (e) {
      if (e.weight > best) best = e.weight;
      volume += e.weight * (e.reps || 0) * (e.sets || 1);
    });

    var stats = [
      { value: String(sessions), label: tr('workoutPage.statSessions', 'Sessions logged') },
      { value: best ? best + ' kg' : '-', label: tr('workoutPage.statBest', 'Best lift') },
      { value: volume ? Math.round(volume) + ' kg' : '-', label: tr('workoutPage.statVolume', 'Total volume') }
    ];

    stats.forEach(function (s) {
      var box = document.createElement('div');
      box.className = 'workout__stat';
      var val = document.createElement('span');
      val.className = 'workout__stat-value';
      val.textContent = s.value;
      var lab = document.createElement('span');
      lab.className = 'workout__stat-label';
      lab.textContent = s.label;
      box.appendChild(val);
      box.appendChild(lab);
      statsEl.appendChild(box);
    });
  }

  function renderChart(entries) {
    if (!chartEl) return;
    chartEl.innerHTML = '';

    var series = entries
      .filter(function (e) {
        return e.exercise === (exerciseSelect ? exerciseSelect.value : '');
      })
      .slice()
      .sort(function (a, b) {
        return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      });

    if (series.length < 2) {
      var note = document.createElement('p');
      note.className = 'text--muted';
      note.textContent = tr('workoutPage.chartNeedsTwo', 'Log at least two sessions of the same exercise to see a progress trend.');
      chartEl.appendChild(note);
      return;
    }

    var w = 640;
    var h = 240;
    var padX = 44;
    var padY = 24;

    var weights = series.map(function (e) { return e.weight; });
    var min = Math.min.apply(null, weights);
    var max = Math.max.apply(null, weights);
    if (min === max) {
      min = min - 5;
      max = max + 5;
    }
    var range = max - min;

    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', tr('workoutPage.chartLabel', 'Weight progress over time for the selected exercise'));

    var plotW = w - padX * 2;
    var plotH = h - padY * 2;

    for (var g = 0; g <= 4; g++) {
      var y = padY + (plotH / 4) * g;
      var line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', padX);
      line.setAttribute('x2', w - padX);
      line.setAttribute('y1', y);
      line.setAttribute('y2', y);
      line.setAttribute('class', 'workout__chart-grid');
      svg.appendChild(line);

      var valLabel = document.createElementNS(SVG_NS, 'text');
      valLabel.setAttribute('x', padX - 8);
      valLabel.setAttribute('y', y + 4);
      valLabel.setAttribute('text-anchor', 'end');
      valLabel.setAttribute('class', 'workout__chart-label');
      valLabel.textContent = String(Math.round(max - (range / 4) * g));
      svg.appendChild(valLabel);
    }

    var points = series.map(function (e, i) {
      var x = padX + (series.length === 1 ? plotW / 2 : (plotW / (series.length - 1)) * i);
      var y = padY + plotH - ((e.weight - min) / range) * plotH;
      return { x: x, y: y, entry: e };
    });

    var areaD = 'M' + points[0].x + ' ' + (padY + plotH);
    var lineD = '';
    points.forEach(function (p, i) {
      lineD += (i === 0 ? 'M' : ' L') + p.x + ' ' + p.y;
      areaD += ' L' + p.x + ' ' + p.y;
    });
    areaD += ' L' + points[points.length - 1].x + ' ' + (padY + plotH) + ' Z';

    var area = document.createElementNS(SVG_NS, 'path');
    area.setAttribute('d', areaD);
    area.setAttribute('class', 'workout__chart-area');
    svg.appendChild(area);

    var path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', lineD);
    path.setAttribute('class', 'workout__chart-line');
    svg.appendChild(path);

    points.forEach(function (p) {
      var dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('cx', p.x);
      dot.setAttribute('cy', p.y);
      dot.setAttribute('r', 5);
      dot.setAttribute('class', 'workout__chart-dot');
      svg.appendChild(dot);

      var title = document.createElementNS(SVG_NS, 'title');
      title.textContent = formatDate(p.entry.date) + ': ' + p.entry.weight + ' kg';
      dot.appendChild(title);
    });

    points.forEach(function (p, i) {
      if (points.length > 8 && i % 2 !== 0) {
        return;
      }
      var lab = document.createElementNS(SVG_NS, 'text');
      lab.setAttribute('x', p.x);
      lab.setAttribute('y', h - 6);
      lab.setAttribute('text-anchor', 'middle');
      lab.setAttribute('class', 'workout__chart-label');
      lab.textContent = formatDate(p.entry.date);
      svg.appendChild(lab);
    });

    chartEl.appendChild(svg);
  }

  function renderExerciseOptions(entries) {
    if (!exerciseSelect) return;
    var current = exerciseSelect.value;
    var names = [];
    entries.forEach(function (e) {
      if (names.indexOf(e.exercise) === -1) {
        names.push(e.exercise);
      }
    });
    names.sort();

    exerciseSelect.innerHTML = '';
    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = tr('workoutPage.chooseExercise', 'Choose an exercise');
    exerciseSelect.appendChild(placeholder);

    names.forEach(function (name) {
      var opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      exerciseSelect.appendChild(opt);
    });

    if (names.indexOf(current) !== -1) {
      exerciseSelect.value = current;
    } else if (names.length) {
      exerciseSelect.value = names[0];
    }
  }

  function renderList(entries) {
    if (!listEl) return;
    listEl.innerHTML = '';

    if (!entries.length) {
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;

    entries.slice().reverse().forEach(function (e, idx) {
      var originalIndex = entries.length - 1 - idx;
      var li = document.createElement('li');
      li.className = 'workout__entry';

      var info = document.createElement('div');
      var name = document.createElement('div');
      name.className = 'workout__entry-name';
      name.textContent = e.exercise;
      var meta = document.createElement('div');
      meta.className = 'workout__entry-meta';
      meta.textContent = formatDate(e.date) + ' - ' + e.weight + ' kg x ' + (e.reps || 0) + ' reps x ' + (e.sets || 1) + ' sets';
      info.appendChild(name);
      info.appendChild(meta);

      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'workout__entry-remove';
      remove.textContent = tr('workoutPage.remove', 'Remove');
      remove.setAttribute('data-index', String(originalIndex));
      remove.setAttribute('aria-label', tr('workoutPage.removeEntry', 'Remove entry for {exercise}', { exercise: e.exercise }));

      li.appendChild(info);
      li.appendChild(remove);
      listEl.appendChild(li);
    });
  }

  function renderAll() {
    var entries = readEntries();
    renderStats(entries);
    renderExerciseOptions(entries);
    renderList(entries);
    renderChart(entries);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formEl) return;

    var data = new FormData(formEl);
    var exercise = String(data.get('exercise') || '').trim();
    var date = String(data.get('date') || '').trim();
    var weight = Number(data.get('weight'));
    var reps = Number(data.get('reps'));
    var sets = Number(data.get('sets'));

    var errorEl = formEl.querySelector('.form__error');
    if (!exercise || !date || !weight || weight <= 0 || !reps || reps <= 0 || !sets || sets <= 0) {
      if (errorEl) {
        errorEl.textContent = tr('workoutPage.formError', 'Please complete every field with valid values.');
      }
      return;
    }
    if (errorEl) {
      errorEl.textContent = '';
    }

    var entries = readEntries();
    entries.push({
      exercise: exercise,
      date: date,
      weight: weight,
      reps: reps,
      sets: sets
    });

    var saved = writeEntries(entries);
    if (!saved && noticeEl) {
      noticeEl.textContent = tr('workoutPage.storageUnavailable', 'Browser storage is unavailable, so this session will not be saved.');
      noticeEl.hidden = false;
    } else if (noticeEl) {
      noticeEl.hidden = true;
    }

    formEl.reset();
    renderAll();
  }

  function handleRemove(e) {
    var btn = e.target.closest ? e.target.closest('.workout__entry-remove') : null;
    if (!btn) return;
    var index = Number(btn.getAttribute('data-index'));
    if (isNaN(index)) return;
    var entries = readEntries();
    entries.splice(index, 1);
    writeEntries(entries);
    renderAll();
  }

  function init() {
    formEl = document.getElementById('workoutForm');
    listEl = document.getElementById('workoutList');
    chartEl = document.getElementById('workoutChart');
    emptyEl = document.getElementById('workoutEmpty');
    statsEl = document.getElementById('workoutStats');
    exerciseSelect = document.getElementById('workoutExerciseFilter');
    noticeEl = document.getElementById('workoutNotice');

    if (!formEl) return;

    formEl.addEventListener('submit', handleSubmit);
    if (listEl) listEl.addEventListener('click', handleRemove);
    if (exerciseSelect) {
      exerciseSelect.addEventListener('change', function () {
        renderChart(readEntries());
      });
    }

    var dateField = formEl.querySelector('input[name="date"]');
    if (dateField && !dateField.value) {
      var today = new Date();
      var iso = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
      dateField.value = iso;
    }

    renderAll();

    if (window.IronZoneI18n && typeof window.IronZoneI18n.onChange === 'function') {
      window.IronZoneI18n.onChange(renderAll);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
