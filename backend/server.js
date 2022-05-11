import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const port = 3000;

const client = new MongoClient("mongodb://127.0.0.1:27017");
await client.connect();
const db = client.db("blog");
const article = db.collection('articles');
app.use(express.json());

app.use(express.static("frontend"));

app.get('/api/articles', async (req, res) => {
    const articles = await article.find({}).toArray();
    res.json(articles)
})

app.get('/api/articles/:id', async (req, res) => {
   const art = await article.findOne({_id: ObjectId(req.params.id)})
   res.json(art)
})

app.post('/api/articles/new', async (req, res) => {
    await article.insertOne({
        ...req.body,
         date: new Date()
})
res.redirect('/api/articles')
})


app.put('/api/articles/update/:id', async (req, res) => {
   await article.updateOne({_id: ObjectId(req.params.id)}, {$set: {...req.body}})

   res.json('updated')
})


app.delete('/api/articles/erase/:id', async (req, res) => {
    const art = await article.findOne({_id: ObjectId(req.params.id)})

    await article.deleteOne(art);

    res.json({
        message: 'deleted'
    })
})


app.listen(port, () => {
    console.log("listening");
})