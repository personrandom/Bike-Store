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

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
