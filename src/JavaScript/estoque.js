// Adiciona as funções de renderização e carregamento de produtos após a definição dos elementos.

const API_BASE_URL = 'https://localhost:7223/api';

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

                const response = await fetch(`${API_BASE_URL}/Produto/Cadastrar`, {
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
            const response = await fetch(`${API_BASE_URL}/Produto`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erro ao carregar produtos.");
            }

            const produtos = await response.json();
            renderProductList(produtos); // Substituindo a renderização com a nova função

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
        const res = await fetch(`${API_BASE_URL}/Produto/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar produto.");
        const produto = await res.json();

        if (produto.quantidade <= 0) {
            alert("Estoque insuficiente!");
            return;
        }

        produto.quantidade--;

        const response = await fetch(`${API_BASE_URL}/Produto/Editar/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });

        if (!response.ok) throw new Error("Erro ao vender produto.");
        carregarProdutos();
    } catch (err) {
        console.error("Erro ao vender produto:", err);
    }
}
