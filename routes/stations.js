const express = require('express');
const router = express.Router();
const Station = require('../models/stations');
const Bike = require('../models/bikes');

//returns all stations 
router.get('/', (req, res, next) => {
    Station.find({})
        .then((stations) => {
            res.send(stations);
        })
        .catch(next);
});

//an endpoint to get the nearest station to the user according to their location
router.get('/nearest', (req, res, next) => {
    Station.aggregate([{
        $geoNear: { 
            near: {
                type: 'Point',
                coordinates: [
                    //lng is for longtitude and lat is for latitude and they both will be send in the url
                    parseFloat(req.query.lng), 
                    parseFloat(req.query.lat)
                ] 
            },
            distanceField: 'dist.calculated',
            maxDistance: 10000,
            spherical: true
        }
    }])
        .then((stations) => {
            res.send(stations);
        })
        .catch(next);
});

//returns all bikes IDs in a station  
router.get('/allbikes/:id', (req, res, next) => {
    Station.findOne({_id: req.params.id})
        .then((station) => {
            res.send(station.bikesId);
        })
        .catch(next);
});

//stores a new station
router.post('/', (req, res, next) => {
    let station = new Station(req.body);
    station.save()
        .then((station) => {
            res.send(station);
        })
        .catch(next);
});

//edits an existing station
router.put('/:id', (req, res, next) => {
    Station.findByIdAndUpdate({_id: req.params.id}, req.body)
        .then(() => {
            Station.findOne({_id: req.params.id})
                .then((station) => {
                    res.send(station);
                })
                .catch(next);
        })
        .catch(next);   
});

//deletes a station 
router.delete('/:id', (req, res, next) => {
    Station.findByIdAndRemove({_id: req.params.id})
        .then((station) => {
            res.send(station);
        })
        .catch(next);
});

module.exports = router;