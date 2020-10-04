const request = require('request');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = require('express')();

// connect to Mongo daemon
mongoose
  .connect(
    'mongodb://mongo:27017/expressmongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// insert data to my db
request('https://hn.algolia.com/api/v1/search_by_date?query=nodejs', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var data = JSON.parse(body)

    mongoose.connect('mongodb://mongo:27017/expressmongo', function(err, db) {
      if (err) throw err;
      var myObj = data.hits;
      db.collection('myData').insert(myObj, function(err, res) {
        if (err) throw err;
        console.log("Number of documents inserted : ", res.insertedCount);
        db.close();
      });
    });
  }
});


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

Item = mongoose.model('item', ItemSchema);
app.set('views', path.join(__dirname, '../client'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) =>{

  mongoose.connect('mongodb://mongo:27017/expressmongo', function(err, db) {
    if (err) throw err;
    db.collection('myData').find().toArray(function(err, results) {
      if (err){
        console.log("Error")
      }
      else console.log("ok")//res.send(results);
    });
  });

  res.render("index");
})


//Post route
app.post('/item/add', (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });

  newItem.save().then(item => res.redirect('/'));
});

const port = 3000;
app.listen(port, () => console.log('Server running...'));