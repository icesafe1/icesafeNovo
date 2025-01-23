// Dados dos produtos
const produtos = [
    { id: 1, name: "torrada", price: 10.00, imgSrc: "src/images/torada.jpg" },
    { id: 2, name: "Produto 2", price: 12.50, imgSrc: "src/images/snack2.jpg" },
    { id: 3, name: "Produto 3", price: 15.00, imgSrc: "src/images/snack3.jpg" },
    { id: 4, name: "Produto 4", price: 8.00, imgSrc: "src/images/snack4.jpg" }
];

// Variáveis do carrinho
let carrinho = [];

// Exibir produtos na página
function exibirProdutos() {
    const productList = document.getElementById('product-list');

    produtos.forEach(produto => {
        const produtoCard = document.createElement('div');
        produtoCard.classList.add('product-item');

        produtoCard.innerHTML = `
            <img src="${produto.imgSrc}" alt="${produto.name}" class="product-image">
            <h4 class="product-name">${produto.name}</h4>
            <p class="product-price">R$${produto.price.toFixed(2)}</p>
            <button 
                class="add-to-cart" 
                data-id="${produto.id}" 
                data-name="${produto.name}" 
                data-price="${produto.price}">
                Adicionar ao Carrinho
            </button>
        `;

        productList.appendChild(produtoCard);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);
            adicionarAoCarrinho(id, name, price);
        });
    });
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(id, name, price) {
    const produtoExistente = carrinho.find(item => item.id === id);

    if (produtoExistente) {
        produtoExistente.quantity++;
    } else {
        carrinho.push({ id, name, price, quantity: 1 });
    }

    atualizarCarrinho();
}

// Atualizar o carrinho na interface
function atualizarCarrinho() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = '';

    let total = 0;

    carrinho.forEach(item => {
        total += item.price * item.quantity;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <p><strong>${item.name}</strong> - R$${item.price.toFixed(2)} x ${item.quantity}</p>
            <button class="remove-item" data-id="${item.id}">Remover</button>
        `;

        cartItemsContainer.appendChild(itemElement);
    });

    document.getElementById('totalPrice').innerText = `Total: R$${total.toFixed(2)}`;

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            removerDoCarrinho(id);
        });
    });
}

// Remover produto do carrinho
function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarCarrinho();
}

// Inicializar carrinho
function inicializarCarrinho() {
    const cartButton = document.getElementById('imageButton');
    const closeCartButton = document.getElementById('closeCart');

    cartButton.addEventListener('click', () => {
        document.getElementById('cartSidebar').classList.add('open');
    });

    closeCartButton.addEventListener('click', () => {
        document.getElementById('cartSidebar').classList.remove('open');
    });
}

// Carregar ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    exibirProdutos();
    inicializarCarrinho();
});
// Atualizar o carrinho na interface
function atualizarCarrinho() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = '';

    let total = 0;

    carrinho.forEach(item => {
        total += item.price * item.quantity;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <p>
                <strong>${item.name}</strong> - R$${item.price.toFixed(2)} 
                x ${item.quantity}
            </p>
            <div class="item-controls">
                <button class="decrease-item" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-item" data-id="${item.id}">+</button>
                <button class="remove-item" data-id="${item.id}">Remover</button>
            </div>
        `;

        cartItemsContainer.appendChild(itemElement);
    });

    document.getElementById('totalPrice').innerText = `Total: R$${total.toFixed(2)}`;

    // Eventos para botões de controle
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            removerDoCarrinho(id);
        });
    });

    document.querySelectorAll('.increase-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            aumentarQuantidade(id);
        });
    });

    document.querySelectorAll('.decrease-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            diminuirQuantidade(id);
        });
    });
}

// Função para aumentar a quantidade do produto no carrinho
function aumentarQuantidade(id) {
    const produto = carrinho.find(item => item.id === id);
    if (produto) {
        produto.quantity++;
        atualizarCarrinho();
    }
}

// Função para diminuir a quantidade do produto no carrinho
function diminuirQuantidade(id) {
    const produto = carrinho.find(item => item.id === id);
    if (produto) {
        if (produto.quantity > 1) {
            produto.quantity--;
        } else {
            removerDoCarrinho(id);
        }
        atualizarCarrinho();
    }
}
// avalicao das estrelas
// Seleção de elementos
const checkoutButton = document.getElementById("checkoutButton");
const successModal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");
const stars = document.querySelectorAll(".star");

// Exibe o modal ao clicar em "Finalizar Compra"
checkoutButton.addEventListener("click", () => {
    successModal.classList.remove("hidden");
});

// Fecha o modal ao clicar no botão "Voltar"
closeModal.addEventListener("click", () => {
    successModal.classList.add("hidden");
});

// Avaliação por estrelas
stars.forEach((star, index) => {
    star.addEventListener("click", () => {
        stars.forEach(s => s.classList.remove("selected"));
        for (let i = 0; i <= index; i++) {
            stars[i].classList.add("selected");
        }
        console.log(`Avaliação: ${index + 1} estrela(s)`);
    });
});



