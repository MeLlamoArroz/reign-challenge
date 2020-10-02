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
    res.render("index");   
})


//Post route
app.post('/item/add', (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });

  newItem.save().then(item => res.redirect('/'));
});

request('https://hn.algolia.com/api/v1/search_by_date?query=nodejs', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage. 
  }
});

const port = 3000;
app.listen(port, () => console.log('Server running...'));