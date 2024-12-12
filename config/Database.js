import mysql from 'mysql2';

const db = mysql.createConnection({
  host: "localhost",
  user: "myuser",
  password: "myuser",
  database: "hijaumandala",
  port: 3307
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database.');
  }
});

export default db;
