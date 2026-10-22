(function () {
  'use strict';

  var PLANS = {
    starter: { key: 'starter', nameKey: 'membership.starterName', fallback: 'Starter', reasonsKey: 'wizard.reasonStarter', reasonFallback: 'You are starting out and want full access to the gym floor at a low monthly cost.' },
    pro: { key: 'pro', nameKey: 'membership.proName', fallback: 'Pro', reasonsKey: 'wizard.reasonPro', reasonFallback: 'You train regularly and want group classes plus priority booking.' },
    elite: { key: 'elite', nameKey: 'membership.eliteName', fallback: 'Elite', reasonsKey: 'wizard.reasonElite', reasonFallback: 'You want personal training and nutrition guidance on top of full access.' }
  };

  var formEl, resultEl, resultNameEl, resultTextEl, resultBtnEl;

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

  function scorePlan(answers) {
    var score = { starter: 0, pro: 0, elite: 0 };

    if (answers.goal === 'lose') {
      score.pro += 2;
      score.elite += 1;
    } else if (answers.goal === 'build') {
      score.starter += 1;
      score.pro += 2;
    } else if (answers.goal === 'perform') {
      score.elite += 3;
    } else if (answers.goal === 'health') {
      score.starter += 3;
    }

    if (answers.experience === 'new') {
      score.starter += 2;
      score.pro += 1;
    } else if (answers.experience === 'some') {
      score.pro += 2;
    } else if (answers.experience === 'regular') {
      score.pro += 1;
      score.elite += 2;
    }

    if (answers.frequency === 'once') {
      score.starter += 2;
    } else if (answers.frequency === 'twice') {
      score.pro += 2;
    } else if (answers.frequency === 'often') {
      score.elite += 2;
      score.pro += 1;
    }

    if (answers.support === 'coach') {
      score.elite += 3;
    } else if (answers.support === 'group') {
      score.pro += 2;
    } else if (answers.support === 'alone') {
      score.starter += 2;
    }

    var best = 'starter';
    var bestScore = -1;
    Object.keys(score).forEach(function (key) {
      if (score[key] > bestScore) {
        bestScore = score[key];
        best = key;
      }
    });
    return best;
  }

  function collectAnswers() {
    var answers = {};
    ['goal', 'experience', 'frequency', 'support'].forEach(function (name) {
      var checked = formEl.querySelector('input[name="' + name + '"]:checked');
      answers[name] = checked ? checked.value : '';
    });
    return answers;
  }

  function isComplete(answers) {
    return !!(answers.goal && answers.experience && answers.frequency && answers.support);
  }

  function showResult(planKey) {
    var plan = PLANS[planKey];
    if (!plan || !resultEl) return;

    resultNameEl.textContent = tr(plan.nameKey, plan.fallback);
    resultTextEl.textContent = tr(plan.reasonsKey, plan.reasonFallback);
    resultBtnEl.setAttribute('data-plan', plan.key);
    resultEl.hidden = false;
  }

  function hideResult() {
    if (resultEl) resultEl.hidden = true;
  }

  function handleChange() {
    var answers = collectAnswers();
    if (!isComplete(answers)) {
      hideResult();
      return;
    }
    showResult(scorePlan(answers));
  }

  function handleSubmit(e) {
    e.preventDefault();
    var answers = collectAnswers();
    if (!isComplete(answers)) {
      hideResult();
      return;
    }
    showResult(scorePlan(answers));
    if (resultEl) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function handleResultClick(e) {
    var btn = e.target.closest ? e.target.closest('[data-plan]') : null;
    if (!btn) return;
    e.preventDefault();
    var planId = btn.getAttribute('data-plan');
    if (!planId) return;

    if (window.IronZoneStorage && window.IronZoneStorage.set) {
      window.IronZoneStorage.set('ironzone:selectedPlan', planId);
    } else {
      try {
        localStorage.setItem('ironzone:selectedPlan', planId);
      } catch (err) {
        // storage unavailable - the query string still carries the choice
      }
    }
    window.location.href = 'join.html?plan=' + encodeURIComponent(planId);
  }

  function init() {
    formEl = document.getElementById('planWizard');
    if (!formEl) return;

    resultEl = document.getElementById('wizardResult');
    resultNameEl = document.getElementById('wizardResultName');
    resultTextEl = document.getElementById('wizardResultText');
    resultBtnEl = document.getElementById('wizardResultBtn');

    formEl.addEventListener('change', handleChange);
    formEl.addEventListener('submit', handleSubmit);
    if (resultEl) {
      resultEl.addEventListener('click', handleResultClick);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
