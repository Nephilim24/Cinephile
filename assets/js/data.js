const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNjgwNjY3YzEyY2Y4ZmU4ZDBiYTcxMDZiZDgyNGYyZSIsIm5iZiI6MTc0NDQ3MjYxOS4xNzEsInN1YiI6IjY3ZmE4YTJiMWYzYmNmZWE0OGQ5NDAwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FjfcpY1vS2JIBd--k-UC0iSu-qikBJVYIjJi_l7zRnE'
  }
};

const header = document.querySelector('.header');
const headerNextContent = document.querySelector('.header__next-content');
const imgPath = 'https://image.tmdb.org/t/p/original/'
const imgPathNext = 'https://image.tmdb.org/t/p/w500/'

async function getNowMovies() {

  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=ru-RU&page=1', options);
    const nowMovies = await response.json();

    let currentIndex = 0;

    function update() {
      const headerBg = document.createElement('img');

      headerBg.setAttribute('src', `${imgPath}${nowMovies.results[currentIndex].backdrop_path}`);
      headerBg.classList.add('show');
      header.append(headerBg);
      header.querySelector('h1').innerHTML = nowMovies.results[currentIndex].title;
      header.querySelector('p').innerHTML = nowMovies.results[currentIndex].overview;
      const headerNextContentBg = headerNextContent.querySelector('img');
      // headerNextContentBg.setAttribute('src', `${imgPathNext}${nowMovies.results[currentIndex + 1].backdrop_path}`);
      headerNextContent.querySelector('h3').innerHTML = nowMovies.results[(currentIndex + 1) % nowMovies.results.length].title;

      const oldImage = header.querySelector('img');
      if (oldImage) {
        oldImage.classList.remove('show');
        setTimeout(() => oldImage.remove(), 1000);
      }

      const nextButton = header.querySelector('.header__next');
      nextButton.addEventListener("click", () => {
        update();
        if (interval > 0) {
          clearInterval(interval);
        } else {
          setInterval(update, 5000);
        }
      })

      currentIndex = (currentIndex + 1) % nowMovies.results.length;
    }
    update();

    let interval = setInterval(update, 5000);

  } catch (error) {
    console.error(error);
  }

}

getNowMovies();