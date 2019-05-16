-- for this assignment, most if not all sql queries were input directly through the terminal. 
-- this file serves as a backup 
--


-- drop database if exists bamazon;
-- create database bamazon;
use bamazon;
create table products (
    item_id int not null auto_increment,
    product_name varchar(255) not null,
    department_name varchar(255) not null,
    price int(10),
    PRIMARY KEY (item_id)
);