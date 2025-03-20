document.addEventListener("DOMContentLoaded", function () {
    const reviewsContainer = document.getElementById("reviews-container");

    // Função para carregar as avaliações do localStorage
    function loadReviews() {
        const reviews = JSON.parse(localStorage.getItem("avaliacoes")) || [];
        
        // Limpa o container antes de adicionar as novas avaliações
        reviewsContainer.innerHTML = '';
        
        // Adiciona as avaliações ao container
        reviews.forEach(review => {
            const reviewDiv = document.createElement("div");
            reviewDiv.classList.add("review");
            
            reviewDiv.innerHTML = `
                <p class="review-text">"${review.texto}"</p>
                <p class="review-rating">Avaliação: ${"★".repeat(review.estrelas)}${"☆".repeat(5 - review.estrelas)}</p>
                <p class="review-date">Data: ${review.data}</p>
            `;
            
            reviewsContainer.appendChild(reviewDiv);
        });
    }

    // Carrega as avaliações ao carregar a página
    loadReviews();
});



const newReview = {
    texto: "Produto excelente!",
    estrelas: 5,
    data: new Date().toLocaleString()  // Data e hora no formato local
};

// Salva no localStorage
let reviews = JSON.parse(localStorage.getItem("avaliacoes")) || [];
reviews.push(newReview);
localStorage.setItem("avaliacoes", JSON.stringify(reviews));
