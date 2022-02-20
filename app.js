const form = document.querySelector('#form');
const searchInput = document.querySelector('#search');
const songsContainer = document.querySelector('#songs-container');
const prevAndNextContainer = document.querySelector('#prev-and-next-container');

const apiUrl = `https://api.lyrics.ovh`

const getMoreSongs = async (url) => {
  const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await response.json()

  insertSongDataIntoPage(data);
}

const insertPrevAndNextButtons = ({ prev, next }) => {
  prevAndNextContainer.innerHTML = `
    ${prev ? `<button class='btn' onClick="getMoreSongs('${prev}')">Anteriores</button>` : '' }
    ${next ? `<button class='btn' onClick="getMoreSongs('${next}')">Próximas</button>` : '' }
  `
}

const insertSongDataIntoPage = ({ data, prev, next }) => {
  songsContainer.innerHTML = data.map(({ artist: { name }, title }) => `
    <li class='song'>
      <span class='song-artist'><strong>${name}</strong> - ${title}</span>
      <button class='btn' data-artist='${name}' data-song-title='${title}'>Ver letra</button>
    </li>
  `).join('')

  insertPrevAndNextButtons({ prev, next });
}

const fetchSongs = async (term) => {
  const response = await fetch(`${apiUrl}/suggest/${term}`);   
  const data = await response.json()

  insertSongDataIntoPage(data);
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    songsContainer.innerHTML = `<li class='warning-message'> Insira um termo de pesquisa! </li>`
    return;
  }

  fetchSongs(searchTerm);
})

const insertLyricsIntoContainer = (artist, songTitle, lyrics) => {
  songsContainer.innerHTML = `
    <li class='lyrics-container'>
      <h2><strong>${songTitle}</strong> - ${artist}</h2>
      <p class='lyrics'>${lyrics}</p>
    </li>
  `
}

const fetchLyrics = async (artist, songTitle) => {
  const response = await fetch(`${apiUrl}/v1/${artist}/${songTitle}`);   
  const data = await response.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  insertLyricsIntoContainer(artist, songTitle, lyrics);
}

songsContainer.addEventListener('click', event => {
  const clickedElement = event.target;

  if(clickedElement.tagName === 'BUTTON') {
    const artist = clickedElement.getAttribute('data-artist');
    const songTitle = clickedElement.getAttribute('data-song-title');

    fetchLyrics(artist, songTitle);

    prevAndNextContainer.innerHTML = '';
  }
})