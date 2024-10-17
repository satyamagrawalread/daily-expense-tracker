const Category = require('../models/Category');

const getAllCategories = async(req, res, next) => {
    try {
        const categories = await Category.find({parentId: null});
        const resultCategories = await Promise.all(categories.map(async(category) => {
            const subCategories = await Category.find({parentId: category._id});
            return {
                id: category._id,
                name: category.name,
                subCategories: subCategories.map(subCategory => ({
                    id: subCategory._id,
                    name: subCategory.name
                }))
            }
        }))
        return res.status(200).send({data: resultCategories});
    } catch (error) {
        next(error);
    }
}

module.exports = {getAllCategories};