export interface ITransaction {
  desc: string;
  amount: number;
  category: string;
  subCategory: string;
}
export interface OEachTransaction {
  time: string;
  desc: string;
  amount: number;
  category: string;
  subCategory: string;
}
export interface OTransaction {
  date: string;
  transactions: {
    time: string;
    desc: string;
    amount: number;
    category: string;
    subCategory: string;
  }[];
}

export interface CurrentMonthCategoryDataType {
  categoryName: string;
  totalAmount: number;
}

export interface LastWeekCategoryDataType {
    date: string;
    categories: {
        name: string,
        totalAmount: number
    }[]
  }
