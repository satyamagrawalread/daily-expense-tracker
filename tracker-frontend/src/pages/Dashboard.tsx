import { Loader2Icon } from "lucide-react";
import AddExpenseModal from "../components/dashboard/AddExpenseModal";
import MonthExpenses from "../components/dashboard/MonthExpenses";
import TransactionsList from "../components/dashboard/TransactionsList";
import WeekExpenses from "../components/dashboard/WeekExpenses";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useAuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getToken, removeToken } from "../helpers";

const Dashboard = () => {
  const { user, setUser, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const authToken = getToken();
  useEffect(() => {
    if (!authToken || (!isLoading && !user)) {
      navigate("/signin", { replace: true });
    }
  }, [user]);

  const handleLogout = () => {
    setUser(undefined);
    removeToken();
    navigate("/signin", { replace: true });
  };
  if (isLoading) {
    return (
      <div className="h-svh flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="text-gray-500">May take some time</div>
          <Loader2Icon className=" animate-spin " />
        </div>
      </div>
    );
  }
  return (
    <div>
      {user && (
        <div className="w-screen h-svh overflow-hidden">
          <div className="w-screen h-[10%] flex justify-between items-center py-5 px-5 bg-gray-100 border-b shadow-sm">
            <span className="text-emerald-800 font-semibold">
              Welcome {user.username}!
            </span>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <div className="w-screen h-[90%] hidden lg:flex lg:flex-row items-start gap-4 mx-auto py-6 px-4 flex-1">
            <div className="h-full flex flex-col gap-4 flex-1 w-full">
              <MonthExpenses />
              <WeekExpenses />
            </div>
            <div className="h-full min-w-80 w-full lg:w-96">
              <TransactionsList />
            </div>
          </div>
          <div className="w-screen h-[90%] flex lg:hidden flex-col gap-4 max-w-6xl mx-auto py-10 px-4 flex-1 overflow-y-auto">
            <Tabs defaultValue="transactions">
              <TabsList className="w-full flex ">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              <TabsContent value="transactions" className="w-full">
                <div className=" w-full  ">
                  <TransactionsList />
                </div>
              </TabsContent>
              <TabsContent value="summary" className="w-full">
                <div className=" flex flex-col gap-4 flex-1 ">
                  <MonthExpenses />
                  <WeekExpenses />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <AddExpenseModal />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
