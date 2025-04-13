import { EntitySchema } from "typeorm";

const Commento = new EntitySchema({
    name: "Commento",
    tableName: "commento",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid"
        },
        text: {
            type: "text",
            nullable: false
        },
        senderId: {
            type: "uuid",
            nullable: false
        },
        productId: {
            type: "uuid",
            nullable: false
        }
    },
    relations: {
        user: { // Relazione con l'utente che ha scritto il commento
            target: "User",
            type: "many-to-one",
            joinColumn: {
                name: "senderId"
            }
        },
        prodotto: { // Relazione con il prodotto a cui appartiene il commento
            target: "Prodotto",
            type: "many-to-one",
            joinColumn: {
                name: "productId"
            }
        }
    }
});

export default Commento;