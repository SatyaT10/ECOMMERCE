const express = require("express");
const store_Route = express();
store_Route.use(express.json());
store_Route.use(express.urlencoded({ extended: true }));
const multer = require('multer');
const path = require('path');
store_Route.use(express.static('public'));
const auth = require("../middleware/auth");
const store_Controllers = require('../controllers/storeController');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/storeImages'), function (error) {
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


store_Route.post('/create-store', auth, upload.single('logo'), store_Controllers.createStore);

module.exports = store_Route;