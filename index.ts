// Тема: онлайн банк

// Спринт 1

// Базовый класс Account

/*
 * Класс Account представляет базовый банковский счет.
 * Он содержит информацию о номере счета и балансе.
 */
class Account {
    protected accountNumber: string; // Номер счета, доступен для подклассов
    protected balance: number; // Баланс счета, доступен только внутри класса

    constructor(accountNumber: string, initialBalance: number) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    // Метод для внесения средств на счет.
    public deposit(amount: number): void {
        if (amount > 0) {
            this.balance += amount;
        } else {
            throw new Error("Сумма должна быть положительной");
        }
    }

    // Метод для снятия средств со счета.
    public withdraw(amount: number): void {
        if (amount > 0 && amount <= this.balance) {
            this.balance -= amount;
        } else {
            throw new Error("Недостаточно средств или неверная сумма");
        }
    }

    // Метод для получения текущего баланса счета.
    public getBalance(): number {
        return this.balance;
    }
}


// Наследуемый класс SavingsAccount

/*
 * Класс SavingsAccount представляет сберегательный счет,
 * который наследует функциональность базового класса Account.
 */
class SavingsAccount extends Account {
    private interestRate: number; // Процентная ставка для начисления процентов

    constructor(accountNumber: string, initialBalance: number, interestRate: number) {
        super(accountNumber, initialBalance);
        this.interestRate = interestRate;
    }

    /*
     * Метод для применения процентов к текущему балансу.
     * Начисляет проценты на текущий баланс и добавляет их к счету.
     */
    public applyInterest(): void {
        const interest = this.getBalance() * this.interestRate / 100; // сделать приватным
        this.deposit(interest);
    }
}


// Сервисный класс Bank

/*
 * Класс Bank представляет банк и управляет банковскими счетами.
 */
class Bank {
    private accounts: Account[] = []; // Массив для хранения всех счетов банка

    // Метод для добавления нового счета в банк.
    public addAccount(account: Account): void {
        this.accounts.push(account);
    }

    // Метод для получения счета по номеру.
    // Возвращает объект типа Account или undefined, если счет не найден
    public getAccount(accountNumber: string): Account | undefined {
        return this.accounts.find(acc => acc['accountNumber'] === accountNumber);
    }
}

// -----------------

// private — доступен только внутри класса.
// protected — доступен внутри класса и его подклассов.
// public — доступен из любого места.

// internal — доступен в пределах одного модуля 
// (в TypeScript не поддерживается напрямую, но можно использовать модули).

// sealed — предотвращает дальнейшее наследование 
// (в TypeScript нет прямого аналога, но можно использовать final в других языках).

// -----------------


// Виртуальные методы

/*
 * Класс CheckingAccount представляет расчетный счет,
 * который наследует функциональность базового класса Account.
 */
class CheckingAccount extends Account {
    // Переопределяет метод withdraw для добавления дополнительной проверки.
    public withdraw(amount: number): void {
        // Переопределение метода для проверки дополнительных условий
        if (amount > 1000) {
            throw new Error("Снятие более 1000 требует дополнительного подтверждения");
        }
        super.withdraw(amount); // Вызов метода withdraw базового класса для выполнения операции снятия
    }
}

// Upcast
// Когда вы используете базовый тип для ссылки на объект производного типа
// Создание объекта SavingsAccount и присвоение его переменной типа Account (upcast)
let myAccount: Account = new SavingsAccount("123456", 1000, 5);

if (myAccount instanceof SavingsAccount) {
    let savingsAcc = myAccount as SavingsAccount; // Приведение типа с использованием оператора as
}
else {
    console.log("Объект не является savingAccount")
}

// Downcast
// Приведение базового типа к производному (downcast)
let savingsAcc = myAccount as SavingsAccount;
savingsAcc.applyInterest(); // Вызов метода applyInterest у объекта SavingsAccount

// Операторы is и as
// В TypeScript вы можете использовать оператор instanceof для проверки типа
// Проверка, является ли myAccount экземпляром SavingsAccount перед downcast'ом
if (myAccount instanceof SavingsAccount) {
    let savingsAcc = myAccount as SavingsAccount; // Приведение типа с использованием оператора as
}


// Композиция
// Когда один объект содержит другой объект и управляет его жизненным циклом

/*
 * Класс Customer представляет клиента банка,
 * который имеет один банковский счет.
 */
class Customer {
    private account: Account; // Переменная для хранения аккаунта клиента

    // account - Объект типа Account, который принадлежит клиенту 
    constructor(account: Account) {
        this.account = account; // Композиция
    }
}

// let cus: Customer = new Customer(`Account`)

// Аггрегация
// Когда один объект ссылается на другой объект, но не управляет его жизненным циклом

/*
 * Класс BankBranch представляет филиал банка,
 * который может иметь несколько банковских счетов.
 */
class BankBranch {
    private accounts: Account[]; // Массив для хранения счетов филиала банка

    // accounts - Массив объектов типа Account, которые принадлежат филиалу
    constructor(accounts: Account[]) { // Аггрегация
        this.accounts = accounts;
    }
}


