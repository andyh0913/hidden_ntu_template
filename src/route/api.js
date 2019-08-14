const express = require("express");
const router = express.Router();
const User = require('../model/User');
const Message = require('../model/Message');

router.get('/message', (req, res) => {
    Message.find({'user': req.query.user}).sort({time: 1}).then((messages)=>{
        res.send(messages);
    })
})

router.get('/user', (req, res) => {
    if(req.session.isLogin){
        User.findById(req.session.uid, '_id name account progress', (err, _user) => {
            if(err){
                console.error(err);
                res.status(500).send("Server error");
            }
            else res.status(200).send(_user)
        })
    }
    else res.status(401).send({_id: 'none'});
});

module.exports = router;