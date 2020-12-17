var express = require('express')
var axios = require('axios')
var mysql = require('mysql')

var connection = mysql.createConnection({
                                            host:"localhost",
                                            port:3306,
                                            user:'root',
                                            password:'root',
                                            database:'inventory_dec_2020'

                                        })


var app  = express()

app.use(express.json())

connection.connect(err=>{
    if(err)
        throw err
    console.log("Connected to database!!!!")
})

app.get("/get/inventory", (req,res)=>{
   
        var sql = "select * from shop_inventory"
        connection.query(sql, (err, data)=>{
            if(err)
                throw err
            res.send(data)    
        })
})

app.get("/get/inventory/:code", (req, res)=>{
    console.log("Get inventory for code " + req.params.code)
    var sql = "select * from shop_inventory where product_code='" + req.params.code+"'"
    connection.query(sql, (err, data)=>{
        if(err)
            throw err
        console.log(data)
        console.log(data.length)
        if(data.length == 0){
            res.send([{
                id:0,
                message: "Invalid product code",
                product_quantity: 0
            }])
        }else{
            res.send(data)  
        }
        
    })
    
})




app.listen(1235, ()=>{
    console.log("listening on port 1235")
})
