-- analytics.sql

-- Total sales by product category
SELECT p.category, SUM(oi.list_price * oi.quantity) AS revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY p.category
ORDER BY revenue DESC;

-- Total sales by employee
SELECT o.employee_id, SUM(oi.list_price * oi.quantity) AS revenue
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY o.employee_id
ORDER BY revenue DESC;

-- Total sales over a date range (daily)
SELECT DATE(o.order_date) AS day, SUM(oi.list_price * oi.quantity) AS revenue
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_date BETWEEN ? AND ?
GROUP BY day
ORDER BY day;

-- Top-selling products
SELECT p.product_id, p.product_name, SUM(oi.quantity) AS total_sold
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY p.product_id, p.product_name
ORDER BY total_sold DESC
LIMIT 10;