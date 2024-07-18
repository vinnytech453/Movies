const API_KEY = 'cfa3a76f600a97a4ea76d149c6643963';
const BASE_URL = 'https://api.themoviedb.org/3';

document.addEventListener('DOMContentLoaded', async () => {
    const actorId = getActorIdFromUrl();
    if (actorId) {
        const actorDetails = await fetchActorDetails(actorId);
        if (actorDetails) {
            displayActorDetails(actorDetails);
        } else {
            console.error('Failed to fetch actor details');
        }
    } else {
        console.error('Actor ID not found in URL');
    }
});

function getActorIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function fetchActorDetails(actorId) {
    try {
        const response = await fetch(`${BASE_URL}/person/${actorId}?api_key=${API_KEY}&append_to_response=credits`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching actor details:', error);
        return null;
    }
}

function displayActorDetails(actor) {
    const actorDetailsContainer = document.getElementById('actor-details');
    actorDetailsContainer.innerHTML = `
        <h2>${actor.name}</h2>
        <img src="https://image.tmdb.org/t/p/w300${actor.profile_path}" alt="${actor.name}">
        <p>${actor.biography}</p>
        <h3>Known For</h3>
        <ul>
            ${actor.credits.cast.map(credit => `<li>${credit.title} (${credit.character})</li>`).join('')}
        </ul>
    `;
}
