// ======================
// ELEMENTOS
// ======================

const ingredientes = document.getElementById("ingredientes");
const btnAddIngrediente = document.getElementById("btnAddIngrediente");

const custoReceita = document.getElementById("custoReceita");
const margemLucro = document.getElementById("margemLucro");
const precoVenda = document.getElementById("precoVenda");

// ======================
// PRODUTOS
// ======================

function obterProdutos() {
    return JSON.parse(localStorage.getItem("estoque")) || [];
}

// ======================
// DATALIST PRODUTOS
// ======================

function criarDatalistProdutos() {

    let datalist = document.getElementById("listaProdutos");

    if (!datalist) {

        datalist = document.createElement("datalist");
        datalist.id = "listaProdutos";

        document.body.appendChild(datalist);
    }

    const produtos = obterProdutos();

    datalist.innerHTML = produtos.map(produto => `
        <option value="${produto.nome}">
    `).join("");
}

// ======================
// UNIDADE AUTOMÁTICA
// ======================

function atualizarUnidade(inputIngrediente) {

    const produtos = obterProdutos();

    const produto = produtos.find(
        p =>
        p.nome.toLowerCase() ===
        inputIngrediente.value.toLowerCase()
    );

    const linha = inputIngrediente.closest("tr");

    const selectUnidade =
        linha.querySelector(".unidade");

    if (!produto) {

        selectUnidade.innerHTML = `
            <option value="">Selecione</option>
        `;

        return;
    }

    const unidade =
        produto.unidade.toUpperCase();

    if (unidade === "KG") {

        selectUnidade.innerHTML = `
            <option value="KG">KG</option>
            <option value="g">g</option>
        `;

    } else if (unidade === "L") {

        selectUnidade.innerHTML = `
            <option value="L">L</option>
            <option value="ml">ml</option>
        `;

    } else {

        selectUnidade.innerHTML = `
            <option value="${produto.unidade}">
                ${produto.unidade}
            </option>
        `;
    }

    calcularCustoReceita();
}

// ======================
// CUSTO AUTOMÁTICO
// ======================

function calcularCustoReceita() {

    const produtos = obterProdutos();

    let custoTotal = 0;

    document
        .querySelectorAll("#ingredientes tr")
        .forEach(linha => {

            const nomeProduto =
                linha.querySelector(".ingrediente").value;

            let quantidade =
                parseFloat(
                    linha.querySelector(".quantidade").value
                ) || 0;

            const unidadeReceita =
                linha.querySelector(".unidade")?.value || "";

            const produto = produtos.find(
                p =>
                    p.nome.toLowerCase() ===
                    nomeProduto.toLowerCase()
            );

            if (!produto) return;

            const precoCusto =
                parseFloat(produto.precoCusto) || 0;

            const quantidadeEstoque =
                parseFloat(produto.quantidade) || 1;

            const unidadeEstoque =
                produto.unidade.toUpperCase();

            // ======================
            // CONVERSÕES
            // ======================

            if (
                unidadeEstoque === "KG" &&
                unidadeReceita === "g"
            ) {
                quantidade = quantidade / 1000;
            }

            if (
                unidadeEstoque === "L" &&
                unidadeReceita === "ml"
            ) {
                quantidade = quantidade / 1000;
            }

            const custoUnitario =
                precoCusto / quantidadeEstoque;

            custoTotal +=
                quantidade * custoUnitario;

        });

    custoReceita.value =
        custoTotal.toFixed(2);

    calcularPrecoVenda();
}

// ======================
// PREÇO DE VENDA
// ======================

function calcularPrecoVenda() {

    const custo =
        parseFloat(custoReceita.value) || 0;

    const margem =
        parseFloat(margemLucro.value) || 0;

    const venda =
        custo + (custo * margem / 100);

    precoVenda.value =
        venda.toFixed(2);
}

margemLucro.addEventListener(
    "input",
    calcularPrecoVenda
);

// ======================
// ADICIONAR INGREDIENTE
// ======================

function adicionarIngrediente() {

    const linha = document.createElement("tr");

    linha.innerHTML = `
        <td>
            <input
                type="text"
                class="ingrediente"
                list="listaProdutos"
                placeholder="Digite o ingrediente"
            >
        </td>

        <td>
            <input
                type="number"
                class="quantidade"
                placeholder="Quantidade"
                min="0"
                step="0.001"
            >
        </td>

        <td>
            <select class="unidade">
            </select>
        </td>

        <td>
            <button
                type="button"
                class="btn-remover"
            >
                ❌
            </button>
        </td>
    `;

    ingredientes.appendChild(linha);

    const inputIngrediente =
        linha.querySelector(".ingrediente");

    const campoQuantidade =
        linha.querySelector(".quantidade");

    const campoUnidade =
        linha.querySelector(".unidade");

    inputIngrediente.addEventListener(
        "input",
        () => {
            atualizarUnidade(inputIngrediente);
        }
    );

    campoQuantidade.addEventListener(
        "input",
        calcularCustoReceita
    );

    campoUnidade.addEventListener(
        "change",
        calcularCustoReceita
    );
}

// ======================
// BOTÃO ADICIONAR
// ======================

btnAddIngrediente.addEventListener(
    "click",
    adicionarIngrediente
);

// ======================
// REMOVER INGREDIENTE
// ======================

ingredientes.addEventListener(
    "click",
    (event) => {

        if (
            event.target.classList.contains(
                "btn-remover"
            )
        ) {

            event.target
                .closest("tr")
                .remove();

            calcularCustoReceita();
        }

    }
);

// ======================
// INICIALIZAÇÃO
// ======================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        criarDatalistProdutos();

        adicionarIngrediente();

    }
);