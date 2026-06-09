// Função que simula o fluxo real do seu sistema: Lê do localStorage, adiciona uma nova e salva de volta
function adicionarESalvarTransacao(novaTransacao) {
    // 1. Busca o que já estava salvo no localStorage (se não tiver nada, começa com uma lista vazia '[]')
    let transacoesAtuais = localStorage.getItem('transactions') ? JSON.parse(localStorage.getItem('transactions')) : [];

    // 2. Integra a nova transação na lista
    transacoesAtuais.push(novaTransacao);

    // 3. Salva a lista atualizada de volta no localStorage do navegador
    localStorage.setItem('transactions', JSON.stringify(transacoesAtuais));

    // 4. Retorna a lista completa para o sistema usar
    return transacoesAtuais;
}

module.exports = { adicionarESalvarTransacao };