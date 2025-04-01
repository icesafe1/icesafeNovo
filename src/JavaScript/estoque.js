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

document.getElementById("DetalhesV").addEventListener("click", () => {
    window.open("detalhes.html", "_blank"); // Abre a página em uma nova aba
});


async function carregarEstoque() {
    try {
        let response = await fetch(`${API_BASE_URL}/Produto/Todos`);
        if (!response.ok) {
            throw new Error("Erro ao carregar estoque.");
        }

        let produtos = await response.json();

        let estoqueContainer = document.getElementById("estoque-container");
        estoqueContainer.innerHTML = ""; // Limpa antes de adicionar os novos

        produtos.forEach(produto => {
            let produtoElement = document.createElement("div");
            produtoElement.innerHTML = `
                <p>Nome: ${produto.nome}</p>
                <p>Estoque: ${produto.quantidade}</p>
                <p>Total de Vendas: ${produto.totalVendas || 0}</p>
                <button class="add-stock-btn" data-id="${produto.id}">Adicionar Estoque</button>
                <button class="remove-stock-btn" data-id="${produto.id}">Remover Produto</button>
            `;
            estoqueContainer.appendChild(produtoElement);
        });

        adicionarEventosBotoes(); // Reaplica os eventos nos botões
    } catch (error) {
        console.error("Erro ao carregar estoque:", error);
        alert("Erro ao carregar estoque.");
    }
}


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

        productsContainer.innerHTML = ""; // Limpa o container antes de adicionar os produtos

        produtos.forEach(product => {
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

        adicionarEventosBotoes(); // Adiciona eventos aos botões após carregar os produtos
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert("Erro ao carregar produtos: " + error.message);
    }
}

async function adicionarAoEstoque(id) {
    try {
        console.log(`Adicionando estoque ao produto ${id}...`);

        // Busca o produto pelo ID
        const produtoResponse = await fetch(`${API_BASE_URL}/Produto/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!produtoResponse.ok) {
            throw new Error("Erro ao buscar produto. Verifique o ID.");
        }

        const produto = await produtoResponse.json();

        // Incrementa a quantidade do produto
        produto.quantidade += 1;

        // Envia a atualização para o backend
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
    } catch (error) {
        console.error("Erro ao adicionar estoque:", error);
        alert("Erro ao atualizar estoque: " + error.message);
    }
}

// Função para adicionar eventos aos botões
function adicionarEventosBotoes() {
    console.log("Adicionando eventos aos botões...");

    // Adiciona eventos para remover produto
    document.querySelectorAll(".remove-stock-btn").forEach(button => {
        const id = button.getAttribute("data-id");
        console.log("Evento de remover vinculado ao botão ID:", id);

        // Remove event listeners antigos e adiciona novos
        button.replaceWith(button.cloneNode(true));
        const newButton = document.querySelector(`.remove-stock-btn[data-id="${id}"]`);
        newButton.addEventListener("click", async () => {
            console.log("Removendo produto ID:", id);
            if (!id) {
                alert("Erro: ID do produto não encontrado");
                return;
            }
            await removerProduto(id);
        });
    });

    // Adiciona eventos para adicionar estoque
    document.querySelectorAll(".add-stock-btn").forEach(button => {
        const id = button.getAttribute("data-id");
        console.log("Evento de adicionar estoque vinculado ao botão ID:", id);

        // Remove event listeners antigos e adiciona novos
        button.replaceWith(button.cloneNode(true));
        const newButton = document.querySelector(`.add-stock-btn[data-id="${id}"]`);
        newButton.addEventListener("click", async () => {
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

// Função para registrar uma venda
function registrarVenda(valor) {
    const vendas = JSON.parse(localStorage.getItem("vendas")) || []; // Obtém as vendas existentes
    vendas.push({ valor, data: new Date() }); // Adiciona a nova venda com a data atual
    localStorage.setItem("vendas", JSON.stringify(vendas)); // Salva as vendas no localStorage
    atualizarTotalVendas(); // Atualiza o total de vendas exibido
}

// Função para atualizar o total de vendas
function atualizarTotalVendas() {
    const totalSalesElement = document.getElementById("totalSales");
    if (!totalSalesElement) {
        console.error("Elemento 'totalSales' não encontrado no DOM.");
        return;
    }

    const vendas = JSON.parse(localStorage.getItem("vendas")) || []; // Obtém as vendas do localStorage
    const total = vendas.reduce((sum, venda) => sum + venda.valor, 0); // Calcula o total de vendas
    totalSalesElement.textContent = `Total de vendas: R$ ${total.toFixed(2)}`;
}

// Função para calcular vendas por período
function calcularVendasPorPeriodo(vendas) {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const inicioSemana = new Date(agora);
    inicioSemana.setDate(agora.getDate() - agora.getDay());

    let totalMes = 0;
    let totalSemana = 0;

    vendas.forEach(venda => {
        const dataVenda = new Date(venda.data);
        if (dataVenda >= inicioMes) {
            totalMes += venda.valor;
        }
        if (dataVenda >= inicioSemana) {
            totalSemana += venda.valor;
        }
    });

    return { mes: totalMes, semana: totalSemana };
}

// Função para fechar o modal de vendas
function fecharModal() {
    document.getElementById("salesModal").classList.add("hidden");
}

// Adiciona evento para visualizar vendas
document.getElementById("viewSalesButton").addEventListener("click", () => {
    const vendas = JSON.parse(localStorage.getItem("vendas")) || [];
    const vendasPorPeriodo = calcularVendasPorPeriodo(vendas);
    const salesByPeriodElement = document.getElementById("salesByPeriod");

    salesByPeriodElement.innerHTML = `
        <p>Total deste mês: R$ ${vendasPorPeriodo.mes.toFixed(2)}</p>
        <p>Total desta semana: R$ ${vendasPorPeriodo.semana.toFixed(2)}</p>
    `;

    document.getElementById("salesModal").classList.remove("hidden");
});

// Carregar produtos ao carregar a página
window.addEventListener("load", () => {
    console.log("Página carregada - iniciando...");
    carregarProdutos();
    atualizarTotalVendas(); // Atualiza o total de vendas ao carregar a página
});

// Adiciona tratamento de erro global
window.addEventListener("error", (event) => {
    console.error("Erro global:", event.error);
    alert(`Erro inesperado: ${event.message}`);
});

cancelButton.addEventListener("click", () => {
    addProductForm.classList.add("hidden"); // Oculta o formulário
});

const checkoutButton = document.getElementById('checkoutButton');
if (checkoutButton) {
    checkoutButton.addEventListener('click', async () => {
        let cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0); // Calcula o total do carrinho

        // Registra a venda
        registrarVenda(cartTotal);

        // Limpa o carrinho e atualiza a interface
        cartItems.length = 0;
        updateCart();
        renderProductList(produtos);

        alert(`Compra finalizada! Total: R$ ${cartTotal.toFixed(2)}`);
    });
} else {
    console.error("Botão 'checkoutButton' não encontrado no DOM.");
}

console.log("POR QUE QUE ESSA MERDA NÃO DA CERTO");
