import { EntitySchema } from "typeorm";

const Follower =  new EntitySchema({
  name: "Follower",
  tableName: "follower", 
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
      target: "User", 
      type: "many-to-one",
      joinColumn: {
        name: "followerId",
      },
    },
    followed: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "followedId", 
      },
    },
  },
});

export default Follower