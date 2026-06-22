require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
app.get("/", (req, res) => {
  res.json({
    message: "Product Explorer API is running",
    endpoint: "/products",
    status: "success"
  });
});

app.get("/products", async (req, res) => {
  try {
    const { category, created_at, id } = req.query;

    const limit = Math.min(
      parseInt(req.query.limit) || 20,
      100
    );

    let query;
    let values = [];

    if (category && created_at && id) {
      query = `
        SELECT *
        FROM products
        WHERE category = $1
        AND (created_at, id) < ($2, $3)
        ORDER BY created_at DESC, id DESC
        LIMIT $4
      `;

      values = [category, created_at, id, limit];

    } else if (category) {
      query = `
        SELECT *
        FROM products
        WHERE category = $1
        ORDER BY created_at DESC, id DESC
        LIMIT $2
      `;

      values = [category, limit];

    } else if (created_at && id) {
      query = `
        SELECT *
        FROM products
        WHERE (created_at, id) < ($1, $2)
        ORDER BY created_at DESC, id DESC
        LIMIT $3
      `;

      values = [created_at, id, limit];

    } else {
      query = `
        SELECT *
        FROM products
        ORDER BY created_at DESC, id DESC
        LIMIT $1
      `;

      values = [limit];
    }

    const result = await pool.query(query, values);

    const rows = result.rows;

    let nextCursor = null;

    if (rows.length > 0) {
      const lastRow = rows[rows.length - 1];

      nextCursor = {
        created_at: lastRow.created_at,
        id: lastRow.id,
      };
    }

    res.json({
      count: rows.length,
      limit,
      data: rows,
      nextCursor,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});
 const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});