// ----------------------------------------------


// Спринт 3. АБСТРАКТНЫЕ КЛАССЫ, ИНТЕРФЕЙСЫ

/**
 * Интерфейс IAccount описывает основные операции с банковским счетом.
 */
interface IAccount {
    deposit(amount: number): void;
    withdraw(amount: number): void;
    getBalance(): number;
}

/**
 * Абстрактный класс Transaction представляет финансовую транзакцию.
 * Он содержит абстрактный метод для выполнения транзакции.
 */
abstract class Transaction {
    protected amount: number; // Сумма транзакции

    constructor(amount: number) {
        this.amount = amount; // Инициализация суммы транзакции
    }

    /**
     * Абстрактный метод для выполнения транзакции.
     * Должен быть реализован в подклассах.
     */
    abstract execute(): void;
}

// обновляем класс Account, чтобы он реализовывал интерфейс IAccount
class Account implements IAccount {
    protected accountNumber: string;
    private balance: number;

    constructor(accountNumber: string, initialBalance: number) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    public deposit(amount: number): void {
        if (amount > 0) {
            this.balance += amount;
        } else {
            throw new Error("Сумма должна быть положительной");
        }
    }

    public withdraw(amount: number): void {
        if (amount > 0 && amount <= this.balance) {
            this.balance -= amount;
        } else {
            throw new Error("Недостаточно средств или неверная сумма");
        }
    }

    public getBalance(): number {
        return this.balance;
    }
}

// Класс SavingsAccount
class SavingsAccount extends Account {
    private interestRate: number;

    constructor(accountNumber: string, initialBalance: number, interestRate: number) {
        super(accountNumber, initialBalance);
        this.interestRate = interestRate;
    }

    public applyInterest(): void {
        const interest = this.getBalance() * this.interestRate / 100;
        this.deposit(interest);
        console.log(`Начислены проценты: ${interest}`);
    }
}

// Класс CheckingAccount
class CheckingAccount extends Account {
    public withdraw(amount: number): void {
        if (amount > 1000) {
            throw new Error("Снятие более 1000 требует дополнительного подтверждения");
        }
        super.withdraw(amount);
    }
}

/**
 * Класс DepositTransaction представляет транзакцию внесения средств.
 */
class DepositTransaction extends Transaction {
    private account: Account; // Счет, на который будет внесена сумма

    constructor(account: Account, amount: number) {
        super(amount); // Вызов конструктора базового класса
        this.account = account; // Инициализация счета
    }

    /**
     * Реализация метода execute для внесения средств на счет.
     */
    public execute(): void {
        this.account.deposit(this.amount); // Внесение суммы на счет
        console.log(`Внесено ${this.amount} на счет ${this.account['accountNumber']}`);
    }
}

/**
 * Класс WithdrawTransaction представляет транзакцию снятия средств.
 */
class WithdrawTransaction extends Transaction {
    private account: Account; // Счет, с которого будет снята сумма

    constructor(account: Account, amount: number) {
        super(amount); // Вызов конструктора базового класса
        this.account = account; // Инициализация счета
    }

    /**
     * Реализация метода execute для снятия средств со счета.
     */
    public execute(): void {
        this.account.withdraw(this.amount); // Снятие суммы со счета
        console.log(`Снято ${this.amount} с счета ${this.account['accountNumber']}`);
    }
}

// Пример использования
const savingsAcc = new SavingsAccount("SAV123", 1000, 5); // Создание сберегательного счета
const checkingAcc = new CheckingAccount("CHK456", 2000); // Создание расчетного счета

// Применение процентов к сберегательному счету
savingsAcc.applyInterest(); // Начисление процентов

// Выполнение транзакций
const depositTransaction = new DepositTransaction(savingsAcc, 500); // Создание транзакции внесения
depositTransaction.execute(); // Выполнение транзакции внесения

const withdrawTransaction = new WithdrawTransaction(checkingAcc, 300); // Создание транзакции снятия
withdrawTransaction.execute(); // Выполнение транзакции снятия

// Проверка балансов
console.log(`Баланс сберегательного счета: ${savingsAcc.getBalance()}`); // Вывод баланса сберегательного счета
console.log(`Баланс расчетного счета: ${checkingAcc.getBalance()}`); // Вывод баланса расчетного счета

// ----------------------------------

// Интерфейс определяет контракт, который должны выполнять классы, его реализующие.
// Это означает, что любой класс, который реализует интерфейс, гарантированно будет иметь определенные методы и свойства. 
// Это особенно полезно при работе в команде или разработке крупных приложений

// абстрактные методы и свойства - виртуальные, но не содержат реализации, обязаны быть переопределены
// в классе наследнике (с помощью override в C#)

// абстрактные классы могут содержать не абстрактные методы и свойства (не могут быть декорированы static, sealed)

// абстрактные могут наследоваться как от абстрактных так и от обычного

// инерфейс содержит сигнатуры методов, свойств без модификаторов доступа
// у класса может быть один предок, но он может реализовывать множество интерфейсов

