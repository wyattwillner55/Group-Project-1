// Declare Variables for Form
var formEl = document.querySelector("#form");
var buttonEl = document.querySelector("#button");
var searchBarEl = document.querySelector("#search-input")

// Declare keys 

const gameApiKey = "e74f1531c0f74b7db40ea409fea58784";
const movieApiKey = "ce9ece71";

// Creating genre vars for filtering
var genre1;
var genre2;
var genre3;
var beenCleared = false;
// Event listeners
formEl.addEventListener("submit", handleSearchFormSubmit);

//Functions

// initial fetch -> setGenres -> filterGenre x3 -> randomRecommendation

function recommendGame() {
    setGenres();
    filterGenre(genre1);
    filterGenre(genre2);
    filterGenre(genre3);
    randomRecommendation();
}

function randomRecommendation() {
    let randomGenre = Math.floor(Math.random() * 3);
    let randomNum = Math.floor(Math.random() * 25) + 1;
    let genreArray = [genre1,genre2,genre3];
    fetchGameFromGenre(genreArray[randomGenre],randomNum);
}

function fetchGameFromGenre(genre,pageNumber) {
    fetch('https://api.rawg.io/api/games?genre=' + genre + '&key=' + gameApiKey + '&page=' + pageNumber)
    .then(function(response){
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    }).then(function(recommendation){
        let gameTitle =  recommendation.results[0].slug;
        fetch('https://rawg.io/api/games?search=' + gameTitle + '&key=' + gameApiKey)
    .then(function(response){
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    }).then(function(finalRec){
        window.localStorage.setItem('game', JSON.stringify(finalRec.results[0]));
    })
    })
}

function filterGenre(filteredGenre) {
    let gameGenres = [ 'Arcade' ,  'Educational' , 'Casual' , 'Board Games' , 'Educational' ,
     'Indie' ,  'RPG' , 'Puzzle' , 'Adventure' , 'Simulation' ,'Massively-Multiplayer' ,
      'Platformer' , 'Puzzle' ,  'Strategy' , 'Card' , 'Indie' , 'Sports' , 'Massively-Multiplayer' ,
       'Racing' , 'Shooter' , 'Shooter'];
    let movieGenres = ["Animation" , "Biography" , "Comedy" , "Crime" , "Documentary" ,
     "Drama" ,  "Fantasy" , "Film Noir" , "History"  ,  "Horror" , "Music" , "Musical" ,
      "Mystery" , "Romance" ,  "Sci-Fi" , "Short" , "Sport" , "Superhero" , "Thriller" ,
       "War" , "Western"];
    
    for (i = 0; i < gameGenres.length; i++) {
        if (filterGenre == movieGenres[i]) {
            filterGenre = gameGenres[i];
        }
    }
}

function setGenres() {
    let movieInfo = JSON.parse(window.localStorage.getItem('movie'));
    let objectString = movieInfo.Genre.replaceAll(',','');
    let movieGenreArray = objectString.split(' ');
    genre1 = movieGenreArray[0];
    genre2 = movieGenreArray[1];
    genre3 = movieGenreArray[2];
}

function handleSearchFormSubmit(event){
    event.preventDefault();

    var queryString = "./search-results.html";
    location.assign(queryString);
};

// Event listeners
formEl.addEventListener("submit", handleSearchFormSubmit);

// Fetch request for Games 

function displayPreviousRecs() {
    // getting last movie from local storage
    var movie = JSON.parse(window.localStorage.getItem('movie'));

    // displaying movie information of last saved movie 
    document.querySelector('#mTitle').textContent = "Title: " + movie.Title;
    document.querySelector('#mRelease').textContent = "Release: " + movie.Released;
    document.querySelector('#mDirector').textContent = "Director: " + movie.Director;
    document.querySelector('#mActors').textContent = "Actors: " + movie.Actors;
    document.querySelector('#mIMDbRating').textContent = "IMDB: " + movie.Ratings[0].Value;
    document.querySelector('#mRTRating').textContent = "Rotten Tomatoes: " + movie.Ratings[1].Value;
    document.querySelector('#mMCRating').textContent = "Metacritic: " + movie.Ratings[2].Value;
    document.querySelector('#mPlot').textContent = "Plot: " + movie.Plot;

    // setting the source of the poster to the link that was fetched with the movie
    var mPoster = movie.Poster;
    document.querySelector('#mPoster').setAttribute('src', mPoster);

    // getting last game from local storage
    var game = JSON.parse(window.localStorage.getItem('game'));

    // displaying game information of last saved game
    document.querySelector('#gTitle').textContent = "Title: " + game.name;
    document.querySelector('#gRelease').textContent = "Release: " + game.released;
    // checking if it has a value for the esrb rating
    if (game.esrb_rating) {
        document.querySelector('#gESRB').textContent = "Age Rating: " + game.esrb_rating.name;
    }
    document.querySelector('#gMCRating').textContent = "Metacritic: " + game.metacritic;
    document.querySelector('#gGenres').textContent = "Genres: ";
    // for as many genres as are listed
    for (i = 0; i < game.genres.length; i++) {
        document.querySelector('#gGenres').textContent += (game.genres[i].name + " ");
    }

    // setting the source of the poster to the link fetched with the game
    var gPoster = game.background_image;
    document.querySelector('#gPoster').setAttribute('src', gPoster)
}
recommendGame();
displayPreviousRecs();
 