import { QueryClient, QueryClientProvider } from "react-query"
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

const queryClient = new QueryClient();

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={<div>Something Went Wrong</div>}>
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />}></Route>
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </QueryClientProvider>
    </>
  )
}

export default App
