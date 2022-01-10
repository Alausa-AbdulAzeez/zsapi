CREATE DATABASE store_manager;

CREATE TABLE personnel(
    personnel_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    profile_picture VARCHAR(500),
    isAdmin BOOLEAN DEFAULT FALSE,
    isAttendant BOOLEAN DEFAULT TRUE,
    total_items_sold INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products(
product_id SERIAL PRIMARY KEY,
product_name VARCHAR(100) NOT NULL,
product_price INT NOT NULL,
product_desc VARCHAR(300) NOT NULL,
product_img  VARCHAR(500) NOT NULL,
product_categories VARCHAR [],
inStock BOOLEAN DEFAULT TRUE,
total_no_available INT DEFAULT 20,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sales(
  order_date timestamp DEFAULT NOW(),
  amount INT,
  personnel_id INT
)

-- 1
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON personnel
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


