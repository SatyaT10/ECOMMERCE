const SubCategory = require("../models/subCategoryModels");

const addSubCategory = async (req, res) => {
    try {
        const sub_category = new SubCategory({
            category_id: req.body.category_id,
            sub_category: req.body.sub_category
        });

        const result = await sub_category.save();
        res.status(200).send({success:true,message:"Category wass Added",data:result});

    } catch (error) {
        res.status(400).send({ success: true,message:error.message });
    }
}

module.exports = {
    addSubCategory,
}