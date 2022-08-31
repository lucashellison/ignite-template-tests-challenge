import "reflect-metadata";
import {CreateUserUseCase} from "../../../users/useCases/createUser/CreateUserUseCase";
import {InMemoryUsersRepository} from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import {AppError} from "../../../../shared/errors/AppError";
import {CreateStatementUseCase} from "../createStatement/CreateStatementUseCase";
import {InMemoryStatementsRepository} from "../../repositories/in-memory/InMemoryStatementsRepository";
import {GetStatementOperationUseCase} from "./GetStatementOperationUseCase";


let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;


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
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory,statementRepositoryInMemory);

    const user = await createUserUseCase.execute({
      name: "Jhow Philips",
      email: "jhow_philips@gmail.com",
      password: "123456"
    });

    user_id = user.id;
  });


  it("should not be able to get statement operation info with a non existed user",() => {

    expect(async () => {

      const despositInfo = await createStatementUseCase.execute({
        user_id,
        type: OperationType.DEPOSIT,
        amount: 250,
        description: "Deposit 1"
      });

      const statement_id = String(despositInfo.id);


      await getStatementOperationUseCase.execute({
        user_id:"abcd-123-567",
        statement_id
      });

    }).rejects.toBeInstanceOf(AppError);

  });


  it("should not be able to get statement operation info with a non existed statement_id",() => {

    expect(async () => {

      await createStatementUseCase.execute({
        user_id,
        type: OperationType.DEPOSIT,
        amount: 250,
        description: "Deposit 1"
      });

      await getStatementOperationUseCase.execute({
        user_id,
        statement_id: "123456"
      });

    }).rejects.toBeInstanceOf(AppError);

  });


  it("should be able to get statement operation info",async () => {

    const despositInfo = await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 250,
      description: "Deposit 1"
    });

    const statement_id = String(despositInfo.id);
    const statementOperationInfo = await getStatementOperationUseCase.execute({user_id,statement_id});
    expect(statementOperationInfo).toHaveProperty('id');

  });


});
