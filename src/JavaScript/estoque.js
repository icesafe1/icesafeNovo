 const API_BASE_URL = 'https://localhost:7223/api';


// Seleciona os elementos do DOM
const addProductForm = document.getElementById("addProductForm");
const addProductButton = document.getElementById("addProductButton");
const saveProductButton = document.getElementById("saveProductButton");
const productsContainer = document.getElementById("products-container");

// Exibir o formulário ao clicar no botão "Adicionar Produto"
addProductButton.addEventListener("click", () => {
    addProductForm.classList.remove("hidden");
});

// Captura os dados do formulário e envia para a API
saveProductButton.addEventListener("click", async () => {
    const name = document.getElementById("newProductName").value;
    const price = parseFloat(document.getElementById("newProductPrice").value);
    const quantity = parseInt(document.getElementById("newProductQuantity").value);
    

    if (!name || !price || !quantity || !imageFile) {
        alert("Preencha todos os campos.");
        return;
    }

    // Converte a imagem para Base64
    const imgSrc = await convertImageToBase64(imageFile);

    const newProduct = { name, price, quantity, imgSrc };

    try {
        const response = await fetch(`${API_BASE_URL}/adicionar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct),
        });

        if (!response.ok) throw new Error("Erro ao adicionar produto");

        alert("Produto adicionado com sucesso!");
        addProductForm.classList.add("hidden"); // Esconde o formulário
        carregarProdutos(); // Atualiza a lista de produtos
    } catch (error) {
        console.error(error);
    }
});



// Função para carregar produtos do banco de dados
async function carregarProdutos() {
    try {
        const response = await fetch(`${API_BASE_URL}/Produto'`);
        if (!response.ok) throw new Error("Erro ao carregar produtos");

        const produtos = await response.json();
        productsContainer.innerHTML = ""; // Limpa o container antes de adicionar

        produtos.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card");

            productDiv.innerHTML = `
                <img src="${product.imgSrc}" alt="${product.name}" class="product-image">
                <h3>${product.name}</h3>
                <p>Preço: R$ ${product.price.toFixed(2)}</p>
                <p>Quantidade: <span>${product.quantity}</span></p>
                <button class="remove-stock-btn" data-id="${product.id}">Excluir</button>
                <button class="add-stock-btn" data-id="${product.id}">Adicionar Estoque</button>
            `;

            productsContainer.appendChild(productDiv);
        });

        adicionarEventosBotoes();
    } catch (error) {
        console.error(error);
    }
}

// Função para adicionar eventos aos botões
function adicionarEventosBotoes() {
    document.querySelectorAll(".remove-stock-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const id = button.getAttribute("data-id");
            await removerProduto(id);
        });
    });

    document.querySelectorAll(".add-stock-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const id = button.getAttribute("data-id");
            await adicionarAoEstoque(id);
        });
    });
}

// Função para remover um produto
async function removerProduto(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/remover/${id}`, { method: "DELETE" });

        if (!response.ok) throw new Error("Erro ao remover produto");

        alert("Produto removido!");
        carregarProdutos(); // Atualiza a lista de produtos
    } catch (error) {
        console.error(error);
    }
}

// Função para adicionar ao estoque
async function adicionarAoEstoque(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/Editar/${id}`, { method: "PUT" });

        if (!response.ok) throw new Error("Erro ao adicionar ao estoque");

        alert("Estoque atualizado!");
        carregarProdutos(); // Atualiza a lista de produtos
    } catch (error) {
        console.error(error);
    }
}

// Carregar os produtos ao abrir a página
carregarProdutos();



let totalSales = 0;

// Função para renderizar os produtos no estoque
function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    container.innerHTML = '';
    
    produtos.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-card');
    
        productDiv.innerHTML = `
            <img src="${product.imgSrc}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Preço: R$ ${product.price.toFixed(2)}</p>
            <p>Quantidade: <span id="quantity-${product.id}">${product.quantity}</span></p>
            <button class="remove-btn" data-id="${product.id}">Excluir</button>
            <button class="add-stock-btn" data-id="${product.id}">Adicionar ao estoque</button>
        
        `
        container.appendChild(productDiv);
    });
    
    
    document.querySelectorAll(".add-stock-btn").forEach(button => {
        button.addEventListener("click", () => {
            const id = parseInt(button.getAttribute("data-id"));
            updateStock(id, "add");
        });
    });
    
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", () => {
            const id = parseInt(button.getAttribute("data-id"));
            updateStock(id, "remove");
        });
    });
    
    
   
    localStorage.setItem("produtos", JSON.stringify(produtos));
}

// Função para atualizar o estoque
function updateStock(id, action) {
    const product = produtos.find((p) => p.id === id);
    if (!product) return;

    if (action === 'add') {
        product.quantity += 1;
    } else if (action === 'remove' && product.quantity > 0) {
        product.quantity -= 1;
        totalSales += product.price;  // Atualiza o total de vendas ao retirar do estoque
    }
    renderProducts();
    updateTotalSales();  // Atualiza o total de vendas na interface
}


// Exibir o total de vendas
function updateTotalSales() {
    const salesElement = document.getElementById('totalSales');
    if (salesElement) {
        salesElement.textContent = `Total de vendas: R$ ${totalSales.toFixed(2)}`;
    }
    localStorage.setItem('totalSales', totalSales.toFixed(2));  // Salva o total de vendas no localStorage
}

// Função para mostrar o formulário de adicionar produto
function showAddProductForm() {
    document.getElementById("addProductForm").classList.remove("hidden");
}

// Vincular o botão de adicionar produto ao formulário
document.getElementById("addProductButton").onclick = showAddProductForm;
document.getElementById("saveProductButton").onclick = addProduct;

// Renderizar os produtos ao carregar
renderProducts();
updateTotalSales();

    // Salvar um novo produto
    saveProductButton.addEventListener("click", () => {
        const name = document.getElementById("newProductName").value;
        const price = parseFloat(document.getElementById("newProductPrice").value);
        const quantity = parseInt(document.getElementById("newProductQuantity").value);
       
        // Criação do objeto de novo produto
        const newProduct = {
            id: produtos.length + 1, // Gerando um novo ID
            name: name,
            price: price,
            quantity: quantity,
            imgSrc: URL.createObjectURL(imageFile) // Usando a URL do arquivo de imagem
        };

        // Adicionar o novo produto ao estoque
        produtos.push(newProduct);
        localStorage.setItem("produtos", JSON.stringify(produtos));
        renderProducts(); // Re-renderiza os produtos
        addProductForm.classList.add("hidden"); // Esconde o formulário
    });
    
