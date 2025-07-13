import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    username: {
      type: "varchar",
      unique: true,
    },
    email: {
      type: "varchar",
      unique: true,
    },
    password: {
      type: "varchar",
      nullable:true
    },
    picture:{
      type:"varchar",
      length:500,
      nullable:true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    prodotti: {
      target: "Prodotto",
      type: "one-to-many",
      inverseSide: "pubblicatoDa",
    },
    preferiti: {
      target: "Preferito",
      type: "one-to-many",
      inverseSide: "user",
    },
  },
});

export default User;