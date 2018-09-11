const passport = require("passport");
const express = require("express");
const usersRoutes = express.Router();
const bcrypt = require('bcrypt');

const User = require("../models/user");



usersRoutes.get("/users/add", (req, res, next) => {
    res.render("users/add-user");
});

usersRoutes.post('/users/add-user', async function(req, res, next)  {

    let { username, password, role } = req.body;

    let validateRes = validateUser({
        username,
        password,
        role
    });

    let errorMessage = null;

    if(validateRes) {
        errorMessage = validateRes.details[0].message;
        return res.status(400)
            .render('users/add', {
                message:errorMessage
            });
    }

    let user = await User.findOne({ username });

    if(user) {

        errorMessage = "User with this name already exists!"

        return res.status(400)
            .render('users/add', {
                message:errorMessage
            });

    } else {

        try {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            user = new User({ username, password, role });
            const result = await user.save();

            res.status(201)
                .redirect('/');
        } catch(ex) {
            next(ex);
        }

    }

});

module.exports = usersRoutes;