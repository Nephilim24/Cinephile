// async function getNowMovies() {
//   try {
//     
//     
//     let currentIndex = 0;

//     function update() {
//       header.append(generateBg(currentIndex, nowMovies, imgPath));
//       header.querySelector('h1').innerHTML = nowMovies.results[currentIndex].title;
//       header.querySelector('p').innerHTML = nowMovies.results[currentIndex].overview;
//       let nextIndex = (currentIndex + 1) % nowMovies.results.length;
//       const headerNextBtn = header.querySelector('.header__next');
//       headerNextBtn.querySelector('h3').innerHTML = nowMovies.results[nextIndex].title;
//       headerNextBtn.append(generateBg(nextIndex, nowMovies, imgPathMini));
//       currentIndex = (currentIndex + 1) % nowMovies.results.length;
//     }
//     update();
//     setInterval(update, 10000);
//   } catch (error) {
//     console.error(error);
//   }
// }


// function generateBg(index, nowMovies, imgPath) {
//   const headerBg = document.createElement('img');
//   headerBg.setAttribute('src', `${imgPath}${nowMovies.results[index].backdrop_path}`);
//   headerBg.classList.add('show');


//   return headerBg;
// }

// getNowMovies();


const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNjgwNjY3YzEyY2Y4ZmU4ZDBiYTcxMDZiZDgyNGYyZSIsIm5iZiI6MTc0NDQ3MjYxOS4xNzEsInN1YiI6IjY3ZmE4YTJiMWYzYmNmZWE0OGQ5NDAwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FjfcpY1vS2JIBd--k-UC0iSu-qikBJVYIjJi_l7zRnE'
  }
};

const header = document.querySelector('.header');
const imgPath = 'https://image.tmdb.org/t/p/original/';
const imgPathMini = 'https://image.tmdb.org/t/p/w500/';

let currentIndex = 0;
let nowMovies;
let headerBg, nextBg, titleElem, descrElem, headerNextButton;


async function getNowMoviews() {
  try {
    const response =
      await fetch('https://api.themoviedb.org/3/movie/now_playing?language=ru-RU&page=1', options);

    nowMovies = await response.json();
    init();
    update();
    setInterval(update, 5000);
  } catch (error) {
    console.error(error);
  }
}


function init() {
  headerBg = document.createElement('img');
  headerBg.classList.add('show');
  header.append(headerBg);
  // 
  titleElem = document.createElement('h1');
  descrElem = document.createElement('p');
  header.querySelector('.header__content').append(titleElem, descrElem);
  // 
  headerNextButton = header.querySelector('.header__next');
  //
  nextBg = document.createElement('img');
  nextBg.classList.add('show');
  headerNextButton.append(nextBg);
  headerNextButton.addEventListener('click', update);
}

function update() {
  const nextIndex = (currentIndex + 1) % nowMovies.results.length;

  headerBg.src = `${imgPath}${nowMovies.results[currentIndex].backdrop_path}`;
  headerBg.classList.add('show');
  setTimeout(() => headerBg.classList.remove('show'), 500);

  titleElem.innerHTML = nowMovies.results[currentIndex].title;
  descrElem.innerHTML = nowMovies.results[currentIndex].overview;

  nextBg.src = `${imgPath}${nowMovies.results[nextIndex].backdrop_path}`;
  headerNextButton.querySelector('h3').innerHTML = nowMovies.results[nextIndex].title;

  currentIndex = nextIndex;

}

getNowMoviews();