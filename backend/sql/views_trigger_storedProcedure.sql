-- views_trigger_storedProcedure.sql


CREATE VIEW vw_customer_order_summary AS
SELECT
  c.customer_id,
  c.first_name,
  c.last_name,
  SUM(oi.quantity * oi.list_price * (1 - oi.discount)) AS total_spent
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY c.customer_id, c.first_name, c.last_name;

SELECT customer_id, name, total_spent
    FROM vw_customer_order_summary
    ORDER BY total_spent DESC
    LIMIT 10;