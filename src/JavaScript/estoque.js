const API_BASE_URL = 'https://localhost:7223/api';

// Seleciona os elementos do DOM
const addProductForm = document.getElementById("addProductForm");
const addProductButton = document.getElementById("addProductButton");
const saveProductButton = document.getElementById("saveProductButton");
const productsContainer = document.getElementById("products-container");
const cancelButton = document.getElementById("cancelButton");

// Exibir o formulário ao clicar no botão "Adicionar Produto"
addProductButton.addEventListener("click", () => {
    addProductForm.classList.remove("hidden");
}
);

// Captura os dados do formulário e envia para a API
saveProductButton.addEventListener("click", async () => {
    try {
        // Verifica se os elementos existem antes de acessar .value
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

        const newProduct = { 
            Nome: name, 
            Preco: preco, 
            Quantidade: quantity, 
            imgLink: imgLink 
        };

        console.log("Enviando produto:", newProduct);

        const response = await fetch(`${API_BASE_URL}/Produto/Adicionar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Erro ao adicionar produto");
        }

        alert("Produto adicionado com sucesso!");

        // Limpa os campos do formulário manualmente
        nameInput.value = "";
        priceInput.value = "";
        quantityInput.value = "";
        imgLinkInput.value = "";

        addProductForm.classList.add("hidden"); // Oculta o formulário
        await carregarProdutos(); // Atualiza a lista de produtos
    } catch (error) {
        console.error("Erro ao salvar produto:", error);
        alert("Erro ao salvar produto: " + error.message);
    }
});

// Função para carregar produtos do banco de dados
async function carregarProdutos() {
    try {
        console.log("Carregando produtos...");
        const response = await fetch(`${API_BASE_URL}/Produto`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Erro ao carregar produtos");
        }

        const produtos = await response.json();
        console.log("Produtos recebidos da API:", produtos);

        console.log("Atualizando container de produtos...");
        productsContainer.innerHTML = ""; // Limpa o container antes de adicionar os produtos

        produtos.forEach(product => {
            console.log("Produto recebido:", product);

            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card");

            productDiv.innerHTML = `
                <img src="${product.imgLink || 'img/produto-sem-imagem.jpg'}" alt="${product.nome}" 
                     onerror="this.src='img/produto-sem-imagem.jpg'">
                <h3>${product.nome}</h3>
                <p>Preço: R$ ${product.preco.toFixed(2)}</p>
                <p>Quantidade: ${product.quantidade}</p>
                <button class="remove-stock-btn" data-id="${product.id}">Excluir</button>
                <button class="add-stock-btn" data-id="${product.id}">Adicionar mais um</button>
            `;

            productsContainer.appendChild(productDiv);
        });

        adicionarEventosBotoes();
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert("Erro ao carregar produtos: " + error.message);
    }
}
async function adicionarAoEstoque(id) {
    try {
        console.log(`Adicionando estoque ao produto ${id}...`);

        // Primeiro, busque o produto com o id usando GET
        let produtoResponse = await fetch(`${API_BASE_URL}/Produto/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (!produtoResponse.ok) {
            throw new Error("Erro ao buscar produto. Verifique o ID.");
        }
        const produto = await produtoResponse.json();

        // Agora, envie a requisição para atualizar o produto
        const response = await fetch(`${API_BASE_URL}/Produto/Editar/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Falha ao atualizar estoque");
        }

        alert("Estoque atualizado com sucesso!");
        await carregarProdutos(); // Atualiza a lista de produtos
    } 
    catch (error) {
        console.error("Erro ao adicionar estoque:", error);
        alert("Erro ao atualizar estoque: " + error.message);
    }
}

// Função para adicionar eventos aos botões
function adicionarEventosBotoes() {
    console.log("Adicionando eventos aos botões...");

    // Remove eventos anteriores para evitar duplicação
    document.querySelectorAll(".remove-stock-btn").forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });

    document.querySelectorAll(".add-stock-btn").forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });

    // Adiciona novos eventos para remover produto
    document.querySelectorAll(".remove-stock-btn").forEach(button => {
        const id = button.getAttribute("data-id");
        console.log("Evento de remover vinculado ao botão ID:", id);
        button.addEventListener("click", async () => {
            console.log("Removendo produto ID:", id);
            if (!id) {
                alert("Erro: ID do produto não encontrado");
                return;
            }
            const response = await fetch(`${API_BASE_URL}/Produto/Remover/${id}`, { 
                method: "DELETE" 
            });
        });
    });

    // Adiciona novos eventos para adicionar estoque
    document.querySelectorAll(".add-stock-btn").forEach(button => {
        const id = button.getAttribute("data-id");
        console.log("Evento de adicionar estoque vinculado ao botão ID:", id);
        button.addEventListener("click", async () => {
            console.log("Adicionando estoque ao produto ID:", id);
            if (!id) {
                alert("Erro: ID do produto não encontrado");
                return;
            }
            await adicionarAoEstoque(id);
        });
    });
}

// Função para remover um produto
async function removerProduto(id) {
    try {
        console.log(`Enviando requisição para remover produto com ID: ${id}`);
        const response = await fetch(`${API_BASE_URL}/Produto/Remover/${id}`, { 
            method: "DELETE" 
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Falha ao remover produto");
        }

        alert("Produto removido com sucesso!");
        await carregarProdutos(); // Atualiza a lista de produtos
    } catch (error) {
        console.error("Erro ao remover produto:", error);
        alert("Erro ao remover produto: " + error.message);
    }
}

// Função para adicionar ao estoque

// Carregar produtos ao carregar a página
window.addEventListener("load", () => {
    console.log("Página carregada - iniciando...");
    carregarProdutos();
});

// Adiciona tratamento de erro global
window.addEventListener("error", (event) => {
    console.error("Erro global:", event.error);
    alert(`Erro inesperado: ${event.message}`);
});

cancelButton.addEventListener("click", () => {
    addProductForm.classList.add("hidden"); // Oculta o formulário
});

document.getElementById("DetalhesV").addEventListener("click", (event) => {
    event.preventDefault(); // Evita o comportamento padrão do link
    window.location.href = "detalhes.html"; // Redireciona para detalhes.html
});

console.log("POR QUE QUE ESSA MERDA NÃO DA CERTO");

