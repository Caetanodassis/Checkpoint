// Carregar e exibir jogos
displayGames(allGames);

// Função para exibir os jogos
function displayGames(games) {
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = '';

    if (games.length === 0) {
        gamesGrid.innerHTML = '<p class="no-results">Nenhum jogo encontrado.</p>';
        return;
    }

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
        <div class="game-poster">
            <img src="${game.poster}" alt="${game.title}">
            <div class="game-rating">
            <span class="rating-number">${game.rating}</span>
            <span class="rating-star">★</span>
            </div>
        </div>
        <div class="game-info">
            <h3 class="game-title">${game.title}</h3>
            <p class="game-platform">${game.platform}</p>
        </div>
        `;

        // CORRIGIDO: Navega usando o ID do jogo
        gameCard.addEventListener('click', () => {
            window.location.href = `game.html?id=${game.id}`;
        });

        gamesGrid.appendChild(gameCard);
    });
}

// Preenche o filtro de ano
const yearFilter = document.getElementById('yearFilter');
const currentYear = new Date().getFullYear();
for (let year = currentYear; year >= 1958; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
}

// Variáveis de estado dos filtros
let selectedRating = 0;
const searchInput = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-btn');
const filterSelects = document.querySelectorAll('.filter-select');
const starsContainer = document.getElementById('starsContainer');
const stars = starsContainer.querySelectorAll('.star');
const allStarParts = starsContainer.querySelectorAll('.star-half, .star-full');

// --- SISTEMA DE AVALIAÇÃO ---
allStarParts.forEach(part => {
    part.addEventListener('mouseenter', function() {
        const value = parseFloat(this.dataset.value);
        updateStars(value);
    });

    part.addEventListener('click', function() {
        selectedRating = parseFloat(this.dataset.value);
        applyFilters();
    });
});

starsContainer.addEventListener('mouseleave', function() {
    updateStars(selectedRating);
});

function updateStars(rating) {
    stars.forEach((star, index) => {
        const starValue = index + 1;
        star.classList.remove('half', 'full');
        if (rating >= starValue) {
            star.classList.add('full');
        } else if (rating >= starValue - 0.5) {
            star.classList.add('half');
        }
    });
}

// --- PESQUISA ---
searchButton.addEventListener('click', applyFilters);
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') applyFilters();
});

// --- FILTROS ---
filterSelects.forEach(select => {
    select.addEventListener('change', applyFilters);
});

// --- FUNÇÃO PRINCIPAL DE FILTRAGEM ---
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const platform = filterSelects[0].value;
    const genre = filterSelects[1].value;
    const year = filterSelects[2].value;
    const mode = filterSelects[3].value;

    let filtered = allGames.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm);
        const matchesPlatform = !platform || game.platform.toLowerCase().includes(platform);
        const matchesGenre = !genre || game.genre.toLowerCase().includes(genre);
        const matchesYear = !year || String(game.year) === year;
        const matchesMode = !mode || game.mode.toLowerCase().includes(mode);
        const matchesRating = !selectedRating || game.rating >= selectedRating;

        return matchesSearch && matchesPlatform && matchesGenre && matchesYear && matchesMode && matchesRating;
    });

    displayGames(filtered);
}

// --- LIMPAR FILTROS ---
document.querySelector('.clear-filters-btn').addEventListener('click', function() {
    document.querySelectorAll('.filter-select').forEach(select => select.value = '');
    document.querySelector('.search-bar').value = '';
    selectedRating = 0;
    updateStars(0);
    displayGames(allGames);
});