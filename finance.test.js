const { calcularResumo } = require('./finance');

describe('Testes do Módulo Financeiro', () => {
    
    test('Deve calcular corretamente o resumo com entradas e saídas', () => {
        // Cenário de teste (Mocks)
        const transacoesDummy = [
            { id: 1, descricao: 'Salário', valor: '5000', tipo: 'entrada' },
            { id: 2, descricao: 'Aluguel', valor: '1200', tipo: 'saida' },
            { id: 3, descricao: 'Mercado', valor: '300', tipo: 'saida' }
        ];

        // Execução
        const resultado = calcularResumo(transacoesDummy);

        // Validações (Asserts)
        expect(resultado.entradas).toBe(5000);
        expect(resultado.saidas).toBe(1500);
        expect(resultado.total).toBe(3500);
    });

    test('Deve retornar valores zerados se a lista de transações estiver vazia', () => {
        const resultado = calcularResumo([]);
        
        expect(resultado.entradas).toBe(0);
        expect(resultado.saidas).toBe(0);
        expect(resultado.total).toBe(0);
    });
});