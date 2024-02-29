const mongoose = require('mongoose');


const Store = mongoose.Schema({
    vender_id: {
        type: String,
        require: true
    },
    logo: {
        type: String,
        require: true
    },
    business_email: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    pin: {
        type: String,
        require: true
    },
    // latitude: {
    //     type: String,
    //     require: true
    // },
    // longitude: {
    //     type: String,
    //     require: true
    // }
    location: {
        type: { type: String, required: true },
        coordinates: []
    }
});

Store.index({location:"2dsphere"});

module.exports=mongoose.model('Store',Store);