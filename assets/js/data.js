const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNjgwNjY3YzEyY2Y4ZmU4ZDBiYTcxMDZiZDgyNGYyZSIsIm5iZiI6MTc0NDQ3MjYxOS4xNzEsInN1YiI6IjY3ZmE4YTJiMWYzYmNmZWE0OGQ5NDAwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FjfcpY1vS2JIBd--k-UC0iSu-qikBJVYIjJi_l7zRnE'
  }
};

const header = document.querySelector('.header');
const imgPath = 'https://image.tmdb.org/t/p/original/'

async function getNowMovies() {

  try {

    const response = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=ru-RU&page=1', options);

    const nowMovies = await response.json();

    const headerBg = document.createElement('img');
    headerBg.setAttribute('src', `${imgPath}${nowMovies.results[0].backdrop_path}`);
    header.append(headerBg);
    header.querySelector('h1').innerHTML = nowMovies.results[0].title;
    header.querySelector('p').innerHTML = nowMovies.results[0].overview;

  } catch (error) {
    console.error(error);
  }

}

getNowMovies();