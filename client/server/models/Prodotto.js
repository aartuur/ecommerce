import { EntitySchema } from "typeorm";

const Prodotto = new EntitySchema({
  name: "Prodotto",
  tableName: "prodotti",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    Nome: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    Descrizione: {
      type: "text",
      nullable: true,
    },
    Prezzo: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    nPreferiti: {
      type: "int",
      default: 0,
    },
    pubblicatoDaId: {
      type: "uuid",
      nullable: false,
    },
    imageId: {
      type: "int", 
      nullable: true,
    },
  },
  relations: {
    pubblicatoDa: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "pubblicatoDaId",
      },
    },
    image: {
      target: "Image",
      type: "one-to-one",
      joinColumn: {
        name: "imageId",
      },
      inverseSide: "prodotto",
      onDelete: "SET NULL", 
    },
    preferiti: {
      target: "Preferito",
      type: "one-to-many",
      inverseSide: "prodotto",
    },
  },
});

export default Prodotto;