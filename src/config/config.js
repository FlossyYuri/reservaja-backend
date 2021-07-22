module.exports = {
  development: {
    database: {
      host: "localhost",
      port: 3306,
      name: "reservaja",
      dialect: "mysql",
      user: "root",
      password: "",
    },
  },
  production: {
    database: {
      host: process.env.HOST_NAME,
      port: process.env.HOST_PORT,
      name: process.env.DATABASE_NAME,
      dialect: process.env.DATABASE_DIALECT,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
  },
};
