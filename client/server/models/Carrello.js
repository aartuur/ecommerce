import { EntitySchema } from "typeorm";

const Carrello = new EntitySchema({
  name: "Carrello", // Name of the entity
  tableName: "carrello", // Table name in the database
  columns: {
    id: {
      type: "uuid", // Unique identifier for the cart entry
      primary: true,
      generated: "uuid", // Automatically generates UUIDs
    },
    productId: {
      type: "uuid", // UUID of the product added to the cart
      nullable: false,
    },
    cartedFrom: {
      type: "uuid", // UUID of the user who added the product to the cart
      nullable: false,
    },
    quantity: {
      type: "integer", // Quantity of the product in the cart (optional but useful)
      default: 1, // Default value is 1
    },
    createdAt: {
      type: "timestamp", // Timestamp for when the entry was created
      createDate: true, // Automatically managed by TypeORM
    },
    updatedAt: {
      type: "timestamp", // Timestamp for when the entry was last updated
      updateDate: true, // Automatically managed by TypeORM
    },
  },
  indices: [
    {
      name: "IDX_PRODUCT_USER", // Index for faster querying
      columns: ["productId", "cartedFrom"],
      unique: true, // Ensures a user cannot add the same product twice
    },
  ],
});

export default Carrello;