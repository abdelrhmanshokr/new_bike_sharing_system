const express = require('express');
const router = express.Router();
const User = require('../models/users');

//returns all users in the system  
router.get('/', (req, res, next) => {
    User.find({})
        .then((users) => {
            res.send(users);
        })
        .catch(next);
});

//adds a new user to the system
router.post('/', (req, res, next) => {
    let user = new User(req.body);
    user.save()
        .then((user) => {
            res.send(user);
        })
        .catch(next);   
});

//edits an existing user 
router.put('/:id', (req, res, next) => {
    User.findByIdAndUpdate({_id: req.params.id}, req.body)
        .then(() => {
            User.findOne({_id: req.params.id})
                .then((user) => {
                    res.send(user);
                })
                .catch(next);
        })
        .catch(next);
});

//deletes a user
router.delete('/:id', (req, res, next) => {
    User.findByIdAndRemove({_id: req.params.id})
        .then((user) => {
            res.send(user);
        })
        .catch(next);
});


module.exports = router; 