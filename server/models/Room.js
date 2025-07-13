import { EntitySchema } from "typeorm";

const Room =  new EntitySchema({
  name: "Room",
  columns: {
    id: {
      primary: true,
      type: "varchar",
      length:150
    },
    createdAt: {
      type: "datetime",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    membri: {
      type: "many-to-many",
      target: "User",
      joinTable: true,
      cascade: true,
      eager: true,
    },
  },
});

export default Room