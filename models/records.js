const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create records' schema 
const RecordSchema = new Schema({
    startingTime: Date,
    deliveryTime: Date,
    startStationId: String,
    destinationId: String,
    feePerHour: {
        type: Number, 
        default: 0.5
    },
    totalCost: Number,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bikeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bike'
    },
    totalTime: Number
});

//create records' model to migrate to the db 
const Record = mongoose.model('record', RecordSchema);

module.exports = Record;