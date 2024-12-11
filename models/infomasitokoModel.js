import db from "../config/Database.js";

const InformasiStore = {
    create: async (data) => {
        const { description, imageUrl, sellerId } = data;
        const query = `
            INSERT INTO informasi_store (description, imageUrl, sellerId)
            VALUES ('${description}', '${imageUrl}', ${sellerId});
        `;
        await db.query(query);
    },

    getBySellerId: async (userId) => {
        const query = `SELECT * FROM informasi_store WHERE userId = ${userId};`;
        const [results] = await db.query(query);
        return results;
    },

    update: async (id, data) => {
        const { description, imageUrl } = data;
        const query = `
            UPDATE informasi_store
            SET description = '${description}', imageUrl = '${imageUrl}'
            WHERE id = ${id};
        `;
        await db.query(query);
    },

    delete: async (id) => {
        const query = `DELETE FROM informasi_store WHERE id = ${id};`;
        await db.query(query);
    }
};

export default InformasiStore;
