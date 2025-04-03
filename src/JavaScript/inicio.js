async function venderProduto(id) {
    try {
        // Faz a requisição para obter o produto atual
        let produtoResponse = await fetch(`${API_BASE_URL}/Produto/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!produtoResponse.ok) {
            throw new Error("Erro ao buscar produto.");
        }

        let produto = await produtoResponse.json();

        // Verifica se há estoque suficiente
        if (produto.quantidade <= 0) {
            alert("Estoque insuficiente!");
            return;
        }

        // Atualiza a quantidade vendida e remove do estoque
        produto.quantidade -= 1;
        produto.totalVendas = (produto.totalVendas || 0) + 1;

        // Envia a atualização para o banco
        let updateResponse = await fetch(`${API_BASE_URL}/Produto/Editar/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });

        if (!updateResponse.ok) {
            throw new Error("Erro ao registrar venda.");
        }

        alert("Venda registrada com sucesso!");
        await carregarProdutos(); // Atualiza a página
    } catch (error) {
        console.error("Erro ao vender produto:", error);
        alert("Erro ao registrar venda: " + error.message);
    }
}



let produtos = []; // Declara a variável no escopo global

document.addEventListener("DOMContentLoaded", async () => {
    const productList = document.getElementById("product-list");

    async function fetchProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/Produto`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar produtos do banco de dados");
            }

            const produtosData = await response.json();
            return produtosData;
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            alert("Erro ao carregar produtos: " + error.message);
            return [];
        }
    }

    produtos = await fetchProducts(); // Carrega os produtos do backend
    renderProductList(produtos); // Renderiza os produtos na página
});

document.addEventListener("DOMContentLoaded", () => {
    const cartItems = [];
    const totalPriceElement = document.getElementById("totalPrice");
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

   // Função para adicionar um produto ao carrinho
    window.addToCart = function (id) {
        // Certifique-se de que o array 'produtos' está acessível
        const product = produtos.find(p => p.id === id);

        if (product) {
            if (product.quantidade > 0) {
                // Verifica se o produto já está no carrinho
                const cartItem = cartItems.find(item => item.id === id);
                if (cartItem) {
                    // Incrementa a quantidade no carrinho
                    cartItem.quantity += 1;
                } else {
                    // Adiciona o produto ao carrinho
                    cartItems.push({
                        id: product.id,
                        name: product.nome,
                        price: product.preco,
                        quantity: 1
                    });
                }

                // Atualiza o carrinho
                updateCart();
            } else {
                alert("Produto esgotado!");
            }
        } else {
            alert("Produto não encontrado!");
        }
    };

    // Função para atualizar o carrinho de compras
    function updateCart() {
        cartContainer.innerHTML = "";

        let totalPrice = 0;

        if (cartItems.length === 0) {
            cartContainer.innerHTML = "<p>Carrinho vazio</p>";
            totalPriceElement.innerHTML = "<strong>Total: R$ 0.00</strong>";
            return;
        }

        cartItems.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <p>${item.name} - R$ ${item.price.toFixed(2)} (x${item.quantity})</p>
                <button onclick="removeFromCart(${index})">Remover</button>
            `;

            cartContainer.appendChild(cartItem);
            totalPrice += item.price * item.quantity; // Calcula o preço total com base na quantidade
        });

        totalPriceElement.innerHTML = `<strong>Total: R$ ${totalPrice.toFixed(2)}</strong>`;
    }

   // Função para remover um produto do carrinho
    window.removeFromCart = function (index) {
        const cartItem = cartItems[index]; // Obtém o item do carrinho pelo índice
        const product = produtos.find(p => p.id === cartItem.id); // Encontra o produto no estoque

        if (product) {
            // Incrementa 1 unidade ao estoque
            product.quantidade += 1;


            // Reduz a quantidade do item no carrinho
            cartItem.quantity -= 1;

            // Remove o item do carrinho se a quantidade for 0
            if (cartItem.quantity === 0) {
                cartItems.splice(index, 1); // Remove o item do carrinho
            }
        }

        // Atualiza o carrinho e a lista de produtos
        updateCart();
        renderProductList(produtos);

        // Salva os produtos atualizados no localStorage
        localStorage.setItem("produtos", JSON.stringify(produtos));
    };

const thankYouModal = document.getElementById("thankYouModal");
const thankYouMessage = document.getElementById("thankYouMessage");

document.getElementById('checkoutButton').addEventListener('click', async () => {
    let totalSales = parseFloat(localStorage.getItem("totalSales")) || 0; // Obtém o total de vendas anterior
    let cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0); // Calcula o total do carrinho

    totalSales += cartTotal; // Soma com o total anterior

    // Atualiza o total de vendas no localStorage
    localStorage.setItem("totalSales", totalSales);

    // Atualiza o estoque no backend com base nos itens comprados
    try {
        for (const cartItem of cartItems) {
            const product = produtos.find(p => p.id === cartItem.id);
            if (product) {
                product.quantidade -= cartItem.quantity; // Desconta a quantidade comprada do estoque

                // Envia a atualização para o backend
                const response = await fetch(`${API_BASE_URL}/Produto/Editar/${product.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(product) // Envia o produto atualizado
                });

                if (!response.ok) {
                    throw new Error(`Erro ao atualizar o produto ${product.nome} no backend`);
                }
            }
        }

        // Atualiza o localStorage com os produtos atualizados
        localStorage.setItem("produtos", JSON.stringify(produtos));

        // Limpa o carrinho
        cartItems.length = 0;
        updateCart();
        renderProductList(produtos);

        // Exibe a mensagem de agradecimento no modal
        thankYouMessage.innerHTML = `Total da compra: R$ ${cartTotal.toFixed(2)}`;
        thankYouModal.classList.remove("hidden");
    } catch (error) {
        console.error("Erro ao atualizar o estoque no backend:", error);
        alert("Erro ao finalizar a compra. Tente novamente.");
    }
});

// Fechar o modal
document.getElementById("closeThankYouModal").addEventListener("click", () => {
    thankYouModal.classList.add("hidden");
});

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

// Função para renderizar a lista de produtos
window.renderProductList = function (produtos) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Limpa a lista de produtos antes de renderizar

    produtos.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${product.imgLink || 'img/produto-sem-imagem.jpg'}" alt="${product.nome}">
            <h3>${product.nome}</h3>
            <p>Preço: R$ ${product.preco.toFixed(2)}</p>
            <p>Disponível: ${product.quantidade}</p>
            <button onclick="addToCart(${product.id})">Adicionar ao carrinho</button>
        `;
        productList.appendChild(productCard);
    });

};