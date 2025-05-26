window.addEventListener("DOMContentLoaded", () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNjgwNjY3YzEyY2Y4ZmU4ZDBiYTcxMDZiZDgyNGYyZSIsIm5iZiI6MTc0NDQ3MjYxOS4xNzEsInN1YiI6IjY3ZmE4YTJiMWYzYmNmZWE0OGQ5NDAwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FjfcpY1vS2JIBd--k-UC0iSu-qikBJVYIjJi_l7zRnE",
    },
  };

  const header = document.querySelector(".header");
  const imgPath = "https://image.tmdb.org/t/p/original/";
  const imgPathMini = "https://image.tmdb.org/t/p/w500/";

  let currentIndex = 0;
  let nowMovies;
  let headerBg,
    nextBg,
    titleElem,
    descrElem,
    headerNextButton,
    matSwiper,
    topSwiper,
    matInfo;

  async function getNowMoviews() {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/now_playing?language=ru-RU&page=1",
        options
      );

      nowMovies = await response.json();
      init();
      update();
      setMatData();
      // setTopData();
      setInterval(update, 10000);
    } catch (error) {
      console.error(error);
    }
  }

  function init() {
    headerBg = document.createElement("img");
    headerBg.classList.add("show");
    header.append(headerBg);
    //
    titleElem = document.createElement("h1");
    descrElem = document.createElement("p");
    header.querySelector(".header__content").append(titleElem, descrElem);
    //
    headerNextButton = header.querySelector(".header__next");
    //
    nextBg = document.createElement("img");
    nextBg.classList.add("show");
    headerNextButton.append(nextBg);
    headerNextButton.addEventListener("click", update);
    matSwiper = document.querySelectorAll(".mat");
    matInfo = document.querySelector(".mat__info");
    topSwiper = document.querySelector(".top");
  }

  function update() {
    const nextIndex = (currentIndex + 1) % nowMovies.results.length;
    headerBg.src = `${imgPath}${nowMovies.results[currentIndex].backdrop_path}`;
    headerBg.classList.add("show");
    setTimeout(() => headerBg.classList.remove("show"), 500);

    titleElem.innerHTML = nowMovies.results[currentIndex].title;
    descrElem.innerHTML = nowMovies.results[currentIndex].overview;

    nextBg.src = `${imgPath}${nowMovies.results[nextIndex].backdrop_path}`;
    headerNextButton.querySelector("h3").innerHTML =
      nowMovies.results[nextIndex].title;

    currentIndex = nextIndex;
  }

  getNowMoviews();

  async function setMatData() {
    for (let i = 0; i < matSwiper.length; i++) {
      const attr = matSwiper[i].getAttribute("id");
      const wrapper = matSwiper[i].querySelector(".swiper-wrapper");
      const data = await getMatData(attr);
      data.forEach((item) => {
        const matItem = document.createElement("div");
        matItem.classList.add("swiper-slide");
        matItem.setAttribute("data-id", item.id);
        matItem.setAttribute("data-type", matSwiper[i].getAttribute("id"));
        matItem.innerHTML = `<img src="${imgPathMini}${item.poster_path}" alt="">`;
        wrapper.append(matItem);
      });
    }
  }

  async function getMatData(type = "movies") {
    try {
      const URL =
        type === "movies"
          ? "https://api.themoviedb.org/3/movie/upcoming?language=ru-RU&page=1"
          : "https://api.themoviedb.org/3/tv/popular?language=ru-RU&page=1";

      const response = await fetch(URL, options);

      const data = await response.json();

      return data.results;
    } catch (error) {
      console.log(error);
    }
  }

  window.addEventListener("click", (e) => {
    const slide = e.target;
    const parent = slide.closest(".swiper-slide");
    if (parent) {
      const id = parent.getAttribute("data-id");
      const type = parent.getAttribute("data-type");
      getDetail(id, type);
      getActors(id);
    }
  });

  async function getDetail(id, type) {
    const typeData = type === "movies" ? "movie" : "tv";

    try {
      const URL = `https://api.themoviedb.org/3/${typeData}/${id}?language=ru-RU`;
      const response = await fetch(URL, options);
      const data = await response.json();
      //
      const section = document.getElementById(type);
      const content = section.querySelector(".mat__info-content");
      const htmlData = `
        <h2>${data.title ?? data.name}</h2>
        <p>${data.overview}</p>
      <p>
        ${data.release_date ?? data.first_air_date}
        \t${data.genres.map((genre) => `${capitalize(genre.name)} `)}
        \t${formalMinToHours(data.runtime) ?? data.episode_run_time[0]}
      </p>
        <img src="${imgPath}${data.backdrop_path}">
        <p>
        <img src="${(await getActors(id)).map((actor) => actor.profile_path)}">
        ${(await getActors(id)).map((actor) => actor.name)}
        </p>
      `;
      content.innerHTML = htmlData;
      section.querySelector(".mat__info").classList.add("active");
      section
        .querySelector("button")
        .addEventListener("click", () =>
          section.querySelector(".mat__info").classList.remove("active")
        );
    } catch (error) {
      console.log(error);
    }
  }

  async function getActors(id) {
    const URL = `https://api.themoviedb.org/3/movie/${id}/credits?language=ru-RU`;
    try {
      const response = await fetch(URL, options);
      const data = await response.json();
      const actors = data.cast.splice(0, 4);
      return actors;
    } catch (error) {
      console.log(error);
    }
  }

  function formalMinToHours(mins) {
    const hrs = Math.floor(mins / 60);
    const min = mins % 60;
    return `${hrs}ч ${min.toString().padEnd(2, "0")}м`;
  }

  function capitalize(str) {
    if (str) {
      return str[0].toUpperCase() + str.substring(1).toLowerCase();
    } else {
      return "";
    }
  }

  async function getTopData() {
    try {
      const URL =
        "https://api.themoviedb.org/3/movie/top_rated?language=ru-RU&page=1";
      const response = await fetch(URL, options);
      const data = await response.json();
      const top10 = data.results.splice(0, 10);
      console.log(top10);

      return data;
    } catch (error) {
      console.log(error);
    }
  }
  getTopData();
});

// async function setTopData() {
//   for (let i = 0; i < topSwiper.length; i++) {
//     const wrapper = topSwiper[i].querySelector('.swiper-wrapper')
//     const data = await getTopData();
//     data.forEach(item => {
//       const topItem = document.createElement('div');
//       topItem.classList.add('top__swiper-slide');
//       topItem.innerHTML = (`<img src="${imgPathMini}${item.poster_path}" alt="">`);
//       wrapper.append(topItem);
//     });
//   }
// }
