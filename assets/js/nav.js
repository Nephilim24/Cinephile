const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    nav.style.background = 'black';
  } else {
    nav.style.background = '#14141480';
  }
});