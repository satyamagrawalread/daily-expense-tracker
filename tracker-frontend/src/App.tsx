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
        <ErrorBoundary fallback={<div>Something Went Wrong</div>}>
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
