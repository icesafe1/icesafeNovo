// Estoque e gerenciamento de produtos
let produtos = JSON.parse(localStorage.getItem("produtos")) || [
    { id: 1, name: "Torrada", price: 3.20, imgSrc: "src/images/torada.jpg", quantity: 5 },
    { id: 2, name: "Bolacha Bauducco", price: 2.50, imgSrc: "src/images/bolacha bauduco 2,50.jpg", quantity: 5 },
    { id: 3, name: "Tortuguita", price: 1.00, imgSrc: "src/images/tortuguita 1,00.jpg", quantity: 5 }
];
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
            <button onclick="removeProduct(${product.id})">Excluir</button>
            <button onclick="updateStock(${product.id}, 'add')">Adicionar ao estoque</button>
            <button onclick="updateStock(${product.id}, 'remove')">Retirar do estoque</button>
        `;
        
        container.appendChild(productDiv);
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
        totalSales += product.price;
    }

    renderProducts();
    updateTotalSales();
}

// Função para excluir um produto do estoque
function removeProduct(id) {
    const index = produtos.findIndex((p) => p.id === id);
    if (index !== -1 ) {
        produtos.splice(index, 1);
        renderProducts();
    }
}

// Exibir o total de vendas
function updateTotalSales() {
    const salesElement = document.getElementById('totalSales');
    if (salesElement) {
        salesElement.textContent = `Total de vendas: R$ ${totalSales.toFixed(2)}`;
    }
}

// Renderizar os produtos ao carregar
renderProducts();
updateTotalSales();

// Carrinho de compras
document.addEventListener("DOMContentLoaded", () => {
    const cartItems = [];
    const totalPriceElement = document.getElementById("totalPrice");
    const productList = document.getElementById("product-list");

    // Função para renderizar a lista de produtos no carrinho
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
        const cartContainer = document.querySelector(".cart-items");
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
            totalPrice += item.price;
        });

        totalPriceElement.innerHTML = `<strong>Total: R$ ${totalPrice.toFixed(2)}</strong>`;
    }

    // Função para remover um produto do carrinho
    window.removeFromCart = function(index) {
        const removedItem = cartItems.splice(index, 1)[0];
        const product = produtos.find(p => p.id === removedItem.id);
        if (product) {
            product.quantity += 1;
        }
        updateCart();
        localStorage.setItem("produtos", JSON.stringify(produtos));
        renderProductList();
    };

    // Função para limpar o carrinho
    window.clearCart = function() {
        cartItems.length = 0;
        updateCart();
        alert("Carrinho limpo!");
    };

    renderProductList();
});
//produto
document.addEventListener("DOMContentLoaded", () => {
    // Obter elementos do DOM
    const addProductButton = document.getElementById("addProductButton");
    const addProductForm = document.getElementById("addProductForm");
    const saveProductButton = document.getElementById("saveProductButton");
    const cancelButton = document.getElementById("cancelButton");

    // Mostrar o formulário de adição
    addProductButton.addEventListener("click", () => {
        addProductForm.classList.remove("hidden");
    });

    // Cancelar a adição de produto
    cancelButton.addEventListener("click", () => {
        addProductForm.classList.add("hidden");
    });

    // Salvar um novo produto
    saveProductButton.addEventListener("click", () => {
        const name = document.getElementById("newProductName").value;
        const price = parseFloat(document.getElementById("newProductPrice").value);
        const quantity = parseInt(document.getElementById("newProductQuantity").value);
        const imageFile = document.getElementById("newProductImage").files[0];

        if (!name || !price || !quantity || !imageFile) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

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
});

