const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const musicGrid = document.getElementById("music-grid");
const sortSelect = document.getElementById("sort-select");
const themeToggle = document.getElementById("theme-toggle");


const API_URL =
  "https://itunes.apple.com/search?media=music&limit=20&term=";
let musicArray = [];

function showSkeletons() {
  musicGrid.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const skeleton = document.createElement("div");
    skeleton.classList.add("skeleton-card");
    skeleton.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-title"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-year"></div>
    `;
    musicGrid.appendChild(skeleton);
  }
}

async function fetchMusic(searchTerm) {
  showSkeletons();
  const response = await fetch(`${API_URL}${searchTerm}`);
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    // Remove duplicates by collection name
    const seen = new Set();
    const uniqueResults = data.results.filter(function(item) {
      const title = item.collectionName || item.trackName;
      if (seen.has(title)) {
        return false;
      }
      seen.add(title);
      return true;
    });

    musicArray = uniqueResults;
    displayMusic(musicArray);
  } else {
    musicGrid.innerHTML = "<p>No results found. Try another search!</p>";
  }
}

function displayMusic(albums) {
  musicGrid.innerHTML = "";

  albums.forEach(function (album) {
    const card = document.createElement("div");
    card.classList.add("music-card");

    const artwork = album.artworkUrl100
      ? album.artworkUrl100.replace("100x100", "400x400")
      : "https://via.placeholder.com/300x400?text=No+Image";

    card.innerHTML = `
      <img src="${artwork}" alt="${album.collectionName}" />
      <div class="music-card-info">
        <h3>${album.collectionName || "Unknown Album"}</h3>
        <p>Artist: ${album.artistName || "Unknown Artist"}</p>
        <p>Tracks: ${album.trackCount || "Unknown"}</p>
        <p class="year">${album.releaseDate ? album.releaseDate.substring(0, 4) : "Unknown Year"}</p>
      </div>
    `;

    musicGrid.appendChild(card);
  });
}

sortSelect.addEventListener("change", function () {
  const sortValue = sortSelect.value;
  let sortedMusic = [...musicArray];

  if (sortValue === "az") {
    sortedMusic.sort((a, b) =>
      a.collectionName.localeCompare(b.collectionName),
    );
  } else if (sortValue === "za") {
    sortedMusic.sort((a, b) =>
      b.collectionName.localeCompare(a.collectionName),
    );
  } else if (sortValue === "newest") {
    sortedMusic.sort(
      (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate),
    );
  } else if (sortValue === "oldest") {
    sortedMusic.sort(
      (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate),
    );
  }

  displayMusic(sortedMusic);
});

searchBtn.addEventListener("click", function () {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchMusic(searchTerm);
  }
});

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      fetchMusic(searchTerm);
    }
  }
});

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
});
