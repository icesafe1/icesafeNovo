const API_BASE_URL = "http://localhost:7223/api";

async function acessarEstoque() {
    try {
        const senha = prompt("Digite a senha para acessar o estoque:");
        
        if (!senha) {
            alert("Por favor, digite uma senha.");
            return;
        }

        // Verifica a senha no backend
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ senha })
        });

        if (!response.ok) {
            throw new Error("Senha incorreta! Acesso negado.");
        }

        // Armazena o token de autenticação
        const data = await response.json();
        localStorage.setItem("authToken", data.token);

        // Redireciona para a página de estoque
        window.location.href = "estoque.html";
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert(error.message);
    }
}

// Função para verificar se o usuário está autenticado
async function verificarAutenticacao() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Sessão expirada. Por favor, faça login novamente.");
        }
    } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        localStorage.removeItem("authToken");
        window.location.href = "login.html";
    }
}

// Verifica a autenticação quando a página carrega
document.addEventListener("DOMContentLoaded", verificarAutenticacao);