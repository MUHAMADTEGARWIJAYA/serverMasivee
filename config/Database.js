import { Sequelize } from "sequelize";

const db = new Sequelize('hijaumandala', 'root', '',{
    host: "localhost",
    dialect: "mysql"

});

export default db;