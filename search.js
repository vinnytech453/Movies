const API_KEY = 'cfa3a76f600a97a4ea76d149c6643963';
const BASE_URL = 'https://api.themoviedb.org/3';

document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('suggestions');

    // Search functionality
    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();
        if (query.length > 2) {
            const movies = await searchMovies(query);
            displaySearchResults(suggestionsContainer, movies);
        } else {
            suggestionsContainer.innerHTML = '';
        }
    });

    // Function to handle search movie details
    suggestionsContainer.addEventListener('click', async (event) => {
        const movieId = event.target.getAttribute('data-id');
        if (movieId) {
            showMovieDetails(movieId);
        }
    });
});

async function searchMovies(query) {
    const encodedQuery = encodeURIComponent(query);
    return fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodedQuery}`);
}

function displaySearchResults(container, movies) {
    container.innerHTML = movies.map(movie => `<div class="suggestion" data-id="${movie.id}">${movie.title}</div>`).join('');
}

async function showMovieDetails(movieId) {
    const movie = await fetchMovieDetails(movieId);
    if (!movie) {
        console.error('Failed to fetch movie details');
        return;
    }
    const movieDetails = document.getElementById('movie-details');
    const trailerContainer = document.getElementById('trailer-container');
    movieDetails.innerHTML = `
        <h2>${movie.title}</h2>
        <p>${movie.overview}</p>
        <h3>Cast</h3>
        <ul>
            ${movie.credits.cast.map(actor => `<li><a href="actor.html?id=${actor.id}">${actor.name}</a> as ${actor.character}</li>`).join('')}
        </ul>
    `;
    const trailer = movie.videos.results.find(video => video.type === 'Trailer');
    if (trailer) {
        trailerContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>`;
    } else {
        trailerContainer.innerHTML = '<p>No trailer available.</p>';
    }
    const movieModal = document.getElementById('movie-modal');
    movieModal.style.display = 'block';
}

async function fetchMovies(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}
