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
connection.connect(function (error) {
    if (error) throw error;
    // welcome manager
    console.log("\n-----------------------------------------------------------------"
        + "\nWelcome Bamazon Manager!\n"
        + "-----------------------------------------------------------------\n");
    // start the app
    welcome();
});

// welcome function, asks managers what they want to do, runs appropriate function 
// based on answer
function welcome() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory",
                "Add New Product", "Exit"],
            message: "Please select what you would like to do."
        }
    ]).then(function (answer) {
        if (answer.action === "View Products for Sale") {
            viewProducts();
        } else if (answer.action === "View Low Inventory") {
            viewLowInventory();
        } else if (answer.action === "Add to Inventory") {
            addToInventory();
        } else if (answer.action === "Add New Product") {
            addNewProduct();
        } else if (answer.action === "Exit") {
            exit();
        }
    })
}

// function to view products
function viewProducts() {
    // save query term
    var query = "SELECT * FROM products";
    // run query
    connection.query(query, function (error, results) {
        // let us know if error
        if (error) throw error;
        // build console table
        consoleTable("\nAll Products For Sale", results);
        // run welcome function
        welcome();
    });
}

// function to view low inventory
function viewLowInventory() {
    // save query term
    var query = "SELECT * FROM products WHERE stock_quantity<5";
    // run query
    connection.query(query, function (error, results) {
        // let us know if error
        if (error) throw error;
        // build console table
        consoleTable("\nLow Product Inventory Data", results);
        // run welcome function
        welcome();
    });
}

// function to add to inventory
function addToInventory() {
    // query db for all products
    connection.query("SELECT * FROM products", function (error, results) {
        if (error) throw error;
        // show manager current product list so they know which item id to select
        consoleTable("\nCurrent Inventory Data", results);
        // ask manager which item id they'd like to add inventory to and by how much
        inquirer.prompt([
            {
                name: "id",
                message: "Input the item ID to increase inventory on.",
                // validate the item id is a number larger than 0 and contained in db
                validate: function (value) {
                    if (isNaN(value) === false && value > 0 && value <= results.length) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "amount",
                message: "Input the amount to increase inventory by.",
                // make sure the amount is a number over 0
                validate: function (value) {
                    if (isNaN(value) === false && value > 0) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            // init item qty var
            var itemQty;
            // loop through results, if db item id equals manager's input, set itemQty
            // to stock qty of that item 
            for (var i = 0; i < results.length; i++) {
                if (parseInt(answer.id) === results[i].item_id) {
                    itemQty = results[i].stock_quantity;
                }
            }
            // call increaseQty function, pass in values for item, origQty, addQty
            increaseQty(answer.id, itemQty, answer.amount);
        });
    });
}

// increase qty function
function increaseQty(item, stockQty, addQty) {
    // query with an update, set stock equal to stockqty + addition qty
    // where the item_id equals the id the user entered
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: stockQty + parseInt(addQty)
            },
            {
                item_id: parseInt(item)
            }
        ],
        function (error, results) {
            // throw error, else log inventory updated and return to welcome screen
            if (error) throw error;
            console.log("\nInventory successfully increased.\n");
            welcome();
        });
}

// function to add new product
function addNewProduct() {
    // querying prior to inquirer so that I can build the choices array from all 
    // available departments
    connection.query("SELECT * FROM departments", function (error, results) {
        // collect item data
        inquirer.prompt([
            {
                name: "item",
                message: "Input new item to add."
            },
            {
                name: "department",
                type: "list",
                choices: function () {
                    // empty array
                    var deptArray = [];
                    // filling array with all detps from table
                    for (var i = 0; i < results.length; i++) {
                        deptArray.push(results[i].department_name);
                    }
                    // returning filled array
                    return deptArray;
                },
                message: "Which department does this item belong in?"
            },
            {
                name: "price",
                message: "How much does this item cost?",
                // validate the cost is a number above/equal to 0 (could be free)
                validate: function (value) {
                    if (value >= 0 && isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "inventory",
                message: "How much inventory do we have?",
                // validate the qty is a number above 0
                validate: function (value) {
                    if (value > 0 && isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (newItem) {
            // then call the add item to dB function with values from inquirer
            addItemToDb(newItem.item, newItem.department,
                parseFloat(newItem.price).toFixed(2), parseInt(newItem.inventory));
        });
    });
}

// add item to db function
function addItemToDb(item, department, price, quantity) {
    // query for creating table row, set vals for each column equal to parameters
    connection.query(
        "INSERT INTO products SET ?",
        {
            product_name: item,
            department_name: department,
            price: price,
            stock_quantity: quantity
        },
        function (error, results) {
            // throw error, else log product added and return to welcome screen
            if (error) throw error;
            console.log("\nNew product successfully added.\n");
            welcome();
        });
}

// function for building console table
function consoleTable(title, results) {
    // init empty values array for console table
    var values = [];
    // loop through all results
    for (var i = 0; i < results.length; i++) {
        // save info to an object on each iteration, object properties will be 
        // column headers in console table
        var resultObject = {
            ID: results[i].item_id,
            Item: results[i].product_name,
            Price: "$" + results[i].price,
            Inventory: results[i].stock_quantity + " units"
        };
        // push the resultObject to values array
        values.push(resultObject);
    }
    // create table titled prod inv data with data in values array
    console.table(title, values);
}

// exit function, says goodbye, ends db connection
function exit() {
    console.log("\nNever stop selling.");
    connection.end();
}