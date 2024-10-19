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

const addCategory = async (req, res, next) => {
    try {
        return res.send({message: "Trail going on"});
        const {category, subcategories} = req.body;
    const newCategory = new Category({
        name: category,
    });
    const newCategoryResult = await newCategory.save();
    const modifiedSubcategories = subcategories.map(subcategory => ({
        name: subcategory.name,
        parentId: newCategoryResult._id
    }));
    await Category.insertMany(modifiedSubcategories);
    return res.status(201).send({message: "Categories added successfully"});
    } catch (error) {
        next(error);
    }
}

module.exports = {getAllCategories, addCategory};