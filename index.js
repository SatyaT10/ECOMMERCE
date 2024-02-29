const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/ECOM");

//User Route
const User_routes = require('./routes/userRoute');
app.use('/api', User_routes);

//Store Route

const store_Route = require('./routes/storeRoute');
app.use('/api', store_Route);


//Category Route
const category_Route = require('./routes/categoryRoute');
app.use('/api', category_Route);


//Sub Category Route
const subCategoryRoutes = require('./routes/subCategoryRoutes');
app.use('/api', subCategoryRoutes);



app.listen(8080, function () {
    console.log("Server started successfully on post 8080");
});