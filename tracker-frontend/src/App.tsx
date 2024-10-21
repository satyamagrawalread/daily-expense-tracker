import { QueryClient, QueryClientProvider } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import AuthProvider from "./providers/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={<div className="h-svh w-screen flex flex-col items-center justify-center gap-2">
          <div className="text-8xl">🥺</div>
          <div className="text-2xl md:text-4xl text-gray-500">Something went wrong</div>
          <div className="text-xl md:text-2xl text-gray-500 pb-52">Try Again!</div>
        </div>}>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Dashboard />}></Route>
                <Route path="/signup" element={<SignUp />}></Route>
                <Route path="/signin" element={<SignIn />}></Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </>
  );
}

export default App;
