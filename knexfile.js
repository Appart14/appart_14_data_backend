// Update with your config settings.

import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    client: 'mysql',
    /*
    connection: {
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    */
    connection: {
      host: "192.168.0.110",
      user: "root",
      password: "password",
      database: "appart_14",
    },
    migrations: {
      directory: './db/migrations',
    },
  },
};
