const preencheDadosModal = (item) => {
    seleciona('.pizzaBig img').src = item.img;
    seleciona('.pizzaInfo h1').innerHTML = item.name;
    seleciona('.pizzaInfo--desc').innerHTML = item.description;
    seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(item.price[2]);
};

// Aula 05
const pegarKey = (e) => {
    // Closest retorna o elemento mais próximo que tem na classe que passamos
    // Do .pizza-item ele vai pegar o valor do atributo data-key
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    console.log('Pizza clicada ' + key);
    console.log(pizzaJson[key]);

    // Garantir que a quantidade inicial de pizzas é 1
    quantPizzas = 1;

    // Para manter a informação de qual pizza foi clicada
    modalKey = key;

    return key;
};

const preencherTamanhos = (key) => {
    // Tirar a seleção de tamanho atual e selecionar o tamanho grande
    seleciona('.pizzaInfo--size.selected').classList.remove('selected');

    // Selecionar todos os tamanhos
    selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
        // Selecionar o tamanho grande
        (sizeIndex == 2) ? size.classList.add('selected') : '';
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });
};

const escolherTamanhoPreco = (key) => {
    // Ações nos botões de tamanho
    // Selecionar todos os tamanhos
    selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            // Clicou em um item, tirar a seleção dos outros e marca o que você clicou
            // Tirar a seleção de tamanho atual e selecionar o tamanho grande
            seleciona('.pizzaInfo--size.selected').classList.remove('selected');
            // Marcar o que você clicou, ao invés de usar e.target use size, pois ele é nosso item dentro do loop
            size.classList.add('selected');

            // Mudar o preço de acordo com o tamanho
            seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(pizzaJson[key].price[sizeIndex]);
        });
    });
};

const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.pizzaInfo--qtmais').addEventListener('click', () => {
        quantPizzas++;
        seleciona('.pizzaInfo--qt').innerHTML = quantPizzas;
    });

    seleciona('.pizzaInfo--qtmenos').addEventListener('click', () => {
        if (quantPizzas > 1) {
            quantPizzas--;
            seleciona('.pizzaInfo--qt').innerHTML = quantPizzas;
        }
    });
};
// /Aula 05

// Aula 06
const adicionarNoCarrinho = () => {
    seleciona('.pizzaInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho');

        // Pegar dados da janela modal atual
        // Qual pizza? Pegue o modalKey para usar pizzaJson[modalKey]
        console.log("Pizza " + modalKey);
        // Tamanho
        let size = seleciona('.pizzaInfo--size.selected').getAttribute('data-key');
        console.log("Tamanho " + size);
        // Quantidade
        console.log("Quant. " + quantPizzas);
        // Preço
        let price = seleciona('.pizzaInfo--actualPrice').innerHTML.replace('R$&nbsp;', '');

        // Crie um identificador que junte id e tamanho
        // Concatene as duas informações separadas por um símbolo, você escolhe
        let identificador = pizzaJson[modalKey].id + 't' + size;

        // Antes de adicionar, verifique se já tem aquele código e tamanho
        // Para adicionarmos a quantidade
        let key = cart.findIndex((item) => item.identificador === identificador);
        console.log(key);

        if (key > -1) {
            // Se encontrar, aumente a quantidade
            cart[key].qt += quantPizzas;
        } else {
            // Adicionar objeto pizza no carrinho
            let pizza = {
                identificador,
                id: pizzaJson[modalKey].id,
                size, // size: size
                qt: quantPizzas,
                price: parseFloat(price), // price: price
            };
            cart.push(pizza);
            console.log(pizza);
            console.log('Sub total R$ ' + (pizza.qt * pizza.price).toFixed(2));
        }

        fecharModal();
        abrirCarrinho();
        atualizarCarrinho();
    });
};

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length);
    if (cart.length > 0) {
        // Mostrar o carrinho
        seleciona('aside').classList.add('show');
        seleciona('header').style.display = 'flex'; // Mostrar barra superior
    }

    // Exibir aside do carrinho no modo mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if (cart.length > 0) {
            seleciona('aside').classList.add('show');
            seleciona('aside').style.left = '0';
        }
    });
};

const fecharCarrinho = () => {
    // Fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw'; // Usando 100vw ele ficará fora da tela
        seleciona('header').style.display = 'flex';
    });
};

