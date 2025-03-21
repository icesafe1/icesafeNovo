const API_BASE_URL = 'https://localhost:7223/api';

// Garantir que o código só execute após o DOM estar carregado
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM totalmente carregado!");

    // Seleciona os elementos do DOM
    const addProductForm = document.getElementById("addProductForm");
    const addProductButton = document.getElementById("addProductButton");
    const saveProductButton = document.getElementById("saveProductButton");

    // Verificação se os elementos existem no DOM
    if (!addProductForm || !addProductButton || !saveProductButton) {
        console.error("❌ ERRO: Um ou mais elementos não foram encontrados!");
        return;
    }

    // Exibir o formulário ao clicar no botão "Adicionar Produto"
    addProductButton.addEventListener("click", () => {
        addProductForm.classList.remove("hidden");
    });

    // Captura os dados do formulário de produto e envia para a API
    saveProductButton.addEventListener("click", async () => {
        const name = document.getElementById("newProductName").value;
        const price = parseFloat(document.getElementById("newProductPrice").value);
        const quantity = parseInt(document.getElementById("newProductQuantity").value);
        const imageFile = document.getElementById("newProductImage").files[0];

        if (!name || !price || !quantity || !imageFile) {
            alert("Preencha todos os campos.");
            return;
        }

        // Criação de um FormData para enviar a imagem junto com os dados
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("quantity", quantity);
        formData.append("image", imageFile);

        try {
            // Primeiro, salva o produto (sem o link da imagem)
            const productResponse = await fetch(`${API_BASE_URL}/produto/Adicionar`, {
                method: "POST",
                body: JSON.stringify({
                    Nome: name,
                    Preco: price,
                    Quantidade: quantity
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!productResponse.ok) {
                throw new Error("Erro ao adicionar produto");
            }

            const productData = await productResponse.json();

            // Agora que o produto foi adicionado, vamos adicionar o link da imagem
            const imgLink = "url-da-imagem";  // O link da imagem pode ser gerado após o upload
            const imageLinkResponse = await fetch(`${API_BASE_URL}/produto/imagelinks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ImgLink: imgLink }),
            });

            if (!imageLinkResponse.ok) {
                throw new Error("Erro ao salvar o link da imagem");
            }

            const imageLinkData = await imageLinkResponse.json();
            console.log("✅ Link da imagem salvo:", imageLinkData);

            alert("Produto e link da imagem salvos com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao salvar produto ou link da imagem:", error);
            alert("Erro ao salvar produto: " + error.message);
        }
    });
});
