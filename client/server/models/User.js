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
});

// Dovrai aggiungere le references a Offerta (Prodotto) e gli altri a cui userId è FK

export default User