const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    desc: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    updatedAt: {
      type: Date, 
      required: true,
    }
  },
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;