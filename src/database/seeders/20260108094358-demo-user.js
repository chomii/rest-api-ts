"use strict";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../../util/password.ts";
import { ref } from "process";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const hashedPassword = await hashPassword("password123");
  await queryInterface.bulkInsert(
    "Users",
    [
      {
        id: uuidv4(),
        firstName: "John",
        lastName: "Doe",
        email: "test@email.com",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: null,
      },
      {
        id: uuidv4(),
        firstName: "Milan",
        lastName: "Stanojevic",
        email: "milan@email.com",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: null,
      },
    ],
    {},
  );
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("Users", null, {});
}
