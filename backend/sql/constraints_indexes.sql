USE bike_store;

-- requirements for project: 4 Fkeys, 1 UNIQUE, 2 CHECK, 1, 4 indexes

-- UNIQUE constraints
ALTER TABLE customers
  ADD CONSTRAINT uq_customers_email UNIQUE (email);

ALTER TABLE staffs
  ADD CONSTRAINT uq_staffs_email UNIQUE (email);

-- CHECK constraints
ALTER TABLE products
  ADD CONSTRAINT chk_products_list_price
  CHECK (list_price > 0);

ALTER TABLE order_items
  ADD CONSTRAINT chk_order_items_quantity
  CHECK (quantity > 0);

ALTER TABLE order_items
  ADD CONSTRAINT chk_order_items_discount
  CHECK (discount >= 0 AND discount <= 1);

-- Indexes
-- speed up queries by date
CREATE INDEX idx_orders_order_date
  ON orders (order_date);

-- speed up lookups by customer
CREATE INDEX idx_orders_customer
  ON orders (customer_id);

-- speed up product lookups in order_items
CREATE INDEX idx_order_items_product
  ON order_items (product_id);

-- composite index on stocks
CREATE INDEX idx_stocks_store_product
  ON stocks (store_id, product_id);
