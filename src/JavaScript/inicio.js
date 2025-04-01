document.addEventListener("DOMContentLoaded", () => {
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [
        { id: 1, name: "Torrada", price: 3.20, imgSrc: "src/images/torada.jpg", quantity: 10 },    
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
    const openCartButton = document.getElementById('openCart'); 
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
        product.quantity -= 1;
        cartItems.push(product);
        updateCart();
        localStorage.setItem("produtos", JSON.stringify(produtos));
        renderProductList();
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
            totalPrice -= item.price;
        });

        totalPriceElement.innerHTML = `<strong>Total: R$ ${totalPrice.toFixed(2)}</strong>`;
    }

   // Função para remover um produto do carrinho
 window.removeFromCart = function(index) {
    const removedItem = cartItems.splice(index, 1)[0]; // Remove o item do carrinho
    const product = produtos.find(p => p.id === removedItem.id); // Encontra o produto no estoque

    if (product) {
        // Incrementa 1 unidade ao estoque
        product.quantity += 1; // Garante que apenas 1 unidade seja adicionada ao estoque
    }

    updateCart(); // Atualiza o carrinho
    localStorage.setItem("produtos", JSON.stringify(produtos)); // Salva os produtos atualizados no localStorage
    renderProductList(); // Renderiza a lista de produtos no estoque
};


document.getElementById('checkoutButton').addEventListener('click', () => {
    let totalSales = parseFloat(localStorage.getItem("totalSales")) || 0;  // Obtém o total de vendas anterior
    let cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0); // Calcula o total do carrinho
    
    totalSales += cartTotal;  // Soma com o total anterior

    localStorage.setItem("totalSales", totalSales); // Atualiza no localStorage

    updateTotalSales(); // Se existir essa função, ela deve atualizar a interface

    // Limpa o carrinho
    cartItems.length = 0;
    updateCart();
    localStorage.setItem("produtos", JSON.stringify(produtos));
    alert("Compra finalizada!");

    localStorage.removeItem("cartItems");
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
    const checkoutButton = document.getElementById('checkoutButton');
    const closeModalButton = document.getElementById('closeModal');
    const reviewModal = document.getElementById('reviewModal');
    const stars = document.querySelectorAll('.star');

    if (checkoutButton && reviewModal) {
        checkoutButton.addEventListener('click', () => {
            reviewModal.classList.remove('hidden');
            stars.forEach(star => star.classList.remove("rated"));
        });
    }

    if (closeModalButton && reviewModal) {
        closeModalButton.addEventListener('click', () => {
            reviewModal.classList.add('hidden');
        });
    }

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const ratingValue = star.getAttribute('data-value');
            setRating(ratingValue);
        });
    });

    function setRating(rating) {
        stars.forEach(star => {
            const starValue = star.getAttribute('data-value');
            if (starValue <= rating) {
                star.classList.add('rated');
            } else {
                star.classList.remove('rated');
            }
        });
        console.log(`Usuário avaliou com ${rating} estrelas`);
    }
}); 