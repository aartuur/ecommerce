import { EntitySchema } from "typeorm";

const Messaggio = new EntitySchema({
  name: "Messaggio",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    contenuto: {
      type: "text",
    },
    mittenteId: {
      type: "uuid",
      nullable: true,
    },
    destinatarioId: {
      type: "uuid",
      nullable: true,
    },
    dataInvio: {
      type: "datetime",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    mittente: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "mittenteId" },
      onDelete: "CASCADE",
    },
    destinatario: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "destinatarioId" },
      onDelete: "CASCADE",
    },
    room: {
      type: "many-to-one",
      target: "Room",
      joinColumn: { name: "roomId" },
      onDelete: "CASCADE",
    },
  },
});

export default Messaggio