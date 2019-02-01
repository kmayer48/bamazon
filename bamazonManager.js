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

// Manager prompt function which gives the user the defined options to select from.
function managerOptions() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Hello! Please select from the available options below.",
        choices: ["View current products", "View low inventory", "Add to inventory", "Add a new product", "Exit"]
    }).then(function (ans) {
        // Switch statement which will run the specified function dependent on what the user selects.
        switch (ans.action) {
            case "View current products":
                viewInventory()
                break;
            case "View low inventory":
                viewLowInventory()
                break;
            case "Add to inventory":
                addToInventory();
                break;
            case "Add a new product":
                addProduct();
                break;
            case "Exit":
                connection.end();
                break;
        }
    })
};

// Function to view current inventory in the database.
function viewInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        // Grabbing all current items and putting them into a CLI chart. 
        var table = new Table({
            head: ["Product Id".cyan.bold, "Product Name".cyan.bold, "Department".cyan.bold, "Price".cyan.bold, "Stock Quantity".cyan.bold]
        });
        console.log("\nHere is a list of current products and inventories:");
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        //
        console.log(table.toString() +
            "\n----------------------------------------------------------------------------------------------------\n");
    });
    // Running the prompt again in case the user wishes to execute another action.
    managerOptions();
};

// Function to view low inventory in the database where stock is less than 5 items.
function viewLowInventory() {
    // Database query with the logic built into the query.
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",
        function (err, res) {
            if (err) throw err;
            // If the response is zero it will alert the user there are not currently any items with less than 5 units in stock.
            if (res.length === 0) {
                console.log("There are currently no items with Low Inventory!")
                managerOptions();
            } else {
                // Building the same table format with all items that have less than 5 units of inventory in stock.
                var table = new Table({
                    head: ["Product Id".cyan.bold, "Product Name".cyan.bold, "Department".cyan.bold, "Price".cyan.bold, "Stock Quantity".cyan.bold]
                });
                for (var i = 0; i < res.length; i++) {
                    table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
                }
                console.log("\nThese are the items that need to be reordered")
                console.log(table.toString());
            }
        });
    // Running the prompt again in case the user wishes execute another action.
    managerOptions();
}

//  Function to log inventory options to the console with inqurier
function addToInventory() {
    var currentInventory = [];
    connection.query("SELECT product_name FROM products", function (err, res) {
        if (err) throw err;
        //
        for (var i = 0; i < res.length; i++) {
            currentInventory.push(res[i].product_name)
        }
        // User prompt.
        inquirer.prompt([{
            name: "choices",
            type: "checkbox",
            message: "Which product would you like to add inventory for?",
            choices: currentInventory
        }]).then(function (res) {
            if (res.choices.length === 0) {
                console.log("Please select an inventory item!");
            } else {
                restockInventory(res.choices);
            }
        });
    });
}

// Function to add actually execute the addition of inventory into the database. The function will take an array of names that the user inputs from the inquirer prompt.
function restockInventory(productNames) {
    // Sets the first element to its own array. If multiple items are selected in the prompt, the function is set to loop back over the function so it will do this action again. 
    // This allows the user to select multiple products to add inventory to at once without having to go back through the main menu.
    var item = productNames.shift();
    var itemStock;
    // Querying the database to retreieve current stock 
    connection.query("SELECT stock_quantity FROM products WHERE ?", {
        product_name: item
    }, function (err, res) {
        if (err) throw err;
        itemStock = res[0].stock_quantity;
        itemStock = parseInt(itemStock)
    });
    // Prompting the user to see how much inventory to add.
    inquirer.prompt([{
        name: "amount",
        type: "text",
        message: "How many " + item + " would you like to add?",
        // Insuring the user inputs a number.
        validate: function (value) {
            if (Number.isInteger(value)) {
                console.log(" Please enter a valid number.");
            }
            return true
        }
    }]).then(function (ans) {
        var amount = ans.amount
        amount = parseInt(amount);
        // Updating the database with new inventory.
        connection.query("UPDATE products SET ? WHERE ?", [{
            stock_quantity: itemStock += amount
        }, {
            product_name: item
        }], function (err) {
            if (err) throw err;
        });
        // If there are no items in the array, the function will return the else statement, otherwise it will rerun this entire function.
        if (productNames.length != 0) {
            restockInventory(productNames);
        } else {
            // Lets the user know that all inventory has been added. Returns the user back to the menu prompt in case they want to execute another action.
            console.log("Inventory has been added.");
            managerOptions();
        }
    });
}

// Function to Add New Products to the database.
function addProduct() {
    var departments = [];
    // Grabbing all available departments from the database and putting them into an array for the user to select from when adding a product.
    connection.query("SELECT department_name FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            departments.push(res[i].department_name);
        }
    });
    // User Prompts.
    inquirer.prompt([{
        name: "product_name",
        type: "text",
        message: "Please enter the name of the product that you would like to add."
    }, {
        name: "department_name",
        type: "list",
        message: "Please choose the department you would like to add your product to.",
        choices: departments
    }, {
        name: "price",
        type: "text",
        message: "Please enter the price for this product."
    }, {
        name: "stock_quantity",
        type: "text",
        message: "Plese enter the Stock Quantity for this item to be entered into current Inventory."
    }]).then(function (ans) {
        // Creates an ojbect with all responses from inquirer to be pushed to the database.
        var item = {
            product_name: ans.product_name,
            department_name: ans.department_name,
            price: ans.price,
            stock_quantity: ans.stock_quantity
        }
        // Insertting the object into the database.
        connection.query("INSERT INTO products SET ?", [item],
            function (err) {
                if (err) throw err;
                console.log(item.product_name + " has been added successfully to your inventory.");
                // Running the prompt again in case the user wishes to execute another action.
                managerOptions();
            });
    });
}

managerOptions();