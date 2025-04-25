fetch('http://localhost:3000/api/produtos')
    .then(res => res.json())
    .then(produtos => {
        const productDetails = document.getElementById("productDetails");

        produtos.forEach(produto => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                <td>${produto.quantidade_vendida}</td>
            `;
            productDetails.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar dados dos produtos:', error);
    });


document.addEventListener("DOMContentLoaded", () => {
    const salesDataElement = document.getElementById("salesData");
    const total15diasElement = document.getElementById("total15dias");
    const total30diasElement = document.getElementById("total30dias");

    // Recupera os dados do localStorage
    let vendas = JSON.parse(localStorage.getItem("vendas")) || [];
    
    let total15dias = 0;
    let total30dias = 0;
    let hoje = new Date();

    salesDataElement.innerHTML = "";

    vendas.forEach(venda => {
        let vendaData = new Date(venda.data);

        // Calcula os ganhos dos últimos 15 e 30 dias
        let diferencaDias = Math.floor((hoje - vendaData) / (1000 * 60 * 60 * 24));

        if (diferencaDias <= 15) {
            total15dias += venda.receita;
        }
        if (diferencaDias <= 30) {
            total30dias += venda.receita;
        }

        let row = `
            <tr>
                <td>${venda.produto}</td>
                <td>${venda.quantidade}</td>
                <td>R$ ${venda.receita.toFixed(2)}</td>
            </tr>
        `;

        salesDataElement.innerHTML += row;
    });

    total15diasElement.textContent = `Rendimento últimos 15 dias: R$ ${total15dias.toFixed(2)}`;
    total30diasElement.textContent = `Rendimento último mês: R$ ${total30dias.toFixed(2)}`;
});

// Função para voltar à página anterior
function voltarPagina() {
    window.location.href = "estoque.html"; // Redireciona para a página de estoque
}

// Função para mostrar o popup de agradecimento
function mostrarPopupAgradecimento() {
    const popup = document.getElementById('popupAgradecimento');
    popup.style.display = 'flex';
}

// Função para fechar o popup
function fecharPopup() {
    const popup = document.getElementById('popupAgradecimento');
    popup.style.display = 'none';
}

// Função para validar a quantidade da compra
function validarQuantidade(quantidade, estoqueAtual) {
    if (quantidade <= 0) {
        alert('A quantidade deve ser maior que zero!');
        return false;
    }
    
    if (quantidade > estoqueAtual) {
        alert(`Quantidade indisponível! Estoque atual: ${estoqueAtual}`);
        return false;
    }
    
    return true;
}

// Função para registrar venda
async function registrarVenda(produtoId, quantidade) {
    try {
        // Primeiro, verifica se o produto existe e tem estoque suficiente
        const produtoResponse = await fetch(`${API_BASE_URL}/Produto/${produtoId}`);
        if (!produtoResponse.ok) {
            throw new Error("Erro ao buscar produto.");
        }

        const produto = await produtoResponse.json();
        
        // Valida a quantidade
        if (!validarQuantidade(quantidade, produto.quantidade)) {
            return;
        }

        // Atualiza o estoque do produto
        produto.quantidade -= quantidade;
        const updateResponse = await fetch(`${API_BASE_URL}/Produto/Editar/${produtoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });

        if (!updateResponse.ok) {
            throw new Error("Erro ao atualizar estoque do produto.");
        }

        // Registra a venda
        const vendaResponse = await fetch(`${API_BASE_URL}/vendas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                produtoId: produtoId,
                quantidade: quantidade,
                dataVenda: new Date().toISOString(),
                precoUnitario: produto.preco,
                nomeProduto: produto.nome
            })
        });

        if (!vendaResponse.ok) {
            throw new Error("Erro ao registrar venda.");
        }

        const venda = await vendaResponse.json();
        console.log("Venda registrada:", venda);
        
        // Mostra o popup de agradecimento
        mostrarPopupAgradecimento();
        
        // Atualiza a lista de produtos
        carregarProdutos();
    } catch (error) {
        console.error("Erro ao registrar venda:", error);
        alert("Erro ao registrar venda: " + error.message);
    }
}

// Função para adicionar ao carrinho
function adicionarAoCarrinho(produtoId, quantidade) {
    // Busca o produto para verificar o estoque
    fetch(`${API_BASE_URL}/Produto/${produtoId}`)
        .then(response => response.json())
        .then(produto => {
            if (!validarQuantidade(quantidade, produto.quantidade)) {
                return;
            }
            
            // Se passou na validação, adiciona ao carrinho
            const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            carrinho.push({
                id: produtoId,
                nome: produto.nome,
                quantidade: quantidade,
                preco: produto.preco
            });
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            
            // Atualiza a exibição do carrinho
            atualizarCarrinho();
        })
        .catch(error => {
            console.error("Erro ao adicionar ao carrinho:", error);
            alert("Erro ao adicionar produto ao carrinho");
        });
}
