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
