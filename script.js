class Transaction {
  constructor(id, name, amount) {
    this.id = id;
    this.name = name;
    this.amount = amount;
  }

  get type() {
    return this.amount < 0 ? 'expense' : 'income';
  }

  get absoluteAmount() {
    return Math.abs(this.amount);
  }

  get formattedAmount() {
    const operator = this.amount < 0 ? '-' : '+';
    return `${operator} R$${this.absoluteAmount.toFixed(2)}`;
  }

  static create(name, amount) {
    const id = Math.round(Math.random() * 10000);
    return new Transaction(id, name.trim(), Number(amount));
  }
}

class TransactionRepository {
  constructor(storageKey = 'transactions') {
    this.storageKey = storageKey;
  }

  getAll() {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return [];
    const transactionsData = JSON.parse(data);
    return transactionsData.map(t => new Transaction(t.id, t.name, t.amount));
  }

  save(transaction) {
    const transactions = this.getAll();
    transactions.push(transaction);
    this._persist(transactions);
    return transaction;
  }

  delete(id) {
    const transactions = this.getAll();
    const filtered = transactions.filter(t => t.id !== id);
    this._persist(filtered);
    return true;
  }

  _persist(transactions) {
    localStorage.setItem(this.storageKey, JSON.stringify(transactions));
  }
}

class IncomeStrategy {
  calculate(currentTotal, amount) {
    return currentTotal + Math.abs(amount);
  }
}

class ExpenseStrategy {
  calculate(currentTotal, amount) {
    return currentTotal - Math.abs(amount);
  }
}

class FinanceService {
  constructor() {
    this.strategies = {
      income: new IncomeStrategy(),
      expense: new ExpenseStrategy()
    };
  }

  calculateBalance(transactions) {
    return transactions.reduce((total, transaction) => {
      const type = transaction.amount >= 0 ? 'income' : 'expense';
      const strategy = this.strategies[type];
      return strategy.calculate(total, transaction.amount);
    }, 0);
  }

  calculateTotalIncomes(transactions) {
    return transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  calculateTotalExpenses(transactions) {
    return Math.abs(
      transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)
    );
  }

  getFinancialSummary(transactions) {
    const incomes = this.calculateTotalIncomes(transactions);
    const expenses = this.calculateTotalExpenses(transactions);
    const balance = incomes - expenses;

    return {
      balance,
      incomes,
      expenses,
      formattedBalance: `R$ ${balance.toFixed(2)}`,
      formattedIncomes: `R$ ${incomes.toFixed(2)}`,
      formattedExpenses: `R$ ${expenses.toFixed(2)}`
    };
  }

  static isValidTransaction(name, amount) {
    return name && name.trim() !== '' && amount !== '' && !isNaN(Number(amount));
  }
}

class UIController {
  constructor() {
    this.transactionsUl = document.querySelector("#transactions");
    this.incomeDisplay = document.querySelector("#money-plus");
    this.expenseDisplay = document.querySelector("#money-minus");
    this.balanceDisplay = document.querySelector("#balance");
    this.form = document.querySelector("#form");
    this.inputTransactionName = document.querySelector("#text");
    this.inputTransactionAmount = document.querySelector("#amount");
    this.btnDarkMode = document.querySelector("#darkmode");
    this.body = document.querySelector("body");

    this.onTransactionDelete = null;
    this.onTransactionAdd = null;
  }

  renderTransactions(transactions) {
    if (!this.transactionsUl) return;
    this.transactionsUl.innerHTML = "";
    transactions.forEach(transaction => {
      this._addTransactionToDOM(transaction);
    });
  }

  _addTransactionToDOM(transaction) {
    const operator = transaction.amount < 0 ? "-" : "+";
    const cssClass = transaction.amount < 0 ? "minus" : "plus";
    const amountWithoutOperator = Math.abs(transaction.amount);

    const li = document.createElement("li");
    li.classList.add(cssClass);
    li.innerHTML = `
      ${transaction.name} 
      <span>${operator} R$${amountWithoutOperator.toFixed(2)}</span>
      <button class="delete-btn" data-id="${transaction.id}">
        x
      </button>
    `;

    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.onTransactionDelete) {
        this.onTransactionDelete(transaction.id);
      }
    });

    this.transactionsUl.appendChild(li);
  }

  updateFinancialDisplay(summary) {
    if (this.balanceDisplay) {
      this.balanceDisplay.textContent = summary.formattedBalance;
    }
    if (this.incomeDisplay) {
      this.incomeDisplay.textContent = `+ ${summary.formattedIncomes}`;
    }
    if (this.expenseDisplay) {
      this.expenseDisplay.textContent = `- ${summary.formattedExpenses}`;
    }
  }

  getFormData() {
    return {
      name: this.inputTransactionName?.value || '',
      amount: this.inputTransactionAmount?.value || ''
    };
  }

  clearForm() {
    if (this.inputTransactionName) this.inputTransactionName.value = "";
    if (this.inputTransactionAmount) this.inputTransactionAmount.value = "";
    this.inputTransactionName?.focus();
  }

  showError(message) {
    alert(message);
  }

  bindEvents() {
    this.form?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (this.onTransactionAdd) {
        const formData = this.getFormData();
        this.onTransactionAdd(formData.name, formData.amount);
      }
    });

    this.btnDarkMode?.addEventListener("click", () => {
      this.body?.classList.toggle("dark");
    });
  }

  init() {
    this.bindEvents();
  }
}

class FinancialApp {
  constructor() {
    this.repository = new TransactionRepository();
    this.financeService = new FinanceService();
    this.ui = new UIController();

    this.ui.onTransactionDelete = this.handleDeleteTransaction.bind(this);
    this.ui.onTransactionAdd = this.handleAddTransaction.bind(this);
  }

  loadAndRender() {
    const transactions = this.repository.getAll();
    this.ui.renderTransactions(transactions);
    this.updateFinancialDisplay(transactions);
  }

  updateFinancialDisplay(transactions) {
    const summary = this.financeService.getFinancialSummary(transactions);
    this.ui.updateFinancialDisplay(summary);
  }

  handleAddTransaction(name, amount) {
    if (!FinanceService.isValidTransaction(name, amount)) {
      this.ui.showError("Por favor, preencha todos os dados corretamente!");
      return;
    }

    const amountNumber = Number(amount);
    const transaction = Transaction.create(name, amountNumber);

    this.repository.save(transaction);
    this.ui.clearForm();
    this.loadAndRender();
  }

  handleDeleteTransaction(id) {
    this.repository.delete(id);
    this.loadAndRender();
  }

  init() {
    this.ui.init();
    this.loadAndRender();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new FinancialApp();
  app.init();
});