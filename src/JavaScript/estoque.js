const API_BASE_URL = 'http://localhost:7223/api';

document.addEventListener("DOMContentLoaded", () => {
    // Seleção de elementos
    const saveProductButton = document.getElementById("saveProductButton");
    const productsContainer = document.getElementById("products-container");
    const addProductButton = document.getElementById("addProductButton");
    const addProductForm = document.getElementById("addProductForm");
    const cancelButton = document.getElementById("cancelButton");
    const detalhesVendasButton = document.getElementById("DetalhesV");

    // Verificar se o elemento 'productsContainer' existe antes de tentar usá-lo
    if (!productsContainer) {
        return; // Evita a execução do código caso o container não exista
    }

    // Mostrar formulário de adicionar produto
    if (addProductButton && addProductForm) {
        addProductButton.addEventListener("click", () => {
            addProductForm.classList.remove("hidden");
        });
    }

    // Cancelar formulário
    if (cancelButton) {
        cancelButton.addEventListener("click", () => {
            addProductForm.classList.add("hidden");
        });
    } else {
        console.error("Botão de cancelar não encontrado.");
    }

    // Navegar para a página de detalhes das vendas
    if (detalhesVendasButton) {
        detalhesVendasButton.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = "detalhes.html";
        });
    }

    // Salvar produto
    if (saveProductButton) {
        saveProductButton.addEventListener("click", async () => {
            try {
                const nameInput = document.getElementById("newProductName");
                const priceInput = document.getElementById("newProductpreco");
                const quantityInput = document.getElementById("newProductQuantity");
                const imgLinkInput = document.getElementById("newProductImgLink");

                if (!nameInput || !priceInput || !quantityInput || !imgLinkInput) {
                    throw new Error("Campos do formulário não encontrados");
                }

                const name = nameInput.value.trim();
                const preco = parseFloat(priceInput.value);
                const quantity = parseInt(quantityInput.value);
                const imgLink = imgLinkInput.value.trim();

                if (!name || isNaN(preco) || isNaN(quantity) || !imgLink) {
                    throw new Error("Preencha todos os campos corretamente");
                }

                const novoProduto = {
                    nome: name,
                    preco: preco,
                    quantidade: quantity,
                    imgLink: imgLink
                };

                const response = await fetch(`${API_BASE_URL}/Produto/Adicionar`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(novoProduto)
                });

                if (!response.ok) {
                    throw new Error("Erro ao salvar produto.");
                }

                alert("Produto salvo com sucesso!");
                addProductForm.classList.add("hidden");
                carregarProdutos(); // Carregar novamente a lista de produtos

            } catch (error) {
                console.error("Erro ao salvar produto:", error.message);
                alert("Erro ao salvar produto: " + error.message);
            }
        });
    }

    // Carregar produtos usando fetch e renderProductList
    async function carregarProdutos() {
        try {
            const produtosData = await fetchProducts();
            renderProductList(produtosData);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            alert("Erro ao carregar produtos: " + error.message);
        }
    }

    // Função para renderizar os produtos
    window.renderProductList = function (produtos) {
        productsContainer.innerHTML = ""; // Limpa a lista de produtos

        if (!produtos || produtos.length === 0) {
            productsContainer.innerHTML = "<p>Não há produtos disponíveis.</p>";
            return;
        }

        // Exibe os produtos no container
        produtos.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card");

            productDiv.innerHTML = `
                <img src="${product.imgLink || 'img/produto-sem-imagem.jpg'}" alt="${product.nome}" onerror="this.src='img/produto-sem-imagem.jpg'">
                <h3>${product.nome}</h3>
                <p>Preço: R$ ${product.preco.toFixed(2)}</p>
                <p>Quantidade: ${product.quantidade}</p>
                <button class="remove-stock-btn" data-id="${product.id}">Excluir</button>
                <button class="add-stock-btn" data-id="${product.id}">Adicionar mais um</button>
                <button class="sell-product-btn" data-id="${product.id}">Vender</button>
            `;

            productsContainer.appendChild(productDiv);
        });

        adicionarEventosBotoes(); // Adiciona os eventos aos botões após renderizar
    };

    // Carregar os produtos inicialmente
    carregarProdutos();
});

// ======================== Eventos dos botões dos produtos ============================
function adicionarEventosBotoes() {
    document.querySelectorAll(".remove-stock-btn").forEach(button => {
        const id = button.getAttribute("data-id");
        button.addEventListener("click", () => removerProduto(id));
    });

    document.querySelectorAll(".add-stock-btn").forEach(button => {
        const id = button.getAttribute("data-id");
        button.addEventListener("click", () => adicionarAoEstoque(id));
    });

    document.querySelectorAll(".sell-product-btn").forEach(button => {
        const id = button.getAttribute("data-id");
        button.addEventListener("click", () => venderProduto(id));
    });
}

// ============================ Funções de ação ===============================
async function adicionarAoEstoque(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/Produto/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar produto.");
        const produto = await res.json();
        produto.quantidade++;

        const response = await fetch(`${API_BASE_URL}/Produto/Editar/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });

        if (!response.ok) throw new Error("Erro ao atualizar produto.");
        carregarProdutos();

    } catch (err) {
        console.error("Erro ao adicionar ao estoque:", err);
    }
}

async function removerProduto(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/Produto/Remover/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Erro ao remover produto.");
        carregarProdutos();
    } catch (err) {
        console.error("Erro ao remover produto:", err);
    }
}

async function venderProduto(id) {
    try {
        // Busca o produto
        const res = await fetch(`${API_BASE_URL}/Produto/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar produto.");
        const produto = await res.json();

        if (produto.quantidade <= 0) {
            alert("Estoque insuficiente!");
            return;
        }

        // Atualiza a quantidade do produto
        produto.quantidade--;

        // Atualiza o produto no banco
        const response = await fetch(`${API_BASE_URL}/Produto/Editar/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });

        if (!response.ok) throw new Error("Erro ao atualizar produto.");

        // Registra a venda
        const vendaResponse = await fetch(`${API_BASE_URL}/Vendas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                produtoId: produto.id,
                quantidade: 1,
                dataVenda: new Date().toISOString(),
                precoUnitario: produto.preco,
                nomeProduto: produto.nome
            })
        });

        if (!vendaResponse.ok) {
            const errorData = await vendaResponse.json();
            console.error("Erro ao registrar a venda:", errorData);
            throw new Error("Erro ao registrar venda no sistema de vendas.");
        }

        alert("Venda registrada com sucesso!");
        carregarProdutos();
    } catch (err) {
        console.error("Erro ao vender produto:", err);
        alert("Erro ao vender produto: " + err.message);
    }
}

async function fetchProducts() {
    try {
        console.log('Tentando buscar produtos...');
        console.log('URL da requisição:', `${API_BASE_URL}/Produto`);
        
        const response = await fetch(`${API_BASE_URL}/Produto/${id}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            mode: 'cors'
        });

        console.log('Status da resposta:', response.status);
        console.log('Headers da resposta:', response.headers);
        
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
