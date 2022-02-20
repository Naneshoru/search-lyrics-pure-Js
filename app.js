const form = document.querySelector('#form');
const searchInput = document.querySelector('#search');
const songsContainer = document.querySelector('#songs-container');
const prevAndNextContainer = document.querySelector('#prev-and-next-container');

form.addEventListener('submit', event => {
  event.preventDefault();

  const searchTerm = searchInput.value;

  fetchSongs(searchTerm);
})