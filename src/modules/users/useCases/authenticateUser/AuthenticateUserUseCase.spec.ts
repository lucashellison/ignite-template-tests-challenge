import "reflect-metadata";
import {AuthenticateUserUseCase} from "./AuthenticateUserUseCase";
import {InMemoryUsersRepository} from "../../repositories/in-memory/InMemoryUsersRepository";
import {CreateUserUseCase} from "../createUser/CreateUserUseCase";
import {AppError} from "../../../../shared/errors/AppError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate User", () => {

  const originalEnv = process.env.JWT_SECRET;

  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    await createUserUseCase.execute({
      name: "Jhow Philips",
      email: "jhow_philips@gmail.com",
      password: "123456"
    });

  });

  it("should not be able to authenticate with a not existent user",() => {
    expect(async () => {


      await authenticateUserUseCase.execute({
        email: "robert_wiliam@gmail.com",
        password: "robert"
      });

    }).rejects.toBeInstanceOf(AppError);
  });


  it("should not be able to authenticate with invalid password",() => {
    expect(async () => {

      await authenticateUserUseCase.execute({
        email: "jhow_philips@gmail.com",
        password: "654321"
      });

    }).rejects.toBeInstanceOf(AppError);
  });


  it("should be able authenticate with correct user and password",async () => {

    const session = await authenticateUserUseCase.execute({
      email: "jhow_philips@gmail.com",
      password: "123456"
    });

    expect(session).toHaveProperty("token");

  });


});
