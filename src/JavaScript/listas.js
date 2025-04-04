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

        // Envia as alterações para o backend
        const response = await fetch(`${API_BASE_URL}/Produto/Editar/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id, // Inclui o ID no corpo da requisição
                nome: novoNome,
                preco: novoPreco,
                quantidade: novaQuantidade,
                imgLink: produtoAtual.imgLink // Mantém o link da imagem atual
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Erro ao atualizar o produto no backend.");
        }

        alert("Produto editado com sucesso!");
        carregarProdutos(); // Recarrega a lista de produtos
    } catch (error) {
        console.error("Erro ao editar produto:", error);
        alert("Erro ao editar produto no backend.");
    }
}

// Função para inativar um produto
async function inativarProduto(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/Produto/Inativar/${id}`, {
            method: "PUT"
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Erro ao inativar produto.");
        }

        alert("Produto inativado com sucesso!");
        carregarProdutos(); // Recarrega a lista de produtos
    } catch (error) {
        console.error("Erro ao inativar produto:", error);
        alert("Erro ao inativar produto: " + error.message);
    }
}

// Função para ativar um produto
async function ativarProduto(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/Produto/Ativar/${id}`, {
            method: "PUT"
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Erro ao ativar produto.");
        }

        alert("Produto ativado com sucesso!");
        carregarProdutos(); // Recarrega a lista de produtos
    } catch (error) {
        console.error("Erro ao ativar produto:", error);
        alert("Erro ao ativar produto: " + error.message);
    }
}

// Carrega os produtos ao carregar a página
document.addEventListener("DOMContentLoaded", carregarProdutos);