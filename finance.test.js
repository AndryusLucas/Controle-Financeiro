const { calcularResumo } = require('./finance');

// Grupo de testes para a matéria da Jéssica
describe('Testando as contas do sistema', () => {

    test('Caso 1: Deve somar entradas e subtrair saídas corretamente', () => {
        // Criando uma listinha de mentira idêntica à que o usuário usaria
        const compras = [
            { valor: '100', tipo: 'entrada' }, // Ganhou 100
            { valor: '30', tipo: 'saida' }     // Gastou 30
        ];

        const resultado = calcularResumo(compras);

        // Verificando se a matemática funcionou
        expect(resultado.entradas).toBe(100);
        expect(resultado.saidas).toBe(30);
        expect(resultado.total).toBe(70); // 100 - 30 tem que dar 70
    });
});