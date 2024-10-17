const Transaction = require("../models/Transaction");

const createTransaction = async (req, res, next) => {
  const { desc, amount, category, subCategory } = req.body;
  console.log(desc);
  const user = req.user;
  console.log(user);
  try {
    if ((!amount || amount <= 0) && !category && !subCategory) {
      return res.send({ error: "Invalid Details" });
    }
    const transaction = new Transaction({
      userId: user._id,
      desc,
      amount,
      category,
      subCategory,
    });
    await transaction.save();
    return res.status(201).send({ message: "New Transaction Created" });
  } catch (error) {
    next(error);
  }
};

const modifyTransactions = (transactions) => {
  return transactions.map((element) => {
    return {
      date: element.updatedAt,
      desc: element.desc,
      amount: element.amount,
      category: element.category.name,
      subCategory: element.subCategory.name,
    };
  });
};
const getAllTransactionsById = async (req, res, next) => {
  // const user = req.user;
  const { categories, subCategories } = req.query;
  try {
    let categoriesList = [];
    let subCategoriesList = [];
    if (categories) {
      categoriesList = categories.split(",");
    }
    if (subCategories) {
      subCategoriesList = subCategories.split(",");
    }
    if (subCategoriesList.length>0 || !!categoriesList.length>0) {
      const transactions = await Transaction.find({
        $or: [
          { category: { $in: categoriesList } },
          { subCategory: { $in: subCategoriesList } },
        ],
      })
        .populate("category")
        .populate("subCategory");
      return res.status(200).send({ data: modifyTransactions(transactions) });
    } else {
      const transactions = await Transaction.find()
        .populate("category")
        .populate("subCategory");
      return res.status(200).send({ data: modifyTransactions(transactions) });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createTransaction, getAllTransactionsById };
