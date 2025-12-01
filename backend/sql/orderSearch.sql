-- orders.sql

-- Get all orders
SELECT *
FROM orders
ORDER BY order_date DESC;

-- Get order items for a specific order
SELECT oi.*, p.product_name
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
WHERE oi.order_id = ?;

-- Update order status
UPDATE orders
SET status = ?
WHERE order_id = ?;

-- Insert a new order
INSERT INTO orders (customer_id, order_date, status, employee_id)
VALUES (?, NOW(), ?, ?);

-- Insert items for a specific order
INSERT INTO order_items (order_id, item_id, product_id, quantity, list_price, discount)
VALUES (?, ?, ?, ?, ?, ?);

-- Get orders for a specific customer
SELECT *
FROM orders
WHERE customer_id = ?
ORDER BY order_date DESC;

-- Get all payments (if you have a payments table)
SELECT *
FROM payments
ORDER BY payment_date DESC;