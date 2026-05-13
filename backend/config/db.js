import { Sequelize } from "sequelize"

const sequelize = new Sequelize("studcoin", "postgres", "", {
  host: "localhost",
  dialect: "postgres",
  logging: false
})

export default sequelize