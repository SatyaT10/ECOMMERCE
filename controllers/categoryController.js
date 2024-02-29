const category = require('../models/categoryModel');

const add_Categoty = async (req, res) => {
    const reqBody = req.body;
    const { categorys } = reqBody;
    try {
        const categoryData = await category.find({});
        if (categoryData.length > 0) {
            let checking = false;
            for (let i = 0; i < categoryData.length; i++) {
                if (categoryData[i]['category'].toLowerCase() === categorys.toLowerCase()) {
                    checking = true;
                    break;
                }
            }
            if (checking == false) {
                const Category = new category({
                    category: categorys,

                });
                const cat_data = await Category.save();
                res.status(200).send({ success: true, message: 'Category was Added successfully', data: cat_data });

            } else {
                res.status(200).send({ success: true, message: "This Category(" + categorys + ") is already exists." });
            }

        } else {
            const Category = new category({
                category: categorys,

            });
            const cat_data = await Category.save();
            res.status(200).send({ success: true, message: 'Category was Added successfully', data: cat_data });

        }

    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}

module.exports = {
    add_Categoty,
}