const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "bike_store"
});

// Example route
app.get("/products", async (req: any, res: { json: (arg0: any) => void; }) => {
  const [rows] = await db.query("SELECT * FROM products");
  res.json(rows);
});

app.listen(3001, () => console.log("API running on port 3001"));