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
        connection.query(sql, (err, data)=>{
            if(err)
                throw err
            connection.end((err)=>{
                if(err)
                    throw err
                console.log("Connection to database closed!");
            })    
            res.send(data)    
        })
    })


app.get("/get/products/:code", (req, res)=>{
    console.log("Get product inventory for code " + req.params.code)
    var sql = "select * from shop_product where product_code='" + req.params.code+"'"
    connection.query(sql, (err, data)=>{
        if(err)
            throw err
        console.log(data)
        console.log(data.length)
        if(data.length == 0){
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
                        res.send(response.data)
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
