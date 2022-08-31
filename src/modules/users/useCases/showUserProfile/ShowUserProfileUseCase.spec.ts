import "reflect-metadata";
import {CreateUserUseCase} from "../createUser/CreateUserUseCase";
import {InMemoryUsersRepository} from "../../repositories/in-memory/InMemoryUsersRepository";
import {AppError} from "../../../../shared/errors/AppError";
import {ShowUserProfileUseCase} from "./ShowUserProfileUseCase";


let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("", () => {

  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });


  it("should not be able to see info of a non existed user",() => {

    expect(async () => {

      const user = await createUserUseCase.execute({
        name: "Jhow Philips",
        email: "jhow_philips@gmail.com",
        password: "123456"
      });

      const infoUser = await showUserProfileUseCase.execute("invalid_id");

    }).rejects.toBeInstanceOf(AppError);


  });



  it("should be able to see info of a existed user",async () => {

    const user = await createUserUseCase.execute({
      name: "Jhow Philips",
      email: "jhow_philips@gmail.com",
      password: "123456"
    });

    let infoUser;

    if(user.id){
      infoUser = await showUserProfileUseCase.execute(user.id);
    }

    expect(infoUser).toHaveProperty("name");

  });



});
