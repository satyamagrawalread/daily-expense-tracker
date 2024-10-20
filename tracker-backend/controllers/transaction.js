const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const {
  modifyTransactions,
  getLast7Days,
  fillMissingDaysAndCategories,
  getCurrentIstTime,
} = require("../services/transaction");

const createTransaction = async (req, res, next) => {
  const { desc, amount, category, subCategory } = req.body;
  const user = req.user;
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
      updatedAt: getCurrentIstTime()
    });
    await transaction.save();
    return res.status(201).send({ message: "New Transaction Created" });
  } catch (error) {
    // next(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
};

const getAllTransactionsById = async (req, res, next) => {
  const user = req.user;
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
    if (subCategoriesList.length > 0 || !!categoriesList.length > 0) {
      const transactions = await Transaction.find({
        userId: user._id,
        $or: [
          { category: { $in: categoriesList } },
          { subCategory: { $in: subCategoriesList } },
        ],
        
      })
        .populate("category")
        .populate("subCategory")
        .sort({updatedAt: -1})
        .lean();
      return res.status(200).send({ data: modifyTransactions(transactions) });
    } else {
      const transactions = await Transaction.find({userId: user._id})
        .populate("category")
        .populate("subCategory")
        .sort({updatedAt: -1})
        .lean();;
      return res.status(200).send({ data: modifyTransactions(transactions) });
    }
  } catch (error) {
    // next(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
};

const getCurrentMonthTransactions = async (req, res, next) => {
  const user = req.user;
  try {
    const currentDate = new Date(getCurrentIstTime());
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth,
      1
    );
    const aggregatedData = await Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          updatedAt: { $gte: startOfMonth, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);
    const categoriesList = await Category.find({ parentId: null });
    const resultMap = {};
    aggregatedData.forEach((item) => {
      resultMap[item._id] = item.totalAmount;
    });
    const categoriesResult = categoriesList.map((category) => {
      return {
        categoryName: category.name,
        totalAmount: resultMap[category._id] || 0,
      };
    });

    return res.status(200).send({ data: categoriesResult });
  } catch (error) {
    // next(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
};

const getLastWeekTransactions = async (req, res, next) => {
  const user = req.user;
  try {
    const currentDate = new Date(getCurrentIstTime());
    const sevenDaysAgo = new Date(getCurrentIstTime());
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    const aggregatedData = await Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          updatedAt: { $gte: sevenDaysAgo, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: {
            category: "$category",
            day: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.day": 1, "_id.category": 1 },
      },
    ]);

    const last7DaysList = getLast7Days();
    const categoriesList = await Category.find({ parentId: null });
    return res
      .status(200)
      .send({
        data: fillMissingDaysAndCategories(
          aggregatedData,
          last7DaysList,
          categoriesList
        ),
      });
  } catch (error) {
    // next(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
};

module.exports = {
  createTransaction,
  getAllTransactionsById,
  getCurrentMonthTransactions,
  getLastWeekTransactions,
};
