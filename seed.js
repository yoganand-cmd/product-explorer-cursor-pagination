require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Home",
  "Sports",
  "Toys",
  "Beauty",
  "Grocery"
];

const TOTAL = 200000;
const BATCH_SIZE = 2000;

async function seed() {
  console.log("Starting seed...");

  for (let start = 0; start < TOTAL; start += BATCH_SIZE) {
    const values = [];
    const params = [];

    for (
      let i = start;
      i < start + BATCH_SIZE && i < TOTAL;
      i++
    ) {
      const category =
        categories[Math.floor(Math.random() * categories.length)];

      const name = `${category} Product ${i + 1}`;

      const price = (
        Math.random() * 5000 +
        10
      ).toFixed(2);

      const base = values.length * 3;

      values.push(
        `($${base + 1}, $${base + 2}, $${base + 3})`
      );

      params.push(name, category, price);
    }

    const query = `
      INSERT INTO products(name, category, price)
      VALUES ${values.join(",")}
    `;

    await pool.query(query, params);

    console.log(
      `Inserted ${Math.min(
        start + BATCH_SIZE,
        TOTAL
      )}/${TOTAL}`
    );
  }

  console.log("Finished!");
  await pool.end();
}

seed().catch(console.error);