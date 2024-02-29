const express = require("express");
const subCategoryRoutes = express();

subCategoryRoutes.use(express.urlencoded({ extended: true }));
subCategoryRoutes.use(express.json());

const auth = require('../middleware/auth');
const subCategoryControllers = require('../controllers/subCategoryController');

subCategoryRoutes.post('/add-sub-category', auth, subCategoryControllers.addSubCategory);


module.exports = subCategoryRoutes;