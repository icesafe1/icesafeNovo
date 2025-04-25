const API_BASE_URL = 'https://localhost:7223/api';

async function carregarProdutos() {
    try {
        console.log('Iniciando carregamento de produtos...');
        console.log('URL da API:', `${API_BASE_URL}/Produto`);
        
        const response = await fetch(`${API_BASE_URL}/Produto`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            mode: 'cors',
            credentials: 'omit'
        }).catch(error => {
            console.error('Erro na requisição fetch:', error);
            throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
        });

        console.log('Status da resposta:', response.status);
        console.log('Headers da resposta:', response.headers);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta do servidor:', errorText);
            throw new Error(`Erro ao carregar produtos: ${response.status} - ${errorText}`);
        }

        const produtos = await response.json();

        const tableBody = document.querySelector("#productTable tbody");
        tableBody.innerHTML = "";

        produtos.forEach(produto => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${produto.nome}</td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td>${produto.quantidade}</td>
                <td>
                    <button class="edit" onclick="editarProduto(${produto.id})">Editar</button>
                  
                </td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Erro detalhado ao carregar produtos:', error);
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_EMPTY_RESPONSE')) {
            alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 5000.');
        } else {
            alert('Erro ao carregar produtos: ' + error.message);
        }
    }
}

function exibirProdutos(produtos) {
    const tbody = document.querySelector('#tabelaProdutos tbody');
    if (!tbody) {
        console.error('Elemento tbody não encontrado');
        return;
    }

    tbody.innerHTML = '';

    if (produtos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="6" class="text-center">Nenhum produto cadastrado</td>';
        tbody.appendChild(tr);
        return;
    }

    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>
                <img src="${produto.imgLink || 'img/produto-sem-imagem.jpg'}" 
                     alt="${produto.nome}" 
                     style="width: 50px; height: 50px; object-fit: cover;">
            </td>
            <td>
                <button onclick="editarProduto(${produto.id})" class="btn-editar">Editar</button>
                <button onclick="excluirProduto(${produto.id})" class="btn-excluir">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para editar produto
async function editarProduto(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/Produto/${id}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar dados do produto');
        }

        const produto = await response.json();
        
        // Preenche o formulário de edição
        document.getElementById('editId').value = produto.id;
        document.getElementById('editNome').value = produto.nome;
        document.getElementById('editPreco').value = produto.preco;
        document.getElementById('editQuantidade').value = produto.quantidade;
        document.getElementById('editImgLink').value = produto.imgLink || '';

        // Mostra o modal de edição
        document.getElementById('modalEditar').style.display = 'block';
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        alert('Erro ao carregar dados do produto para edição');
    }
}

// Função para excluir produto
async function excluirProduto(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/Produto/Remover/${id}`, {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir produto');
        }

        alert('Produto excluído com sucesso!');
        carregarProdutos(); // Recarrega a lista
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto');
    }
}

// Função para fechar o modal
function fecharModal() {
    document.getElementById('modalEditar').style.display = 'none';
}

// Adiciona evento para o formulário de edição
document.getElementById('formEditar')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const nome = document.getElementById('editNome').value;
    const preco = parseFloat(document.getElementById('editPreco').value);
    const quantidade = parseInt(document.getElementById('editQuantidade').value);
    const imgLink = document.getElementById('editImgLink').value;

    try {
        const response = await fetch(`${API_BASE_URL}/Produto/Editar/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                id: id,
                nome: nome,
                preco: preco,
                quantidade: quantidade,
                imgLink: imgLink
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar produto');
        }

        alert('Produto atualizado com sucesso!');
        fecharModal();
        carregarProdutos(); // Recarrega a lista
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        alert('Erro ao atualizar produto');
    }
});


// Carrega os produtos quando a página é carregada
document.addEventListener('DOMContentLoaded', carregarProdutos);
