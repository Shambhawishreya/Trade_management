const { Pool } = require('pg');

// Create a pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost', // or your server's IP/domain
  database: 'postgres',
  password: 'lolo45',
  port: 5432, // default PostgreSQL port
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connected to PostgreSQL');
  }
  release(); // release the client back to the pool
});

const express = require('express')
//const pool = require('./controllers/db')

const app = express()
app.use(express.json())

app.get("/users",async(req,res)=>{
    async function fetchData() {
        try {
          const res = await pool.query('SELECT * FROM users');
          //console.log(res.rows);

          return res.rows;
        } catch (err) {
          console.error('Error executing query', err.stack);
        }
      }
      let data = await fetchData();
      
      console.log("data=",data);
      
      return res.json({"data":data});
})



app.listen('2099',()=>{
    console.log("connected");
    
})



// Export the pool for use in other files
//module.exports = pool;