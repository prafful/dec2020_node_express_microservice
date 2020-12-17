var express = require('express')
var axios = require('axios')
var mysql = require('mysql')

var connection = mysql.createConnection({
                                            host:"localhost",
                                            port:3306,
                                            user:'root',
                                            password:'root',
                                            database:'product_dec_2020'

                                        })


var app  = express()

app.use(express.json())

app.get("/posts", (req,res)=>{
    axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(response=>{
                console.log(response)
                res.send(response.data)
            })
            .catch(error=>{
                console.log(error)
            })
})


connection.connect(err=>{
        if(err)
            throw err
        console.log("Connected to database!!!!")

})

app.get("/get/products", (req,res)=>{
  
        var sql = "select * from shop_product"
        connection.query(sql, (err, dataproduct)=>{
            if(err)
                throw err
           
            res.send(dataproduct)    
        })
    })


app.get("/get/products/:code", (req, res)=>{
    console.log("Get product inventory for code " + req.params.code)
    var sql = "select * from shop_product where product_code='" + req.params.code+"'"
    connection.query(sql, (err, dataproduct)=>{
        if(err)
            throw err
        console.log(dataproduct)
        console.log(dataproduct.length)
        if(dataproduct.length == 0){
            res.send({
                id:0,
                message: "Invalid product code"
            })
        }else{
            //res.send(data)
            //communicate with inventory api to get inventory quantity
            //if inventory quantity is more than zero then update the inventory status in product db.
            axios.get("http://localhost:1235/get/inventory/"+ req.params.code)
                    .then(response=>{
                        console.log("Receiving inventory quantity from inventory api....");
                        console.log(response.data)
                        if(response.data[0].product_quantity>0){
                            console.log("Quantity is more than 0!")
                            var sqlupdate = "UPDATE shop_product SET inventory_status = '1' WHERE product_code='" + req.params.code+"'"
                            console.log(sqlupdate)
                        }else{
                            console.log("Quantity is 0!")
                            var sqlupdate = "UPDATE shop_product SET inventory_status = '0' WHERE product_code='" + req.params.code+"'"
                            console.log(sqlupdate)
                        }    
                        connection.query(sqlupdate, (err, data)=>{
                                if(err)
                                    throw err
                                
                                console.log(data)    
                                
                            })
                            //res.send(dataproduct)
                            var sql = "select * from shop_product where product_code='" + req.params.code+"'"
                            connection.query(sql, (err, finalproduct)=>{
                                if(err)
                                    throw err
                                console.log(finalproduct)
                                res.send(finalproduct)
                            })     
                    })
                    .catch(error=>{
                        console.log(error)
                    })
        }
        
    })
    
})



app.listen(1234, ()=>{
    console.log("listening on port 1234")
})
