const API_BASE_URL = "https://localhost:7223/api"; // Substitua pela URL base da sua API


// Função para carregar os produtos do backend
async function carregarProdutos() {
    try {
        // Faz uma requisição GET para o backend
        const response = await fetch(`${API_BASE_URL}/Produto`);
        if (!response.ok) {
            throw new Error("Erro ao carregar produtos do backend");
        }

        const produtos = await response.json(); // Converte a resposta para JSON
        const tableBody = document.querySelector("#productTable tbody");
        tableBody.innerHTML = ""; // Limpa a tabela antes de renderizar

        // Renderiza os produtos na tabela
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
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert("Erro ao carregar produtos: " + error.message);
    }

}

// Função para editar um produto
async function editarProduto(id) {

    try {
        const novoNome = prompt("Digite o novo nome do produto:");
        const novoPreco = parseFloat(prompt("Digite o novo preço do produto:"));
        const novaQuantidade = parseInt(prompt("Digite a nova quantidade do produto:"));

        if (!novoNome || isNaN(novoPreco) || isNaN(novaQuantidade)) {
            alert("Preencha todos os campos corretamente.");
            return;
        }

        // Busca o produto atual para manter o link da imagem
        const responseProduto = await fetch(`${API_BASE_URL}/Produto/${id}`);
        if (!responseProduto.ok) {
            throw new Error("Erro ao buscar o produto atual.");
        }
        const produtoAtual = await responseProduto.json();

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