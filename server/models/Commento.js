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
        user: { 
            target: "User",
            type: "many-to-one",
            joinColumn: {
                name: "senderId"
            }
        },
        prodotto: {
            target: "Prodotto",
            type: "many-to-one",
            joinColumn: {
                name: "productId"
            }
        }
    }
});

export default Commento;