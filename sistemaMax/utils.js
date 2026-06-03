function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarNumero(valor) {
    return Number(valor).toLocaleString("pt-BR");
}

function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR");
}