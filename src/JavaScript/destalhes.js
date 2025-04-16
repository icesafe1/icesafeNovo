// Carregar VENDAS e RELATÓRIO
document.addEventListener("DOMContentLoaded", () => {
    // Carregar vendas
    fetch("https://localhost:7223/api/vendas/vendas")

        .then(res => {
            if (!res.ok) {
                throw new Error("Erro ao carregar dados das vendas.");
            }
            return res.json();
        })
        .then(vendas => {
            const productDetails = document.getElementById("productDetails");

            // Limpa a tabela antes de renderizar os dados
            productDetails.innerHTML = "";

            vendas.forEach(venda => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${venda.produto}</td>
                    <td>${venda.quantidade}</td>
                    <td>R$ ${venda.receita.toFixed(2)}</td>
                    <td>${new Date(venda.data).toLocaleDateString()}</td>
                `;
                productDetails.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar dados das vendas:", error);
        });

    // Carregar relatório
    fetch("https://localhost:7223/api/vendas/relatorio")

        .then(res => {
            if (!res.ok) {
                throw new Error("Erro ao carregar relatório de vendas.");
            }
            return res.json();
        })
        .then(relatorio => {
            const total15diasElement = document.getElementById("total15dias");
            const total30diasElement = document.getElementById("total30dias");

            total15diasElement.textContent = `Rendimento últimos 15 dias: R$ ${relatorio.ultimos15Dias.toFixed(2)}`;
            total30diasElement.textContent = `Rendimento último mês: R$ ${relatorio.ultimos30Dias.toFixed(2)}`;
        })
        .catch(error => {
            console.error("Erro ao carregar relatório de vendas:", error);
        });
});

// Função para voltar
function voltarPagina() {
    window.location.href = "estoque.html";
}

// Função para registrar venda
async function registrarVenda(produtoId, quantidade) {
    try {
        const response = await fetch("http://localhost:7223/api/vendas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                produtoId: produtoId,
                quantidade: quantidade
            })
        });

        if (!response.ok) {
            throw new Error("Erro ao registrar venda.");
        }

        const venda = await response.json();
        console.log("Venda registrada:", venda);
        alert("Venda registrada com sucesso!");
    } catch (error) {
        console.error("Erro ao registrar venda:", error);
        alert("Erro ao registrar venda.");
    }
}
