const Pool = require("pg").Pool;

// const pool = new Pool({
//   user: "postgres",
//   password: `Babatunde_1999`,
//   host: "localhost",
//   port: 5432,
//   database: "store_manager",
// });
const pool = new Pool({
  user: "yunnafvekntzrx",
  password: `2e8bb0e032e02fc600ea7eb1eb90426d4242ca7fd6d5225467f09b74d8f1d230`,
  host: "ec2-34-230-198-12.compute-1.amazonaws.com",
  port: 5432,
  database: "dasck9pf45lf4v",
  uri: "postgres://yunnafvekntzrx:2e8bb0e032e02fc600ea7eb1eb90426d4242ca7fd6d5225467f09b74d8f1d230@ec2-34-230-198-12.compute-1.amazonaws.com:5432/dasck9pf45lf4v",
});

module.exports = pool;
