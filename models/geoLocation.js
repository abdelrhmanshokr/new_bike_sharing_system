const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a geoLocation schema to enable us to locate the nearest bike, station or any other entity 
const GeoLocation = new mongoose.Schema({
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        index: '2dsphere'
    }
});

//exporting only the schema as we don't need to create the model or export it 
module.exports = GeoLocation;

