import { apiUrl, PUBLIC_KEY, apiKey, navContainer, searchInput, moviesCardContainer, moreInfoContainer } from './script.js';

const favouritelistCardContainer = document.querySelector('.favourite-card-container');
// It used to fetch the  favourite list characters from local storage
let favouriteListLocalStorage = JSON.parse(localStorage.getItem('favouriteListLocalStorage'))


// This function return the character's item detail information
async function moreInfo(id) {
  const moreInfoContainer = document.querySelector('.character-more-info-container');
  moreInfoContainer.style.opacity = "1";
  moreInfoContainer.style.pointerEvents = "all";
  moreInfoContainer.style.zIndex = "10";
  moreInfoContainer.innerHTML = '';
  navContainer.style.filter = "blur(5px)";
  searchInput.style.filter = "blur(5px)";
  moviesCardContainer.style.filter = "blur(5px)";
  navContainer.style.pointerEvents = "none";
  searchInput.style.pointerEvents = "none";
  moviesCardContainer.style.pointerEvents = "none";

  try {
    const request = await fetch(apiUrl + `/characters/${id}?apikey=${PUBLIC_KEY}`);
    const data = await request.json();
    if (data.status == 'Ok') {

      data.data.results.forEach(response => {

        response.id = (response.id != '') ? response.id : 'Not Available';
        response.name = (response.name != '') ? response.name : 'Not Available';
        response.description = (response.description != '') ? response.description : 'Not Available';
        response.comics.available = (response.comics.available > 0) ? response.comics.available : '0';
        response.series.available = (response.series.available > 0) ? response.series.available : '0';
        response.stories.available = (response.stories.available > 0) ? response.stories.available : '0';
        response.events.available = (response.events.available > 0) ? response.events.available : '0';

        const element = document.createElement('div');
        element.classList.add('character-more-info');
        renderCharacterMoreInfo(element, response);
        moreInfoContainer.appendChild(element);

        const checkItemLocalStorage = favouriteListLocalStorage.find(item => parseInt(item) === response.id);
        if (checkItemLocalStorage) {
          document.querySelector(".add-to-favorites-button").innerHTML = "Remove from Favorites";
        } else {
          document.querySelector(".add-to-favorites-button").innerHTML = "Add to Favorites";
        }

      });
    } else {
      moreInfoContainer.innerHTML = `
        <div class="no-movie-found">
            <img src="https://cdn-icons-png.flaticon.com/256/7465/7465691.png"></img>
        </div>
        `;
    }
  }
  catch (error) {
    console.log(error)
  }
}

// This function return the character's detail inside the api response and render into the DOM element
async function renderCharacterMoreInfo(element, data) {
  element.innerHTML = `
    <div class="character-more-info">
      <div class="more-info-image-container">
          <img class="more-info-image" src="${data.thumbnail.path + '/standard_fantastic.' + data.thumbnail.extension}"></img>
      </div>
      <div class="more-info-dip-container">

        <div class="more-info-title-container">
            <span class="more-info-title"> ${data.name}&nbsp&nbsp</span>
        </div>

        <div class="mc-container">
          <p>Comics <br> ${data.comics.available}</p>
          <p>Series <br>${data.series.available}</p>
          <p>Stories <br>${data.stories.available}</p>
          <p>Events <br>${data.events.available}</p>
         </div>

         <div class="more-info-desc-container">
            <p class="more-info-desc">${data.description}</p>
         </div>

         <div class="action-buttons-container">
              <div class="add-to-favorites-container" id="add-to-favorites-${data.id}" >
                  <button class="add-to-favorites-button" id="favoriteslist-button-${data.id}">Add to Favorites</button>
              </div>
          </div>
      </div>

      <div id="close-more-info" class="close-more-info-container">
          <i class="fa-solid fa-times"></i>
      </div>
    </div>
    `;


  setTimeout(() => {
    const closeMoreInfo = document.getElementById(`close-more-info`);
    closeMoreInfo?.addEventListener('click', function () {
      closeMore()
    });

    const addToFavouriteBtn = document.getElementById(`add-to-favorites-${data.id}`)
    addToFavouriteBtn?.addEventListener('click', function () {
      addToFavouriteList(`${data.id}`)
    })
  }, 1000);
}



if (favouriteListLocalStorage == null) {
  favouriteListLocalStorage = [];
}

