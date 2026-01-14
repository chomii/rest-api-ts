"use strict";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import sequelize from "../connection.ts";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare email: string;
  declare firstName: null | string;
  declare id: CreationOptional<number>;
  declare lastName: null | string;
  declare password: string;
  declare refreshToken: null | string;
}
User.init(
  {
    email: { allowNull: false, type: DataTypes.STRING, unique: true },
    firstName: DataTypes.STRING,
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    lastName: DataTypes.STRING,
    password: { allowNull: false, type: DataTypes.STRING },
    refreshToken: { allowNull: true, type: DataTypes.STRING },
  },
  {
    modelName: "User",
    sequelize,
  },
);

export default User;
