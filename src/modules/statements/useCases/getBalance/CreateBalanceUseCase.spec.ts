import "reflect-metadata";
import {CreateUserUseCase} from "../../../users/useCases/createUser/CreateUserUseCase";
import {InMemoryUsersRepository} from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import {AppError} from "../../../../shared/errors/AppError";
import {CreateStatementUseCase} from "../createStatement/CreateStatementUseCase";
import {InMemoryStatementsRepository} from "../../repositories/in-memory/InMemoryStatementsRepository";
import {GetBalanceUseCase} from "../getBalance/GetBalanceUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement",() => {

  let user_id: any;

  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory,statementRepositoryInMemory);

    getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory,usersRepositoryInMemory);

    const user = await createUserUseCase.execute({
      name: "Jhow Philips",
      email: "jhow_philips@gmail.com",
      password: "123456"
    });

    user_id = user.id;
  });


  it("should not be able to get balance with a non existed user",() => {

    expect(async () => {
      await getBalanceUseCase.execute({user_id:'abcde'});

    }).rejects.toBeInstanceOf(AppError);

  });


  it("should be able to make a withdraw",async () => {

    await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 250,
      description: "Deposit 1"
    });

    await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit 2"
    });

    await createStatementUseCase.execute({
      user_id,
      type: OperationType.WITHDRAW,
      amount: 150,
      description: "Withdraw 1"
    });

    const balance = await getBalanceUseCase.execute({user_id});

    expect(balance.balance).toEqual(200);

  });


});