//This function is used to add the characters item into the favourite list
function addToFavouriteList(id) {
  if (moreInfoContainer.style.opacity == "1") {
    const infoFavoritelistButton = document.getElementById(`favoriteslist-button-${id}`);
    infoFavoritelistButton.innerHTML = (favouriteListLocalStorage.includes(id)) ? 'Add to Favoritelist' : 'Remove From Favoritelist';
  }

  const favouritelistIcon = document.getElementById(`_favouritelistIcon-${id}`);
  favouritelistIcon.classList.toggle('active');
  if (favouritelistIcon.classList.contains('active')) {
    success('Character added to favorite list')
    favouritelistIcon.src = "https://cdn-icons-png.flaticon.com/512/210/210545.png";
  } else {
    warning('Character removed from favorite list')
    favouritelistIcon.src = "https://cdn-icons-png.flaticon.com/512/10037/10037207.png";
  }

  let index = favouriteListLocalStorage.indexOf(id);
  if (index !== -1) {

    favouriteListLocalStorage.splice(index, 1)
    localStorage.setItem(`favouriteListLocalStorage`, JSON.stringify(favouriteListLocalStorage));
    showFavouriteList();
    return;
  }

  favouriteListLocalStorage.push(id);
  localStorage.setItem(`favouriteListLocalStorage`, JSON.stringify(favouriteListLocalStorage));
  showFavouriteList();
}


async function fetchDataAndUpdateDOM(id) {
  const response = await fetch(`${apiUrl}/characters/${id}?apikey=${PUBLIC_KEY}`);
  const data = await response.json();
  return data;
}

//This function is used to render the fetch api's character response to DOM element.Inside this function, calling the moreInfo() used to return the overal detail of particular character and addToFavouriteList() is used  to add the characters item into the favourite list.
async function addCharacterToDOM(id) {
  const data = await fetchDataAndUpdateDOM(id);
  data.data.results.forEach(data => {
    const element = document.createElement('div');
    element.innerHTML = `
    <div class="card">
          <div class="movie-image-container">
              <img class="movie-image" src="${data.thumbnail.path + '/standard_fantastic.' + data.thumbnail.extension}"></img>
          </div>
          <div class="card-actions">
              <div class="like-container" id="add-to-fav-${data.id}">
                <img class="like-image active" id="_favouritelistIcon-${data.id}" src="https://cdn-icons-png.flaticon.com/512/210/210545.png"></img>
              </div>
              <div class="watchlist-button-container">
                <img class="watchlist-button-image active" id="_watchlistIcon-${data.id}"src="https://cdn-icons-png.flaticon.com/32/786/786453.png"></img>
              </div>
          </div>
          <div class="movie-info-container"  id="movie-info-${data.id}">
              <div class="movie-title-container">
                <h3 class="movie-title">${data.name}</h3>
              </div>
              <div class="mc-container">
                  <p>Comics <br> ${data.comics.available}</p>
                  <p>Series <br>${data.series.available}</p>
                  <p>Stories <br>${data.stories.available}</p>
              </div>
              <div class="movie-plot-container">
                  <p class="movie-plot">${data.description}</p>
              </div>
          </div>     
    </div>`;

    if (data.id !== null) {
      const movieInfoContainer = element.querySelector(`#movie-info-${data.id}`);
      movieInfoContainer.addEventListener('click', function () {
        moreInfo(data.id);
      });
    }
    setTimeout(() => {
      const addToFavourite = document.getElementById(`add-to-fav-${id}`)

      addToFavourite?.addEventListener('click', function () {
        addToFavouriteList(`${id}`)
      })
    }, 2000);
    favouritelistCardContainer.appendChild(element);
  });
}

//This funtion used to fetch the list of favorite character.Inside the function called the addCharacterToDom which helps to render the fetch charactor from api to DOM
async function showFavouriteList() {
  favouritelistCardContainer.innerHTML = ``;
  if (favouriteListLocalStorage.length == "") {
    favouritelistCardContainer.innerHTML = `<div class="no-item-in-favouriteList-container">
            <h1 class="search-slogon">No Character in FavouriteList</h1>
        </div>`;
  } else {
    favouriteListLocalStorage.forEach(id => {
      addCharacterToDOM(id)
    });

  }
}

//Add event listener called the showFavouritelist() on DOMContentLoaded
addEventListener("DOMContentLoaded", (event) => {
  showFavouriteList();
});

//This function closing the character's more info pop up
function closeMore() {

  moreInfoContainer.style.opacity = "0";
  moreInfoContainer.style.pointerEvents = "none";
  moreInfoContainer.style.zIndex = "-1";
  navContainer.style.filter = "blur(0px)";
  searchInput.style.filter = "blur(0px)";
  searchInput.style.pointerEvents = "auto";
  moviesCardContainer.style.filter = "blur(0px)";
  navContainer.style.pointerEvents = "auto";
  moviesCardContainer.style.pointerEvents = "auto";
  moreInfoContainer.innerHTML = "";
}

// This function return the success message of toaster
function success(msg) {
  iziToast.success({
    title: msg,
    position: 'topRight'
  })
}
// This function return the warning message of toaster
function warning(msg) {
  iziToast.warning({
    title: msg,
    position: 'topRight'
  })
}

export { moreInfo, favouriteListLocalStorage, addToFavouriteList }

