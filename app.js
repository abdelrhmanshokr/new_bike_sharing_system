const express = require('express');
const mongoose = require('mongoose');
const app = express();
const users = require('./routes/users');
const stations = require('./routes/stations');
const bikes = require('./routes/bikes');
const records = require('./routes/records');

app.use(express.json());
app.use('/api/users', users);
app.use('/api/stations', stations);
app.use('/api/bikes', bikes);
app.use('/api/records', records);

//error handling middelware
app.use((err, req, res, next) => {
    res.status(422).send({error: err.message});
});

//connect to mongodb
mongoose.connect('mongodb://localhost/bikeSharing',  {useNewUrlParser: true, useUnifiedTopology: true})
    .then( () => {
        console.log('connected to mongodb');
    })
    .catch( (err) => {
        console.log(err.message);
    });

//setting mongoose promise to the global promise 
mongoose.Promise = global.Promise;

const port = process.env.port || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));