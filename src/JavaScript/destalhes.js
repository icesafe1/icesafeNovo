// Carregar VENDAS e RELATÓRIO
document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = 'http://localhost:7223/api';

    // Função para carregar dados das vendas
    async function carregarDadosVendas() {
        try {
            console.log('Iniciando carregamento de dados das vendas...');
            console.log('URL da API:', `${API_BASE_URL}/Vendas`);
            
            const response = await fetch(`${API_BASE_URL}/Vendas`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                mode: 'cors'
            }).catch(error => {
                console.error('Erro na requisição fetch:', error);
                throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
            });

            console.log('Status da resposta:', response.status);
            console.log('Headers da resposta:', response.headers);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Resposta do servidor:', errorText);
                throw new Error(`Erro ao carregar vendas: ${response.status} - ${errorText}`);
            }

            const vendas = await response.json();
            console.log('Vendas carregadas com sucesso:', vendas);
            exibirDadosVendas(vendas);
        } catch (error) {
            console.error('Erro detalhado ao carregar dados das vendas:', error);
            if (error.message.includes('Failed to fetch') || error.message.includes('ERR_EMPTY_RESPONSE')) {
                alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 7223.');
            } else {
                alert('Erro ao carregar dados das vendas: ' + error.message);
            }
        }
    }

    // Função para carregar relatório de vendas
    async function carregarRelatorioVendas() {
        try {
            console.log('Iniciando carregamento do relatório de vendas...');
            console.log('URL da API:', `${API_BASE_URL}/Vendas/relatorio`);
            
            const response = await fetch(`${API_BASE_URL}/Vendas/relatorio`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                mode: 'cors'
            }).catch(error => {
                console.error('Erro na requisição fetch:', error);
                throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
            });

            console.log('Status da resposta:', response.status);
            console.log('Headers da resposta:', response.headers);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Resposta do servidor:', errorText);
                throw new Error(`Erro ao carregar relatório: ${response.status} - ${errorText}`);
            }

            const relatorio = await response.json();
            console.log('Relatório carregado com sucesso:', relatorio);
            exibirRelatorioVendas(relatorio);
        } catch (error) {
            console.error('Erro detalhado ao carregar relatório de vendas:', error);
            if (error.message.includes('Failed to fetch') || error.message.includes('ERR_EMPTY_RESPONSE')) {
                alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 7223.');
            } else {
                alert('Erro ao carregar relatório de vendas: ' + error.message);
            }
        }
    }

    // Função para exibir dados das vendas
    function exibirDadosVendas(vendas) {
        const tbody = document.querySelector('#tabelaVendas tbody');
        if (!tbody) {
            console.error('Elemento tbody não encontrado');
            return;
        }

        tbody.innerHTML = '';

        if (vendas.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="4" class="text-center">Nenhuma venda registrada</td>';
            tbody.appendChild(tr);
            return;
        }

        vendas.forEach(venda => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${venda.id}</td>
                <td>${venda.produtoNome}</td>
                <td>${venda.quantidade}</td>
                <td>R$ ${venda.precoUnitario.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Função para exibir relatório de vendas
    function exibirRelatorioVendas(relatorio) {
        const relatorioDiv = document.getElementById('relatorioVendas');
        if (!relatorioDiv) {
            console.error('Elemento relatorioVendas não encontrado');
            return;
        }

        relatorioDiv.innerHTML = `
            <h3>Relatório de Vendas</h3>
            <p>Total de Vendas: ${relatorio.totalVendas}</p>
            <p>Valor Total: R$ ${relatorio.valorTotal.toFixed(2)}</p>
            <p>Produto Mais Vendido: ${relatorio.produtoMaisVendido}</p>
        `;
    }

    // Carrega os dados quando a página é carregada
    carregarDadosVendas();
    carregarRelatorioVendas();
});

// Função para voltar
function voltarPagina() {
    window.location.href = "estoque.html";
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
        if (produto.quantidade < quantidade) {
            throw new Error("Estoque insuficiente.");
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
        alert("Venda registrada com sucesso!");
    } catch (error) {
        console.error("Erro ao registrar venda:", error);
        alert("Erro ao registrar venda: " + error.message);
    }
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
