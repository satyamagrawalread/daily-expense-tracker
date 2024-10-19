import { PartyPopperIcon } from "lucide-react";
import { OEachTransaction } from "../../types/transaction.types";

const Transaction = ({ transaction }: { transaction: OEachTransaction }) => {
  return (
    <div className=" flex items-center justify-between ">
      <div className="flex items-center gap-2">
        <div>
          {/* <div className="font-light text-xs mt-1">{transaction.time}</div> */}
          <PartyPopperIcon className=" w-7 h-7 " />
        </div>
        <div className=" flex-1 flex flex-col ">
          <h3 className=" font-semibold text-base ">{transaction.desc}</h3>
          <p className=" text-muted-foreground text-sm ">
            {transaction.subCategory}
          </p>
        </div>
      </div>
      <span>-₹{transaction.amount.toLocaleString("en-IN")}</span>
    </div>
  );
};

export default Transaction;
