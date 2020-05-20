const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//require geolocation to add a location attribute to the stations
const GeoSchema = require('./geoLocation');

//create the bikes' schema
const BikeSchema = new Schema({
    //adding a geoLocation attribute to enable us to locate the nearest station insteade of using normal attributes lng & lat 
    geoLocation: GeoSchema,
    OkToBeRented: {
        type: Boolean,
    },
    qrCode: String,
    stationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

//create the model to migrate it to the db 
const Bike = mongoose.model('bike', BikeSchema);

module.exports = Bike; 