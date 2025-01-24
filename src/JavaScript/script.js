// Dados dos produtos
const produtos = [
    { id: 1, name: "Torrada", price: 3.20, imgSrc: "src/images/torada.jpg" },
    { id: 2, name: "Bolacha Bauducco", price: 2.50, imgSrc: "src/images/bolacha bauduco 2,50.jpg" },
    { id: 3, name: "Tortuguita", price: 1.00, imgSrc: "src/images/tortuguita 1,00.jpg" },
    { id: 4, name: "Azedinha", price: 1.50, imgSrc: "src/images/azedinha 1,50.jpeg" },
    { id: 5, name: "Trento", price: 2.00, imgSrc: "src/images/trento 2,00.jpeg" },
    { id: 6, name: "Bolo de pote", price: 10.00, imgSrc: "src/images/bolooooo.jpg" },
    { id: 7, name: "Chocolate lolo", price: 2.00, imgSrc: "src/images/chocolate lolo 2,00.jpg" },
    { id: 8, name: "Chocolate prestigio", price: 2.30, imgSrc: "src/images/chocolate prestigio 2,30.jpg" },
    { id: 9, name: "Halls", price: 1.50, imgSrc: "src/images/halls 1,50.jpg" },
    { id: 10, name: "Fine tubes", price: 1.50, imgSrc: "src/images/fini tubes 1,50.jpg" },
    { id: 13, name: "Cup Noodles", price: 4.00, imgSrc: "src/images/cup.webp" },
    { id: 14, name: "Cookies Bauducco", price: 2.50, imgSrc: "src/images/cokieee.jpeg" },
    { id: 15, name: "Clube Social", price: 0.95, imgSrc: "src/images/club social 0,95.jpg" },
    { id: 16, name: "Choquito", price: 2.40, imgSrc: "src/images/choquito 2,40.jpg" },
    { id: 17, name: "Bis oreo", price: 2.50, imgSrc: "src/images/bis oreo 2,50.jpg" },
    { id: 18, name: "Teens", price: 1.80, imgSrc: "src/images/teens 1,80.jpg" },
    { id: 19, name: "Trident", price: 2.30, imgSrc: "src/images/trident 2,30.jpg" },
    { id: 20, name: "Ouro branco", price: 1.50, imgSrc: "src/images/ouro branco 1,50.jpg" },
    { id: 21, name: "Kit Kat", price: 3.90, imgSrc: "src/images/kit kat 3,90.jpg" },
    { id: 22, name: "Empadinha", price: 6.00, imgSrc: "src/images/empadinha 6,00.jpg" },
    { id: 23, name: "Mine fini", price: 1.00, imgSrc: "src/images/mini fini 1,00.jpg"},
    { id: 24, name: "Freegls", price: 1.20, imgSrc: "src/images/freegels 1,20.jpg" },
    { id: 25, name: "Barrinha de cereal", price: 1.40, imgSrc: "src/images/barrinha de cereal 1,40.jpg"},
    { id: 26, name: "Água", price: 1.30, imgSrc: "src/images/agua 1,30.avif" },
    { id: 27, name: "Coca-Cola", price: 1.80, imgSrc: "src/images/coca mini 1,80.jpeg" },
    { id: 28, name: "Chá mate", price: 3.00, imgSrc: "src/images/cha mate gelado 3,00.jpeg" },
    { id: 29, name: "Café", price: 6.50, imgSrc: "src/images/cafe tres corações 6,50.jpeg" },
    { id: 30, name: "Cini", price: 1.29, imgSrc: "src/images/mini cine de framboesa 1,29.png" },
    { id: 31, name: "Energético", price: 8.00, imgSrc: "src/images/monster 8,00.webp" },
    { id: 32, name: "Showkinho", price: 1.00, imgSrc: "src/images/showkinho 1,00.jpeg" },
    { id: 33, name: "Sprite", price: 4.00, imgSrc: "src/images/sprit 4,00.jpeg"},
    { id: 34, name: "Power", price: 4.30, imgSrc: "src/images/power bebida 4,30.webp"},
    
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



