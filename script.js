//import properties and methods related to search input and favorite list
import {moreInfo,favouriteListLocalStorage,addToFavouriteList} from './moreInfo.js';

//Define and initiate the public key,hash,apiUrl,apiKey 
let PUBLIC_KEY  =   "9ab871748d83ae2eb5527ffd69e034de"
let hash        =   "d35377547e551cd64a60657d2517bb7f";
const apiUrl = 'https://gateway.marvel.com/v1/public/';
const apiKey = `&apikey=${PUBLIC_KEY}&hash=${hash}?ts=1`;

//DOM manipulation 
const navContainer = document.querySelector('.nav-container')
const home = document.querySelector('.home')
const search = document.querySelector('.search')
const favourite = document.querySelector('.favourite')

const homeContainer = document.querySelector('.home-container')
const searchBody = document.querySelector('.search-body')
const searchbarContainer = document.querySelector('.searchbar-container')
const searchInput = document.getElementById('search-input')
const searchSlogon = document.querySelector('.search-slogon')
const moreInfoContainer = document.querySelector('.character-more-info-container')
const favouriteBody = document.querySelector('.favourite-body')

const moviesCardContainer = document.querySelector('.movies-card-container')
const homeSearchButton = document.querySelector('.home-search-button')

const logo = document.querySelector('.logo-container');

logo.addEventListener('click',()=>{
  home.classList.add('active')
  homeContainer.classList.add('active')
  search.classList.remove('active')
  searchBody.classList.remove('active')
  favourite.classList.remove('active')
  favouriteBody.classList.remove('active')
})

//Click on home menu diplaying the home page section by adding the active class and hide the rest section i.e search, favorite sections 
home.addEventListener('click',()=>{
  home.classList.add('active')
  homeContainer.classList.add('active')
  search.classList.remove('active')
  searchBody.classList.remove('active')
  favourite.classList.remove('active')
  favouriteBody.classList.remove('active')
})

//Click on search menu diplaying the search page section by adding the active class and hide the rest section i.e home, favorite sections 
search.addEventListener('click', () => {
  search.classList.add('active')
  searchBody.classList.add('active')
  home.classList.remove('active')
  homeContainer.classList.remove('active')
  favourite.classList.remove('active')
  favouriteBody.classList.remove('active')
})

//Click on favorite menu diplaying the favorite page section by adding the active class and hide the rest section i.e home, search sections 
favourite.addEventListener('click',()=>{
  favourite.classList.add('active')
  favouriteBody.classList.add('active')
  home.classList.remove('active')
  homeContainer.classList.remove('active')
  search.classList.remove('active')
  searchBody.classList.remove('active')
})

//Click on let's search button diplaying the search page section by adding the active class and hide the rest section i.e home, favorite sections 
homeSearchButton.addEventListener('click',function(){
  search.classList.add('active')
  searchBody.classList.add('active');
  home.classList.remove('active')
  homeContainer.classList.remove('active');
  favouriteBody.classList.remove('active');
})

//When user input the character in the search bar then this function is called. This function also called the fetchCharacters which returns all the character available in the marvel api by matching their input value 
function userInput() {
  searchInput.addEventListener('input', () => {
      if (searchInput.value == "") {
          searchBody.style.top = "10%";
          searchBody.style.height = "70vh";
          searchSlogon.style.display = "flex";
          moviesCardContainer.style.display = "none";
          searchbarContainer.style.marginBottom = "50px";
      } else {
          searchBody.style.height = "116vh";
          searchSlogon.style.display = "none";
          moviesCardContainer.style.display = "flex";
          searchBody.style.top = "-16%";
          moviesCardContainer.style.marginTop = "0px";
          searchbarContainer.style.marginBottom = "20px";
      }
      fetchCharacters();
  });
}


