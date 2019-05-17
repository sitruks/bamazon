-- for this assignment, most if not all sql queries were input directly through the terminal. 
-- this file serves as a backup 
--


-- drop database if exists bamazon;
-- create database bamazon;

-- MAKE TABLE
use bamazon;
create table products (
    item_id int not null auto_increment,
    product_name varchar(255) not null,
    department_name varchar(255) not null,
    price decimal(10,2),
    PRIMARY KEY (item_id)
);

-- ADD DUMMY VALUES
use bamazon;
insert into products (item_id, product_name, department_name, price)
values (1, "fuzzy socks", "clothing", 2.99),
(2, "long socks", "clothing", 3.99),
(3, "widget", "electronics", 14.36),
(4, "cog", "electronics", 1.50),
(5, "wheel", "hobby", 5.87),
(6, "copper wire", "electronics", 3.97),
(7, "coppr wire", "electronics", 1.97),
(8, "comfy shoes", "clothing", 19.65),
(9, "warm slippers", "clothing", 16.89),
(10, "yarn and thread", "hobby", 0.99);