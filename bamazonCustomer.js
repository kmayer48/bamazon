// Pull in required dependencies.
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");
var colors = require("colors");

// Define the MySQL connection parameters
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Username to connect to the database.
    user: "root",
    // Password to connect to the database.
    password: "",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the Bamazon database id " + connection.threadId + "\n");
});

// Prints the items for sale and their details.
connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log("-------------------------------------| Welcome to Bamazon! |----------------------------------------\n");
    console.log("\n--------------------------------------- CURRENT PRODUCTS -------------------------------------------\n");
    // For Loop to display all current items in the database in the CLI Table.
    var table = new Table({
        head: ["Product Id".cyan.bold, "Product Name".cyan.bold, "Department".cyan.bold, "Price".cyan.bold, "Stock Quantity".cyan.bold]
    });
    for (var i = 0; i < res.length; i++) {
        table.push([res[i].id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]);
    }
    //
    console.log(table.toString() + "\n" +
        "\n----------------------------------------------------------------------------------------------------\n");
});

// promptUser will prompt the user for the item ID and quantity they would like to purchase.
function promptUser() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([{
                type: "input",
                name: "product_id",
                message: "Please enter the Product ID of the item you would like to purchase.",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    console.log(" Please input one of the Product Id's from the above list.");
                },
                filter: Number
            },
            {
                type: "input",
                name: "quantity",
                message: "How many would you like to buy?",
                validate: function (value) {
                    if (Number.isInteger(value)) {
                        return true;
                    }
                    console.log(" Please enter a valid number.");
                },
                filter: Number
            }
        ]).then(function (ans) {
            // Setting responses to variables.
            var item = ans.product_id;
            var quantity = ans.quantity;
            // Grabbing the chosen item object.
            var chosenItem;
            for (var i = 0; i < res.length; i++) {
                if (res[i].id === item) {
                    chosenItem = res[i];
                }
            }
            // Setting a grand total variable to be displayed in the console.
            var grandTotal = parseFloat((chosenItem.price) * quantity).toFixed(2);
            // Displaying totals 
            console.log("\nYou have selected to purchase: \n" +
                "\nProduct Id: " + item +
                "\nProduct: " + chosenItem.product_name +
                "\nQuantity: " + quantity);
            // If the user has selected an invalid item ID, data attay will be empty.
            if (quantity <= chosenItem.stock_quantity) {
                var newQuantity = (chosenItem.stock_quantity - quantity);
                console.log("\nThe product you requested is in stock! Placing order..." +
                    "\nYour Grand Total is: $" + grandTotal + "\n");
                // Update the inventory
                connection.query("UPDATE products SET ? WHERE ? ",
                    [{
                            stock_quantity: newQuantity
                        },
                        {
                            id: item
                        }
                    ],
                    function (err, res) {
                        if (err) throw err;
                        console.log("Your order has been placed!" +
                            "\nThank you for shopping with us! Please allow 3-5 business days for delivery!\n" +
                            "\n----------------------------------------------------------------------------------------------------\n");
                        // End the database connection
                        connection.end();
                    });
            } else {
                console.log("\nSorry. There is not enough product in stock, your order cannot be placed. Please modify your order." +
                    "\nCurrent Inventory: " + chosenItem.stock_quantity + " units in stock." +
                    "\n----------------------------------------------------------------------------------------------------\n");
                promptUser();
            }
        });
    });
}

promptUser();