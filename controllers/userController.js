const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const config = require('../config/config');
const jwt = require("jsonwebtoken");
const node_mailer = require('nodemailer');
const random_String = require('randomstring');
const fs = require("fs");


const sendResetPasswordMail = async (name, email, token) => {
    try {
        const transporter = node_mailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.userName,
                pass: config.password
            }

        });

        const mailOptions = {
            from: config.userName,
            to: email,
            subject: 'for Reset Password',
            html: '<p> Hi ' + name + ', Please<a herf="http://127.0.0.1:8080/api/reset-password?token=' + token + '>click hare</a> to Reset your Password </p>'
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Mail has been send:-  ", info.response);
            }
        })

    } catch (error) {
        res.status(400).send({ success: false, message: error.message });

    }
}

const create_token = async (id) => {
    try {

        const token = await jwt.sign({ _id: id }, config.secret_jwt);
        return token;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const securePassword = async (password) => {
    try {
        const passwordHash = bcryptjs.hash(password, 10);
        return passwordHash;
    } catch (error) {
        res.status(404).send(error.message);

    }
}

const register_user = async (req, res) => {
    try {
        const spasssword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: spasssword,
            image: req.file.filename,
            mobile: req.body.mobile,
            type: req.body.type,

        });
        const userData = await User.findOne({ email: req.body.email });
        if (userData) {
            res.status(200).send({ success: false, message: 'email is alredy exists' });
        } else {
            const user_data = await user.save();
            res.status(200).send({ success: true, data: user_data });
        }

    } catch (error) {
        res.status(404).send(error.message);
    }
}
//Login Method
const user_Login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log(req.body.email);
        console.log(password);

        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcryptjs.compare(password, userData.password);
            if (passwordMatch) {
                const tokenData = await create_token(userData._id);
                const userResults = {
                    _id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    mobile: userData.mobile,
                    image: userData.image,
                    type: userData.type,
                    token: tokenData
                }
                const response = {
                    success: true,
                    message: "User Details",
                    data: userResults
                }
                res.status(200).send(response);
            } else {
                res.status(200).send({ success: false, message: "Email And Password are incorrect" });
            }
        } else {
            res.status(200).send({ success: false, message: "Email And Password are incorrect" });
        }   
    } catch (error) {
        res.status(400).send(error.message);
    }
}
//update_Password
const update_Password = async (req, res) => {
    try {
        const user_id = req.body._id;
        console.log(req.body._id);
        const password = req.body.password;
        const userData = await User.findOne({ _id: user_id });
        // console.log(userData);
        if (userData) {
            const newPassword = await securePassword(password);
            await User.findByIdAndUpdate({ _id: user_id }, { $set: { password: newPassword } });
            res.status(200).send({ success: true, message: 'Your password has been updated' });
        } else {
            res.status(200).send({ success: false, message: "User Id not found!" });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const forget_password = async (req, res) => {
    try {
        const userData = await User.findOne({ email: req.body.email });
        if (userData) {
            const NewRandomString = await random_String.generate();
            await User.updateOne({ email: req.body.email }, { $set: { token: NewRandomString } });
            await sendResetPasswordMail(userData.name, userData.email, userData.token);
            res.status(200).send({ success: true, message: 'Please check your mail and Reset your Password' });
        } else {
            res.status(200).send({ success: true, message: 'Email Id is wrong please enter valid email id.' });
        }

    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}
//Reset Password
const reset_password = async (req, res) => {
    try {
        const token = req.query.token;
        const validUser = await User.findOne({ token: token });
        if (validUser) {
            const password = req.body.password;
            const spasssword = await securePassword(password);
            const userData = await User.findByIdAndUpdate({ _id: validUser._id }, { $set: { password: spasssword, token: '' } }, { new: true });
            res.status(200).send({ success: true, message: "password successfully updated ", data: userData });
        } else {
            res.status(200).send({ success: true, message: "this link has been expried" });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}

// Renew Token
const renew_token = async (id) => {
    try {
        const secret_jwt = config.secret_jwt;
        const newSecret_jwt = random_String.generate()

        fs.readFile('config/config.js', 'utf-8', function (err, data) {
            if (err) throw err;
            var newValue = data.replace(new RegExp(secret_jwt, "g"), newSecret_jwt);
            fs.writeFile('config/config.js', newValue, 'utf-8', function (err, data) {
                if (err) throw err;

                console.log("Work is Done!",data);
            });
            console.log(data);
        });

        const token = await jwt.sign({ _id: id }, newSecret_jwt);
        return token;
    } catch (error) {
        res.status(400).send({ success: false, message: error.message })
    }
}


const refresh_token = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const userData = await User.findOne({ _id: user_id });
        if (userData) {
            const tokenData = await renew_token(user_id);
            const response = {
                user_id: user_id,
                token: tokenData
            }
            res.status(200).send({ success: true, message: 'Token is Refreshed and datails is ', data: response });

        } else {
            res.status(200).send({ success: true, message: 'User Not found' });
        }

    } catch (error) {
        res.status(400).send({ success: false, message: error.message })
    }
}

module.exports = {
    register_user,
    user_Login,
    update_Password,
    forget_password,
    reset_password,
    refresh_token
};