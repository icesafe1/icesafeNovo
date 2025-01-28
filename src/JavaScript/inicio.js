document.addEventListener("DOMContentLoaded", () => {
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [
        { id: 1, name: "Torrada", price: 3.20, imgSrc: "src/images/torada.jpg", quantity: 10 },
        { id: 2, name: "Bolacha Bauducco", price: 2.50, imgSrc: "src/images/bolacha bauduco 2,50.jpg", quantity: 15 },
        { id: 3, name: "Tortuguita", price: 1.00, imgSrc: "src/images/tortuguita 1,00.jpg", quantity: 20 }
    ];
    const cartItems = [];
    const totalPriceElement = document.getElementById("totalPrice");
    const productList = document.getElementById("product-list");
    const cartContainer = document.querySelector(".cart-items");

    // Função para abrir o carrinho
    const openCart = () => {
        const cartSidebar = document.getElementById("cartSidebar");
        cartSidebar.style.display = 'block';  // Torna o carrinho visível
    };

    // Função para fechar o carrinho
    const closeCart = () => {
        const cartSidebar = document.getElementById("cartSidebar");
        cartSidebar.style.display = 'none';  // Torna o carrinho invisível
    };

    // Adiciona o evento de clique para abrir o carrinho (por exemplo, em um botão com ID 'openCart')
    const openCartButton = document.getElementById('openCart'); // Adicione um botão com esse ID
    if (openCartButton) {
        openCartButton.addEventListener('click', openCart);
    }

    // Adiciona o evento de clique para fechar o carrinho ao clicar no 'X'
    const closeCartButton = document.getElementById('closeCart');
    if (closeCartButton) {
        closeCartButton.addEventListener('click', closeCart);
    }

    // Função para renderizar a lista de produtos no estoque
    function renderProductList() {
        productList.innerHTML = "";
        produtos.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <img src="${product.imgSrc}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Preço: R$ ${product.price.toFixed(2)}</p>
                <p>Disponível: ${product.quantity}</p>
                <button onclick="addToCart(${product.id})">Adicionar ao carrinho</button>
            `;
            productList.appendChild(productCard);
        });
    }

    // Função para adicionar um produto ao carrinho
    window.addToCart = function(id) {
        const product = produtos.find(p => p.id === id);

        if (product && product.quantity > 0) {
            // Decrementa a quantidade no estoque
            product.quantity -= 1;
            // Adiciona o produto ao carrinho
            cartItems.push(product);
            updateCart();
            // Atualiza o localStorage
            localStorage.setItem("produtos", JSON.stringify(produtos));
            renderProductList(); // Re-renderiza a lista de produtos
        } else {
            alert("Produto esgotado!");
        }
    };

    // Função para atualizar o carrinho de compras
    function updateCart() {
        cartContainer.innerHTML = "";

        let totalPrice = 0;

        if (cartItems.length === 0) {
            cartContainer.innerHTML = "<p>Carrinho vazio</p>";
        }

        cartItems.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <p>${item.name} - R$ ${item.price.toFixed(2)}</p>
                <button onclick="removeFromCart(${index})">Remover</button>
            `;

            cartContainer.appendChild(cartItem);
            totalPrice += item.price;
        });

        totalPriceElement.innerHTML = `<strong>Total: R$ ${totalPrice.toFixed(2)}</strong>`;
    }

    // Função para remover um produto do carrinho
    window.removeFromCart = function(index) {
        const removedItem = cartItems.splice(index, 1)[0];
        const product = produtos.find(p => p.id === removedItem.id);
        if (product) {
            // Volta a quantidade do produto para o estoque
            product.quantity += 1;
        }
        updateCart();
        localStorage.setItem("produtos", JSON.stringify(produtos));
        renderProductList();
    };

    // Função para limpar o carrinho
    document.getElementById('checkoutButton').addEventListener('click', () => {
        // Limpa o carrinho
        cartItems.length = 0;
        updateCart();  // Atualiza o carrinho na interface
        localStorage.setItem("produtos", JSON.stringify(produtos));  // Atualiza o estoque no localStorage
        alert("Compra finalizada!");  // Exibe uma mensagem de sucesso
    });
    

    renderProductList(); // Inicializa a lista de produtos
});
document.addEventListener("DOMContentLoaded", () => {
    const openCartButton = document.getElementById('imageButton');  // Botão para abrir o carrinho
    const cartSidebar = document.getElementById('cartSidebar');  // O carrinho
    const closeCartButton = document.getElementById('closeCart');  // Botão de fechar carrinho

    // Função para abrir o carrinho
    openCartButton.addEventListener('click', () => {
        cartSidebar.style.display = 'block';  // Torna o carrinho visível
    });

    // Função para fechar o carrinho
    closeCartButton.addEventListener('click', () => {
        cartSidebar.style.display = 'none';  // Torna o carrinho invisível
    });
});


//estrelas

document.addEventListener("DOMContentLoaded", () => {
    const checkoutButton = document.getElementById('checkoutButton');  // Botão de "Finalizar Compra"
    const closeModalButton = document.getElementById('closeModal');  // Botão de "Voltar"
    const reviewModal = document.getElementById('reviewModal');  // Modal de Avaliação
    const stars = document.querySelectorAll('.star');  // Estrelas de avaliação

    // Abre o modal de avaliação ao clicar em "Finalizar Compra"
    checkoutButton.addEventListener('click', () => {
        reviewModal.classList.remove('hidden');  // Remove a classe 'hidden' para mostrar o modal
    });

    // Fecha o modal de avaliação ao clicar em "Voltar"
    closeModalButton.addEventListener('click', () => {
        reviewModal.classList.add('hidden');  // Adiciona a classe 'hidden' para esconder o modal
    });
    

    // Adiciona o comportamento de clique nas estrelas
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const ratingValue = star.getAttribute('data-value');  // Pega o valor da estrela clicada
            setRating(ratingValue);  // Atualiza as estrelas com o valor selecionado
        });
    });

    // Função para marcar as estrelas como avaliadas
    function setRating(rating) {
        stars.forEach(star => {
            const starValue = star.getAttribute('data-value');
            if (starValue <= rating) {
                star.classList.add('rated');  // Marca a estrela com cor dourada
            } else {
                star.classList.remove('rated');  // Remove a cor dourada da estrela
            }
        });
    }
});
