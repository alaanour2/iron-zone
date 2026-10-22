(function () {
  'use strict';

  var trainers = window.IronZoneTrainers || [];

  var listEl, searchInput, filterSelect, emptyEl, clearBtn, marqueeEl;

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

  function buildCard(t) {
    var name = tr('trainersData.' + t.key + '.name', t.name);
    var specialtyLabel = tr('trainersPage.spec' + cap(t.specialty), cap(t.specialty));
    var yearsText = tr('trainersPage.years', '{n} years').replace('{n}', t.years);
    var bio = tr('trainersData.' + t.key + '.bio', t.bio || '');
    var altSuffix = tr('trainersPage.altSuffix', 'coach');
    var viewProfile = tr('trainerPage.viewProfile', 'View profile');

    var card = document.createElement('article');
    card.className = 'card card--interactive';

    var link = document.createElement('a');
    link.className = 'card__link';
    link.href = 'trainer.html?id=' + encodeURIComponent(t.key);
    link.setAttribute('aria-label', viewProfile + ': ' + name);

    var img = document.createElement('img');
    img.src = t.image;
    img.alt = name + ', ' + specialtyLabel + ' ' + altSuffix;
    img.className = 'card__media';
    img.width = 600;
    img.height = 450;
    img.loading = 'lazy';
    link.appendChild(img);

    var h3 = document.createElement('h3');
    h3.className = 'card__title';
    h3.textContent = name;
    var pSpec = document.createElement('p');
    pSpec.className = 'text--muted';
    pSpec.textContent = specialtyLabel + ' | ' + yearsText;
    var pBio = document.createElement('p');
    pBio.className = 'text--muted';
    pBio.textContent = bio;
    var cta = document.createElement('span');
    cta.className = 'card__cta';
    cta.textContent = viewProfile;

    link.appendChild(h3);
    link.appendChild(pSpec);
    link.appendChild(pBio);
    link.appendChild(cta);
    card.appendChild(link);
    return card;
  }

  function render(filtered) {
    if (!listEl) return;
    listEl.innerHTML = '';

    if (filtered.length === 0) {
      if (emptyEl) emptyEl.hidden = false;
      if (marqueeEl) marqueeEl.hidden = true;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    if (marqueeEl) marqueeEl.hidden = false;

    var group = document.createElement('div');
    group.className = 'marquee__group';
    filtered.forEach(function (t) {
      group.appendChild(buildCard(t));
    });
    listEl.appendChild(group);

    var clone = group.cloneNode(true);
    clone.classList.add('marquee__group--clone');
    clone.setAttribute('aria-hidden', 'true');
    Array.prototype.forEach.call(clone.querySelectorAll('a, button, input, select, textarea, [tabindex]'), function (el) {
      el.setAttribute('tabindex', '-1');
    });
    listEl.appendChild(clone);
  }

  function applyFilters() {
    var query = (searchInput && searchInput.value ? searchInput.value : '').toLowerCase().trim();
    var specialty = filterSelect && filterSelect.value ? filterSelect.value : '';
    var filtered = trainers.filter(function (t) {
      var localizedName = tr('trainersData.' + t.key + '.name', t.name).toLowerCase();
      var localizedSpec = tr('trainersPage.spec' + cap(t.specialty), t.specialty).toLowerCase();
      var matchesQuery = query === '' ||
        t.name.toLowerCase().indexOf(query) !== -1 ||
        t.specialty.toLowerCase().indexOf(query) !== -1 ||
        localizedName.indexOf(query) !== -1 ||
        localizedSpec.indexOf(query) !== -1;
      var matchesSpecialty = specialty === '' || t.specialty === specialty;
      return matchesQuery && matchesSpecialty;
    });
    render(filtered);
  }

  function clearFilters() {
    if (searchInput) searchInput.value = '';
    if (filterSelect) filterSelect.value = '';
    render(trainers);
  }

  function init() {
    listEl = document.getElementById('trainerList');
    if (!listEl) return;
    searchInput = document.getElementById('trainerSearch');
    filterSelect = document.getElementById('trainerSpecialty');
    emptyEl = document.getElementById('trainerEmpty');
    clearBtn = document.getElementById('trainerClear');
    marqueeEl = document.getElementById('trainerMarquee');
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (filterSelect) filterSelect.addEventListener('change', applyFilters);
    if (clearBtn) clearBtn.addEventListener('click', clearFilters);
    render(trainers);
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
