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
    viewProducts();
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the item ID of the item you would like to buy.",
            name: "inventory_id"  
        },
        {
            type: "input",
            message: "Please enter the new total quantity of the item you are adding to the inventory.",
            name: "new_quantity"
        }
    ]).then(function(response){
        connection.query(
            `update products set ? WHERE item_id = ${response.inventory_id}`,
            [
                {
                    quantity: new_quantity
                }
            ],
            function(error, res){
                if (error) throw err;
                console.log(`You have set the inventory of the ${res[0].product.name} to ${res[0].quantity}`);
                app();
            }

        )
    })

};
function addNewProduct(){
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the product?",
            name: "new_product_name"
        },
        {
            type: "input",
            message: "What department is the product in?",
            name: "new_product_department"
        },
        {
            type: "input",
            message: "How much does the item cost?",
            name: "new_product_cost"
        },
        {
            type: "input",
            message: "How many of item is in stock?",
            name: "new_product_quantity"
        }
    ]).then(function(res){
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: res.new_product_name,
                department: res.new_product_department,
                price: res.new_product_cost,
                quantity: res.new_product_quantity
            },
            function(error, result){
                if (error) throw error;
                console.log(result.affectedRows + " product inserted");
            }
        )
    })
};
function quit(){
    console.log("Quitting the program.")
    connection.end();
};