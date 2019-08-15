-- i've used SQL over the past 7 years at the time of this commit, so i refuse to use CAPS for this exercise
drop database if exists bamazon;
create database bamazon;

-- USE DB
use bamazon;

-- MAKE TABLE
create table products (
    item_id int auto_increment not null,
    product_name varchar(100) null,
    department_name varchar(100) null,
    price decimal(10,2) null,
    stock_quantity int null,
    product_sales decimal(10,2) default 0,
    PRIMARY KEY (item_id)
);

-- ADD DUMMY VALUES

-- CREATE CUSTOMER TABLES
-- use bamazon;
insert into products (product_name, department_name, price, stock_quantity)
values ('Fuzzy socks', 'Clothes', 2.99, 30306),
('Long socks', 'Clothes', 3.99, 64000),
('Widget', 'Toys', 14.36, 48222),
('Cog', 'Electronics', 1.50, 289682),
('Wheel', 'Hobby', 5.87, 5510),
('Copper wire', 'Electronics', 3.97, 73565),
('Coppr wire', 'Electronics', 1.97, 93654),
('Comfy shoes', 'Clothes', 19.65, 1363),
('Warm slippers', 'Household', 16.89, 6135),
('Yarn and thread', 'Hobby', 0.99, 1245300);

-- CREATE DEPARTMENTS TABLES
create table departments (
	department_id int not null auto_increment,
    department_name varchar(100) null,
    over_head_costs decimal(10,2) null,
    PRIMARY KEY (department_id)
);

-- DEFAULT TABLE VALUES
insert into departments (department_name, over_head_costs)
values ('Hobby', 2000), ('Electronics', 10000), ('Toys', 2000), ('Household', 1000), ('Clothes', 1000);

-- VIEW TABLES
select * from products;
select * from departments;

-- QUERY FOR PROFIT (INNER JOIN)
select department_id, departments.department_name, over_head_costs, sum(product_sales) as product_sales,
	sum(product_sales) - over_head_costs as total_profit
from departments
inner join products
on departments.department_name = products.department_name
group by department_id;