import db from './Database.js';

const testDB = async () => {
    try {
        const [rows] = await db.execute('SELECT 1 + 1 AS result');
        console.log('Database connected:', rows);
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
};

testDB();
