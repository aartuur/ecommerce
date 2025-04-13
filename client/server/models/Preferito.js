import { EntitySchema } from "typeorm";

const Preferito = new EntitySchema({
  name: "Preferito",
  tableName: "preferiti",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    userId: {
      type: "uuid",
      nullable: false,
    },
    productId: {
      type: "uuid",
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "userId",
      },
    },
    prodotto: {
      target: "Prodotto",
      type: "many-to-one",
      joinColumn: {
        name: "productId",
      },
    },
  },
});

export default Preferito;