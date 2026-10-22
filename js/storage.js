(function () {
  'use strict';

  function isStorageAvailable() {
    try {
      var testKey = '__ironzone_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  function get(key) {
    if (!isStorageAvailable()) {
      return null;
    }
    try {
      var value = localStorage.getItem(key);
      return value;
    } catch (e) {
      return null;
    }
  }

  function set(key, value) {
    if (!isStorageAvailable()) {
      return false;
    }
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  function remove(key) {
    if (!isStorageAvailable()) {
      return false;
    }
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  window.IronZoneStorage = {
    get: get,
    set: set,
    remove: remove,
    isAvailable: isStorageAvailable
  };
})();
