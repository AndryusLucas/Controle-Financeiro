// Lógica de cálculo pura (isolada do HTML e do localStorage)
function calcularResumo(transacoes) {
    let entradas = 0;
    let saídas = 0;

    transacoes.forEach(transacao => {
        const valor = parseFloat(transacao.valor);
        if (transacao.tipo === 'entrada') {
            entradas += valor;
        } else if (transacao.tipo === 'saida') {
            saídas += valor;
        }
    });

    const total = entradas - saídas;

    return {
        entradas: entradas,
        saidas: saídas,
        total: total
    };
}

// Exporta a função para que o arquivo de teste consiga importar
module.exports = { calcularResumo };