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

app.get("/get/inventory", (req,res)=>{
    connection.connect(err=>{
        if(err)
            throw err
        console.log("Connected to database!!!!")
        var sql = "select * from shop_inventory"
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
})



app.listen(1235, ()=>{
    console.log("listening on port 1234")
})