const atualizarCarrinho = () => {
    // Exibir número de itens no carrinho
    seleciona('.menu-openner span').innerHTML = cart.length;

    // Mostrar ou não o carrinho
    if (cart.length > 0) {
        // Mostrar o carrinho
        seleciona('aside').classList.add('show');

        // Zerar meu .cart para não fazer inserções duplicadas
        seleciona('.cart').innerHTML = '';

        // Criar as variáveis antes do for
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        // Para preencher os itens do carrinho, calcular subtotal
        for (let i in cart) {
            // Use o find para pegar o item por id
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            console.log(pizzaItem);

            // Em cada item, pegar o subtotal
            subtotal += cart[i].price * cart[i].qt;

            // Fazer o clone, exibir na tela e depois preencher as informações
            let cartItem = seleciona('.models .cart--item').cloneNode(true);
            seleciona('.cart').append(cartItem);

            let pizzaSizeName = cart[i].size;

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            // Preencher as informações
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            // Selecionar botões + e -
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                console.log('Clicou no botão mais');
                // Adicionar apenas a quantidade que está neste contexto
                cart[i].qt++;
                // Atualizar a quantidade
                atualizarCarrinho();
            });

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                console.log('Clicou no botão menos');
                if (cart[i].qt > 1) {
                    // Subtrair apenas a quantidade que está neste contexto
                    cart[i].qt--;
                } else {
                    // Remover se for zero
                    cart.splice(i, 1);
                }

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : '';

                // Atualizar a quantidade
                atualizarCarrinho();
            });

            seleciona('.cart').append(cartItem);

        } // Fim do for

        // Fora do for
        // Calcular desconto 10% e total
        // Desconto = subtotal * 0.1
        desconto = subtotal * 0;
        total = subtotal - desconto;

        // Exibir na tela os resultados
        // Selecionar o último span do elemento
        seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal);
        seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto);
        seleciona('.total span:last-child').innerHTML = formatoReal(total);

    } else {
        // Ocultar o carrinho
        seleciona('aside').classList.remove('show');
        seleciona('aside').style.left = '100vw';
    }
};

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra');
        seleciona('aside').classList.remove('show');
        seleciona('aside').style.left = '100vw';
        seleciona('header').style.display = 'flex';
        alert("Pedido Feito");
        window.location.href = '/formu.html';
    });
};

// Mapear pizzaJson para gerar lista de pizzas
pizzaJson.map((item, index) => {
    // console.log(item);
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
    // console.log(pizzaItem);
    // document.querySelector('.pizza-area').append(pizzaItem);
    seleciona('.pizza-area').append(pizzaItem);

    // Preencher os dados de cada pizza
    preencheDadosDasPizzas(pizzaItem, item, index);

    // Pizza clicada
    pizzaItem.querySelector('.pizza-item a').addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Clicou na pizza');

        let chave = pegarKey(e);

        // Abrir janela modal
        abrirModal();

        // Preenchimento dos dados
        preencheDadosModal(item);

        // Pegar tamanho selecionado
        preencherTamanhos(chave);

        // Definir quantidade inicial como 1
        seleciona('.pizzaInfo--qt').innerHTML = quantPizzas;

        // Selecionar o tamanho e o preço com o clique no botão
        escolherTamanhoPreco(chave);
    });

    botoesFechar();

}); // Fim do Mapear pizzaJson para gerar lista de pizzas

// Mudar quantidade com os botões + e -
mudarQuantidade();

adicionarNoCarrinho();
atualizarCarrinho();
fecharCarrinho();
finalizarCompra();

const atualizarQRCode = (total) => {
    const qrcodeContainer = seleciona('#qrcode');
    qrcodeContainer.innerHTML = ''; // Limpar QR Code anterior

    // Link ou mensagem para o QR code
    const pagamentoLink = `https://pagamento-ficticio.com?valor=${total.toFixed(2)}`;

    // Gerar QR Code
    QRCode.toCanvas(qrcodeContainer, pagamentoLink, { width: 150 }, (error) => {
        if (error) console.error('Erro ao gerar QR Code:', error);
    });
};

const atualizaCarrinho = () => {
    // Restante do código...

    if (cart.length > 0) {
        // Calcular valores
        total = subtotal - desconto;

        // Atualizar QR code com o valor total
        atualizarQRCode(total);

        // Atualizar os valores na tela
        seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal);
        seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto);
        seleciona('.total span:last-child').innerHTML = formatoReal(total);
    } else {
        // Esconder o QR code quando o carrinho estiver vazio
        seleciona('#qrcode').innerHTML = '';
    }
    // Pegando os elementos necessários
const finalizarCompraButton = document.getElementById('finalizarCompra');
const dadosModalArea = document.querySelector('.dadosModalArea');
const dadosModalCancelButton = document.querySelector('.dadosModalCancelButton');
const cancelarDadosButton = document.getElementById('cancelarDados');
const formDados = document.getElementById('formDados');

// Abrir o modal quando o cliente clicar em "Finalizar a compra"
finalizarCompraButton.addEventListener('click', () => {
    dadosModalArea.style.display = 'block'; // Exibe o modal
});

// Fechar o modal quando o cliente clicar em "Voltar" ou "Cancelar"
dadosModalCancelButton.addEventListener('click', () => {
    dadosModalArea.style.display = 'none'; // Fecha o modal
});

cancelarDadosButton.addEventListener('click', () => {
    dadosModalArea.style.display = 'none'; // Fecha o modal
});

// Quando o formulário for enviado, pegamos os dados e mostramos uma mensagem
formDados.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita o envio normal do formulário

    // Pegando os valores dos campos
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;

    // Aqui, você pode fazer o que desejar com os dados, como enviar para o servidor
    console.log('Dados recebidos:', nome, email, telefone, endereco);

    // Fechar o modal após os dados serem enviados
    dadosModalArea.style.display = 'none';

    // Aqui você pode adicionar o código para realizar a compra ou envio de confirmação
    alert('Compra realizada com sucesso!');
});

};
