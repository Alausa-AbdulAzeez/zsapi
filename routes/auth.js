const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { verifyTokenAndIsAdmin } = require("./verifyTokekn");
const pool = require("../db/db");

// REGISTER

router.post("/signup", async (req, res) => {
  try {
    // await client.connect();
    const { email, profile_picture, isAdmin, isAttendant } = req.body;
    const password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SEC_KEY
    ).toString();
    const newPersonnel = await pool.query(
      `INSERT INTO personnel (email, password, profile_picture, isAdmin,isAttendant) VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [email, password, profile_picture, isAdmin, isAttendant]
    );
    res.status(201).json(newPersonnel.rows[0]);
  } catch (error) {
    res.status(500).json(error);
  }
  // client.end();
});

// LOGIN

router.post("/login", async (req, res) => {
  try {
    // await client.connect();
    const { email } = await req.body;
    const user = await pool.query(`SELECT * FROM personnel WHERE email = $1`, [
      email,
    ]);

    // check user validity
    user.rows.length === 0 && res.status(403).json("User not found!");

    // decrypt password
    // res.status(201).json(user.rows[0]);
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.rows[0].password,
      process.env.SEC_KEY
    ).toString(CryptoJS.enc.Utf8);

    // Checks password validity
    decryptedPassword !== req.body.password &&
      res.status(403).json("Iinvalid username or password");

    const accessToken = jwt.sign(
      { isAttendant: user.rows[0].isattendant, isAdmin: user.rows[0].isadmin },
      process.env.JWT_SEC,
      { expiresIn: "100d" }
    );

    const { password, ...others } = user.rows[0];
    res.status(201).json({ ...others, accessToken });
  } catch (error) {
    // res.json(error);
  }
  // client.end();
});

module.exports = router;
