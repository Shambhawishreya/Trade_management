const express = require('express')
const pool = require('./controllers/db')

const app = express()
app.use(express.json())

app.get("/users",async(req,res)=>{
    async function fetchData() {
        try {
          const res = await pool.query('SELECT * FROM users');
          console.log(res.rows);
        } catch (err) {
          console.error('Error executing query', err.stack);
        }
      }
      fetchData();
})



app.listen('2099',()=>{
    console.log("connected");
    
})