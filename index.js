const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = require('express')();

// connect to Mongo daemon

// local connection
// launch local `mongod --dbpath "D:\mongodb\data"` first
// will create a 'db' named 'express-mongo'
// localhost url, without default port 27017 will work just fine
const dbRoute_local = 'mongodb://localhost:27017/express-mongo';
// docker url
// doesn't require local installation of mongo
// 'mymongo' is defined inside docker-compose.yml as the service name
// 'express-mongo' is the 'db' name
const dbRoute_docker = 'mongodb://mymongo:27017/express-mongo';
// using dockerfile
const dbRoute_dockerfile = 'mongodb://foo-mongo-db:27017/express-mongo';
// using docker-compose
const dbRoute_dockercompose = 'mongodb://mongo-db-container-foo:27017/express-mongo';

mongoose.connect(
    dbRoute_dockercompose,
    {useNewUrlParser: true}
).then(()=>console.log('Connected to MongoDB'))
.catch(err=>console.log(err));

// DB schema

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Item = mongoose.model('item', ItemSchema);


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    Item.find((err, items)=>{
        if (err) {console.log(err)};
        res.render("index", {items});
    });
});

app.post('/item/add', (req, res)=>{
    const newItem = new Item({
        name: req.body.name
    });
    newItem.save().then(item=>res.redirect('/'));
});

const port = 3000;
app.listen(port, ()=> console.log(`servering running at port: ${port}`));