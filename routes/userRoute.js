const express = require("express");
const User_Route = express();
const multer = require("multer");
const path = require("path");
User_Route.use(express.json());
User_Route.use(express.urlencoded({ extended: true }));

User_Route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/userImages/'), function (error) {
            if (error) throw error;
        });
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name, function (error1) {
            if (error1) throw error1;
        });
    }
});

const upload = multer({ storage: storage });

const user_controller = require('../controllers/userController');

const auth = require("../middleware/auth");

User_Route.post('/register', upload.single('image'), user_controller.register_user);

User_Route.post('/login', user_controller.user_Login);

User_Route.get('/test', auth, function (req, res) {
    res.status(200).send({ success: true, message: "Authenticated" });
});

//Update Password Route
User_Route.post('/update-password', auth, user_controller.update_Password);

//forget Password Route
User_Route.post('/forget-password',user_controller.forget_password);

//Reset Password Route
User_Route.get('/reset-password',user_controller.reset_password);

//Refrash Token
User_Route.post('/refresh-token',auth,user_controller.refresh_token);


module.exports = User_Route;