require('dotenv').config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTableNPM = require("console.table");

// create mysql connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_USER_PASSWORD,
    database: "bamazon"
});

// connect to db
connection.connect(function(error){
	if (error) throw error;
	// welcome manager
	console.log("\n-----------------------------------------------------------------" 
		+ "\nWelcome Bamazon Supervisor!\n" 
		+ "-----------------------------------------------------------------\n");
	// start the app
	welcome();
});

// welcome function asks what supervisor wants to do and runs corresponding function
function welcome() {
	inquirer.prompt([
		{
			name: "action",
			type: "list",
			choices: ["View Product Sales By Department", "Create New Department", "Exit"],
			message: "Please select what you would like to do."
		},
	]).then(function(response) {
		if (response.action === "View Product Sales By Department") {
			viewSales();
		} else if (response.action === "Create New Department") {
			createDepartment();
		} else if (response.action === "Exit") {
			exit();
		}
	});
}

// function to view departmental sales
function viewSales() {
	// building query variable for inner join
	// selecting dept id, dept name, OH costs, sum(product sales) with alias product
	// sales, and sum(product sales) - OH costs with alias total profit - these will
	// be the resulting table headers
	// from departments table, inner join products table where dept names equal each 
	// other. group by dept id
	const joinQuery = "SELECT department_id, departments.department_name, over_head_costs,"
		+ " SUM(product_sales) AS product_sales," 
		+ " SUM(product_sales) - over_head_costs AS total_profit ";
	joinQuery += "FROM departments INNER JOIN products ";
	joinQuery += "ON departments.department_name = products.department_name ";
	joinQuery += "GROUP BY department_id ";

	// query the db, throw error if error, if not, build and print console table
	// return to welcome screen
	connection.query(joinQuery, function(error, results) {
		if (error) throw error;
		consoleTableProfit("\nDepartmental Profit", results);
		welcome();
	});
}

// function to create new department
function createDepartment() {
	// query db to display console table of current departments and validate supervisor
	// isn't adding a dept that already exists
	connection.query("SELECT * FROM departments", function (error, results) {
		if (error) throw error;
		// display current departments
		consoleTableDept("\nCurrent Department Data", results);
		// ask for new dept name and overhead for it
		inquirer.prompt([
			{
				name: "name",
				message: "Please input new department name.",
				// validating dept doesn't already exist
				validate: function(value) {
					// create empty dept array
					const deptArray = [];
					// push all current depts to array
					for (let i = 0; i < results.length; i++) {
						deptArray.push(results[i].department_name.toLowerCase());
					}
					// if supervisor input not in array, return true, else return false
					if (deptArray.indexOf(value.toLowerCase()) === -1) {
						return true;
					}
					return false;
				}
			},
			{
				name: "overhead",
				message: "Input new department overhead costs.",
				// validate the overhead is a number larger than 0
				validate: function(value) {
					if (isNaN(value) === false && value > 0) {
						return true;
					}
					return false;
				}
			}
		]).then(function(newDept) {
			// query db for an insertion into the departments table, set name/costs equal
			// to supervisor input
			connection.query(
				"INSERT INTO departments SET ?",
				{
					department_name: newDept.name,
					over_head_costs: parseFloat(newDept.overhead).toFixed(2)
				}, 
				function(error, results) {
					// if error, tell us, else log success and return to welcome screen
					if (error) throw error;
					console.log("\nNew department added successfully.\n");
					welcome();
			});
		});
	});
}

// function for building console table for viewing total profit
function consoleTableProfit(title, results) {
	// init empty values array for console table
	const values = [];
	// loop through all results
	for (let i = 0; i < results.length; i++) {
		// save info to an object on each iteration, object properties will be 
		// column headers in console table
		const resultObject = {
			ID: results[i].department_id,
			Department: results[i].department_name,
			Overhead: "$" + results[i].over_head_costs.toFixed(2),
			Product_Sales: "$" + results[i].product_sales.toFixed(2),
			Total_Profit: "$" + results[i].total_profit.toFixed(2)
		};
		// push the resultObject to values array
		values.push(resultObject);
	}
	// create table titled prod inv data with data in values array
	console.table(title, values);
}

// function for building console table for adding new dept function
function consoleTableDept(title, results) {
	// init empty values array for console table
	const values = [];
	// loop through all results
	for (let i = 0; i < results.length; i++) {
		// save info to an object on each iteration, object properties will be 
		// column headers in console table
		const resultObject = {
			ID: results[i].department_id,
			Department: results[i].department_name,
			Overhead: "$" + results[i].over_head_costs.toFixed(2),
		};
		// push the resultObject to values array
		values.push(resultObject);
	}
	// create table titled prod inv data with data in values array
	console.table(title, values);
}

// exit function ends connection to db
function exit() {
	console.log("\nNever stop selling.");
	connection.end();
}