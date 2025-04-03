function acessarEstoque() {
    const senhaCorreta = "123"; // Substitua pela senha desejada
    const senha = prompt("Digite a senha para acessar o estoque:");

    if (senha === senhaCorreta) {
        window.location.href = "estoque.html"; // Redireciona para a página de estoque
    } else {
        alert("Senha incorreta! Acesso negado.");
    }
}