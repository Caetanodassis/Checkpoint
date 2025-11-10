window.onload = function() {
  // 1️⃣ Captura o nome do jogo passado pela URL
  const params = new URLSearchParams(window.location.search);
  const gameTitle = params.get('title');

  // 2️⃣ Busca o jogo no array allGames (do games-data.js)
  const game = allGames.find(g => g.title === gameTitle);

  // 3️⃣ Referências dos elementos HTML
  const titleElement = document.getElementById('gameTitle');
  const posterElement = document.getElementById('gamePoster');
  const descriptionElement = document.getElementById('gameDescription');
  const platformElement = document.getElementById('gamePlatform');
  const genreElement = document.getElementById('gameGenre');
  const yearElement = document.getElementById('gameYear');
  const ratingElement = document.getElementById('gameRating');
  const reviewsList = document.getElementById('reviewsList');
  const addReviewBtn = document.getElementById('addReviewBtn');

  // 4️⃣ Verifica se o jogo existe
  if (!game) {
    document.body.innerHTML = '<p>Jogo não encontrado.</p>';
    return;
  }

  // 5️⃣ Preenche os elementos com os dados do jogo
  titleElement.textContent = game.title;
  posterElement.src = game.poster;
  descriptionElement.textContent = game.description || 'Sem descrição disponível.';
  platformElement.textContent = `Plataforma: ${game.platform}`;
  genreElement.textContent = `Gênero: ${game.genre}`;
  yearElement.textContent = `Ano: ${game.year}`;
  ratingElement.textContent = `Avaliação: ${game.rating}`;

  // 6️⃣ Exibe avaliações salvas no localStorage
  showReviews();

  // --- FUNÇÃO PARA MOSTRAR AVALIAÇÕES ---
  function showReviews() {
    const reviews = JSON.parse(localStorage.getItem(`reviews_${gameTitle}`)) || [];
    if (!reviewsList) return;
    reviewsList.innerHTML = '';
    reviews.forEach(review => {
      const li = document.createElement('li');
      li.textContent = `⭐ ${review.rating} - ${review.text}`;
      reviewsList.appendChild(li);
    });
  }

  // --- FUNÇÃO PARA ADICIONAR AVALIAÇÃO ---
  if (addReviewBtn) {
    addReviewBtn.addEventListener('click', () => {
      const rating = prompt('Dê uma nota de 1 a 5:');
      const text = prompt('Digite um comentário:');

      if (!rating || rating < 1 || rating > 5) {
        alert('Nota inválida.');
        return;
      }

      const newReview = { rating: parseInt(rating), text };
      const reviews = JSON.parse(localStorage.getItem(`reviews_${gameTitle}`)) || [];
      reviews.push(newReview);

      localStorage.setItem(`reviews_${gameTitle}`, JSON.stringify(reviews));
      showReviews();
    });
  }
};