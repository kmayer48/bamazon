DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	id int(20) not null auto_increment,
	product_name varchar(30) not null,
    department_name varchar(30) not null,
	price int(20) not null,
	stock_quantity int(20) not null,
    primary key(id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Apple Iphone", "Electronics", 999.99, 20), ("Bose Headphones", "Electronics", 299.99, 8), ("Playstation 4", "Electronics", 399.99, 12), ("Apple Macbook Pro", "Electronics", 1399.99, 11),  ("Puma Sweatpants", "Clothing", 39.99, 12), ("Nike Tee", "Clothing", 29.99, 15), ("Under Armour Hoody", "Clothing", 49.99, 18),
("Sectional Couch", "Furniture", 1299.99, 4), ("Lay-z-boy Recliner", "Furniture", 399.99, 6), ("Computer Desk" , "Furniture", 299.99, 9);

SELECT * FROM products