const API_KEY = 'cfa3a76f600a97a4ea76d149c6643963';
const BASE_URL = 'https://api.themoviedb.org/3';

const genresContainer = document.getElementById('genres-container');
const trendingMoviesContainer = document.getElementById('trending-movies');
const latestTrailersContainer = document.getElementById('latest-trailers');
const movieModal = document.getElementById('movie-modal');
const movieDetails = document.getElementById('movie-details');
const trailerContainer = document.getElementById('trailer-container');
const closeModal = document.getElementsByClassName('close')[0];
const searchInput = document.getElementById('search-input');
const suggestions = document.getElementById('suggestions');
const themeToggle = document.getElementById('theme-toggle');

// Fetch genres and display them
async function fetchGenres() {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await response.json();
    data.genres.forEach(genre => {
        const genreSection = document.createElement('section');
        genreSection.classList.add('genre-section');
        genreSection.setAttribute('data-genre-id', genre.id);

        const genreTitle = document.createElement('h2');
        genreTitle.textContent = genre.name;

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        genreSection.appendChild(genreTitle);
        genreSection.appendChild(movieContainer);
        genresContainer.appendChild(genreSection);

        fetchMoviesByGenre(genre.id, movieContainer);
    });
}

// Fetch movies by genre
async function fetchMoviesByGenre(genreId, container) {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
    const data = await response.json();
    data.results.forEach(movie => {
        createMovieCard(movie, container);
    });
}

// Fetch trending movies
async function fetchTrendingMovies() {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await response.json();
    data.results.forEach(movie => {
        createMovieCard(movie, trendingMoviesContainer);
    });
}

// Fetch latest trailers
async function fetchLatestTrailers() {
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
    const data = await response.json();
    data.results.forEach(movie => {
        createMovieCard(movie, latestTrailersContainer);
    });
}

// Create a movie card
function createMovieCard(movie, container) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.setAttribute('data-movie-id', movie.id);

    const movieTitle = document.createElement('h3');
    movieTitle.textContent = movie.title;

    const moviePoster = document.createElement('img');
    moviePoster.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
    moviePoster.alt = movie.title;

    movieCard.appendChild(moviePoster);
    movieCard.appendChild(movieTitle);
    container.appendChild(movieCard);

    movieCard.addEventListener('click', () => showMovieDetails(movie.id));
}

// Show movie details in modal
async function showMovieDetails(movieId) {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
    const movie = await response.json();

    movieDetails.innerHTML = `
        <h2>${movie.title}</h2>
        <p>${movie.overview}</p>
        <h3>Cast:</h3>
        <ul>${movie.credits.cast.map(actor => `<li><a href="#" onclick="showActorDetails(${actor.id})">${actor.name}</a> as ${actor.character}</li>`).join('')}</ul>
    `;

    const trailer = movie.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    if (trailer) {
        trailerContainer.innerHTML = `
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
        `;
    } else {
        trailerContainer.innerHTML = '<p>No trailer available.</p>';
    }

    movieModal.style.display = 'block';
}

// Show actor details on a new page
function showActorDetails(actorId) {
    window.location.href = `actor.html?id=${actorId}`;
}

// Close modal
closeModal.onclick = function() {
    movieModal.style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == movieModal) {
        movieModal.style.display = 'none';
    }
}

// Fetch search suggestions
searchInput.addEventListener('input', async function() {
    const query = searchInput.value;
    if (query.length > 2) {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await response.json();
        suggestions.innerHTML = data.results.map(movie => `<div class="suggestion" data-movie-id="${movie.id}">${movie.title}</div>`).join('');
        
        document.querySelectorAll('.suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                showMovieDetails(suggestion.getAttribute('data-movie-id'));
                suggestions.innerHTML = '';
                searchInput.value = '';
            });
        });
    } else {
        suggestions.innerHTML = '';
    }
});

// Toggle theme
themeToggle.onclick = function() {
    document.body.classList.toggle('dark-theme');
}

// Initialize
fetchGenres();
fetchTrendingMovies();
fetchLatestTrailers();
