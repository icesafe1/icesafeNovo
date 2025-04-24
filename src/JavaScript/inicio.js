const API_BASE_URL = 'https://localhost:7223/api';


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

        // Envia a atualização para o banco
        let updateResponse = await fetch(`${API_BASE_URL}/Produto/Editar/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });
        if (!updateResponse.ok) {
            throw new Error("Erro ao registrar venda.");
        }
        const vendaResponse = await fetch("https://localhost:7223/api/Vendas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                produtoId: product.id,
                quantidade: cartItem.quantity,
                dataVenda: new Date().toISOString() // <-- ESSA LINHA ADICIONADA
            })
        });
        
    
        
        
        if (!vendaResponse.ok) {
            const errorData = await vendaResponse.json();
            console.error("Erro ao registrar a venda:", errorData);
            throw new Error("Erro ao registrar venda no sistema de vendas.");
        }
        

        alert("Venda registrada com sucesso!");
        produtos = await fetchProducts(); // Atualiza a lista de produtos
        renderProductList(produtos); // Atualiza a exibição
    } catch (error) {
        console.error("Erro ao vender produto:", error);
        alert("Erro ao registrar venda: " + error.message);
    }
}



let produtos = []; // Declara a variável no escopo global

async function fetchProducts() {
    try {
        console.log('Tentando buscar produtos...');
        console.log('URL da requisição:', `${API_BASE_URL}/Produto`);
        
        const response = await fetch(`${API_BASE_URL}/Produto`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            mode: 'cors' // Adiciona explicitamente o modo CORS
        });

        console.log('Status da resposta:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta do servidor:', errorText);
            throw new Error(`Erro ao buscar produtos do banco de dados. Status: ${response.status}`);
        }

        const produtosData = await response.json();
        console.log('Produtos recebidos:', produtosData);
        return produtosData;
    } catch (error) {
        console.error("Erro detalhado ao carregar produtos:", error);
        if (error.message.includes('Failed to fetch')) {
            alert("Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 7223.");
        } else {
            alert("Erro ao carregar produtos: " + error.message);
        }
        return [];
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const productList = document.getElementById("product-list");

    // Carrega os produtos do backend
    produtos = await fetchProducts();
    renderProductList(produtos); // Renderiza os produtos na página
});

document.addEventListener("DOMContentLoaded", () => {
    let cartItems = [];
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

                // Abre o carrinho automaticamente
                const cartSidebar = document.getElementById("cartSidebar");
                if (cartSidebar) {
                    cartSidebar.style.display = 'block'; // Torna o carrinho visível
                } else {
                    console.error("Carrinho não encontrado no DOM.");
                }
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

        if (cartItem) {
            // Reduz a quantidade do item no carrinho
            cartItem.quantity -= 1;

            // Remove o item do carrinho se a quantidade for 0
            if (cartItem.quantity === 0) {
                cartItems.splice(index, 1); // Remove o item do carrinho
            }
        }

        // Atualiza o carrinho
        updateCart();
    };

    document.getElementById('checkoutButton')?.addEventListener('click', async () => {
        if (cartItems.length === 0) {
            alert("O carrinho está vazio!");
            return;
        }

        try {
            // Primeiro, verifica se todos os produtos ainda estão disponíveis
            const produtos = await fetchProducts();
            let produtosAtualizados = [...produtos];

            // Verifica estoque e prepara atualizações
            for (const cartItem of cartItems) {
                const product = produtosAtualizados.find(p => p.id === cartItem.id);
                if (!product) {
                    throw new Error(`Produto ${cartItem.name} não encontrado no sistema`);
                }
                if (product.quantidade < cartItem.quantity) {
                    throw new Error(`Estoque insuficiente para o produto ${product.nome}`);
                }
            }

            // Processa cada item do carrinho
            for (const cartItem of cartItems) {
                const product = produtosAtualizados.find(p => p.id === cartItem.id);
                
                // Atualiza a quantidade no produto
                product.quantidade -= cartItem.quantity;

                // Atualiza o produto no backend
                const updateResponse = await fetch(`${API_BASE_URL}/Produto/Editar/${product.id}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        id: product.id,
                        nome: product.nome,
                        preco: product.preco,
                        quantidade: product.quantidade,
                        imgLink: product.imgLink
                    })
                });

                if (!updateResponse.ok) {
                    const errorText = await updateResponse.text();
                    console.error("Erro ao atualizar produto:", errorText);
                    throw new Error(`Erro ao atualizar o produto ${product.nome}`);
                }

                // Registra a venda
                const vendaData = {
                    produtoId: product.id,
                    quantidade: cartItem.quantity,
                    dataVenda: new Date().toISOString() // Envia a data em formato ISO (UTC)
                };

                console.log("Enviando dados da venda:", vendaData);

                const vendaResponse = await fetch(`${API_BASE_URL}/Vendas`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(vendaData)
                });

                if (!vendaResponse.ok) {
                    const errorText = await vendaResponse.text();
                    console.error("Erro ao registrar venda:", errorText);
                    throw new Error(`Erro ao registrar a venda do produto ${product.nome}`);
                }
            }

            // Atualiza o total de vendas no localStorage
            let totalSales = parseFloat(localStorage.getItem("totalSales")) || 0;
            let cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            totalSales += cartTotal;
            localStorage.setItem("totalSales", totalSales);

            // Mostra o modal de agradecimento
            const thankYouModal = document.getElementById('thankYouModal');
            if (thankYouModal) {
                thankYouModal.classList.remove('hidden');
            }

            // Limpa o carrinho e atualiza a interface
            cartItems = [];
            updateCart();
            
            // Atualiza a lista de produtos
            produtosAtualizados = await fetchProducts();
            renderProductList(produtosAtualizados);
        } catch (error) {
            console.error("Erro durante a finalização da compra:", error);
            alert("Ocorreu um erro ao finalizar a compra: " + error.message);
        }
    });
    
    // Adiciona evento para fechar o modal de agradecimento
    document.getElementById('closeThankYouModal')?.addEventListener('click', () => {
        const thankYouModal = document.getElementById('thankYouModal');
        if (thankYouModal) {
            thankYouModal.classList.add('hidden');
        }
    });

});

window.renderProductList = function (produtos) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Limpa a lista de produtos antes de renderizar

    // Filtra produtos com quantidade maior que 0
    const produtosDisponiveis = produtos.filter(product => product.quantidade > 0);

    // Renderiza apenas os produtos disponíveis
    produtosDisponiveis.forEach((product) => {
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
// Exibir o modal
document.getElementById("thankYouModal").classList.remove("hidden");

// Fechar o modal
document.getElementById("closeThankYouModal").addEventListener("click", function () {
    document.getElementById("thankYouModal").classList.add("hidden");
});
