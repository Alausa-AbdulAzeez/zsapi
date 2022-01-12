const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: `Babatunde_1999`,
  host: "localhost",
  host: zsapi.herokuapp.com,
  port: 5432,
  database: "store_manager",
});

module.exports = pool;
