-- orders.sql

-- Get all orders by date
SELECT *
FROM orders
ORDER BY order_date DESC;

-- Get orders by date
SELECT *
FROM orders
WHERE order_date = ?;

-- Get orders by customer name (date descending)
SELECT o.*
FROM orders p
JOIN customers c ON o.customer_id = c.customer_id
WHERE CONCAT(first_name, ' ', last_name) = ?
ORDER BY order_date DESC;

-- Get orders by staff id (date descending)
SELECT *
FROM orders
WHERE staff_id = ?
ORDER BY order_date DESC;

-- Get orders by order status (date descending)
SELECT *
FROM orders
WHERE order_status = ?
ORDER BY order_date DESC;

-- Search orders by optional filters: order date, name, staff id, order status
SELECT o.*, CONCAT(c.first_name, ' ', c.last_name) AS customer_name
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE (o.order_date = ? OR ? IS NULL)
  AND (CONCAT(c.first_name, ' ', c.last_name) = ? OR ? IS NULL)
  AND (o.staff_id = ? OR ? IS NULL)
  AND (o.order_status = ? OR ? IS NULL);



-- Updating/adding orders

-- Update order status
UPDATE orders
SET order_status = ?
WHERE order_id = ?;

-- Insert a new order
-- NEEDS CORRECT PARAMETERS ------
/*INSERT INTO orders (customer_id, order_date, order_status, employee_id)
VALUES (?, NOW(), ?, ?);*/

-- Modify payment stuff