//This function return fetch all the characters from the marvel api by name start with input type character
export async function fetchCharacters() {
  try {
    const response = await fetch(apiUrl + `characters?nameStartsWith=${searchInput.value.trim()}` + apiKey);
    const data = await response.json();
    if(data.status == 'Ok'){
        renderCharacters(data.data.results);  
    }else{
      moviesCardContainer.innerHTML = `
      <div class="no-movie-found">
          <img src="https://cdn-icons-png.flaticon.com/256/7465/7465691.png"></img>
      </div>
      `;
    }
  } catch (error) {
    console.log(error)
  }
}


// Function for displaying the searched results from the api to DOM. Chararcters is the array of objects which matches the string entered in the searched bar
function renderCharacters(characters){
  const moviesCardContainer = document.querySelector('.movies-card-container');
  moviesCardContainer.innerHTML='';
  if(characters.length>0){
      for (const character of characters) {

        character.id = (character.id != '') ? character.id : 'Not Available';                   
        character.name = (character.name != '') ? character.name : 'Not Available';
        character.description = (character.description != '') ? character.description : 'Not Available';
        character.comics.available = (character.comics.available >0) ? character.comics.available : '0';
        character.series.available = (character.series.available >0) ? character.series.available : '0';
        character.stories.available = (character.stories.available >0) ? character.stories.available : '0';

        const element = document.createElement('div');
        element.classList.add('movie-card');
    
        renderCard(element, character);

        moviesCardContainer.appendChild(element);
        //console.log(moviesCardContainer);
      }
  }else{
    moviesCardContainer.innerHTML = `
    <div class="no-movie-found">
        <img src="https://cdn-icons-png.flaticon.com/256/7465/7465691.png"></img>
    </div>
    `;
  }
}


//This function is used to render the DOM manipulation on the card list 
function renderCard(ele,data){

  let isEleExist = favouriteListLocalStorage.findIndex((index)=>  index== data.id);

  let imageSrc = (isEleExist == -1) ? 'https://cdn-icons-png.flaticon.com/512/10037/10037207.png' : 'https://cdn-icons-png.flaticon.com/512/210/210545.png';
  ele.innerHTML = `
    <div class="card">
          <div class="movie-image-container">
              <img class="movie-image" src="${data.thumbnail.path+'/standard_fantastic.' + data.thumbnail.extension}"></img>
          </div>
          <div class="card-actions">
              <div id="add-to-fav-list-${data.id}" class="like-container">
                <img class="like-image " id="_favouritelistIcon-${data.id}" src="${imageSrc}"></img>
              </div>
              <div onclick="addMovieToWatchlist('${data.id}')" class="watchlist-button-container">
                <img class="watchlist-button-image active" id="_watchlistIcon-${data.id}"src="https://cdn-icons-png.flaticon.com/32/786/786453.png"></img>
              </div>
          </div>
          <div class="movie-info-container"  id="movie-info-${data.id}">
              <div class="movie-title-container">
                <h3 class="movie-title">${data.name}</h3>
              </div>
              <div class="mc-container">
                  <p>Comics <br> ${data.comics.available }</p>
                  <p>Series <br>${data.series.available}</p>
                  <p>Stories <br>${data.stories.available}</p>
              </div>
              <div class="movie-plot-container">
                  <p class="movie-plot">${data.description}</p>
              </div>
          </div>     
    </div>`;
    if(data.id !='null'){
      setTimeout(() => {
            const movieInfoContainer = document.getElementById(`movie-info-${data.id}`);
            movieInfoContainer?.addEventListener('click',() => moreInfo(data.id))

            const addToFavourite = document.getElementById(`add-to-fav-list-${data.id}`)
            addToFavourite?.addEventListener('click',() => addToFavouriteList(`${data.id}`))
        }, 1000);
     
    }
}

//userInput() function called here
userInput();

export {apiUrl,PUBLIC_KEY,apiKey,navContainer,home,search,favourite,searchInput,searchBody,favouriteBody,homeContainer,searchbarContainer,moviesCardContainer,searchSlogon,moreInfoContainer,homeSearchButton,userInput,renderCard}
