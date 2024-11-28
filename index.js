const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kk0ds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // const database = client.db("insertDB");
    // const haiku = database.collection("haiku");
    const userCollections = client.db('usersDB').collection('users');
    const ordersCollections = client.db('ordersDB').collection('orders');

   app.get('/users', async(req, res)=>{
      const cursor = userCollections.find();
      const result= await cursor.toArray();
      res.send(result);
   })

    
    
    app.post('/users', async(req, res)=>{
        
        const newUsers = req.body;
        console.log(newUsers);
        const result = await userCollections.insertOne(newUsers);
        res.send(result);
    })
    app.get('/orders', async(req, res)=>{
        const cursor = ordersCollections.find();
        const result= await cursor.toArray();
        res.send(result);
     })
    app.post('/orders', async(req, res)=>{
        
        const newOrders = req.body;
        console.log(newOrders);
        const result = await ordersCollections.insertOne(newOrders);
        res.send(result);
    })
    app.get('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCollections.findOne(query);
      res.send(result); 
  })
   app.put('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options={ upsert: true};
      const updatedUser = req.body;
      const user={
        $set:{
          name: updatedUser.name,
          address: updatedUser.address,
          phone: updatedUser.phone
         }
      }
      const result = await userCollections.updateOne(filter, user, options);
      res.send(result);

   })
    app.delete('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await userCollections.deleteOne(query);
        res.send(result); 
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
   res.send('MERN simple crud operation is running');
})

app.listen(port, ()=>{
    console.log(`MERN simple crud operation is running on port: ${port}`);
})