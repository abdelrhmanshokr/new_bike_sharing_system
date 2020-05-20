const express = require('express'); 
const router = express.Router(); 
const moment = require('moment');
const Bike = require('../models/bikes');
const Station = require('../models/stations');
const Record = require('../models/records');
const User = require('../models/users');

//returns all bikes in the system
router.get('/', (req, res, next) => {
    let bikes = Bike.find({})
    .then((bikes) => {
        res.send(bikes);
    })
    .catch(next);
});

//adds a new bike 
router.post('/', (req, res, next) => {
    let bike = new Bike(req.body);
    bike.save()
        .then((bike) => {
            // to push new record into the bikes in the station field called bikesId
            Station.findOne({_id: bike.stationId})
                .then((station) => {
                    station.bikesId.push(bike);
                    station.save()
                    .then()
                    .catch(next);
                })
                .catch(next);
        })
        res.send(bike)
        .catch(next);
});

//edits an existing bike 
router.put('/:id', (req, res, next) => {
    Bike.findByIdAndUpdate({_id: req.params.id}, req.body)
        .then(() => {
            Bike.findOne({_id: req.params.id})
                .then((bike) => {
                    res.send(bike);
                })
                .catch(next);
        })
        .catch(next);
});

//deletes one bike 
router.delete('/:id', (req, res, next) => {
    Bike.findByIdAndRemove({_id: req.params.id})
        .then((bike) => {
            res.send(bike);
        })
        .catch(next);
});

//a user rents a bike
router.post('/rent', (req, res, next) => {
    // first we need to check first if the bike is rented or the user has rented a bike
    // if(bike.okToBeRented == 'true' || user.okToRent == 'true'){
    //     //the user has no bike attached to them and the bike is not used by another user so both are ok to move on
    // }else{
    //     //either the user has rented a bike and didn't return it yet or the bike is rented by another user
    //     res.send('please check if you have not returned your last bike or if the bike is being used by another user');
    // }
    //the route will get these data from the request but for now let it be 
    let record = new Record({
        startingTime: moment(),
        startStationId: '5e7a3a36c083647b1afe984a',
        userId: '5e860664a1980a237c241ff8',
        bikeId: '5e88ad98e068270ec9f04a02'
    });
    record.save()
        .then((result) => {
            //getting the user and linking them to the bike they rented 
            User.findOne({_id: record.userId})
                .then((user) => {
                    user.bikeId = record.bikeId;
                    //setting a new value to the user's latest record to enable us to retrieve the same record once the user returns the bike
                    user.latestRecordId = record.id;
                    //setting the user's okToRent field to false as they have a bike now it will return to true when the user returns their bike
                    user.okToRent = false;
                    user.save()
                        .then()
                        .catch(next);
                })
                .catch(next);
                    
            //getting the bike that got rented and linking it to the user, also removing stationId from the bike.stationId field as it's no longer there 
            Bike.findOne({_id: record.bikeId})
                .then((bike) => {
                    bike.userId = record.userId;
                    //setting the bike.stationId to null as the rented bike does not belong to the start station any more
                    bike.stationId = null;
                    //setting the bike's ok to be rented to false as it's being used right now so no other user can rent it until it's returned to some other station by the same user
                    bike.OkToBeRented = false;
                    bike.save()
                        .then()
                        .catch(next);
                })
                .catch(next);
                    
            //removing the rented bike from the start station's bikesId list as it's leaving so it's no longer there
            Station.findOne({_id: record.startStationId})
                .then((station) => {
                    station.bikesId.splice(station.bikesId.indexOf(record.bikeId), 1);
                    station.save()
                        .then()
                        .catch(next);
                })
                .catch(next);
        res.send(record);
        })
        .catch(next); 
});

//user releases a bike 
router.post('/release', (req, res, next) => {
    //first we need to get the latest record with the same userId 
    //we will get the info we need from the req later but for now let it be 
    let userId = '5e860664a1980a237c241ff8';
    let bikeId = '5e88ad98e068270ec9f04a02'; 
    let deliveryTime = moment();
    let destinationId = '5e8457a53c436d5b02aca623';

    //we need to first find the user associated with this record and get the latest record Id from it 
    User.findOne({_id: userId})
        .then((user) => {
            //we need to remove the link between this bike and the current user as they are returning it, and setting their ok to rent field to true as now they can start renting again 
            user.bikeId = null;
            user.okToRent = true;
            user.save()
                .then()
                .catch(next);
                
            //then we use the latest recordId to get the record we need 
            Record.findOne({_id: user.latestRecordId})
                .then((record) => {
                    //we fill in the rest of the fields delivery time, destinationId and we calculate the total cost of the trip 
                    record.deliveryTime = deliveryTime;
                    record.destinationId = destinationId;
                    record.totalTime = deliveryTime.diff(record.startingTime);
                    record.totalCost = (((deliveryTime - record.startingTime) / 60000) * record.feePerHour);
                    //we need to set a global variable to hold the fees per hour value in if possible 
                    record.save()
                        .then((record) => {
                            res.send(record);
                        })
                        .catch(next);
                })
                .catch(next);
        })
        .catch(next);
        
    //we need to find the station to add the new bike to it 
    Station.findOne({_id: destinationId})
        .then((station) => {
            station.bikesId.push(bikeId);
            station.save()
                .then()
                .catch(next);
        })
        .catch(next);
            
    //we need to find the bike to assign the new station to its stationId
    Bike.findOne({_id: bikeId})
        .then((bike) => {
            bike.stationId = destinationId;
            bike.userId = null;
            bike.OkToBeRented = true;
            bike.save()
                .then()
                .catch(next);
        })
        .catch(next);
});

//returns the nearest bike (for the admin)
router.get('/nearest', (req, res, next) => {
    Bike.aggregate([{
        $geoNear: {
            near: {
                type: 'point',
                coordinates: [
                    //lng is for longtitude and lat is for latitude
                    parseFloat(req.query.lng),
                    parseFloat(req.query.lat)
                ]
            },
            distanceField: 'dist.calculated',
            maxDistance: 100000,
            spherical: true
        }
    }])
        .then((bikes) => {
            res.send(bikes);
        })
        .catch(next);
});

//returns the location of a certain bike in real time 
router.get('/bikelocation/:id', (req, res, next) => {
    Bike.findOne({_id: req.params.id})
        .then((bike) => {
            res.send(bike.geoLocation.coordinates);
        })
        .catch(next);
});

module.exports = router;