const router = require("express").Router();
const pool = require("../db/db");
const {
  verifyTokenAndIsAdmin,
  verifyTokenAndAuthorization,
} = require("./verifyTokekn");

// create a product
router.post("/create", verifyTokenAndIsAdmin, async (req, res) => {
  try {
    const {
      product_categories,
      product_desc,
      product_img,
      product_name,
      product_price,
      total_no_available,
    } = req.body;
    const newProduct = await pool.query(
      `INSERT INTO products(product_categories,product_desc,product_img,product_name,product_price,total_no_available) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        product_categories,
        product_desc,
        product_img,
        product_name,
        product_price,
        total_no_available,
      ]
    );

    res.status(201).json(newProduct.rows[0]);
  } catch (error) {
    res.json(error);
  }
});

// get a product
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query(
      `SELECT * FROM products WHERE product_id = $1`,
      [id]
    );
    res.status(201).json(product.rows);
  } catch (error) {
    res.json(error);
  }
});

// update a product

router.put("/update/:id", verifyTokenAndIsAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { ...abc } = req.body;
    const a = { ...abc };
    const b = Object.keys(a);

    let product;
    if (b.includes("product_name")) {
      product = await pool.query(
        `UPDATE products set product_name = $1  WHERE product_id = $2 RETURNING *`,
        [req.body["product_name"], id]
      );
    }
    if (b.includes("product_desc")) {
      product = await pool.query(
        `UPDATE products set product_desc = $1  WHERE product_id = $2 RETURNING *`,
        [req.body["product_desc"], id]
      );
    }
    if (b.includes("product_categories")) {
      product = await pool.query(
        `UPDATE products set product_categories = $1  WHERE product_id = $2 RETURNING *`,
        [req.body["product_categories"], id]
      );
    }
    if (b.includes("product_img")) {
      product = await pool.query(
        `UPDATE products set product_img = $1  WHERE product_id = $2 RETURNING *`,
        [req.body["product_img"], id]
      );
    }
    if (b.includes("inStock")) {
      product = await pool.query(
        `UPDATE products set inStock = $1  WHERE product_id = $2 RETURNING *`,
        [req.body["inStock"], id]
      );
    }
    if (b.includes("total_no_available")) {
      product = await pool.query(
        `UPDATE products set total_no_available = (SELECT total_no_available from products where product_id = $1)-1 WHERE product_id = $1 RETURNING *`,
        [id]
      );
    }
    res.status(201).json(product.rows);
  } catch (error) {
    res.json(error);
  }
});

// update product amount
router.put(
  "/updateamount/:id",
  verifyTokenAndAuthorization,
  async (req, res) => {
    const number = 1;
    try {
      const { id } = req.params;
      const product = await pool.query(
        `UPDATE products set total_no_available = (SELECT total_no_available from products where product_id = $2)-$1 WHERE product_id = $2 RETURNING *`,
        [number, id]
      );
      res.status(201).json(product.rows);
    } catch (error) {
      res.json(error);
    }
  }
);

// delete a product
router.delete("/delete/:id", verifyTokenAndIsAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query(`DELETE FROM products WHERE product_id = $1 RETURNING *`, [
      id,
    ]);
    res.status(201).json("row successfully deleted");
  } catch (error) {
    res.json(error);
  }
});

// get all products
let sortedProducts = [];

router.get("/", verifyTokenAndAuthorization, async (req, res) => {
  const name_query = req.query.name;
  try {
    if (name_query) {
      const products = await pool.query(`SELECT * FROM products`);
      products.rows.find((product) => {
        product.product_name.trim().toLowerCase().includes(name_query) &&
          (sortedProducts = [...sortedProducts, product]);
      });
      res.status(201).json(sortedProducts);
      sortedProducts = [];
    } else {
      const products = await pool.query(`SELECT * FROM products`);
      res
        .status(201)
        .json(products.rows.sort((a, b) => b.updated_at - a.updated_at));
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
