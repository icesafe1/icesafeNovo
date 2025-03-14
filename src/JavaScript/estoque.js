
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

let totalSales = parseFloat(localStorage.getItem("totalSales")) || 0;


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
            
            
        `;
       
   function updateStock(id, action) {
    const product = produtos.find((p) => p.id === id);
    if (!product) return;

    if (action === 'remove') {
        if (product.quantity > 0) {
            product.quantity -= 1;
            totalSales += product.price;  
            localStorage.setItem("totalSales", totalSales); 
        } else {
            alert("Estoque já está zerado!");
            return;
        }
    } else if (action === 'add') {
        product.quantity += 1;
    }

    renderProducts();
    updateTotalSales();
}

    
        container.appendChild(productDiv);
    });
    
    
    document.querySelectorAll(".add-stock-btn").forEach(button => {
        button.addEventListener("click", () => {
            const id = parseInt(button.getAttribute("data-id"));
            updateStock(id, "add");
        });
    });
    
    document.querySelectorAll(".remove-stock-btn").forEach(button => {
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
        totalSales += product.price;
    }
    renderProducts();
    updateTotalSales();
}


// Exibir o total de vendas
function updateTotalSales() {
    const salesElement = document.getElementById('totalSales');
    if (salesElement) {
        salesElement.textContent = `Total de vendas: R$ ${totalSales.toFixed(2)}`;
    }
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

    
    window.location.href = '#inicio'; 

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
//desloga senha

    // Verifique se o usuário está autenticado e se há a senha no localStorage ou sessionStorage
    document.getElementById('sairButton').addEventListener('click', function() {
        // Limpar dados de login (por exemplo, senha)
        localStorage.removeItem('userPassword');  // ou sessionStorage.removeItem('userPassword');

        // Redireciona o usuário para a página de login ou página inicial
        window.location.href = 'inicio.html';
    });

