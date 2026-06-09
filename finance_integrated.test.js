const { adicionarESalvarTransacao } = require('./finance_integrated');

// --- PASSO SIMPLES: Criando um simulador do localStorage para o teste funcionar ---
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; }
    };
})();

// Dizemos para o sistema usar o nosso simulador durante o teste
global.localStorage = localStorageMock;
// ---------------------------------------------------------------------------------

describe('Testes de Integração do Sistema Financeiro', () => {

    // Antes de cada teste, limpamos o banco para um teste não atrapalhar o outro
    beforeEach(() => {
        localStorage.clear();
    });

    test('Deve integrar a lógica com o localStorage (Salvar e Recuperar dados)', () => {
        // 1. Cenário: Criar uma transação nova
        const novaTransacao = { valor: '250', tipo: 'entrada' };

        // 2. Execução: Chamar a função que junta a lógica com o armazenamento
        const resultadoDaIntegracao = adicionarESalvarTransacao(novaTransacao);

        // 3. Verificação de Integração:
        // O resultado na memória imediata tem que ter 1 item
        expect(resultadoDaIntegracao.length).toBe(1);

        // A prova real: Vamos ler direto do simulador do localStorage para ver se ele gravou em texto textualmente
        const dadosNoLocalStorage = JSON.parse(localStorage.getItem('transactions'));
        
        expect(dadosNoLocalStorage).not.toBeNull();
        expect(dadosNoLocalStorage[0].valor).toBe('250');
        expect(dadosNoLocalStorage[0].tipo).toBe('entrada');
    });
});