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
      type: "mediumblob", // Dati binari dell'immagine
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
      inverseSide: "image", // Nome della proprietà nel modello Prodotto
      onDelete: "CASCADE", // Elimina l'immagine se il prodotto viene eliminato
    },
  },
});

export default Image;