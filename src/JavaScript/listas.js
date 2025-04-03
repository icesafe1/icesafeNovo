const API_BASE_URL = "https://localhost:7223/api"; // Substitua pela URL base da sua API

// Função para carregar os produtos do LocalStorage
function carregarProdutos() {
    let produtos = JSON.parse(localStorage.getItem("produtos")) || []; // Recupera os produtos do LocalStorage
    const tableBody = document.querySelector("#productTable tbody");
    tableBody.innerHTML = ""; // Limpa a tabela antes de renderizar

    produtos.forEach(produto => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>
                <button class="edit" onclick="editarProduto(${produto.id})">Editar</button>
                ${produto.ativo 
                    ? `<button class="inactivate" onclick="inativarProduto(${produto.id})">Inativar</button>` 
                    : `<button class="activate" onclick="ativarProduto(${produto.id})">Ativar</button>`}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Função para editar um produto
async function editarProduto(id) {
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const produto = produtos.find(p => p.id === id);
    if (!produto) {
        alert("Produto não encontrado!");
        return;
    }

    const novoNome = prompt("Digite o novo nome do produto:", produto.nome);
    const novoPreco = parseFloat(prompt("Digite o novo preço do produto:", produto.preco));
    const novaQuantidade = parseInt(prompt("Digite a nova quantidade do produto:", produto.quantidade));
    const novoImgLink = prompt("Digite o link da imagem do produto (ou deixe em branco para manter a atual):", produto.imgLink);

    if (!novoNome || isNaN(novoPreco) || isNaN(novaQuantidade)) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    // Atualiza os campos do produto localmente
    produto.nome = novoNome;
    produto.preco = novoPreco;
    produto.quantidade = novaQuantidade;
    produto.imgLink = novoImgLink.trim() || produto.imgLink; // Mantém o link da imagem atual se o campo estiver vazio

    try {
        // Envia as alterações para o backend
        const response = await fetch(`${API_BASE_URL}/Produto/Editar/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: produto.id, // Inclui o ID no corpo da requisição
                nome: produto.nome,
                preco: produto.preco,
                quantidade: produto.quantidade,
                imgLink: produto.imgLink
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Erro ao atualizar o produto no backend.");
        }

        // Atualiza o LocalStorage após a confirmação do backend
        localStorage.setItem("produtos", JSON.stringify(produtos));
        alert("Produto editado com sucesso!");
        carregarProdutos(); // Recarrega a lista de produtos
    } catch (error) {
        console.error("Erro ao editar produto:", error);
        alert("Erro ao editar produto no backend.");
    }
}

// Função para inativar um produto
function inativarProduto(id) {
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const produto = produtos.find(p => p.id === id);
    if (!produto) {
        alert("Produto não encontrado!");
        return;
    }

    produto.ativo = false; // Marca o produto como inativo
    localStorage.setItem("produtos", JSON.stringify(produtos)); // Atualiza o LocalStorage
    alert("Produto inativado com sucesso!");
    carregarProdutos(); // Recarrega a lista de produtos
}

// Função para ativar um produto
function ativarProduto(id) {
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const produto = produtos.find(p => p.id === id);
    if (!produto) {
        alert("Produto não encontrado!");
        return;
    }

    produto.ativo = true; // Marca o produto como ativo
    localStorage.setItem("produtos", JSON.stringify(produtos)); // Atualiza o LocalStorage
    alert("Produto ativado com sucesso!");
    carregarProdutos(); // Recarrega a lista de produtos
}

// Carrega os produtos ao carregar a página
document.addEventListener("DOMContentLoaded", carregarProdutos);