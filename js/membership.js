(function () {
  'use strict';

  function init() {
    var chooseBtns = document.querySelectorAll('.js-choose-plan');
    if (!chooseBtns.length) {
      return;
    }

    chooseBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var planId = btn.getAttribute('data-plan');
        if (!planId || planId.trim() === '') {
          window.location.href = 'join.html';
          return;
        }
        if (window.IronZoneStorage && window.IronZoneStorage.set) {
          window.IronZoneStorage.set('ironzone:selectedPlan', planId.trim());
        } else {
          try {
            localStorage.setItem('ironzone:selectedPlan', planId.trim());
          } catch (err) {
            // ignore
          }
        }
        window.location.href = 'join.html?plan=' + encodeURIComponent(planId.trim());
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
