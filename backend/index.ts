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


// ------------------ Health check ------------------
app.get("/health", async (_req: Request, res: Response) => {
 try {
   await db.query("SELECT 1");
   res.json({ ok: true });
 } catch (err) {
   console.error("DB health check failed:", err);
   res.status(500).json({ ok: false });
 }
});


// ------------------ PRODUCTS (search) ------------------
app.get("/products", async (req: Request, res: Response) => {
  const {
    productId,
    productName,
    brandName,
    category,
    year,
    minPrice,
    maxPrice,
    storeName,
  } = req.query as {
    productId?: string;
    productName?: string;
    brandName?: string;
    category?: string;
    year?: string;
    minPrice?: string;
    maxPrice?: string;
    storeName?: string;
  };

  const productIdNum = productId ? Number(productId) : null;
  const yearNum = year ? Number(year) : null;
  const minPriceNum = minPrice ? Number(minPrice) : null;
  const maxPriceNum = maxPrice ? Number(maxPrice) : null;

  const sql = `
    SELECT 
      p.*,
      b.brand_name,
      c.category_name,
      st.store_name
    FROM products p
    LEFT JOIN brands b    ON p.brand_id = b.brand_id
    LEFT JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN stocks s    ON s.product_id = p.product_id
    LEFT JOIN stores st   ON st.store_id = s.store_id
    WHERE
      (? IS NULL OR p.product_id = ?)
      AND (? IS NULL OR p.product_name LIKE CONCAT('%', ?, '%'))
      AND (? IS NULL OR b.brand_name LIKE CONCAT('%', ?, '%'))
      AND (? IS NULL OR c.category_name LIKE CONCAT('%', ?, '%'))
      AND (? IS NULL OR p.model_year = ?)
      AND (? IS NULL OR st.store_name = ?)
      AND (
        (? IS NULL AND ? IS NULL)
        OR p.list_price BETWEEN COALESCE(?, 0) AND COALESCE(?, 999999)
      )
    LIMIT 100;
  `;

  const params = [
    productIdNum, productIdNum,
    productName || null, productName || null,
    brandName || null,  brandName || null,
    category || null,   category || null,
    yearNum,            yearNum,
    storeName || null,  storeName || null,
    minPriceNum,        maxPriceNum, minPriceNum, maxPriceNum,
  ];

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Error searching products:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});



// ------------------ CATEGORIES ------------------
app.get("/categories", async (_req: Request, res: Response) => {
 try {
   const [rows] = await db.query(
     "SELECT * FROM categories ORDER BY category_name"
   );
   res.json(rows);
 } catch (err) {
   console.error(err);
   res.status(500).json({ error: "db error" });
 }
});


// ------------------ BRANDS ------------------
app.get("/brands", async (_req: Request, res: Response) => {
 try {
   const [rows] = await db.query(
     "SELECT * FROM brands ORDER BY brand_name"
   );
   res.json(rows);
 } catch (err) {
   console.error(err);
   res.status(500).json({ error: "db error" });
 }
});


// ------------------ STORES ------------------
app.get("/stores", async (_req: Request, res: Response) => {
 try {
   const [rows] = await db.query(
     "SELECT * FROM stores ORDER BY store_name"
   );
   res.json(rows);
 } catch (err) {
   console.error(err);
   res.status(500).json({ error: "db error" });
 }
});


// ------------------ STAFFS ------------------
app.get("/staffs", async (_req: Request, res: Response) => {
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


// ------------------ ORDERS (basic list) ------------------
app.get("/orders", async (_req: Request, res: Response) => {
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


// ------------------ ORDER DETAILS ------------------
app.get("/orders/:orderId/details", async (req: Request, res: Response) => {
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


// ------------------ ORDER ITEMS ------------------
app.get("/orders/:orderId/items", async (req: Request, res: Response) => {
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


// ------------------ PRODUCTS BY CATEGORY ------------------
app.get("/categories/:categoryId/products", async (req: Request, res: Response) => {
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


// ------------------ STORE INVENTORY ------------------
app.get("/stores/:storeId/inventory", async (req: Request, res: Response) => {
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


// ------------------ TOP CUSTOMERS ------------------
app.get("/analytics/top-customers", async (_req: Request, res: Response) => {
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


// ------------------ ORDER SEARCH (Employee page) ------------------
app.get("/orders/search", async (req: Request, res: Response) => {
 const { date, customerName, staffId, status } = req.query;


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
     (? IS NULL OR DATE(o.order_date) = ?)
     AND (? IS NULL OR CONCAT(c.first_name, ' ', c.last_name) LIKE CONCAT('%', ?, '%'))
     AND (? IS NULL OR o.staff_id = ?)
     AND (? IS NULL OR o.order_status = ?)
   ORDER BY o.order_date DESC
   LIMIT 100;
 `;


 const params = [
   date || null, date || null,
   customerName || null, customerName || null,
   staffId || null, staffId || null,
   status || null, status || null,
 ];


 try {
   const [rows] = await db.query(sql, params);
   res.json(rows);
 } catch (err) {
   console.error("Error searching orders:", err);
   res.status(500).json({ error: "db error" });
 }
});


// ------------------ START SERVER ------------------
const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
 console.log(`API running on port ${port}`);
});
