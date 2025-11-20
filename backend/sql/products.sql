-- products.sql

-- Get all products
SELECT *
FROM products;

-- Get product by ID
SELECT *
FROM products
WHERE product_id = ?;

-- Search products by optional filters: brand, category, price range
-- Pass NULL for filters you want to ignore.
SELECT *
FROM products
WHERE (brand = ? OR ? IS NULL)
  AND (category = ? OR ? IS NULL)
  AND (price BETWEEN ? AND ?);

-- Get all brands (optional helper query)
SELECT DISTINCT brand
FROM products;

-- Get all categories (optional helper query)
SELECT DISTINCT category
FROM products;
