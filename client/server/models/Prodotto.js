import { EntitySchema }  from "typeorm";

const Prodotto = new EntitySchema({
  name: "Prodotto",
  tableName: "prodotti",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
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
    image: {
      type: "text", // Campo per memorizzare l'immagine codificata in Base64
      nullable: true,
    },
    nPreferiti: {
      type: "int",
      default: 0,
    },
    pubblicatoDa: {
      type: "int", // ID dell'utente che ha pubblicato il prodotto
      nullable: false,
    },
  },
});

export default Prodotto