const API_BASE_URL = 'https://localhost:7223/api';

// Seleciona os elementos do DOM
const addProductForm = document.getElementById("addProductForm");
const addProductButton = document.getElementById("addProductButton");
const saveProductButton = document.getElementById("saveProductButton");
const productsContainer = document.getElementById("products-container");

// Verificação de elementos do DOM
if (!addProductForm || !addProductButton || !saveProductButton || !productsContainer) {
    console.error("Elementos do DOM não encontrados!");
    alert("Erro crítico: Elementos da página não carregados corretamente");
}

// Exibir o formulário ao clicar no botão "Adicionar Produto"
addProductButton.addEventListener("click", () => {
    addProductForm.classList.remove("hidden");
});

// Captura os dados do formulário e envia para a API
saveProductButton.addEventListener("click", async () => {
    try {
        // Verifica se os elementos existem antes de acessar .value
        const nameInput = document.getElementById("newProductName");
        const priceInput = document.getElementById("newProductpreco");
        const quantityInput = document.getElementById("newProductQuantity");
        const imgLinkInput = document.getElementById("newProductImgLink");

        //definir como ID 0.
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

        // Padroniza os nomes das propriedades conforme o backend espera
        const newProduct = { 
            
            Name: name, 
            Preco: preco,       // Ou Price, conforme seu backend
            Quantity: quantity, 
            ImgLink: imgLink 
        };

        console.log("Enviando produto:", newProduct);

        const response = await fetch(`${API_BASE_URL}/Produto/Adicionar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Erro ao adicionar produto");
        }

        alert("Produto adicionado com sucesso!");
        addProductForm.classList.add("hidden");
        addProductForm.reset(); // Limpa o formulário
        await carregarProdutos();
    } catch (error) {
        console.error("Erro ao salvar produto:", error);
        alert(error.message);
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
        console.log("Produtos recebidos:", produtos);

        productsContainer.innerHTML = "";

        produtos.forEach(product => {
            // Verifica se o produto tem todas as propriedades necessárias
            if (!product.id || !product.Name || !product.Preco || !product.Quantity) {
                console.warn("Produto inválido:", product);
                return;
            }

            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card");

            productDiv.innerHTML = `
                <img src="${product.ImgLink || 'img/produto-sem-imagem.jpg'}" alt="${product.Name}" 
                     onerror="this.src='img/produto-sem-imagem.jpg'">
                <h3>${product.Name}</h3>
                <p>Preço: R$ ${product.Preco.toFixed(2)}</p>
                <p>Quantidade: ${product.Quantity}</p>
                <button class="remove-stock-btn" data-id="${product.id}">Excluir</button>
                <button class="add-stock-btn" data-id="${product.id}">Adicionar Estoque</button>
            `;

            productsContainer.appendChild(productDiv);
        });

        adicionarEventosBotoes();
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert("Erro ao carregar produtos: " + error.message);
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

    // Adiciona novos eventos
    document.querySelectorAll(".remove-stock-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const id = button.getAttribute("data-id");
            console.log("Removendo produto ID:", id);
            if (!id) {
                alert("Erro: ID do produto não encontrado");
                return;
            }
            await removerProduto(id);
        });
    });

    document.querySelectorAll(".add-stock-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const id = button.getAttribute("data-id");
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
        console.log(`Enviando requisição para remover produto ${id}...`);
        const response = await fetch(`${API_BASE_URL}/Produto/Remover/${id}`, { 
            method: "DELETE" 
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Falha ao remover produto");
        }

        alert("Produto removido com sucesso!");
        await carregarProdutos();
    } catch (error) {
        console.error("Erro ao remover produto:", error);
        alert("Erro ao remover produto: " + error.message);
    }
}

// Função para adicionar ao estoque
async function adicionarAoEstoque(id) {
    try {
        console.log(`Adicionando estoque ao produto ${id}...`);
        const response = await fetch(`${API_BASE_URL}/Produto/Editar/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Quantity: 1 }) // Adiciona 1 unidade
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Falha ao atualizar estoque");
        }

        alert("Estoque atualizado com sucesso!");
        await carregarProdutos();
    } catch (error) {
        console.error("Erro ao adicionar estoque:", error);
        alert("Erro ao atualizar estoque: " + error.message);
    }
}

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