const express = require("express");
category_Route = express();
category_Route.use(express.json());
category_Route.use(express.urlencoded({ extended: true }));
const auth = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');
category_Route.post('/add-category', auth, categoryController.add_Categoty);


module.exports = category_Route;