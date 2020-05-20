const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//require geolocation to add a location attribute to the stations 
const GeoSchema = require('./geoLocation');


//create stations' schema
const StationSchema = new Schema({
    //adding a geoLocation attribute to enable us to locate the nearest station insteade of using normal attributes lng & lat 
    geoLocation: GeoSchema,
    areaName: {
        type: String
    },
    maxSpots: {
        type: Number
    },
    occupiedSpots: Number,
    vacantSpots: Number,
    bikesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bike' 
    }]
});

//create stations' model to migrate to the db 
const Station = mongoose.model('station', StationSchema);

module.exports = Station;