const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware here
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bye7x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        console.log('db connected');
        const peopleCollection = client.db('volunteerNetwork').collection('peoples');
        const eventCollection = client.db('volunteerNetwork').collection('events');

        app.get('/addevents', async (req, res) =>{
            const query = {};
            const cursor = eventCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.post('/addevents', async (req, res) =>{
            const query = req.body;
            const result = await eventCollection.insertOne(query);
            res.send(result);
        })
        app.delete('/addevents/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await eventCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/addmainitem', async (req, res) =>{
            const query = req.body;
            const result = await peopleCollection.insertOne(query);
            res.send(result);
        })
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('volunteer server is runing');
})
app.listen(port, () =>{
    console.log('app is runing on port', port);
})
