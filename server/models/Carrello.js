import { EntitySchema } from "typeorm";

const Carrello = new EntitySchema({
  name: "Carrello", 
  tableName: "carrello", 
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    productId: {
      type: "uuid",
      nullable: false,
    },
    cartedFrom: {
      type: "uuid", 
      nullable: false,
    },
    quantity: {
      type: "integer", 
      default: 1, 
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
  indices: [
    {
      name: "IDX_PRODUCT_USER",
      columns: ["productId", "cartedFrom"],
      unique: true,
    },
  ],
});

export default Carrello;