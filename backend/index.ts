import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL pool using env vars
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
});

// health check route
app.get("/health", async (_req: Request, res: Response) => {
  try {
    await db.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    console.error("DB health check failed:", err);
    res.status(500).json({ ok: false });
  }
});

// products route
app.get("/products", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM products LIMIT 50");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "db error" });
  }
});

// get all categories
app.get("/categories", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories ORDER BY category_name");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// get all brands
app.get("/brands", async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM brands ORDER BY brand_name");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// get all stores
app.get("/stores", async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM stores ORDER BY store_name");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// get all staff members
app.get("/staffs", async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.staff_id,
        s.first_name,
        s.last_name,
        s.email,
        s.phone,
        s.active,
        st.store_name
      FROM staffs s
      JOIN stores st ON st.store_id = s.store_id
      ORDER BY s.staff_id;
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// get all orders
app.get("/orders", async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        order_id,
        customer_id,
        store_id,
        staff_id,
        order_status,
        order_date
      FROM orders
      ORDER BY order_date DESC
      LIMIT 50;
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// get all info , use this for demo
app.get("/orders/:orderId/details", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        o.order_id,
        o.order_status,
        o.order_date,
        o.required_date,
        o.shipped_date,
        c.first_name AS customer_first_name,
        c.last_name  AS customer_last_name,
        st.store_name,
        sf.first_name AS staff_first_name,
        sf.last_name  AS staff_last_name
      FROM orders o
      JOIN customers c ON c.customer_id = o.customer_id
      JOIN stores st    ON st.store_id = o.store_id
      JOIN staffs sf    ON sf.staff_id = o.staff_id
      WHERE o.order_id = ?
      `,
      [req.params.orderId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// get items for specific order
app.get("/orders/:orderId/items", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        oi.item_id,
        p.product_name,
        oi.quantity,
        oi.list_price,
        oi.discount,
        (oi.quantity * oi.list_price * (1 - oi.discount)) AS line_total
      FROM order_items oi
      JOIN products p ON p.product_id = oi.product_id
      WHERE oi.order_id = ?
      ORDER BY oi.item_id;
      `,
      [req.params.orderId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// get items in specific category
app.get("/categories/:categoryId/products", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT *
      FROM products
      WHERE category_id = ?
      ORDER BY product_name;
      `,
      [req.params.categoryId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});


// get inventory from store
app.get("/stores/:storeId/inventory", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        p.product_id,
        p.product_name,
        b.brand_name,
        c.category_name,
        s.quantity
      FROM stocks s
      JOIN products p ON p.product_id = s.product_id
      JOIN brands b   ON b.brand_id = p.brand_id
      JOIN categories c ON c.category_id = p.category_id
      WHERE s.store_id = ?
      ORDER BY p.product_name;
      `,
      [req.params.storeId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// get top 10 customers by spending
app.get("/analytics/top-customers", async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.customer_id,
        c.first_name,
        c.last_name,
        SUM(oi.quantity * oi.list_price * (1 - oi.discount)) AS total_spent
      FROM customers c
      JOIN orders o ON o.customer_id = c.customer_id
      JOIN order_items oi ON oi.order_id = o.order_id
      GROUP BY c.customer_id
      ORDER BY total_spent DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});


// search orders with optional filters for Employee page
app.get("/orders/search", async (req: Request, res: Response) => {
  const { date, customerName, staffId, status } = req.query;

  // for logging / debugging
  console.log("Order search filters:", { date, customerName, staffId, status });

  const sql = `
    SELECT
      o.order_id,
      o.order_status,
      o.order_date,
      o.required_date,
      o.shipped_date,
      o.staff_id,
      c.first_name  AS customer_first_name,
      c.last_name   AS customer_last_name,
      st.store_name
    FROM orders o
    JOIN customers c ON c.customer_id = o.customer_id
    JOIN stores st   ON st.store_id = o.store_id
    WHERE
      ( ? IS NULL OR DATE(o.order_date) = ? )
      AND ( ? IS NULL OR CONCAT(c.first_name, ' ', c.last_name) LIKE CONCAT('%', ?, '%') )
      AND ( ? IS NULL OR o.staff_id = ? )
      AND ( ? IS NULL OR o.order_status = ? )
    ORDER BY o.order_date DESC
    LIMIT 100;
  `;

  const params = [
    date || null,
    date || null,
    customerName || null,
    customerName || null,
    staffId || null,
    staffId || null,
    status || null,
    status || null,
  ];

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Error searching orders:", err);
    res.status(500).json({ error: "db error" });
  }
});



const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

app.get("/products", async (req, res) => {
  const {
    productId,
    productName,
    brandName,
    category,
    year,
    minPrice,
    maxPrice
  } = req.query;

  const sql = `
    SELECT p.*, b.brand_name, c.category_name
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.brand_id
    LEFT JOIN categories c ON p.category_id = c.category_id
    WHERE (p.product_name = ? OR ? IS NULL)
      AND (b.brand_name = ? OR ? IS NULL)
      AND (c.category_name = ? OR ? IS NULL)
      AND (p.model_year = ? OR ? IS NULL)
      AND (p.list_price BETWEEN 0 AND 999999)
  `;

  const params = [
    productName || null, productName || null,
    brandName || null, brandName || null,
    category || null, category || null,
    year || null, year || null
  ];

  try {
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});


