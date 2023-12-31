const express = require('express')
const cors = require('cors') 
require('dotenv').config()
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware 
app.use(cors({
    origin: [
    'http://localhost:5173',
    'https://travel-blog-client.web.app',
    'https://travel-blog-client.firebaseapp.com'
    
],
    credentials: true
}));


app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jzgy2jc.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)

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
     
        const categoryCollection = client.db('travelBlog').collection('category');
        const allDataCollection = client.db('travelBlog').collection('allData');

        app.get('/category', async(req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // All data
        app.get('/allData', async(req, res) => {
            const cursor = allDataCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //
        app.get('/allData/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await allDataCollection.findOne(query);
            res.send(result);
          })
        //   
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello travel World!')
})

app.listen(port, () => {
    console.log(`Travel Blog is running on port ${port}`)
})