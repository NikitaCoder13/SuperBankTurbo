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

// ----------------------------------

// СПРИНТ 4. МАССИВЫ, ИНДЕКСАТОРЫ, КОЛЛЕКЦИИ, 
// ПАРАМЕТРИЗИРОВАННЫЕ КОЛЛЕКЦИИ

// Интерфейс IAccount
interface IAccount {
    deposit(amount: number): void;
    withdraw(amount: number): void;
    getBalance(): number;
}

// Класс Account
class Account implements IAccount {
    protected accountNumber: string;
    private balance: number;

    // Одномерный массив для хранения транзакций
    private transactions: number[];

    constructor(accountNumber: string, initialBalance: number) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        this.transactions = []; // Инициализация одномерного массива
    }

    public deposit(amount: number): void {
        if (amount > 0) {
            this.balance += amount;
            this.transactions.push(amount); // Добавление транзакции в массив
        } else {
            throw new Error("Сумма должна быть положительной");
        }
    }

    public withdraw(amount: number): void {
        if (amount > 0 && amount <= this.balance) {
            this.balance -= amount;
            this.transactions.push(-amount); // Добавление транзакции в массив
        } else {
            throw new Error("Недостаточно средств или неверная сумма");
        }
    }

    public getBalance(): number {
        return this.balance;
    }

    // Метод для отображения всех транзакций (многомерный массив)
    public getTransactions(): number[][] {
        // Возвращаем многомерный массив, где каждая транзакция представлена как [номер, сумма]
        return this.transactions.map((transaction, index) => [index+1, transaction]);
    }

    // Метод для внесения нескольких сумм с использованием params
    public depositMultiple(...amounts: number[]): void {
        amounts.forEach((amount) => {
            this.deposit(amount); // Вызов метода deposit для каждой суммы
        });
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

// Реализация коллекций

// 1. ArrayList (используем массив)
let accountList: Account[] = [];
accountList.push(new SavingsAccount("SAV123", 1000, 5));
accountList.push(new CheckingAccount("CHK456", 2000));

// 2. Queue (очередь)
class Queue<T> {
    private items: T[] = [];

    public enqueue(item: T): void {
        this.items.push(item);
    }

    public dequeue(): T | undefined {
        return this.items.shift();
    }

    public isEmpty(): boolean {
        return this.items.length === 0;
    }
}

const transactionQueue = new Queue<string>();
transactionQueue.enqueue("Deposit $500");
transactionQueue.enqueue("Withdraw $200");

// 3. Stack (стек)
class Stack<T> {
    private items: T[] = [];

    public push(item: T): void {
        this.items.push(item);
    }

    public pop(): T | undefined {
        return this.items.pop();
    }

    public isEmpty(): boolean {
        return this.items.length === 0;
    }
}

const transactionStack = new Stack<string>();
transactionStack.push("Deposit $500");
transactionStack.push("Withdraw $200");

// 4. List (обобщенный список)
let transactionList: Array<string> = [];
transactionList.push("Deposit $500");
transactionList.push("Withdraw $200");

// 5. Dictionary (словарь)
let accountDictionary: { [key: string]: Account } = {};
accountDictionary["SAV123"] = new SavingsAccount("SAV123", 1000, 5);
accountDictionary["CHK456"] = new CheckingAccount("CHK456", 2000);


// Пример использования

const account = new Account("ACC123", 1000);
account.deposit(500); // Внесение 500
account.withdraw(200); // Снятие 200

// Внесение нескольких сумм с использованием params
account.depositMultiple(100, 200, 300);

// Проверка баланса и транзакций
console.log(`Баланс: ${account.getBalance()}`);
console.log(`Транзакции: ${JSON.stringify(account.getTransactions())}`);

const savingsAcc = accountDictionary["SAV123"];
savingsAcc.deposit(500);
savingsAcc.applyInterest();
console.log(`Баланс сберегательного счета ${savingsAcc['accountNumber']}: ${savingsAcc.getBalance()}`);

const checkingAcc = accountDictionary["CHK456"];
checkingAcc.withdraw(300);
console.log(`Баланс расчетного счета ${checkingAcc['accountNumber']}: ${checkingAcc.getBalance()}`);

console.log(`Транзакции из очереди:`)
while (!transactionQueue.isEmpty()) {
    console.log(transactionQueue.dequeue());
}

console.log(`Транзакции из стека:`)
while (!transactionStack.isEmpty()) {
    console.log(transactionStack.pop());
}

console.log(`Транзакции из списка:`)
transactionList.forEach(transaction => console.log(transaction));


// ОТВЕТЫ НА ВОПРОСЫ
// ----------------------------------------------------
// 1. Массив — это структура данных, которая позволяет хранить несколько значений одного типа под одним именем. Каждый элемент массива доступен через уникальный индекс.

// 2. Одномерный массив — это массив, содержащий элементы, доступные по одному индексу. Он представляет собой последовательность элементов.

// 3. Многомерный массив — это массив, содержащий более одного измерения (например, двумерные или трехмерные массивы). Элементы доступны по нескольким индексам.

// 4. Индексаторы позволяют обращаться к классу как к массиву. Для описания индексатора используется ключевое слово this
// [тип индекса]. Пример: public Man this[int i] = _man[i]/

// 5. У класса может быть несколько индексаторов, но каждый из них должен иметь уникальный тип параметров. Это позволяет перегружать индексаторы.

// 6. Ключевое слово params позволяет передавать переменное количество аргументов в метод.
// Пример: 
// public void PrintNumbers(params int[] numbers)
// {
//     foreach (var number in numbers)
//     {
//         Console.WriteLine(number);
//     }
// }

// // Вызов метода с произвольным количеством аргументов
// PrintNumbers(1, 2, 3, 4);

// 7. ArrayList — это коллекция, которая может хранить объекты любого типа и автоматически изменяет свой размер при добавлении или удалении элементов. Однако она не типобезопасна.
// Пример: 
// ArrayList list = new ArrayList();
// list.Add(1);
// list.Add("Hello");

// 8. Queue — это коллекция, реализующая принцип FIFO (первый пришел — первый вышел). Элементы добавляются в конец очереди и извлекаются с начала.
// Пример:
// Queue queue = new Queue();
// queue.Enqueue(1); // Добавление элемента в очередь
// int first = (int)queue.Dequeue(); // Извлечение первого элемента

// 9.Stack — это коллекция, реализующая принцип LIFO (последний пришел — первый вышел). Элементы добавляются и извлекаются с одного конца.
// Пример:
// Stack stack = new Stack();
// stack.Push(1); // Добавление элемента в стек
// int last = (int)stack.Pop(); // Извлечение последнего добавленного элемента

// 10.Основной недостаток коллекции с элементами типа object заключается в том, что она не типобезопасна. Это может привести к ошибкам времени выполнения при попытке привести объекты к неверному типу.
// Пример:
// ArrayList list = new ArrayList();
// list.Add(1);
// list.Add("string");
// // Приведение типа может вызвать InvalidCastException
// int number = (int)list[1]; // Ошибка времени выполнения

// 11.List<T> — это обобщенная коллекция, которая хранит элементы одного типа и обеспечивает типобезопасность и динамическое изменение размера.
// Пример:
// List<int> numbers = new List<int>();
// numbers.Add(1);
// numbers.Add(2);

// 12.Dictionary<TKey,TValue> — это обобщенная коллекция для хранения пар "ключ-значение". Она обеспечивает быстрый доступ к значениям по ключам.
// Пример:
// Dictionary<string, int> ages = new Dictionary<string, int>();
// ages["Alice"] = 30;
// ages["Bob"] = 25;
// int aliceAge = ages["Alice"]; // Получение возраста Алисы
