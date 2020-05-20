const express = require('express');
const router = express.Router();
const Record = require('../models/records');

//returns all records  
router.get('/', (req, res, next) => {
    Record.find({})
        .then((record) => {
            res.send(record);
        })
        .catch(next);
});

//adds a new record 
router.post('/', (req, res, next) => {
    let record = new Record(req.body);
    record.save()
        .then((record) => {
            res.send(record);
        })
        .catch(next);
});

//edits an existing record
router.put('/:id', (req, res, next) => {
    Record.findByIdAndUpdate({_id: req.params.id}, req.body)
        .then(() => {
            Record.findOne({_id: req.params.id})
                .then((record) => {
                    res.send(record);
                })
                .catch(next);
        })
        .catch(next);
});

//deletes one record
router.delete('/:id', (req, res, next) => {
    Record.findByIdAndRemove({_id: req.params.id})
        .then((record) => {
            res.send(record);
        })
        .catch(next);
});

//returns all record of a specific user
router.get('/alluserrecords/:id', (req, res, next) => {
    Record.find({userId: req.params.id})
        .then((records) => {
            res.send(records);
        })
        .catch(next);
});

//returns all records of a specific bike
router.get('/allbikerecords/:id', (req, res, next) => {
    Record.find({bikeId: req.params.id})
        .then((records) => {
            res.send(records);
        })
        .catch(next);
});

module.exports = router;