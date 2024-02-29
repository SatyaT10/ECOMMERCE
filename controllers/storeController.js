const Store = require('../models/storeModel');
const User = require("../models/userModel");



const createStore = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.body.vender_id });
        if (userData) {
            if (!req.body.latitude || !req.body.longitude) {
                res.status(200).send({ success: false, message: 'Location is required' });

            } else {
                const venderData = await Store.findOne({ vender_id: req.body.vender_id });
                if (venderData) {
                    res.status(200).send({ success: true, message: 'vender already existed please enter fresh data' });
                } else {
                    const vender = new Store({
                        vender_id: req.body.vender_id,
                        logo: req.file.filename,
                        business_email: req.body.business_email,
                        address: req.body.address,
                        pin: req.body.pin,
                        location: {
                            type: "Point",
                            coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
                        }
                    });
                    const storeData = await vender.save();
                    res.status(200).send({ success: false, message: 'Data was stored secussesfully', data: storeData });
                }
            }
        } else {
            res.status(200).send({ success: false, message: 'you enered a wrong information' })
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}

module.exports = {
    createStore,

}