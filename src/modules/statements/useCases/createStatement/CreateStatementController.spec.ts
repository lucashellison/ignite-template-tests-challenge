import request from "supertest";
import { app } from "../../../../app";

import createConnection from "../../../../database";
import {Connection} from "typeorm";
import {hash} from "bcryptjs";
import {v4 as uuid} from "uuid";

let connection: Connection;

describe("Create StatementController",() => {

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id = uuid();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at)
                values('${id}', 'admin', 'admin@finapi.com.br', '${password}', 'now()')
            `
    );

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new deposit",async () => {

    const responseToken = await request(app).post("/api/v1/sessions")
      .send({
        email: "admin@finapi.com.br",
        password: "admin"
      })

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Energia"
      }).set({
        Authorization: `Bearer ${token}`
      })

    expect(response.status).toBe(201);

  });

});
