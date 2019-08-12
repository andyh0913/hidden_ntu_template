const express = require("express");
const router = express.Router();
const User = require('../model/User');
const Post = require('../model/Message');

router.get('/post', (req, res) => {
    Post.find({'user': req.query.user}).sort({time: 1}).then((posts)=>{
        res.send(posts);
    })
})

module.exports = router;