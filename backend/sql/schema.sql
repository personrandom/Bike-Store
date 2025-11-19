# bike store database
CREATE DATABASE IF NOT EXISTS bike_store;
USE bike_store;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS staffs;
DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS stores;

# lookup tables
CREATE TABLE brands (
  brand_id    INT PRIMARY KEY,
  brand_name  VARCHAR(255) NOT NULL
);

CREATE TABLE categories (
  category_id   INT PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL
);

# core entities
CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  first_name  VARCHAR(50),
  last_name   VARCHAR(50),
  phone       VARCHAR(25),
  email       VARCHAR(100),
  street      VARCHAR(255),
  city        VARCHAR(100),
  state       VARCHAR(10),
  zip_code    VARCHAR(10)
);

CREATE TABLE stores (
  store_id   INT PRIMARY KEY,
  store_name VARCHAR(255),
  phone      VARCHAR(25),
  email      VARCHAR(100),
  street     VARCHAR(255),
  city       VARCHAR(100),
  state      VARCHAR(10),
  zip_code   VARCHAR(10)
);

CREATE TABLE staffs (
  staff_id   INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name  VARCHAR(50),
  email      VARCHAR(100),
  phone      VARCHAR(25),
  active     INT,
  store_id   INT,
  manager_id INT,
  CONSTRAINT fk_staff_store
    FOREIGN KEY (store_id) REFERENCES stores(store_id),
  CONSTRAINT fk_staff_manager
    FOREIGN KEY (manager_id) REFERENCES staffs(staff_id)
);

CREATE TABLE products (
  product_id   INT PRIMARY KEY,
  product_name VARCHAR(255),
  brand_id     INT,
  category_id  INT,
  model_year   INT,
  list_price   DECIMAL(10,2),
  CONSTRAINT fk_product_brand
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
  CONSTRAINT fk_product_category
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

# transactions
CREATE TABLE orders (
  order_id      INT PRIMARY KEY,
  customer_id   INT,
  order_status  INT,
  order_date    DATE,
  required_date DATE,
  shipped_date  DATE,
  store_id      INT,
  staff_id      INT,
  CONSTRAINT fk_order_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  CONSTRAINT fk_order_store
    FOREIGN KEY (store_id) REFERENCES stores(store_id),
  CONSTRAINT fk_order_staff
    FOREIGN KEY (staff_id) REFERENCES staffs(staff_id)
);

CREATE TABLE order_items (
  order_id   INT,
  item_id    INT,
  product_id INT,
  quantity   INT,
  list_price DECIMAL(10,2),
  discount   DECIMAL(5,2),
  PRIMARY KEY (order_id, item_id),
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE stocks (
  store_id   INT,
  product_id INT,
  quantity   INT,
  PRIMARY KEY (store_id, product_id),
  CONSTRAINT fk_stock_store
    FOREIGN KEY (store_id) REFERENCES stores(store_id),
  CONSTRAINT fk_stock_product
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
