window.addEventListener('DOMContentLoaded', () => {
  const loadingEl = document.querySelector('.loader');

  setTimeout(() => {
    loadingEl.classList.add('fade-out');

    setTimeout(() => {
      loadingEl.style.display = 'none';
    }, 1000);
  }, 2000);
});