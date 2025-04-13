import { EntitySchema } from "typeorm";

const Follower =  new EntitySchema({
  name: "Follower",
  tableName: "follower", // Nome della tabella nel database
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    followerId: {
      type: "int",
      nullable: false,
    },
    followedId: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    follower: {
      target: "User", // Puntiamo all'entità User
      type: "many-to-one",
      joinColumn: {
        name: "followerId", // Colonna che fa riferimento a User.id
      },
    },
    followed: {
      target: "User", // Puntiamo all'entità User
      type: "many-to-one",
      joinColumn: {
        name: "followedId", // Colonna che fa riferimento a User.id
      },
    },
  },
});

export default Follower