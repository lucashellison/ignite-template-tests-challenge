import "reflect-metadata";
import {CreateUserUseCase} from "./CreateUserUseCase";
import {InMemoryUsersRepository} from "../../repositories/in-memory/InMemoryUsersRepository";
import {AppError} from "../../../../shared/errors/AppError";


let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User",() => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user",async () => {

    const user = await createUserUseCase.execute({
      name: "Jhow Philips",
      email: "jhow_philips@gmail.com",
      password: "123456"
    });

    expect(user).toHaveProperty("id");

  });

  it("should not be able to create a user with existed user",() => {

    expect(async () => {
      await createUserUseCase.execute({
        name: "Jhow Philips",
        email: "jhow_philips@gmail.com",
        password: "123456"
      });

      await createUserUseCase.execute({
        name: "Robert Wiliam",
        email: "jhow_philips@gmail.com",
        password: "654321"
      });
    }).rejects.toBeInstanceOf(AppError);


  });

});
