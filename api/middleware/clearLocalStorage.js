// testing delete storage

clearLocalStorage(() => {
  localStorage.clear();
}, []);

module.exports = clearLocalStorage;
