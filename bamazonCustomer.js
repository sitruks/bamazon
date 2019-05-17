// added node code to pull mysql database.
// tested node can get database and initiate inquirer. next step to add loop or more efficient way to catch choices.

const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    password: "cracker",
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    // ------------
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    showItems();
    runSearch();
});

function showItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("/---/---/---/---/---/---/---/");
        console.log("/---|Welcome to Bamazon|---/");
        console.log("/---/---/---/---/---/---/---/");
        console.log("/---|As seen on the 2nd|---/");
        console.log("/---|  page of Google. |---/");
        console.log(res);
        console.log("/---/---/---/---/---/---/---/");
        // connection.end();
    });
}

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Since we are awesome, you can lookup items by id number, instead of name.\nWe currently have 10 items for sale.\nPlease select a number between 1-10",
            choices: [1,2,3,4,5,6,7,8,9,10, "exit"]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Find songs by artist":
                    artistSearch();
                    break;

                case "Find all artists who appear more than once":
                    multiSearch();
                    break;

                case "Find data within a specific range":
                    rangeSearch();
                    break;

                case "Search for a specific song":
                    songSearch();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

function artistSearch() {
    inquirer
        .prompt({
            name: "artist",
            type: "input",
            message: "What artist would you like to search for?"
        })
        .then(function (answer) {
            var query = "SELECT position, song, year FROM top5000 WHERE ?";
            connection.query(query, { artist: answer.artist }, function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
                }
                runSearch();
            });
        });
}

// function artistSearch() {
//   inquirer
//     .prompt({
//       name: "artist",
//       type: "input",
//       message: "What artist would you like to search for?"
//     })
//     .then(function(answer) {
//       var query = "SELECT position, song, year FROM top5000 WHERE ?";
//       connection.query(query, { artist: answer.artist }, function(err, res) {
//         for (var i = 0; i < res.length; i++) {
//           console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
//         }
//         runSearch();
//       });
//     });
// }

// function multiSearch() {
//   var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
//   connection.query(query, function(err, res) {
//     for (var i = 0; i < res.length; i++) {
//       console.log(res[i].artist);
//     }
//     runSearch();
//   });
// }

// function rangeSearch() {
//   inquirer
//     .prompt([
//       {
//         name: "start",
//         type: "input",
//         message: "Enter starting position: ",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       },
//       {
//         name: "end",
//         type: "input",
//         message: "Enter ending position: ",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
//       connection.query(query, [answer.start, answer.end], function(err, res) {
//         for (var i = 0; i < res.length; i++) {
//           console.log(
//             "Position: " +
//               res[i].position +
//               " || Song: " +
//               res[i].song +
//               " || Artist: " +
//               res[i].artist +
//               " || Year: " +
//               res[i].year
//           );
//         }
//         runSearch();
//       });
//     });
// }

// function songSearch() {
//   inquirer
//     .prompt({
//       name: "song",
//       type: "input",
//       message: "What song would you like to look for?"
//     })
//     .then(function(answer) {
//       console.log(answer.song);
//       connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
//         console.log(
//           "Position: " +
//             res[0].position +
//             " || Song: " +
//             res[0].song +
//             " || Artist: " +
//             res[0].artist +
//             " || Year: " +
//             res[0].year
//         );
//         runSearch();
//       });
//     });
// }
