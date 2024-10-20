// import { PartyPopperIcon } from "lucide-react";
import { OEachTransaction } from "../../types/transaction.types";
import { iconMap } from "../../icons";

const Transaction = ({ transaction }: { transaction: OEachTransaction }) => {
  const icon = iconMap[transaction.subCategory.replace(/[-\s]/g, '') as keyof typeof iconMap] || "🎉";
  return (
    <div className=" flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className="text-3xl">
          {/* <div className="font-light text-xs mt-1">{transaction.time}</div> */}
          {/* <PartyPopperIcon className=" w-7 h-7 " /> */}
          {icon}
        </div>
        <div className=" flex-1 flex flex-col ">
          <h3 className=" font-semibold text-base ">{transaction.desc}</h3>
          <p className=" text-muted-foreground text-sm ">
            {transaction.subCategory}
          </p>
        </div>
      </div>
      <span className="text-sm text-gray-500 font-medium">-₹{transaction.amount.toLocaleString("en-IN")}</span>
    </div>
  );
};

export default Transaction;
