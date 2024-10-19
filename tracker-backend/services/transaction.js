const moment = require("moment");
const modifyTransactions = (transactions) => {
  const resultMap = {};
  let dateList = [];
  transactions.forEach((transaction) => {
    const updatedAt = new Date(transaction.updatedAt);
    const date = updatedAt.toISOString().split("T")[0];
    const time = updatedAt.toTimeString().split(" ")[0];
    const updatedTransaction = {
      time,
      desc: transaction.desc,
      amount: transaction.amount,
      category: transaction.category.name,
      subCategory: transaction.subCategory.name,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
    if (!dateList.includes(date)) {
      dateList.push(date);
    }
    if (!resultMap[date]) {
      resultMap[date] = [updatedTransaction];
    } else {
      resultMap[date].push(updatedTransaction);
    }
  });
  return dateList.map((date) => {
    return {
      date,
      transactions: resultMap[date],
    };
  });
  //   return {
  //     date: element.updatedAt,
  //     desc: element.desc,
  //     amount: element.amount,
  //     category: element.category.name,
  //     subCategory: element.subCategory.name,
  //   };
};

const getLast7Days = () => {
  const last7Days = [];
  const today = moment().startOf("day");

  for (let i = 0; i < 7; i++) {
    const day = today.clone().subtract(i, "days").format("YYYY-MM-DD");
    last7Days.push(day);
  }

  return last7Days.reverse();
};

const fillMissingDaysAndCategories = (
  aggregatedData,
  last7DaysList,
  categoriesList
) => {
  const resultMap = aggregatedData.reduce((acc, item) => {
    return {
      ...acc,
      [item._id.day]: {
        ...(acc[item._id.day] ?? {}),
        [item._id.category]: item.totalAmount,
      },
    };
  }, {});
  return last7DaysList.map((date) => {
    return {
      date,
      categories: categoriesList.map((category) => {
        return {
          name: category.name,
          totalAmount:
            resultMap[date] && resultMap[date][category._id]
              ? resultMap[date][category._id]
              : 0,
        };
      }),
    };
  });
};

const getCurrentIstTime = () => {
  // Parse the timestamp string
  const now = new Date();
  const timestamp = now.toISOString();
  const date = new Date(timestamp);

  // Add 3 hours and 30 minutes
  date.setUTCHours(date.getUTCHours() + 5);
  date.setUTCMinutes(date.getUTCMinutes() + 30);

  // Format the new timestamp
  const formattedTimestamp =
    date.toISOString().replace("T", " ").slice(0, -5) + "+00:00";

  return formattedTimestamp;
};

module.exports = {
  modifyTransactions,
  getLast7Days,
  fillMissingDaysAndCategories,
  getCurrentIstTime,
};
