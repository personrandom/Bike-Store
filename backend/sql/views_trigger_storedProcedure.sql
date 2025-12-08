-- views_trigger_storedProcedure.sql

-- this file is not directly used. It just containts sql statements

CREATE VIEW vw_customer_order_summary AS
SELECT
  c.customer_id,
  c.first_name,
  c.last_name,
  ROUND(SUM(oi.quantity * oi.list_price * (1 - oi.discount)), 2) AS total_spent
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY c.customer_id, c.first_name, c.last_name;

-- used in top customers query in index.ts
SELECT 
    customer_id, 
    CONCAT(first_name, ' ', last_name) AS name, 
    total_spent
FROM vw_customer_order_summary
ORDER BY total_spent DESC
LIMIT 10;


CREATE VIEW vw_order_details AS
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
  sf.last_name  AS staff_last_name,
  o.staff_id
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
JOIN stores st    ON st.store_id = o.store_id
JOIN staffs sf    ON sf.staff_id = o.staff_id;

SELECT * FROM vw_order_details WHERE order_id = ?