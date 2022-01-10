const router = require("express").Router();
const pool = require("../db/db");
const {
  verifyTokenAndIsAdmin,
  verifyTokenAndAuthorization,
} = require("./verifyTokekn");

let sortedProducts = [];

// get single user

router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query(
      `SELECT * FROM personnel WHERE personnel_id = $1`,
      [id]
    );
    res.status(201).json(user.rows);
  } catch (error) {
    res.json(error);
  }
});

// get all users
router.get("/", verifyTokenAndAuthorization, async (req, res) => {
  const name_query = req.query.name;
  try {
    if (name_query) {
      const users = await pool.query(`SELECT * FROM personnel`);
      users.rows.find((user) => {
        user.email.trim().toLowerCase().includes(name_query) &&
          (sortedProducts = [...sortedProducts, user]);
      });
      res.status(201).json(sortedProducts);
      sortedProducts = [];
    } else {
      const users = await pool.query(`SELECT * FROM personnel`);
      res
        .status(201)
        .json(users.rows.sort((a, b) => b.updated_at - a.updated_at));
    }
  } catch (error) {
    res.json(error);
  }
});

// update user

router.put("/update/:id", verifyTokenAndIsAdmin, async (req, res) => {
  try {
    const { isAdmin } = req.body;
    const { id } = req.params;
    const updatedUser = await pool.query(
      `UPDATE personnel SET isadmin = $1  WHERE personnel_id = $2 RETURNING *`,
      [isAdmin, id]
    );
    res.status(201).json(updatedUser.rows);
  } catch (error) {
    res.json(error);
  }
});

// update user items_sold

router.put("/items_sold/:id", verifyTokenAndAuthorization, async (req, res) => {
  const number = 1;
  try {
    const { id } = req.params;
    const product = await pool.query(
      `UPDATE personnel SET total_items_sold = (SELECT total_items_sold from personnel where personnel_id = $2)+$1 WHERE personnel_id = $2 RETURNING *`,
      [number, id]
    ).then;
    res.status(201).json(product.rows);
  } catch (error) {
    res.json(error);
  }
});

// NEW SALE
router.post(
  "/items_sold/:id",
  verifyTokenAndAuthorization,
  async (req, res) => {
    const number = 1;
    try {
      const { id } = req.params;
      const product = await pool.query(
        `INSERT INTO sales (amount,personnel_id) VALUES($1,$2) RETURNING *`,
        [number, id]
      );
      res.status(201).json(product.rows);
    } catch (error) {
      res.json(error);
    }
  }
);

// GET USER STATS
router.get("/stats/:id", verifyTokenAndIsAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await pool.query(
      `SELECT SUM(amount) as total,TO_CHAR(order_date, 'month') FROM sales WHERE TO_CHAR(order_date, 'month') =TO_CHAR(order_date, 'month') AND personnel_id = $1 GROUP BY TO_CHAR(order_date, 'month')`,
      [id]
    );
    res.status(201).json(stats.rows);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
