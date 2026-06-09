// Uma função simples que recebe a lista e faz uma conta de somar e subtrair
function calcularResumo(listaDeTransacoes) {
    let entradas = 0;
    let saidas = 0;

    // Passa por cada item da lista
    for (let i = 0; i < listaDeTransacoes.length; i++) {
        let transacao = listaDeTransacoes[i];
        let valor = Number(transacao.valor); // Transforma texto em número de forma simples

        if (transacao.tipo === 'entrada') {
            entradas = entradas + valor;
        } else if (transacao.tipo === 'saida') {
            saidas = saidas + valor;
        }
    }

    let saldoTotal = entradas - saidas;

    // Devolve o resultado final formatado
    return {
        entradas: entradas,
        saidas: saidas,
        total: saldoTotal
    };
}

// Linha obrigatória para o teste conseguir ler essa função
module.exports = { calcularResumo };