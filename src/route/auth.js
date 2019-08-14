const express = require("express");
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
    const _account = req.body.account;
    const _pwd = req.body.pwd;
    if (!_account){
        res.redirect("/login/Missing account!");
    }
    else if (!_pwd){
        res.redirect("/login/Missing password!");
    }
    else {
        User.findOne({account: _account}, (err, userResponse) => {
            if(err) {
                console.log(err);
                res.status(500).send("Server Error.");
            }
            else if (userResponse) {
                bcrypt.compare(_pwd, userResponse.pwdHash, (err, cmpResponse) => {
                    if(err){
                        console.log(err);
                        res.status(500).send("Hash comparison error.");
                    }
                    else if (cmpResponse) {
                        console.log("User login:", userResponse.name);
                        req.session.uid = userResponse._id // Not sure if it will work since it's objectid
                        req.session.isLogin = true;
                        res.redirect("/");
                    }
                    else {
                        res.redirect("/login/Wrong password!");
                    }
                })
            }
            else {
                res.redirect("/login/Wrong account!");
            }
        })
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})

module.exports = router;