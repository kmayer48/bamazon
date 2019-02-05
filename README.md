# bamazon

## An Amazon like shopping interface through the command line using Node.js and MySQL.

# Prerequisites

    * Terminal or Gitbash
    * Node.js & NPM (Node Plugin Manager)
    * Clone down repo
    * MySQL Workbench

##### Enter `npm install` in either Terminal or Gitbash to install neccessary packages to run this application.

#### Be sure to setup the database using MySQL Workbench and be sure to enter the password created to acccess the newly created database.

# Bamazon Customer Interface

## To begin, enter `node bamazonCustomer.js` into the command line. 
### Once connected, you will be prompted with a list of inventory. Enter the Product ID of the item you wish to purchase followed by the quantity of that item.  

#### If you select to purchase too many of a product, the interface will alert you that not enough are in stock and will show you how many are currently available.

### If there is enough of a certain product in stock, your order summary will be shown and the program will exit. To access again, simply input `node bamazonCustomer.js` back into the command line. You will notice the stock of the last item will be deducted from the stock quantity available. 

# Bamazon Manager Interface

## To begin, enter `node bamazonManager.js` into the command line. 
### Once connected, you will be prompted with the following four options:

    * View Current Products
    * View Low Inventory 
    * Add To Inventory
    * Add A New Product

## View Current Products

### This will give the user a current list of all available products. This will be similar to what the customer sees when they first enter the `node bamazonCustomer.js` command.

## View Low Inventory

### This option will show the user all products that have an inventory of less than five units in stock.

## Add To Inventory

### This option gives the user the ability to add iventory to a exisiting product. You can select from multiple products to add inventory for in the database using the spacebar.

## Add A New Product

### The final option gives the user the ability to add a totally new product to the database. It will allow you to enter the details of the items as well at categorize it into its applicable department. 

#### After you select your intial option you will be prompted to select another option, or alternatively you can exit.

# Authors

### Kenny Mayer

