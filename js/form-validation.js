(function () {
  'use strict';

  var PLAN_LABELS = {
    starter: 'Starter',
    pro: 'Pro',
    elite: 'Elite'
  };

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

  function showError(input, message) {
    var errorEl = input.parentElement.querySelector('.form__error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form__error';
      errorEl.setAttribute('role', 'alert');
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message || '';
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input) {
    var errorEl = input.parentElement.querySelector('.form__error');
    if (errorEl) {
      errorEl.textContent = '';
    }
    input.removeAttribute('aria-invalid');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateField(field) {
    clearError(field);
    var value = field.value.trim();
    if (field.hasAttribute('required') && value === '') {
      showError(field, tr('form.required', 'This field is required.'));
      return false;
    }
    if (value === '') {
      return true;
    }
    if (field.type === 'email' && !isValidEmail(value)) {
      showError(field, tr('form.invalidEmail', 'Please enter a valid email address.'));
      return false;
    }
    if (field.name === 'phone' && !/^[0-9+\-\s()]{7,20}$/.test(value)) {
      showError(field, tr('form.invalidPhone', 'Please enter a valid phone number.'));
      return false;
    }
    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
      showError(field, tr('form.required', 'This field is required.'));
      return false;
    }
    return true;
  }

  function initForm(form) {
    if (!form) return;

    var fields = form.querySelectorAll('input[required], select[required], textarea[required], input[type="email"]');

    fields.forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) {
          valid = false;
        }
      });

      var successEl = form.querySelector('.form__success');
      if (!successEl) {
        successEl = document.createElement('div');
        successEl.className = 'form__success';
        successEl.setAttribute('role', 'status');
        successEl.setAttribute('aria-live', 'polite');
        form.appendChild(successEl);
      }

      if (valid) {
        successEl.textContent = tr('form.success', 'Demo submission successful. This is a front-end only demo - no data was sent to a server and no membership has been activated.');
        form.reset();
      } else {
        successEl.textContent = '';
      }
    });
  }

  function prefillJoinPlan(form) {
    if (!form) return;
    var select = form.querySelector('select[name="plan"]');
    if (!select) return;

    var planId = null;
    var params = new URLSearchParams(window.location.search);
    if (params.has('plan')) {
      planId = params.get('plan');
    }
    if (!planId && window.IronZoneStorage) {
      planId = window.IronZoneStorage.get('ironzone:selectedPlan');
    }

    if (planId && Object.prototype.hasOwnProperty.call(PLAN_LABELS, planId)) {
      select.value = planId;
      return;
    }

    var notice = document.getElementById('planNotice');
    if (notice) {
      notice.hidden = false;
      notice.textContent = tr('form.noPlanNotice', 'No plan selected yet. Please choose a plan above or from the Membership page.');
    }
  }

  function init() {
    document.querySelectorAll('form[data-validate]').forEach(function (form) {
      initForm(form);
    });

    var joinForm = document.getElementById('joinForm');
    if (joinForm) {
      prefillJoinPlan(joinForm);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
