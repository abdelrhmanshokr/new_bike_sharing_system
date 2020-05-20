const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create users' schema 
const UserSchema = new Schema({
    name: {
        type: String,
        required: (true, 'name is required') 
    },
    email: {
        type: String,
        required: (true, 'email is required')
    },
    password: {
        type: String
    },
    collage: String,
    year: String,
    phone: String,
    wallet: Number,
    isAdmin: Boolean,
    latestRecordId: String,
    okToRent: Boolean,
    bikeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bike'
    }
});

//creating the model to migrate it to the db 
//it's done using 
//const model name starts with a cabital case litter = mongoose.model('collection name in singular form', schema name)
//and we only export the model not the schema 
const User = mongoose.model('user', UserSchema);

module.exports = User;