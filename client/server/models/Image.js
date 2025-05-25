import { EntitySchema } from "typeorm";

const Image = new EntitySchema({
  name: "Image",
  tableName: "images",
  columns: {
    id: {
        type: "uuid",
        primary: true,
        generated: "uuid",
    },
    data: {
      type: "mediumblob", 
      nullable: false,
    },
    contentType: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    loadedBy: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
  },
  relations: {
    prodotto: {
      target: "Prodotto",
      type: "one-to-one",
      inverseSide: "image", 
      onDelete: "CASCADE", 
    },
  },
});

export default Image;