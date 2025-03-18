// Inicializar produtos no localStorage, ou um array vazio
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let totalSales = parseFloat(localStorage.getItem('totalSales')) || 0;  // Carrega o total de vendas do localStorage

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
            <button onclick="removeProduct(${product.id})">Excluir</button>
            <button onclick="updateStock(${product.id}, 'add')">Adicionar ao estoque</button>
            <button onclick="updateStock(${product.id}, 'remove')">Retirar do estoque</button>
            <button onclick="editProduct(${product.id})">Editar</button>
        `;
        
        container.appendChild(productDiv);
    });
    
    // Salva o estado do estoque no localStorage
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

// Função para excluir um produto do estoque
function removeProduct(id) {
    produtos = produtos.filter(p => p.id !== id);
    renderProducts();
}

// Exibir o total de vendas
function updateTotalSales() {
    const salesElement = document.getElementById('totalSales');
    if (salesElement) {
        salesElement.textContent = `Total de vendas: R$ ${totalSales.toFixed(2)}`;
    }
    localStorage.setItem('totalSales', totalSales.toFixed(2));  // Salva o total de vendas no localStorage
}

// Função para editar um produto
function editProduct(id) {
    const product = produtos.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById("newProductName").value = product.name;
    document.getElementById("newProductPrice").value = product.price;
    document.getElementById("newProductQuantity").value = product.quantity;
    document.getElementById("saveProductButton").onclick = function () {
        saveEditedProduct(id);
    };
    
    document.getElementById("addProductForm").classList.remove("hidden");
}

// Função para salvar alterações no produto
function saveEditedProduct(id) {
    const product = produtos.find(p => p.id === id);
    if (!product) return;
    
    product.name = document.getElementById("newProductName").value;
    product.price = parseFloat(document.getElementById("newProductPrice").value);
    product.quantity = parseInt(document.getElementById("newProductQuantity").value);
    
    const imageFile = document.getElementById("newProductImage").files[0];
    if (imageFile) {
        product.imgSrc = URL.createObjectURL(imageFile);
    }
    
    renderProducts();
    document.getElementById("addProductForm").classList.add("hidden");
}

// Função para adicionar um novo produto
function addProduct() {
    const name = document.getElementById("newProductName").value;
    const price = parseFloat(document.getElementById("newProductPrice").value);
    const quantity = parseInt(document.getElementById("newProductQuantity").value);
    const imageFile = document.getElementById("newProductImage").files[0];
    
    if (!name || isNaN(price) || isNaN(quantity)) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    const newProduct = {
        id: produtos.length ? Math.max(...produtos.map(p => p.id)) + 1 : 1,
        name,
        price,
        quantity,
        imgSrc: imageFile ? URL.createObjectURL(imageFile) : 'src/images/default.jpg'
    };

    produtos.push(newProduct);
    renderProducts();

    // Redireciona para a aba 'Início'
    window.location.href = '#inicio'; // Ou o id da sua aba de início

    document.getElementById("addProductForm").classList.add("hidden");
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

// Função para finalizar a compra e atualizar o total de vendas
document.getElementById('checkoutButton').addEventListener('click', () => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];  // Carregar o carrinho de compras

    // Calcular o total das vendas da compra
    cartItems.forEach(item => {
        totalSales += item.price * item.quantity;  // Atualiza o total de vendas com a compra
    });

    // Limpar o carrinho após a compra
    cartItems.length = 0;
    updateCart();  // Atualiza a interface do carrinho

    // Atualizar o estoque no localStorage
    localStorage.setItem("produtos", JSON.stringify(produtos));  
    localStorage.setItem('totalSales', totalSales.toFixed(2));  // Salva o total de vendas no localStorage

    // Mostrar a mensagem de sucesso
    alert("Compra finalizada!");

    // Limpa o carrinho do localStorage para evitar que itens antigos apareçam
    localStorage.removeItem("cartItems");

    // Atualiza o total de vendas na interface
    updateTotalSales();
});
