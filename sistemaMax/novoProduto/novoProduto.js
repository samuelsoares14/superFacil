// =========================
// ELEMENTOS
// =========================
const precoCusto = document.getElementById("precoCusto");
const margemLucro = document.getElementById("margemLucro");
const precoVenda = document.getElementById("precoVenda");

const imagemProduto = document.getElementById("imagemProduto");
const previewImagem = document.getElementById("previewImagem");

const btnSalvar = document.querySelector(".green-btn");
const formProduto = document.getElementById("formProduto");

// =========================
// VARIÁVEIS GLOBAIS
// =========================
let imagemBase64 = "";
let categorias = [];

// =========================
// CALCULAR PREÇO
// =========================
function calcularPrecoVenda() {
    const custo = parseFloat(precoCusto.value) || 0;
    const margem = parseFloat(margemLucro.value) || 0;

    precoVenda.value = (custo + (custo * margem / 100)).toFixed(2);
}

precoCusto.addEventListener("input", calcularPrecoVenda);
margemLucro.addEventListener("input", calcularPrecoVenda);

// =========================
// IMAGEM
// =========================
imagemProduto.addEventListener("change", (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
        imagemBase64 = ev.target.result;
        previewImagem.src = imagemBase64;
        previewImagem.style.display = "block";
    };

    reader.readAsDataURL(arquivo);
});

// =========================
// CÓDIGO DE BARRAS
// =========================
function gerarCodigoBarras() {
    return Math.floor(
        1000000000000 + Math.random() * 9000000000000
    ).toString();
}

// =========================
// SALVAR PRODUTO
// =========================
btnSalvar.addEventListener("click", salvarProduto);

function salvarProduto() {
    const nome = document.getElementById("nomeProduto").value.trim();

    let codigoBarras = document.getElementById("codigoBarras").value.trim();
    if (!codigoBarras) codigoBarras = gerarCodigoBarras();

    if (!nome) {
        alert("Digite o nome do produto.");
        return;
    }

    const produto = {
        id: Date.now(),
        nome,
        codigoBarras,
        categoria: document.getElementById("categoria").value,
        precoCusto: parseFloat(document.getElementById("precoCusto").value) || 0,
        precoVenda: parseFloat(document.getElementById("precoVenda").value) || 0,
        margemLucro: parseFloat(document.getElementById("margemLucro").value) || 0,
        quantidade: parseFloat(document.getElementById("quantidade").value) || 0,
        unidade: document.getElementById("unidadesDeMedida").value,
        perecivel: document.getElementById("perecivel").checked,
        dataValidade: document.getElementById("dataValidade").value,
        imagem: imagemBase64,
        dataCadastro: new Date().toLocaleString("pt-BR")
    };

    let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
    const idEditando = localStorage.getItem("produtoEditando");

    if (idEditando) {
        const index = estoque.findIndex(p => p.id == idEditando);

        produto.id = Number(idEditando);
        estoque[index] = produto;

        localStorage.removeItem("produtoEditando");

        alert("Produto atualizado!");
    } else {
        estoque.push(produto);
        alert("Produto cadastrado!");
    }

    localStorage.setItem("estoque", JSON.stringify(estoque));

    limparFormulario();
    window.location.href = "../produtos.html";
}

// =========================
// EDITAR PRODUTO
// =========================
const idProdutoEditando = localStorage.getItem("produtoEditando");

if (idProdutoEditando) {
    const estoque = JSON.parse(localStorage.getItem("estoque")) || [];
    const produto = estoque.find(p => p.id == idProdutoEditando);

    if (produto) {
        document.getElementById("nomeProduto").value = produto.nome;
        document.getElementById("codigoBarras").value = produto.codigoBarras;
        document.getElementById("categoria").value = produto.categoria;
        document.getElementById("precoCusto").value = produto.precoCusto;
        document.getElementById("margemLucro").value = produto.margemLucro;

        calcularPrecoVenda();

        document.getElementById("quantidade").value = produto.quantidade;
        document.getElementById("unidadesDeMedida").value = produto.unidade;
        document.getElementById("dataValidade").value = produto.dataValidade || "";

        document.getElementById("perecivel").checked = produto.perecivel;

        if (produto.imagem) {
            imagemBase64 = produto.imagem;
            previewImagem.src = produto.imagem;
            previewImagem.style.display = "block";
        }
    }
}

// =========================
// CATEGORIAS
// =========================

// salvar no localStorage
function salvarCategoriasStorage() {
    localStorage.setItem("categorias", JSON.stringify(categorias));
}

// carregar do localStorage
function carregarCategoriasStorage() {
    categorias = JSON.parse(localStorage.getItem("categorias")) || [];
    renderizarCategorias();
    atualizarSelect();
}

// salvar categoria
const btnSalvarCategoria = document.getElementById("btnSalvarCategoria");

if (btnSalvarCategoria) {
    btnSalvarCategoria.addEventListener("click", () => {
        const input = document.getElementById("novaCategoria");
        const valor = input.value.trim();

        if (valor === "") return;

        if (categorias.includes(valor)) {
            alert("Categoria já existe!");
            return;
        }

        categorias.push(valor);
        salvarCategoriasStorage();

        input.value = "";

        renderizarCategorias();
        atualizarSelect();
    });
}

// abrir/fechar form categoria
const btnNovaCategoria = document.getElementById("btnNovaCategoria");

if (btnNovaCategoria) {
    btnNovaCategoria.addEventListener("click", () => {
        const form = document.getElementById("formNovaCategoria");

        form.style.display =
            form.style.display === "block" ? "none" : "block";
    });
}

// render categorias (SEM EXCLUIR)
function renderizarCategorias() {
    const lista = document.getElementById("listaCategorias");

    lista.innerHTML = "";

    categorias.forEach(cat => {
        const li = document.createElement("li");
        li.textContent = cat;
        lista.appendChild(li);
    });
}

// atualizar select
function atualizarSelect() {
    const select = document.getElementById("categoria");

    select.innerHTML = `<option value="">Selecione</option>`;

    categorias.forEach(cat => {
        select.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

// =========================
// LIMPAR FORM
// =========================
function limparFormulario() {
    if (formProduto) formProduto.reset();

    previewImagem.src = "";
    previewImagem.style.display = "none";

    imagemBase64 = "";
    precoVenda.value = "";
}

// =========================
// INICIALIZAÇÃO
// =========================
document.addEventListener("DOMContentLoaded", () => {
    carregarCategoriasStorage();
});