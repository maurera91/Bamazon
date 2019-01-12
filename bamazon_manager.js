var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Gobucks!1",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    app();
});
function app(){
    console.log("BAMAZON MANAGER MAIN MENU")
    console.log("---------------------------")
    inquirer.prompt([
        {
            type: "list",
            message: "Select Your Function",
            choices: ["View Products", "View Low inventory", "Add to Inventory", "Add New Product", "Quit"],
            name: "main_menu"
        }
    ]).then(function(response){
        switch (response.main_menu){
        case "View Products":
            viewProducts();
            break; 
        case "View Low inventory":
            viewLowInventory();
            break;
        case "Add to Inventory":
            addToInventory();
            break;
        case "Add New Product":
            addNewProduct();
            break;
        case "Quit":
            quit();
            break;
        }
    })

};
function viewProducts(){
    connection.query(
        "SELECT * FROM products",
        function(err,result){
            if (err) throw err;
            for (let item of result){
                console.log(
                `ITEM NAME: ${item.product_name}\n
                ITEM ID: ${item.item_id}\n
                ITEM DEPARTMEMNT: ${item.department_name}\n
                ITEM PRICE: ${item.price}\n
                ITEM QUANTITY: ${item.quantity}\n
                ------------------------`
                );
            }  
            app();  
    });

};
function viewLowInventory(){
    connection.query(
        "SELECT * FROM products WHERE quantity < 5",
        function(err,result){
            if (err) throw err;
            if (result){
            for (let item of result){
                console.log(
                `ITEM NAME: ${item.product_name}\n
                ITEM ID: ${item.item_id}\n
                ITEM DEPARTMEMNT: ${item.department_name}\n
                ITEM PRICE: ${item.price}\n
                ITEM QUANTITY: ${item.quantity}\n
                ------------------------`
                );
            }
            }else{
                console.log("No low inventory");
            }
            app();  
    });

};
function addToInventory(){
    inquirer.query({

    
    })

};
function addNewProduct(){

};
function quit(){
    console.log("Quitting the program.")
    connection.end();
};