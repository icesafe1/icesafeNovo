const API_BASE_URL = "https://localhost:7223/api";

async function carregarProdutos() {
    try {
        const response = await fetch(`${API_BASE_URL}/Produto`);
        if (!response.ok) {
            throw new Error("Erro ao carregar produtos do backend");
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

async function editarProduto(id) {
    try {
        const novoNome = prompt("Digite o novo nome do produto:");
        const novoPreco = parseFloat(prompt("Digite o novo preço do produto:"));
        const novaQuantidade = parseInt(prompt("Digite a nova quantidade do produto:"));

        if (!novoNome || isNaN(novoPreco) || isNaN(novaQuantidade)) {
            alert("Preencha todos os campos corretamente.");
            return;
        }

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

    produto.nome = novoNome;
    produto.preco = novoPreco;
    produto.quantidade = novaQuantidade;
    produto.imgLink = novoImgLink.trim() || produto.imgLink;

    try {

        const response = await fetch(`${API_BASE_URL}/Produto/Editar/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({

                id: produto.id, 
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

        localStorage.setItem("produtos", JSON.stringify(produtos));
        alert("Produto editado com sucesso!");
        carregarProdutos();
    } catch (error) {
        console.error("Erro ao editar produto:", error);
        alert("Erro ao editar produto no backend.");
    }
    } catch (error) {
        console.error("Erro ao editar produto:", error);
        alert("Erro ao editar produto: " + error.message);
    }

function inativarProduto(id) {
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const produto = produtos.find(p => p.id === id);
    if (!produto) {
        alert("Produto não encontrado!");
        return;
    }

    produto.ativo = false; 
    localStorage.setItem("produtos", JSON.stringify(produtos));
    alert("Produto inativado com sucesso!");
    carregarProdutos();
}

function ativarProduto(id) {
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const produto = produtos.find(p => p.id === id);
    if (!produto) {
        alert("Produto não encontrado!");
        return;
    }

    produto.ativo = true;
    localStorage.setItem("produtos", JSON.stringify(produtos));
    alert("Produto ativado com sucesso!");
    carregarProdutos();

}}

document.addEventListener("DOMContentLoaded", carregarProdutos);