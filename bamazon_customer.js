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
    console.log("WELCOME TO BAMAZON!");
    displayItems();
});

function displayItems(){
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
        
    }


function app(){
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the item ID of the item you would like to buy.",
            name: "purchase_id"
        },
        {
            type: "input",
            message: "Please quantity of the item you would like to buy.",
            name: "purchase_quantity"
        }
    ]).then(function(main_response){
        //console.log(main_response.purchase_id);
        connection.query(
            `SELECT * FROM PRODUCTS WHERE item_id = ${main_response.purchase_id}`, 
            function(error,response){
                //console.log(response[0].quantity);
                if (error) throw error;
                if (parseInt(response[0].quantity) >= parseInt(main_response.purchase_quantity)){
                    connection.query(
                        `update products SET ? WHERE ?`,
                        [
                            {
                                quantity: response[0].quantity - main_response.purchase_quantity
                            },
                            {
                                item_id: main_response.purchase_id
                            }
                        ],
                        function(err, res){
                            console.log(`You have purchased ${main_response.purchase_quantity} ${response[0].product_name} for $${parseInt(main_response.purchase_quantity) * parseInt(response[0].price)}`)
                            inquirer.prompt([
                            {
                                type: "list",
                                message: "Would you like to make another purchase?",
                                choices: ["Yes","No, exit the program"],
                                name: "exit"
                            }
                            ]).then(function(final_res){
                                if(final_res.exit == "Yes"){
                                    displayItems();
                                }
                                else{
                                    console.log("Thank you for visiting Bamazon! Goodbye!");
                                    connection.end();
                                }

                            })
                        }
                    )
                }
                else{
                    console.log("Insufficent Quantity!")
                    displayItems();
                }
            }
        )
    });
}